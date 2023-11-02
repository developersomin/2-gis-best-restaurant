import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, Max, Min } from 'class-validator';

export class UpdateUserDto extends PickType(CreateUserDto, ['nickname']) {
	@IsBoolean()
	isRecommend: boolean;
	@Min(-180, { message: '유효한 경도 값이 아닙니다. -180에서 180 사이의 값이어야 합니다.' })
	@Max(180, { message: '유효한 경도 값이 아닙니다. -180에서 180 사이의 값이어야 합니다.' })
	lon: number;
	@Min(-90, { message: '유효한 위도 값이 아닙니다. -90에서 90 사이의 값이어야 합니다.' })
	@Max(90, { message: '유효한 위도 값이 아닙니다. -90에서 90 사이의 값이어야 합니다.' })
	lat: number;
}
