import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import * as xml2js from 'xml2js';

export class OpenApiService {
	constructor(private readonly httpService: HttpService) {}
	async fetchDataFromOpenAPI(apiUrl: string) {
		const apiKey = process.env.OPEN_API_KEY;
		try {
			const response = await axios.get(apiUrl, { params: { apiKey } });
			const xmlData = response.data;

			// XML 데이터를 JSON으로 파싱
			const parser = new xml2js.Parser();
			const jsonData = await parser.parseStringPromise(xmlData);
			// 동적으로 Genrestrtcate 엘리먼트 이름을 추출
			const genrestrtcateName = Object.keys(jsonData)[0];
			// 동적으로 추출한 엘리먼트 이름으로 row 데이터에 접근
			return jsonData[genrestrtcateName].row;
		} catch (error) {
			throw new Error('API 요청 중 오류 발생');
		}
	}
	async multiDataFromOpenAPI() {
		const urls = [
			'https://openapi.gg.go.kr/Genrestrtlunch',
			'https://openapi.gg.go.kr/Genrestrtcate',
			'https://openapi.gg.go.kr/Genrestrtmovmntcook',
			'https://openapi.gg.go.kr/Genrestrtchifood',
			'https://openapi.gg.go.kr/Genrestrtsoup',
			'https://openapi.gg.go.kr/Genrestrtfastfood',
			'https://openapi.gg.go.kr/Genrestrtsash',
			'https://openapi.gg.go.kr/Genrestrtbuff',
			'https://openapi.gg.go.kr/Genrestrtstandpub',
			'https://openapi.gg.go.kr/Genrestrttratearm',
			'https://openapi.gg.go.kr/Genrestrtbsrpcook',
			'https://openapi.gg.go.kr/Resrestrtcvnstr',
			'https://openapi.gg.go.kr/Familyrstrt',
			'https://openapi.gg.go.kr/Resrestrtdrts',
			'https://openapi.gg.go.kr/Familyrstrt',
			'https://openapi.gg.go.kr/Resrestrttearm',
		];
		const dataPromises = urls.map((url) => this.fetchDataFromOpenAPI(url));
		const dataArr = await Promise.all(dataPromises);
		return dataArr.reduce((acc, data) => acc.concat(data), []);
	}
}
