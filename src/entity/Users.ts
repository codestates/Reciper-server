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
import { Recruit_comments } from './Recruit_comments';
import { Task_comments } from './Task_comments';
import { Chats } from './Chats';

@Entity()
export class Users extends BaseEntity {
	// 해당 엔티티(Users) 에서 save, remove 등의 메소드를 사용하기 위해 BaseEntity 를 상속
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({
		unique: true,
	})
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

	@OneToMany(type => Recruits, recruitBoards => recruitBoards.writer)
	recruitBoards!: Recruits[];

	@OneToMany(type => Recruit_comments, commentsList => commentsList.writer)
	commentsList!: Recruit_comments[];

	@OneToMany(type => Task_comments, commentsListTask => commentsListTask.writer)
	commentsListTask!: Task_comments[];

	@OneToMany(type => Chats, chats => chats.writer)
	chat!: Chats[];
}
