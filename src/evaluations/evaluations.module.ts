import { Module } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluations } from './entities/evaluations.entity';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { UsersModule } from '../users/users.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [TypeOrmModule.forFeature([Evaluations]), RestaurantsModule, UsersModule],
	controllers: [EvaluationsController],
	providers: [EvaluationsService, AuthService, JwtService],
})
export class EvaluationsModule {}
