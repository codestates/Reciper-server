import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
@Entity()
export class Stacks {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;
}
