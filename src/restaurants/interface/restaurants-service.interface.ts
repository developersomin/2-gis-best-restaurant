import { Restaurants } from '../entities/restaurants.entity';

export interface IFindByDosiAndSgg {
	data: Restaurants[];
	total: number;
	cursor: { after: number | null };
	count: number;
	next: string | null;
}
