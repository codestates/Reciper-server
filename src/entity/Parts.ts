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
import { TaskBoxes } from './TaskBoxes';

@Entity()
export class Parts extends BaseEntity {
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

	@OneToMany(type => TaskBoxes, taskBoxes => taskBoxes.parts)
	taskBoxes!: TaskBoxes[];

	@ManyToOne(type => Projects, projects => projects.recruitBoards)
	parts!: Parts;
}
