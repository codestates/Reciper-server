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
import { Users } from './Users';

@Entity()
export class Task_comments extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	body!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@ManyToOne(type => Tasks, task => task.commentsList)
	task!: Tasks;

	@ManyToOne(type => Users, writer => writer.commentsList)
	writer!: Users;
}
