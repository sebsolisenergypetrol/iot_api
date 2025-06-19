import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
@Injectable()
export class TelemetryGateway implements OnModuleInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  onModuleInit() {
    // In a real implementation, subscribe to telemetry events and emit to clients
    // Example: this.server.emit('device:update', { ... });
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token || client.handshake.headers['authorization']?.split(' ')[1];
      if (!token) throw new UnauthorizedException('No token provided');
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      (client as any).user = payload;
      // Join company room
      if (payload.companyId) {
        client.join(`company:${payload.companyId}`);
      }
    } catch (err) {
      client.disconnect(true);
    }
  }

  emitDeviceUpdate(deviceId: string, data: any) {
    // Only emit to users in the device's company
    const companyId = data.companyId;
    if (companyId) {
      this.server.to(`company:${companyId}`).emit('device:update', { deviceId, ...data });
    } else {
      this.server.emit('device:update', { deviceId, ...data });
    }
  }
} 