import { Controller, Get, Param, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { IGetRestaurants } from './interface/restaurants-service.interface';
import { GetResDto } from './dto/paginate-restaurant.dto';
import { TransformInterceptor } from '../commons/interceptor/transform.interceptor';
import { HttpExceptionFilter } from '../commons/exception-filter/http.exception-filter';
import { AccessTokenGuard } from '../auth/guard/jwt-token.guard';

@Controller('restaurants')
@UseInterceptors(TransformInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AccessTokenGuard)
export class RestaurantsController {
	constructor(private readonly restaurantsService: RestaurantsService) {}

	@Get()
	getRes(@Query() getResDto: GetResDto): Promise<IGetRestaurants> {
		return this.restaurantsService.getRes(getResDto);
	}
}
