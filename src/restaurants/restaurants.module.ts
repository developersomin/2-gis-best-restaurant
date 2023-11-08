import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurants } from './entities/restaurants.entity';
import { openApiModule } from '../openapi/open-api.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [TypeOrmModule.forFeature([Restaurants]), openApiModule, UsersModule],
	controllers: [RestaurantsController],
	providers: [RestaurantsService, AuthService, JwtService],
	exports: [RestaurantsService],
})
export class RestaurantsModule {}
