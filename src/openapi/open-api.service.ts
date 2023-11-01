import {HttpService} from "@nestjs/axios";
import axios from 'axios';
import * as xml2js from 'xml2js';

export class OpenApiService {
    constructor(private readonly httpService: HttpService) {
    }
    async fetchDataFromOpenAPI() {
        const apiKey = '575b5d0baea8417d8d045523df504945';
        const apiUrl = 'https://openapi.gg.go.kr/Genrestrtchifood';


        try {
            const response = await axios.get(apiUrl, {params: {apiKey}});
            const xmlData = response.data;

            // XML 데이터를 JSON으로 파싱
            const parser = new xml2js.Parser();
            const jsonData = await parser.parseStringPromise(xmlData);
            const rows = jsonData.Genrestrtchifood.row;
            return rows;

        } catch (error) {
            throw new Error('API 요청 중 오류 발생');
        }
    }
}