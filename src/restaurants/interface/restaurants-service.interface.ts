import { Restaurants } from '../entities/restaurants.entity';

export interface IGetRestaurants {
	data: Restaurants[];
	cursor: { after: number | null };
	count: number;
	next: string | null;
}

export interface squareBox {
	minLat: number;
	minLon: number;
	maxLat: number;
	maxLon: number;
}
