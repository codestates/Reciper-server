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

@Entity()
export class Recruit_comments extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	writer!: string;

	@Column()
	writerId!: number;

	@Column()
	body!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@ManyToOne(type => Recruits, recruitBoard => recruitBoard.commentCount)
	recruitBoard!: Recruits;
}
