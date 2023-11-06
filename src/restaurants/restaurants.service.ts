import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurants } from './entities/restaurants.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { OpenApiService } from '../openapi/open-api.service';
import { IFindByDosiAndSgg } from './interface/restaurants-service.interface';

@Injectable()
export class RestaurantsService implements OnModuleInit {
	constructor(
		@InjectRepository(Restaurants)
		private readonly restaurantsRepository: Repository<Restaurants>,
		private readonly openApiService: OpenApiService,
	) {}

	async onModuleInit() {
		const rows = await this.openApiService.getAllData();
		for (const row of rows) {
			if (row.REFINE_WGS84_LOGT !== null || row.REFINE_WGS84_LAT !== null) {
				const data = {
					resNo: row.SAFETY_RESTRNT_NO,
					resName: row.BIZPLC_NM,
					detailAddr: row.DETAIL_ADDR,
					storeTypeName: row.INDUTYPE_NM,
					foodTypeName: row.INDUTYPE_DETAIL_NM,
					telNo: row.TELNO,
					slctnYnDiv: row.SLCTN_YN_DIV,
					roadAddr: row.REFINE_ROADNM_ADDR,
					lotNoAddr: row.REFINE_LOTNO_ADDR,
					zipNo: row.REFINE_ZIPNO,
					lon: row.REFINE_WGS84_LOGT,
					lat: row.REFINE_WGS84_LAT,
					area: {
						dosi: row.SIDO_NM,
						sgg: row.SIGNGU_NM,
					},
				};
				await this.restaurantsRepository.save({
					...data,
				});
			}
		}
	}

	findOne(restaurants: Pick<Restaurants, 'resName' | 'lotNoAddr'>): Promise<Restaurants> {
		return this.restaurantsRepository.findOne({
			where: {
				resName: restaurants.resName,
				lotNoAddr: restaurants.lotNoAddr,
			},
		});
	}
	async findByDosiOrSgg(paginateRestaurantDto): Promise<IFindByDosiAndSgg> {
		const [restaurants, total] = await this.restaurantsRepository.findAndCount({
			where: {
				area: {
					dosi: paginateRestaurantDto.dosi,
					sgg: paginateRestaurantDto.sgg,
				},
				resNo: MoreThan(paginateRestaurantDto.cursor ?? 0),
			},
			relations: ['area'],
			take: paginateRestaurantDto.take,
		});
		const lastItem =
			restaurants.length > 0 && restaurants.length === paginateRestaurantDto.take
				? restaurants[restaurants.length - 1]
				: null;
		const nextUrl = lastItem && new URL('http://localhost:3000/restaurants');
		if (nextUrl) {
			for (const key of Object.keys(paginateRestaurantDto)) {
				if (key !== 'cursor') {
					nextUrl.searchParams.append(key, paginateRestaurantDto[key]);
				}
			}
			nextUrl.searchParams.append('cursor', lastItem.resNo.toString());
		}

		return {
			data: restaurants,
			total,
			cursor: {
				after: lastItem?.resNo ?? null,
			},
			count: restaurants.length,
			next: decodeURIComponent(nextUrl?.toString() ?? null),
		};
	}

	async getRes(getResDto) {
		const qb = this.restaurantsRepository.createQueryBuilder('restaurants');
		qb.addSelect(
			`6371 * acos(cos(radians(${getResDto.lat})) * cos(radians(lat)) * cos(radians(lon) - radians(${getResDto.lon})) + sin(radians(${getResDto.lat})) * sin(radians(lat)))`,
			'distance',
		);
		if (getResDto.order__distance) {
			qb.orderBy('distance', getResDto.order__distance);
		} else if (getResDto.order__scoreAvg) {
			qb.orderBy('scoreAvg', getResDto.order__scoreAvg);
		}
		qb.having(`distance <= ${getResDto.range}`);
		const result = await qb.getRawMany();
		return result;
	}

	async updateRes(restaurants: Pick<Restaurants, 'resName' | 'lotNoAddr' | 'scoreAvg'>): Promise<Restaurants> {
		const findRes = await this.findOne({
			resName: restaurants.resName,
			lotNoAddr: restaurants.lotNoAddr,
		});
		if (!findRes) {
			throw new BadRequestException('음식점이 존재하지 않습니다.');
		}
		const isUpdated = await this.restaurantsRepository.update(
			{
				resName: restaurants.resName,
				lotNoAddr: restaurants.lotNoAddr,
			},
			{
				scoreAvg: restaurants.scoreAvg,
			},
		);
		if (isUpdated.affected === 1) {
			return findRes;
		} else {
			throw new BadRequestException('음식점 업데이트에 실패 하셨습니다.');
		}
	}
}
