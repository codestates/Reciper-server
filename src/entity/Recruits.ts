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
import { Recruit_comments } from './Recruit_comments';
import { Stacks } from './Stacks';
import { Users } from './Users';

@Entity()
export class Recruits extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column()
	simpleDesc!: string;

	@Column()
	recruitMembers!: string; // 배열 형태 - JSON.stringify()

	@Column()
	serviceStep!: string;

	@Column()
	period!: string;

	@Column()
	detailTitle!: string;

	@Column({
		length: 10000,
	})
	detailDesc!: string;

	@Column({
		default: 0,
	})
	view!: number;

	@Column({
		default: 0,
	})
	commentCount!: number;

	@Column()
	uploadImage!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@OneToMany(type => Recruit_comments, commentsList => commentsList.recruitBoard)
	commentsList!: Recruit_comments[];

	@ManyToMany(() => Stacks)
	@JoinTable()
	stacks!: Stacks[];

	@ManyToOne(type => Users, writer => writer.recruitBoards)
	writer!: Users;
}
