import { Controller, Get } from '@nestjs/common';
import { AreaService } from './area.service';
import { Area } from './entities/areas.entity';

@Controller('area')
export class AreaController {
	constructor(private readonly areaService: AreaService) {}

	@Get()
	getAreas(): Promise<Area[]> {
		return this.areaService.getAreas();
	}
}
