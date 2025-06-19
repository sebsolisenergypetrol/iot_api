import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Company } from '../companies/company.entity';
import { Reading } from '../telemetry/reading.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Company, (company) => company.id, { eager: true })
  company: Company;

  @OneToMany(() => Reading, (reading) => reading.device)
  readings: Reading[];
} 