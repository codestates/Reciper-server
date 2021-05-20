import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
} from 'typeorm';
import { Tasks } from './Tasks';

@Entity()
export class Checklists extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	desc!: string;

	@Column()
	isChecked!: boolean;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@ManyToOne(type => Tasks, nowTask => nowTask.checklistsList)
	nowTask!: Tasks;
}
