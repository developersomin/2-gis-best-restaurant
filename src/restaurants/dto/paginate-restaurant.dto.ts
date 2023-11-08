import { IsIn, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetResDto {
	@Min(-90, { message: '유효한 위도 값이 아닙니다. -90에서 90 사이의 값이어야 합니다.' })
	@Max(90, { message: '유효한 위도 값이 아닙니다. -90에서 90 사이의 값이어야 합니다.' })
	@IsNotEmpty({ message: '위도값은 필수 입력 필드입니다.' })
	lat: number;
	@Min(-180, { message: '유효한 경도 값이 아닙니다. -180에서 180 사이의 값이어야 합니다.' })
	@Max(180, { message: '유효한 경도 값이 아닙니다. -180에서 180 사이의 값이어야 합니다.' })
	@IsNotEmpty({ message: '경도값은 필수 입력 필드입니다.' })
	lon: number;
	@IsNotEmpty({ message: '반경 값은 필수 입니다.(KM)' })
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
