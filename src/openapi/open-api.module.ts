import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluations } from '../evaluations/entities/evaluations.entity';
import { Restaurants } from '../restaurants/entities/restaurants.entity';
import { EvaluationsController } from '../evaluations/evaluations.controller';
import { EvaluationsService } from '../evaluations/evaluations.service';
import { OpenApiService } from './open-api.service';

@Module({
	providers: [OpenApiService],
	exports: [OpenApiService],
})
export class openApiModule {}
