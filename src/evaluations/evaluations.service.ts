import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluations } from './entities/evaluations.entity';
import { Repository } from 'typeorm';
import { ScoreDto } from './dto/score.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class EvaluationsService {
	constructor(
		@InjectRepository(Evaluations) private readonly evaluationsRepository: Repository<Evaluations>,
		private readonly restaurantsService: RestaurantsService,
	) {}

	async findResScore(storeName: string, lotNoAddr: string) {
		return await this.evaluationsRepository.find({
			where: {
				restaurant: { storeName, lotNoAddr },
			},
			relations: ['restaurants'],
			select: ['score'],
		});
	}
	calculateScoreAvg(scoreArr: Evaluations[]) {
		let sum = 0;
		for (const evaluation of scoreArr) {
			sum += evaluation.score;
		}
		return scoreArr.length > 0 ? sum / scoreArr.length : 0;
	}

	async keepScore(scoreDto: ScoreDto) {
		const { userId, storeName, lotNoAddr, score, content } = scoreDto;

		const scoreArr = await this.findResScore(storeName, lotNoAddr);
		const scoreAvg = await this.calculateScoreAvg(scoreArr);

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
