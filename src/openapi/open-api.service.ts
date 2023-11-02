import {HttpService} from "@nestjs/axios";
import axios from 'axios';
import * as xml2js from 'xml2js';

export class OpenApiService {
    constructor(private readonly httpService: HttpService) {
    }
    /*async fetchDataFromOpenAPI1() {
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
    }*/
    async fetchDataFromOpenAPI(apiUrl) {
        const apiKey = '16d349beca274e6490e4b0b737ba74c1';
        try {
            const response = await axios.get(apiUrl, {params: {apiKey}});
            const xmlData = response.data;

            // XML 데이터를 JSON으로 파싱
            const parser = new xml2js.Parser();
            const jsonData = await parser.parseStringPromise(xmlData);
            // 동적으로 Genrestrtcate 엘리먼트 이름을 추출
            const genrestrtcateName = Object.keys(jsonData)[0];
            // 동적으로 추출한 엘리먼트 이름으로 row 데이터에 접근
            const rows = jsonData[genrestrtcateName].row;
            return rows;

        } catch (error) {
            throw new Error('API 요청 중 오류 발생');
        }
    }

}