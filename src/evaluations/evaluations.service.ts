import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluations } from './entities/evaluations.entity';
import { Repository } from 'typeorm';
import { ScoreDto } from './dto/score.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { UsersService } from '../users/users.service';
import { Restaurants } from '../restaurants/entities/restaurants.entity';

@Injectable()
export class EvaluationsService {
	constructor(
		@InjectRepository(Evaluations) private readonly evaluationsRepository: Repository<Evaluations>,
		private readonly restaurantsService: RestaurantsService,
		private readonly usersService: UsersService,
	) {}

	// 음식점의 점수를 가져오는 메소드
	async findResScore(restaurant: Pick<Restaurants, 'storeName' | 'lotNoAddr'>): Promise<Evaluations[]> {
		const result = await this.evaluationsRepository.find({
			where: {
				restaurant: { storeName: restaurant.storeName, lotNoAddr: restaurant.lotNoAddr },
			},
			relations: ['restaurant'],
			select: ['score'],
		});
		return result;
	}

	//가게 점수의 평균값을 구하는 메소드
	calculateScoreAvg(scoreArr: Evaluations[], curScore: number): number {
		let sum = curScore;
		for (const evaluation of scoreArr) {
			sum += evaluation.score;
		}
		const result = scoreArr.length > 0 ? sum / (scoreArr.length + 1) : 0;
		return result;
	}

	//유저가 평점을 남기면 실행되는 메소드
	async keepScore(scoreDto: ScoreDto, userId): Promise<Evaluations> {
		const { storeName, lotNoAddr, score, content } = scoreDto;
		const findUser = await this.usersService.findOne({ id: userId });
		if (!findUser) {
			throw new BadRequestException('존재하지 않는 계정입니다.');
		}

		const scoreArr = await this.findResScore({ storeName, lotNoAddr });
		const scoreAvg = this.calculateScoreAvg(scoreArr, score);
		await this.restaurantsService.updateRes(storeName, lotNoAddr, scoreAvg);
		const result = await this.evaluationsRepository.save({
			score,
			content,
			user: {
				id: userId,
			},
			restaurant: {
				storeName,
				lotNoAddr,
			},
		});
		return result;
	}
}
