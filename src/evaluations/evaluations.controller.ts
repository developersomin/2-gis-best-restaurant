import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { ScoreDto } from './dto/score.dto';
import { Evaluations } from './entities/evaluations.entity';
import { AccessTokenGuard } from '../auth/guard/jwt-token.guard';
import { User } from '../users/decorator/users.decorator';

@Controller('evaluations')
export class EvaluationsController {
	constructor(private readonly evaluationsService: EvaluationsService) {}

	@UseGuards(AccessTokenGuard)
	@Post()
	keepScore(@Body() scoreDto: ScoreDto, @User('id') userId: string): Promise<Evaluations> {
		return this.evaluationsService.keepScore(scoreDto, userId);
	}
}
