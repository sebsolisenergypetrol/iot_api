import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reading } from './reading.entity';
import { Device } from '../devices/device.entity';
import * as mqtt from 'mqtt';
import { TelemetryGateway } from './telemetry.gateway';

@Injectable()
export class TelemetryService implements OnModuleInit {
  private readonly logger = new Logger(TelemetryService.name);
  private mqttClient: mqtt.MqttClient;

  constructor(
    @InjectRepository(Reading)
    private readingsRepository: Repository<Reading>,
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
    private telemetryGateway: TelemetryGateway,
  ) {}

  onModuleInit() {
    this.mqttClient = mqtt.connect(process.env.MQTT_URL || 'mqtt://localhost:1883');
    this.mqttClient.on('connect', () => {
      this.logger.log('Connected to MQTT broker');
      this.mqttClient.subscribe('devices/+/telemetry');
    });
    this.mqttClient.on('message', (topic, message) => {
      this.handleMqttMessage(topic, message.toString());
    });
  }

  async handleMqttMessage(topic: string, payload: string) {
    try {
      const match = topic.match(/^devices\/(.+)\/telemetry$/);
      if (!match) return;
      const deviceId = match[1];
      const device = await this.devicesRepository.findOne({ where: { id: deviceId } });
      if (!device) return;
      const value = JSON.parse(payload);
      const reading = this.readingsRepository.create({
        device,
        value,
        timestamp: new Date(),
      });
      await this.readingsRepository.save(reading);
      this.logger.log(`Saved telemetry for device ${deviceId}`);
      this.telemetryGateway.emitDeviceUpdate(deviceId, { value, timestamp: reading.timestamp, companyId: device.company.id });
    } catch (err) {
      this.logger.error('Failed to handle MQTT message', err);
    }
  }
} 