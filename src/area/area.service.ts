import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/areas.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { readFile } from '../commons/fs/fs.read';

@Injectable()
export class AreaService implements OnModuleInit {
	constructor(
		@InjectRepository(Area)
		private readonly areaRepository: Repository<Area>,
		private readonly dataSource: DataSource,
	) {}

	async onModuleInit() {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const rows: Area[] = readFile();
		try {
			for (const row of rows) {
				const existingRow = await this.areaRepository.findOne({ where: { dosi: row.dosi, sgg: row.sgg } });
				if (!existingRow) {
					await queryRunner.manager.save(Area, row);
				}
			} //
			await queryRunner.commitTransaction();
			await queryRunner.release();
		} catch (e) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			throw new InternalServerErrorException('지역 데이터베이스 저장 중 오류 발생');
		}
	}

	async getAreas(): Promise<Area[]> {
		return this.areaRepository.find();
	}
}
