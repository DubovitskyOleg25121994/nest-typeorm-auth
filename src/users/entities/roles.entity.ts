import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Users } from './users.entity';

@Entity()
export class Roles {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({ unique: true })
	name: string;

	@ManyToMany(() => Users)
	@JoinTable({
		name: 'user_roles',
		joinColumn: {
			name: 'role_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
	})
	users: Users[];
}
