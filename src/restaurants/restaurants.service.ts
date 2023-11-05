import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurants } from './entities/restaurants.entity';
import { Repository } from 'typeorm';
import { OpenApiService } from '../openapi/open-api.service';

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
					lot: row.REFINE_WGS84_LOGT,
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
