import { Restaurants } from '../entities/restaurants.entity';

export interface IGetRestaurants {
	data: Restaurants[];
	cursor: { after: number | null };
	count: number;
	next: string | null;
}

export interface ISquareBox {
	minLat: number;
	minLon: number;
	maxLat: number;
	maxLon: number;
}
