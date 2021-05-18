import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
	BaseEntity,
	ManyToOne,
} from 'typeorm';
import { Tasks } from './Tasks';
import { Parts } from './Parts';

@Entity()
export class Task_boxes extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	title!: string;

	@Column()
	index!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@OneToMany(type => Tasks, tasks => tasks.groupingBox)
	tasksList!: Tasks[];

	@ManyToOne(type => Parts, parts => parts.taskBoxesList)
	groupingPart!: Parts;
}
