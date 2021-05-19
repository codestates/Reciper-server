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
import { Users } from './Users';
import { Parts } from './Parts';
import { Chats } from './Chats';
@Entity()
export class Projects extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column({
		unique: true,
	})
	projectURL!: string;

	@Column()
	inviteList!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@OneToMany(type => Parts, partsList => partsList.doingProject)
	partsList!: Parts[];

	@OneToMany(type => Chats, chats => chats.project)
	chats!: Chats[];

	@ManyToMany(() => Users)
	@JoinTable()
	members!: Users[];
}
