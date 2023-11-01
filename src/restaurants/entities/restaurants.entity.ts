import {Column, Entity, OneToMany} from "typeorm";
import {BaseEntity} from "../../commons/entitis/base.entity";
import {Evaluations} from "../../evaluations/entities/evaluations.entity";

@Entity()
export class Restaurants extends BaseEntity{

    @Column({name: 'SIGUN_NM',nullable: true })
    cityName: string;
    @Column({name: 'SIGUN_CD',nullable: true })
    cityCode: string;
    @Column({name: 'BIZPLC_NM',nullable: true })
    storeName: string;
    @Column({name: 'LICENSG_DE',nullable: true })
    licenseDate: string;
    @Column({name: 'BSN_STATE_NM',nullable: true })
    openState: string;
    @Column({name: 'CLSBIZ_DE',nullable: true })
    shutDownDate: string;
    @Column({name: 'LOCPLC_AR',nullable: true })
    locationScale: string;
    @Column({name: 'GRAD_FACLT_DIV_NM',nullable: true })
    gradFacltDivName: string;
    @Column({name: 'MALE_ENFLPSN_CNT',nullable: true })
    maleEmployeeCnt: string;
    @Column({name: 'YY',nullable: true })
    yy: string;
    @Column({name: 'MULTI_USE_BIZESTBL_YN',nullable: true })
    isMulti: string;
    @Column({name: 'GRAD_DIV_NM',nullable: true })
    gradDivName: string;
    @Column({name: 'TOT_FACLT_SCALE',nullable: true })
    totalScale:string;
    @Column({name: 'FEMALE_ENFLPSN_CNT', nullable: true})
    femaleEmployeeCnt: string;
    @Column({name: 'BSNSITE_CIRCUMFR_DIV_NM',nullable: true })
    businessAreaName: string;
    @Column({name: 'SANITTN_INDUTYPE_NM',nullable: true })
    cleanKindName: string;
    @Column({name: 'SANITTN_BIZCOND_NM',nullable: true })
    cleanBizName: string;
    @Column({name: 'TOT_EMPLY_CNT', nullable: true})
    totalEmployeeCnt: string;
    @Column({name: 'REFINE_LOTNO_ADDR', nullable: true})
    lotNoAddr: string;
    @Column({name: 'REFINE_ROADNM_ADDR', nullable: true})
    roadAddr: string;
    @Column({name: 'REFINE_ZIP_CD',nullable: true })
    zipCode: string;

    @Column({type: "decimal",precision: 10, scale: 7})
    lon: number;
    @Column({type: "decimal",precision: 10, scale: 8})
    lat: number;



    @OneToMany(()=>Evaluations, (evaluation)=> evaluation.restaurant)
    evaluations: Evaluations[]
}