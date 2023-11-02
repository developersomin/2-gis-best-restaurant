import {InjectRepository} from "@nestjs/typeorm";
import {Area} from "./entities/area.entity";
import {Repository} from "typeorm";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {readFile} from "../commons/fs/fs.read";

@Injectable()
export class AreaService //implements OnModuleInit,OnModuleDestroy
{

    constructor(
      @InjectRepository(Area)
      private readonly areaRepository: Repository<Area>) {
    }

   /* async onModuleDestroy() {
        await this.areaRepository.clear();
    }

    async onModuleInit() {
        const data = readFile();
        for (const item of data) {
            console.log(item);
            await this.areaRepository.save(item);
        }
    }*/


    async createArea() {

    }
}
