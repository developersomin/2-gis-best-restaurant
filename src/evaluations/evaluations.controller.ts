import { Body, Controller, Post, Query } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { ScoreDto } from './dto/score.dto';
import { Evaluations } from './entities/evaluations.entity';

@Controller('evaluations')
export class EvaluationsController {
	constructor(private readonly evaluationsService: EvaluationsService) {}

	@Post()
	keepScore(@Body() scoreDto: ScoreDto): Promise<Evaluations> {
		return this.evaluationsService.keepScore(scoreDto);
	}
}
