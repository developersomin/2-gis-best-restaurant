import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ScoreDto {
	@IsNumber()
	@Max(5, { message: '0~5 숫자를 입력하세요' })
	@Min(0, { message: '0~5 숫자를 입력하세요' })
	score: number;

	@IsString()
	content: string;

	@IsString()
	userId: string;

	@IsString({ message: '가게명을 입력하세요' })
	@IsNotEmpty()
	storeName: string;

	@IsString()
	@IsNotEmpty({ message: '가게 지번 주소를 입력하세요' })
	lotNoAddr: string;
}
