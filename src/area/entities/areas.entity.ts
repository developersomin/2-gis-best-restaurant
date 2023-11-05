import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entitis/base.entity';
import { Restaurants } from '../../restaurants/entities/restaurants.entity';
import { OmitType } from '@nestjs/mapped-types';

@Entity()
export class Area extends OmitType(BaseEntity, ['id'] as const) {
	@PrimaryColumn()
	dosi: string;
	@PrimaryColumn()
	sgg: string;
	@Column({ type: 'decimal', precision: 10, scale: 7 })
	lon: number;
	@Column({ type: 'decimal', precision: 10, scale: 8 })
	lat: number;
	@OneToMany(() => Restaurants, (restaurants) => restaurants.area)
	restaurants: Restaurants[];
}
