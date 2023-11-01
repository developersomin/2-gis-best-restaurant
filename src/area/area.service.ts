import {InjectRepository} from "@nestjs/typeorm";
import {Area} from "./entities/area.entity";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {readFile} from "../commons/fs/fs.read";

@Injectable()
export class AreaService {

    constructor(
      @InjectRepository(Area)
      private readonly areaRepository: Repository<Area>) {
    }

    async readCSVAndInsertData() {
        const data = readFile();
        for (const item of data) {
            console.log(item);
            await this.areaRepository.save(item);
        }
    }

    async createArea() {

    }
}
