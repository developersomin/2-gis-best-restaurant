import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entitis/base.entity';
import { Evaluations } from '../../evaluations/entities/evaluations.entity';
import { OmitType } from '@nestjs/mapped-types';
import { Area } from '../../area/entities/areas.entity';

@Entity()
export class Restaurants extends OmitType(BaseEntity, ['id'] as const) {
	@Column({ nullable: true })
	resNo: number;
	@PrimaryColumn()
	resName: string;
	@Column({ nullable: true })
	detailAddr: string;
	@Column({ nullable: true })
	storeTypeName: string;
	@Column({ nullable: true })
	foodTypeName: string;
	@Column({ nullable: true })
	telNo: string;
	@Column({ nullable: true })
	slctnYnDiv: string;
	@Column({ nullable: true })
	roadAddr: string;
	@PrimaryColumn()
	lotNoAddr: string;
	@Column({ nullable: true })
	zipNo: number;
	@Column({ type: 'decimal', precision: 13, scale: 10, nullable: true })
	lon: number;
	@Column({ type: 'decimal', precision: 12, scale: 10, nullable: true })
	lat: number;

	@Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
	scoreAvg: number;
	@OneToMany(() => Evaluations, (evaluation) => evaluation.restaurant)
	evaluations: Evaluations[];
	@ManyToOne(() => Area, (area) => area.restaurants)
	@JoinColumn({ referencedColumnName: 'sgg' }) // PK 필드와 연결
	@JoinColumn({ referencedColumnName: 'dosi' }) // PK 필드와 연결
	area: Area;
}
