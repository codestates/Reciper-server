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

	@Column()
	uploadImage!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@Column()
	room!: string;

	@ManyToOne(type => Users, writer => writer.chat)
	writer!: Users;

	@ManyToOne(type => Projects, project => project.chats)
	project!: Projects;
}
