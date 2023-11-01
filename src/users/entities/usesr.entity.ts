import {
    Column,
    Entity,
    OneToMany,
} from "typeorm";
import {BaseEntity} from "../../commons/entitis/base.entity";
import {Evaluations} from "../../evaluations/entities/evaluations.entity";

@Entity()
export class Users extends BaseEntity{
    @Column({unique: true})
    nickname: string;

    @Column()
    password: string;

    @Column({type: "decimal",precision: 10, scale: 7})
    lon: number;

    @Column({type: "decimal",precision: 10, scale: 8})
    lat: number;

    @Column({default: false})
    isRecommend: boolean;

    @OneToMany(()=>Evaluations, (evaluation)=> evaluation.user)
    evaluations: Evaluations[]
}