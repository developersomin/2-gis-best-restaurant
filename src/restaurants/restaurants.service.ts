import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurants } from './entities/restaurants.entity';
import { Repository } from 'typeorm';
import { OpenApiService } from '../openapi/open-api.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurants)
    private readonly restaurantsRepository: Repository<Restaurants>,
    private readonly openApiService: OpenApiService,
  ) {}

  async dataInsert() {
    const rows = await this.openApiService.fetchDataFromOpenAPI();
    for (const row of rows) {
      const dsa = {
        cityName: row.SIGUN_NM[0],
        cityCode: row.SIGUN_CD[0],
        storeName: row.BIZPLC_NM[0],
        licenseDate: row.LICENSG_DE[0],
        openState: row.BSN_STATE_NM[0],
        shutDownDate: row.CLSBIZ_DE[0],
        locationScale: row.LOCPLC_AR[0],
        gradFacltDivName: row.GRAD_FACLT_DIV_NM[0],
        maleEmployeeCnt: row.MALE_ENFLPSN_CNT[0],
        yy: row.YY[0],
        isMulti: row.MULTI_USE_BIZESTBL_YN[0],
        gradDivName: row.GRAD_DIV_NM[0],
        totalScale: row.TOT_FACLT_SCALE[0],
        femaleEmployeeCnt: row.FEMALE_ENFLPSN_CNT[0],
        businessAreaName: row.BSNSITE_CIRCUMFR_DIV_NM[0],
        cleanKindName: row.SANITTN_INDUTYPE_NM[0],
        cleanBizName: row.SANITTN_BIZCOND_NM[0],
        totalEmployeeCnt: row.TOT_EMPLY_CNT[0],
        lotNoAddr: row.REFINE_LOTNO_ADDR[0],
        roadAddr: row.REFINE_ROADNM_ADDR[0],
        zipCode: row.REFINE_ZIP_CD[0],
        lon: Number(row.REFINE_WGS84_LOGT[0]),
        lat: Number(row.REFINE_WGS84_LAT[0]),
      };
      console.log(dsa);
    }
  }
}
