import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinTable,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import { Stacks } from './Stacks';
import { Recruits } from './Recruits';

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
	gitId!: string;

	@Column()
	career!: string;

	@Column()
	isOpen!: boolean;

	@Column()
	aboutMe!: string;

	@Column()
	uploadImage!: string;

	@Column()
	profileColor!: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt!: Date;

	@ManyToMany(() => Stacks)
	@JoinTable()
	stacks!: Stacks[];

	@OneToMany(type => Recruits, recruits => recruits.writer)
	recruitBoards!: Recruits[];
}
