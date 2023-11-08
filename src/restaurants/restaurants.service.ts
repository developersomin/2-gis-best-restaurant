import { BadRequestException, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurants } from './entities/restaurants.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { OpenApiService } from '../openapi/open-api.service';
import { IGetRestaurants, ISquareBox } from './interface/restaurants-service.interface';
import * as geolib from 'geolib';
import { GetResDto } from './dto/paginate-restaurant.dto';
import { Users } from '../users/entities/users.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RestaurantsService implements OnModuleInit {
	constructor(
		@InjectRepository(Restaurants)
		private readonly restaurantsRepository: Repository<Restaurants>,
		private readonly openApiService: OpenApiService,
		private readonly dataSource: DataSource,
	) {}

	//라이프싸이클에 의해 앱이 시작할때 오픈 API 와 연동하여 데이터베이스에 저장하는 로직
	@Cron('0 0 0 * * 1') //매주월요일 00:00 자동실행
	async onModuleInit() {
		const rows = await this.openApiService.getAllData();
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
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
					await queryRunner.manager.save(Restaurants, {
						...data,
					});
				}
			}
			await queryRunner.commitTransaction();
			await queryRunner.release();
		} catch (e) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			throw new InternalServerErrorException('음식점 데이터베이스에 저장 중 오류 발생');
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

	//나의 위치에 반경 range 사각박스 생성 후 위도와 경도의 최대 최소 값 구하는 로직
	getSquareBox(lon, lat, range): ISquareBox {
		const boundingBox = geolib.getBoundsOfDistance({ latitude: lat, longitude: lon }, range * 1000);

		const minLat = boundingBox[0].latitude;
		const minLon = boundingBox[0].longitude;
		const maxLat = boundingBox[1].latitude;
		const maxLon = boundingBox[1].longitude;

		return { minLat, minLon, maxLat, maxLon };
	}

	withinRangeQuery(qb: SelectQueryBuilder<Restaurants>, squareBox: ISquareBox) {
		const { minLat, maxLat, minLon, maxLon } = squareBox;
		qb.where('restaurants.lat > :minLat', { minLat })
			.andWhere('restaurants.lat < :maxLat', { maxLat })
			.andWhere('restaurants.lon > :minLon', { minLon })
			.andWhere('restaurants.lon < :maxLon', { maxLon });
	}

	async getRes(getResDto: GetResDto): Promise<IGetRestaurants> {
		const { lon, lat, range, order__distance, order__scoreAvg } = getResDto;
		const squareBox = this.getSquareBox(getResDto.lon, getResDto.lat, getResDto.range);
		const cursor = getResDto.cursor ?? 0;
		const qb = this.restaurantsRepository.createQueryBuilder('restaurants');
		this.withinRangeQuery(qb, squareBox);
		qb.andWhere('restaurants.resNo > :cursor', { cursor });
		qb.addSelect(
			`6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lon) 
			- radians(${lon})) + sin(radians(${lat})) * sin(radians(lat)))`,
			'distance',
		);

		//거리 정렬과 점수 정렬이 같이 들어오면 평점순으로 먼저 정렬 후 거리순으로 정렬한다.
		//이유는 거리는 중복이 적고 점수는 중복이 많을 수 있다 생각해서 결정했고
		//사용자가 반경 1km 이내의 음식점을 찾아갈때 평점순으로 먼저 보기 때문에 로직을 구성함
		if (getResDto.order__distance && getResDto.order__scoreAvg) {
			qb.orderBy('scoreAvg', order__scoreAvg);
			qb.addOrderBy('distance', order__distance);
		} else if (getResDto.order__distance && !getResDto.order__scoreAvg) {
			qb.orderBy('distance', order__distance);
		} else if (!getResDto.order__distance && getResDto.order__scoreAvg) {
			qb.orderBy('scoreAvg', order__scoreAvg);
		}
		qb.having('distance <= :range', { range });
		qb.take(20);
		const restaurants = await qb.getRawMany();

		//페이지네이션 하는 로직으로 take 20개를 온전히 가져오지 못하면 null 값으로 표시
		//20개를 온전히 가져오지 못한다면 다음 페이지가 없기 때문에 다음 페이지를 위한 설정이다.
		const lastItem =
			restaurants.length > 0 && restaurants.length === getResDto.take
				? restaurants[restaurants.length - 1]
				: null;

		//다음 페이지 주소를 만들어주는 로직
		const nextUrl = lastItem && new URL('http://localhost:3000/restaurants');
		if (nextUrl) {
			for (const key of Object.keys(getResDto)) {
				if (key !== 'cursor') {
					nextUrl.searchParams.append(key, getResDto[key]);
				}
			}
			nextUrl.searchParams.append('cursor', lastItem.restaurants_resNo.toString());
		}

		return {
			data: restaurants,
			cursor: {
				after: lastItem?.restaurants_resNo ?? null,
			},
			count: restaurants.length,
			next: decodeURIComponent(nextUrl?.toString() ?? null),
		};
	}
	randomNumber(length) {
		let end = 0;
		if (length < 5) {
			end = length;
		} else {
			end = 5;
		}
		const indexArray = [];
		for (let i = 0; i < end; i++) {
			const number = Math.floor(Math.random() * length);
			if (indexArray.find((e) => e === number)) {
				i--;
			} else {
				indexArray.push(number);
			}
		}
		return indexArray;
	}

	async recommendRandomRes(user: Users) {
		const { lat, lon } = user;
		const qb = this.restaurantsRepository.createQueryBuilder('restaurants');
		const squareBox = this.getSquareBox(lon, lat, 0.5);
		this.withinRangeQuery(qb, squareBox);
		const restaurants = await qb.getMany();
		const indexArr = this.randomNumber(restaurants.length);
		const randomRestaurants = [];
		for (const index of indexArr) {
			const restaurant = {
				resName: restaurants[index].resName,
				lotNoAddr: restaurants[index].lotNoAddr,
				foodTypeName: restaurants[index].foodTypeName,
				scoreAvg: restaurants[index].scoreAvg,
			};
			randomRestaurants.push(restaurant);
		}
		return randomRestaurants;
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
