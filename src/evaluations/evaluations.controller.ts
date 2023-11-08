import { Body, Controller, Post, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { ScoreDto } from './dto/score.dto';
import { Evaluations } from './entities/evaluations.entity';
import { AccessTokenGuard } from '../auth/guard/jwt-token.guard';
import { User } from '../users/decorator/users.decorator';
import { TransformInterceptor } from '../commons/interceptor/transform.interceptor';
import { HttpExceptionFilter } from '../commons/exception-filter/http.exception-filter';

@Controller('evaluations')
@UseGuards(AccessTokenGuard)
@UseInterceptors(TransformInterceptor)
@UseFilters(HttpExceptionFilter)
export class EvaluationsController {
	constructor(private readonly evaluationsService: EvaluationsService) {}

	@Post()
	keepScore(@Body() scoreDto: ScoreDto, @User('id') userId: string): Promise<Evaluations> {
		return this.evaluationsService.keepScore(scoreDto, userId);
	}
}
