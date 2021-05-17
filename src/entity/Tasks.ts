import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Checklists } from './Checklists';
import { Task_comments } from './Task_comments';

@Entity()
export class Tasks extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	index!: number;

	@Column()
	title!: string;

	@Column({
		length: 1000,
	})
	desc!: string;

	@Column()
	color!: string;

	@Column()
	startDate!: string;

	@Column()
	endDate!: string;

	@Column()
	assignees!: string; // JSON.stringify

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	//@ManyToOne(type => Taskboxes, taskbox => taskbox.tasks)
	//taskbox!: Taskboxes;

	@OneToMany(type => Checklists, checklists => checklists.task)
	checklists!: Checklists[];

	@OneToMany(type => Task_comments, commentsList => commentsList.task)
	commentsList!: Task_comments[];
}
