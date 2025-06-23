import { Entity, PrimaryColumn, Column, ManyToOne, Generated } from 'typeorm';
import { Device } from '../devices/device.entity';

@Entity('readings')
export class Reading {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id: string;

  @ManyToOne(() => Device, (device) => device.readings, { eager: true })
  device: Device;

  @Column({ type: 'jsonb' })
  value: any;

  @PrimaryColumn({ type: 'timestamptz' })
  timestamp: Date;
} 