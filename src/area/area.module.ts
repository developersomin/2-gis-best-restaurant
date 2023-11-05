import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/areas.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Area])],
	controllers: [AreaController],
	providers: [AreaService],
	exports: [AreaService],
})
export class AreaModule {}
