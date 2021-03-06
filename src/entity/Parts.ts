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
import { Projects } from './Projects';
import { Task_boxes } from './Task_boxes';

@Entity()
export class Parts extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column()
	index!: number;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@OneToMany(type => Task_boxes, taskBoxes => taskBoxes.groupingPart, { cascade: true })
	taskBoxesList!: Task_boxes[];

	@ManyToOne(type => Projects, doingProject => doingProject.partsList, { onDelete: 'CASCADE' })
	doingProject!: Projects;
}
