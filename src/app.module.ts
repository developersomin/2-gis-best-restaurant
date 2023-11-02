import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { AreaModule } from './area/area.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DATABASE_HOST,
			port: Number(process.env.DATABASE_PORT),
			username: process.env.DATABASE_USERNAME,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_DATABASE,
			entities: [__dirname + '/**/*.entity.*'],
			synchronize: true,
			logging: true,
		}),
		UsersModule,
		RestaurantsModule,
		EvaluationsModule,
		AreaModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
