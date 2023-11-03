import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurants } from './entities/restaurants.entity';
import { openApiModule } from '../openapi/open-api.module';

@Module({
	imports: [TypeOrmModule.forFeature([Restaurants]), openApiModule],
	controllers: [RestaurantsController],
	providers: [RestaurantsService],
	exports: [RestaurantsService],
})
export class RestaurantsModule {}
