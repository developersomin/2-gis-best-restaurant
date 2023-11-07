import { IsIn, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetResDto {
	@IsNotEmpty()
	lat: number;
	@IsNotEmpty()
	lon: number;
	@IsNotEmpty()
	range: number;
	@IsIn(['ASC', 'DESC'])
	@IsOptional()
	order__scoreAvg?: 'ASC' | 'DESC';
	@IsIn(['ASC', 'DESC'])
	@IsOptional()
	order__distance?: 'ASC' | 'DESC';
	@IsNumber()
	@IsOptional()
	cursor?: number;
	@IsNumber()
	@IsOptional()
	take: number = 20;
}
