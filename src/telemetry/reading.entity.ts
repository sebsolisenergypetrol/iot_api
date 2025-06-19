import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Device } from '../devices/device.entity';

@Entity('readings')
export class Reading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Device, (device) => device.readings, { eager: true })
  device: Device;

  @Column({ type: 'jsonb' })
  value: any;

  @Column({ type: 'timestamptz' })
  timestamp: Date;
} 