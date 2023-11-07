import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluations } from './entities/evaluations.entity';
import { DataSource, Repository } from 'typeorm';
import { ScoreDto } from './dto/score.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { Restaurants } from '../restaurants/entities/restaurants.entity';

@Injectable()
export class EvaluationsService {
	constructor(
		@InjectRepository(Evaluations) private readonly evaluationsRepository: Repository<Evaluations>,
		private readonly restaurantsService: RestaurantsService,
		private readonly dataSource: DataSource,
	) {}

	// 음식점의 점수를 가져오는 메소드
	async findResScore(restaurant: Pick<Restaurants, 'resName' | 'lotNoAddr'>): Promise<Evaluations[]> {
		const result = await this.evaluationsRepository.find({
			where: {
				restaurant: { resName: restaurant.resName, lotNoAddr: restaurant.lotNoAddr },
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
		const { resName, lotNoAddr, score, content } = scoreDto;
		const findRes = await this.restaurantsService.findOne({ resName, lotNoAddr });
		if (!findRes) {
			throw new BadRequestException('음식점이 존재하지 않습니다.');
		}
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const scoreArr = await this.findResScore({ resName, lotNoAddr });
			const scoreAvg = this.calculateScoreAvg(scoreArr, score);
			queryRunner.manager.update(Restaurants, { resName, lotNoAddr }, { scoreAvg });
			const evaluations = this.evaluationsRepository.create({
				score,
				content,
				user: {
					id: userId,
				},
				restaurant: {
					resName,
					lotNoAddr,
				},
			});
			await queryRunner.manager.save(evaluations);
			await queryRunner.commitTransaction();
			await queryRunner.release();

			return evaluations;
		} catch (e) {
			await queryRunner.rollbackTransaction();

			await queryRunner.release();
			throw new BadRequestException(e.message);
		}
	}
}
