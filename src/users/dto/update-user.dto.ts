import { PickType } from '@nestjs/mapped-types';
import { Users } from '../entities/usesr.entity';

export class UpdateUserDto extends PickType(Users, ['nickname', 'isRecommend', 'lon', 'lat']) {}
