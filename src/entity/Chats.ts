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
import { Users } from './Users';
@Entity()
export class Chats extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	text!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@ManyToOne(type => Users, writer => writer.chat)
	writer!: Users;

	@ManyToOne(type => Projects, doingProject => doingProject.chats)
	project!: Projects;
}
