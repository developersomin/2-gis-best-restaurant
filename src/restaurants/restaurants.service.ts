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
		const rows = await this.openApiService.multiDataFromOpenAPI();
		for (const row of rows) {
			console.log(row);
			const dsta = {
				cityName: row.SIGUN_NM[0],
				cityCode: row.SIGUN_CD[0],
				storeName: row.BIZPLC_NM[0],
				licenseDate: row.LICENSG_DE[0],
				openState: row.BSN_STATE_NM[0],
				shutDownDate: row.CLSBIZ_DE[0],
				locationScale: row.LOCPLC_AR[0],
				gradFacltDivName: row.GRAD_FACLT_DIV_NM[0],
				yy: row.YY[0],
				isMulti: row.MULTI_USE_BIZESTBL_YN[0],
				totalScale: row.TOT_FACLT_SCALE[0],
				cleanKindName: row.SANITTN_INDUTYPE_NM[0],
				cleanBizName: row.SANITTN_BIZCOND_NM[0],
				totalEmployeeCnt: row.TOT_EMPLY_CNT[0],
				lotNoAddr: row.REFINE_LOTNO_ADDR[0],
				roadAddr: row.REFINE_ROADNM_ADDR[0],
				zipCode: row.REFINE_ZIP_CD[0],
				lon: Number(row.REFINE_WGS84_LOGT[0]),
				lat: Number(row.REFINE_WGS84_LAT[0]),
			};
			await this.restaurantsRepository.save(dsta);
		}
	}

	findOne(storeName: string, lotNoAddr: string) {
		return this.restaurantsRepository.findOne({
			where: {
				storeName,
				lotNoAddr,
			},
		});
	}

	async updateRes(storeName: string, lotNoAddr: string, scoreAvg: number) {
		const findRes = await this.findOne(storeName, lotNoAddr);
		if (!findRes) {
			throw new BadRequestException('음식점이 존재하지 않습니다.');
		}
		return this.restaurantsRepository.update(
			{
				storeName,
				lotNoAddr,
			},
			{
				scoreAvg,
			},
		);
	}
}
