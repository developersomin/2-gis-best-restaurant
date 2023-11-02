import { PickType } from '@nestjs/mapped-types';
import { Evaluations } from '../entities/evaluations.entity';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class ScoreDto extends PickType(Evaluations, ['score', 'content']) {
	@IsNumber()
	@Max(5, { message: '0~5 숫자를 입력하세요' })
	@Min(0, { message: '0~5 숫자를 입력하세요' })
	score: number;
	@IsString()
	content: string;
	@IsString()
	userId: string;
	@IsString()
	storeName: string;
	@IsString()
	lotNoAddr: string;
}
