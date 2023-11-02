import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurants } from './entities/restaurants.entity';
import { Repository } from 'typeorm';
import { OpenApiService } from '../openapi/open-api.service';

@Injectable()
export class RestaurantsService implements OnModuleInit,OnModuleDestroy{
  constructor(
    @InjectRepository(Restaurants)
    private readonly restaurantsRepository: Repository<Restaurants>,
    private readonly openApiService: OpenApiService,
  ) {}
  async onModuleInit() {

    const data1 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrtlunch");
    const data2 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrtcate");
    const data3 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrtmovmntcook");
    const data4 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrtchifood");
    const data5 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrtsoup");
    const data6 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrtfastfood");
    const data7 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrtsash");
    const data8 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrtbuff");
    const data9 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrtstandpub");
    const data10 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrttratearm");
    const data11 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Genrestrtbsrpcook");
    const data12 = await this.openApiService.fetchDataFromOpenAPI("https://openapi.gg.go.kr/Resrestrtcvnstr");

    const rows = data1.concat(data2).concat(data3).concat(data4).concat(data5).concat(data6).concat(data7).concat(data8).concat(data9).concat(data10).concat(data11).concat(data12);
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
        lat: Number(row.REFINE_WGS84_LAT[0])
      };


      this.restaurantsRepository.save(dsta);

    }
  }
  onModuleDestroy() {
        //throw new Error("Method not implemented.");
    }

}
