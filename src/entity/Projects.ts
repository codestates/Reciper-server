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
@Entity()
export class Projects extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column()
	inviteList!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@OneToMany(type => Parts, parts => parts.parts)
	parts!: Parts[];

	// @OneToMany(type => Chat, chats => chats.project)
	// chats!: Chat[];

	@ManyToMany(() => Users)
	@JoinTable()
	members!: Users[];
}
