import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluations } from './entities/evaluations.entity';
import { Repository } from 'typeorm';
import { ScoreDto } from './dto/score.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class EvaluationsService {
	constructor(
		@InjectRepository(Evaluations) private readonly evaluationsRepository: Repository<Evaluations>,
		private readonly restaurantsService: RestaurantsService,
		private readonly usersService: UsersService,
	) {}

	async findResScore(storeName: string, lotNoAddr: string): Promise<Evaluations[]> {
		const result = await this.evaluationsRepository.find({
			where: {
				restaurant: { storeName, lotNoAddr },
			},
			relations: ['restaurant'],
			select: ['score'],
		});
		return result;
	}
	calculateScoreAvg(scoreArr: Evaluations[], curScore: number): number {
		let sum = curScore;
		for (const evaluation of scoreArr) {
			sum += evaluation.score;
		}
		const result = scoreArr.length > 0 ? sum / (scoreArr.length + 1) : 0;
		return result;
	}

	async keepScore(scoreDto: ScoreDto): Promise<Evaluations> {
		const { userId, storeName, lotNoAddr, score, content } = scoreDto;
		const findUser = await this.usersService.findOne({ id: userId });
		if (!findUser) {
			throw new BadRequestException('존재하지 않는 계정입니다.');
		}

		const scoreArr = await this.findResScore(storeName, lotNoAddr);
		const scoreAvg = await this.calculateScoreAvg(scoreArr, score);
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
