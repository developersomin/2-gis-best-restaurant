import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../commons/entitis/base.entity';
import { Users } from '../../users/entities/usesr.entity';
import { Restaurants } from '../../restaurants/entities/restaurants.entity';

@Entity()
export class Evaluations extends BaseEntity {
	@Column()
	score: string;

	@Column()
	content: string;

	@ManyToOne(() => Users, (user) => user.evaluations)
	user: Users;

	@ManyToOne(() => Restaurants, (restaurant) => restaurant.evaluations)
	restaurant: Restaurants;
}
