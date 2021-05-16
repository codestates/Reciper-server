import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	BaseEntity,
} from 'typeorm';
import { Recruits } from './Recruits';
import { Users } from './Users';

@Entity()
export class Recruit_comments extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	body!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@ManyToOne(type => Recruits, recruitBoard => recruitBoard.commentsList)
	recruitBoard!: Recruits;

	@ManyToOne(type => Users, writer => writer.commentsList)
	writer!: Users;
}
