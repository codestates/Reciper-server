import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Recruits } from './Recruits';

@Entity()
export class Recruit_comments {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	writer!: string;

	@Column()
	writer_id!: number;

	@Column()
	body!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	UpdatedAt!: Date;

	@ManyToOne(type => Recruits, recruits => recruits.id)
	recruits!: Recruits;
}
