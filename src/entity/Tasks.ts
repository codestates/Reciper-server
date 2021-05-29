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
import { Task_boxes } from './Task_boxes';
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
	taskColor!: string;

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

	@ManyToOne(type => Task_boxes, taskBoxes => taskBoxes.tasksList, { onDelete: 'CASCADE' })
	groupingBox!: Task_boxes;

	@OneToMany(type => Checklists, checklists => checklists.nowTask)
	checklistsList!: Checklists[];

	@OneToMany(type => Task_comments, commentsList => commentsList.nowTask)
	commentsList!: Task_comments[];
}
