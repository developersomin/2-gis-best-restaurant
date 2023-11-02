import { Module } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluations } from './entities/evaluations.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { Restaurants } from '../restaurants/entities/restaurants.entity';
import { OpenApiService } from '../openapi/open-api.service';

@Module({
	imports: [TypeOrmModule.forFeature([Evaluations, Restaurants])],
	controllers: [EvaluationsController],
	providers: [EvaluationsService, RestaurantsService, OpenApiService],
})
export class EvaluationsModule {}
