import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../commons/entitis/base.entity';
import { Evaluations } from '../../evaluations/entities/evaluations.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Users extends BaseEntity {
	@Column()
	nickname: string;

	@Exclude()
	@Column()
	password: string;

	@Column({ type: 'decimal', precision: 13, scale: 10 })
	lon: number;

	@Column({ type: 'decimal', precision: 12, scale: 10 })
	lat: number;

	@Column({ default: false })
	isRecommend: boolean;

	@OneToMany(() => Evaluations, (evaluation) => evaluation.user)
	evaluations: Evaluations[];
}
