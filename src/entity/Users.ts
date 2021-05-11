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
	// 해당 엔티티(Users) 에서 save, remove 등의 메소드를 사용하기 위해 aseEntity 를 상속
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
