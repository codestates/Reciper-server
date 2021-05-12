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
} from 'typeorm';
import { Recruit_comments } from './Recruit_comments';
import { Stacks } from './Stacks';
@Entity()
export class Recruits extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column()
	simple_desc!: string;

	@Column()
	recruit_members!: string;

	@Column()
	require_stack!: string;

	@Column()
	service_step!: string;

	@Column()
	period!: boolean;

	@Column()
	detail_title!: string;

	@Column()
	detail_desc!: string;

	@Column()
	view!: number;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	UpdatedAt!: Date;

	@OneToMany(type => Recruit_comments, recruit_comments => recruit_comments.id)
	recruit_commentId!: Recruit_comments[];

	@ManyToMany(() => Stacks)
	@JoinTable()
	join!: Stacks[];
}
