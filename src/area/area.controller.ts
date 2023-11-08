import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AreaService } from './area.service';
import { Area } from './entities/areas.entity';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('area')
export class AreaController {
	constructor(private readonly areaService: AreaService) {}

	@Get()
	@UseInterceptors(CacheInterceptor)
	@CacheKey('areas')
	@CacheTTL(0)
	getAreas(): Promise<Area[]> {
		return this.areaService.getAreas();
	}
}
