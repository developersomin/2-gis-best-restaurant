import { Controller, Get, Param, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurants } from './entities/restaurants.entity';
import { PaginateRestaurantDto } from './dto/paginate-restaurant.dto';
import { IFindByDosiAndSgg } from './interface/restaurants-service.interface';
import { GetResDto } from './dto/get-restaurants.dto';

@Controller('restaurants')
export class RestaurantsController {
	constructor(private readonly restaurantsService: RestaurantsService) {}

	@Get('/sortBy')
	findByDosiSgg(@Query() paginateRestaurantDto: PaginateRestaurantDto): Promise<IFindByDosiAndSgg> {
		return this.restaurantsService.findByDosiOrSgg(paginateRestaurantDto);
	}

	@Get()
	getRes(@Query() getResDto: GetResDto) {
		return this.restaurantsService.getRes(getResDto);
	}
}
