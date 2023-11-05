import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entitis/base.entity';
import { Evaluations } from '../../evaluations/entities/evaluations.entity';
import { OmitType } from '@nestjs/mapped-types';

@Entity()
export class Restaurants extends OmitType(BaseEntity, ['id'] as const) {
	@Column({ nullable: true })
	cityName: string;
	@Column({ nullable: true })
	cityCode: string;
	@PrimaryColumn()
	storeName: string;
	@Column({ nullable: true })
	licenseDate: string;
	@Column({ nullable: true })
	openState: string;
	@Column({ nullable: true })
	shutDownDate: string;
	@Column({ nullable: true })
	locationScale: string;
	@Column({ nullable: true })
	gradFacltDivName: string;
	@Column({ nullable: true })
	yy: string;
	@Column({ nullable: true })
	isMulti: string;
	@Column({ nullable: true })
	totalScale: string;
	@Column({ nullable: true })
	cleanKindName: string;
	@Column({ nullable: true })
	cleanBizName: string;
	@Column({ nullable: true })
	totalEmployeeCnt: string;
	@PrimaryColumn()
	lotNoAddr: string;
	@Column({ nullable: true })
	roadAddr: string;
	@Column({ nullable: true })
	zipCode: string;
	@Column({ type: 'decimal', precision: 10, scale: 7 })
	lon: number;
	@Column({ type: 'decimal', precision: 10, scale: 8 })
	lat: number;
	@Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
	scoreAvg: number;
	@OneToMany(() => Evaluations, (evaluation) => evaluation.restaurant)
	evaluations: Evaluations[];
}
