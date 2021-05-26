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
	index!: number;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@OneToMany(type => Tasks, tasks => tasks.groupingBox, { cascade: true })
	tasksList!: Tasks[];

	@ManyToOne(type => Parts, parts => parts.taskBoxesList)
	groupingPart!: Parts;
}
