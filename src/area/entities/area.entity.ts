import {Column, Entity} from "typeorm";
import {BaseEntity} from "../../commons/entitis/base.entity";

@Entity()
export class Area extends BaseEntity{

    @Column()
    dosi: string;
    @Column()
    sgg: string;
    @Column({type: "decimal",precision: 10, scale: 7})
    lon: number;
    @Column({type: "decimal",precision: 10, scale: 8})
    lat: number;
}