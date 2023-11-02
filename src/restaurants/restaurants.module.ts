import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurants } from './entities/restaurants.entity';
import { OpenApiService } from '../openapi/open-api.service';

@Module({
	imports: [TypeOrmModule.forFeature([Restaurants])],
	controllers: [RestaurantsController],
	providers: [RestaurantsService, OpenApiService],
})
export class RestaurantsModule {}
