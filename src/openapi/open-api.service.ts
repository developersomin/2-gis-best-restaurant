import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { parseStringPromise } from 'xml2js';
import { BadRequestException } from '@nestjs/common';

export class OpenApiService {
	constructor(private readonly httpService: HttpService) {}

	/*async fetchDataFromOpenAPI(apiUrl: string) {
		try {
			const response = await axios.get(apiUrl);
			const xmlData = response.data;

			// XML 데이터를 JSON으로 파싱
			const parser = new xml2js.Parser();
			const jsonData = await parser.parseStringPromise(xmlData);
			// 동적으로 Genrestrtcate 엘리먼트 이름을 추출
			const startXML = Object.keys(jsonData)[0];
			// 동적으로 추출한 엘리먼트 이름으로 row 데이터에 접근
			return jsonData[startXML].row;
		} catch (error) {
			throw new Error('API 요청 중 오류 발생');
		}
	}*/

	/*async multiDataFromOpenAPI() {
		const urls = [
			'https://openapi.gg.go.kr/SafetyRestrntInfo?KEY=385b88d6977b45f09e737206e77cfd6e&TYPE=xml&pIndex=1&pSize=1000',
			'https://openapi.gg.go.kr/SafetyRestrntInfo?KEY=385b88d6977b45f09e737206e77cfd6e&TYPE=xml&pIndex=1&pSize=1000',
			'https://openapi.gg.go.kr/SafetyRestrntInfo?KEY=385b88d6977b45f09e737206e77cfd6e&TYPE=xml&pIndex=1&pSize=1000',
			'https://openapi.gg.go.kr/SafetyRestrntInfo?KEY=385b88d6977b45f09e737206e77cfd6e&TYPE=xml&pIndex=1&pSize=1000',
		];
		const dataPromises = urls.map((url) => this.fetchDataFromOpenAPI(url));
		const dataArr = await Promise.all(dataPromises);
		return dataArr.reduce((acc, data) => acc.concat(data), []);
	}*/

	async getAllData() {
		const apiBaseURL = 'https://openapi.gg.go.kr/' + process.env.OPEN_API_TYPE;
		const apiKey = process.env.OPEN_API_KEY;
		const pageSize = 1000;
		let allData = [];

		for (let pIndex = 1; pIndex < 2; pIndex++) {
			const response = await axios.get(apiBaseURL, {
				params: {
					KEY: apiKey,
					TYPE: 'json', // JSON 형식으로 요청
					pIndex,
					pSize: pageSize,
				},
				headers: {
					accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*!/!*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				},
			});

			const safetyRestaurants = response.data.SafetyRestrntInfo;

			if (safetyRestaurants) {
				const rows = safetyRestaurants[1].row;
				if (rows) {
					allData.push(...rows);
				}
			}
		}
		return allData;
	}
}
