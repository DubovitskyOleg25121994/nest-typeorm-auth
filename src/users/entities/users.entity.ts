import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Roles } from './roles.entity';

@Entity()
export class Users {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({ unique: true })
	email: string;

	@Index()
	@Column({ name: 'first_name' })
	firstName: string;

	@Index()
	@Column({ name: 'last_name' })
	lastName: string;

	@Column({ default: '' })
	password: string;

	@Index()
	@Column({ type: 'timestamp with time zone', name: 'created_at', default: new Date() })
	createdAt: Date;

	@ManyToMany(() => Roles)
	@JoinTable({
		name: 'user_roles',
		joinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'role_id',
			referencedColumnName: 'id',
		},
	})
	roles: Roles[];
}
