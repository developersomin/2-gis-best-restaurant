import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/areas.entity';
import { MoreThan, Repository } from 'typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFile } from '../commons/fs/fs.read';

@Injectable()
export class AreaService implements OnModuleInit {
	constructor(
		@InjectRepository(Area)
		private readonly areaRepository: Repository<Area>,
	) {}

	async onModuleInit() {
		const rows: Area[] = readFile();
		console.log(rows);
		for (const row of rows) {
			const existingRow = await this.areaRepository.findOne({ where: { dosi: row.dosi, sgg: row.sgg } });
			if (!existingRow) {
				await this.areaRepository.save(row);
			}
		}
	}

	async getAreas(): Promise<Area[]> {
		return this.areaRepository.find();
	}
}
