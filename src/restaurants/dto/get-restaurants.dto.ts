import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetResDto {
	@IsNotEmpty()
	lat: number;
	@IsNotEmpty()
	lon: number;
	@IsNotEmpty()
	range: number;
	@IsIn(['ASC', 'DESC'])
	@IsOptional()
	order__scoreAvg?: 'ASC' | 'DESC' = 'DESC';
	@IsIn(['ASC', 'DESC'])
	@IsOptional()
	order__distance?: 'ASC' | 'DESC' = 'DESC';
}
