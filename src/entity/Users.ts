import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinTable,
	BaseEntity,
} from 'typeorm';
import { Stacks } from './Stacks';

@Entity()
export class Users extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	email!: string;

	@Column()
	name!: string;

	@Column()
	mobile!: string;

	@Column()
	git_id!: string;

	@Column()
	career!: string;

	@Column()
	isOpen!: boolean;

	@Column()
	about_me!: string;

	@Column()
	profile_image!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	UpdatedAt!: Date;

	@ManyToMany(() => Stacks)
	@JoinTable()
	join!: Stacks[];
}
