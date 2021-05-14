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
	simple_desc!: string;

	@Column()
	recruit_members!: string; // 배열 형태 - JSON.stringify()

	@Column()
	require_stack!: string; // 배열 형태 - JSON.stringify()

	@Column()
	service_step!: string;

	@Column()
	period!: string;

	@Column()
	detail_title!: string;

	@Column({
		length: 10000,
	})
	detail_desc!: string;

	@Column({
		default: 0,
	})
	view!: number;

	@Column({
		default: 0,
	})
	comment_count!: number;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	UpdatedAt!: Date;

	@OneToMany(type => Recruit_comments, recruit_comments => recruit_comments.id)
	recruit_commentId!: Recruit_comments[];

	@ManyToMany(() => Stacks)
	@JoinTable()
	join!: Stacks[];

	@ManyToOne(type => Users, users => users.id)
	writer!: Users;
}
