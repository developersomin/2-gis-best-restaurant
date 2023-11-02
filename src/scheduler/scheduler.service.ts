import { Cron } from '@nestjs/schedule';
import { RestaurantsService } from '../restaurants/restaurants.service';

export class SchedulerService {
	constructor(private readonly restaurantsService: RestaurantsService) {}

	@Cron('0 0 0 * * 1') //매주월요일 00:00
	async handleCron() {
		await this.restaurantsService.onModuleInit();
	}
}
