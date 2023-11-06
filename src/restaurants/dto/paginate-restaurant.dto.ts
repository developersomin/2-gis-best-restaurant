import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginateRestaurantDto {
	@IsOptional()
	@IsString()
	dosi?: string;
	@IsOptional()
	@IsString()
	sgg?: string;
	@IsNumber()
	@IsOptional()
	take: number = 20;
	@IsNumber()
	@IsOptional()
	cursor?: number;
}
