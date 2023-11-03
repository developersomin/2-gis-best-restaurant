import { IsBoolean, IsNotEmpty, Max, Min } from 'class-validator';

export class UpdateUserDto {
	@IsBoolean()
	@IsNotEmpty({ message: '점심 추천 기능 필수 입력 필드입니다.' })
	isRecommend: boolean;
	@Min(-180, { message: '유효한 경도 값이 아닙니다. -180에서 180 사이의 값이어야 합니다.' })
	@Max(180, { message: '유효한 경도 값이 아닙니다. -180에서 180 사이의 값이어야 합니다.' })
	@IsNotEmpty({ message: '점심 추천 기능 필수 입력 필드입니다.' })
	lon: number;
	@Min(-90, { message: '유효한 위도 값이 아닙니다. -90에서 90 사이의 값이어야 합니다.' })
	@Max(90, { message: '유효한 위도 값이 아닙니다. -90에서 90 사이의 값이어야 합니다.' })
	@IsNotEmpty({ message: '점심 추천 기능 필수 입력 필드입니다.' })
	lat: number;
}
