import { HttpService } from '@nestjs/axios';
import axios from 'axios';

export class OpenApiService {
	constructor(private readonly httpService: HttpService) {}

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
