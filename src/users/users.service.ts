import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/usesr.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) {}

	async findOne(options: FindOptionsWhere<Users>): Promise<Users> {
		return await this.usersRepository.findOne({ where: options });
	}
	async createUser(createUserDto: CreateUserDto): Promise<Users> {
		const { nickname, password } = createUserDto;
		const findUser = await this.findOne({ nickname });
		if (findUser) {
			throw new BadRequestException('이미 가입한 아이디가 있습니다.');
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = this.usersRepository.create({
			nickname,
			password: hashedPassword,
		});
		await this.usersRepository.save(newUser);

		return newUser;
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
		const { isRecommend, lon, lat } = updateUserDto;
		const findUser = await this.findOne({ id });
		if (!findUser) {
			throw new BadRequestException('존재하지 않는 계정입니다.');
		}
		const updateResult = await this.usersRepository.update({ id: findUser.id }, { isRecommend: true, lon, lat });
		if (updateResult.affected === 1) {
			return findUser;
		} else {
			throw new BadRequestException('업데이트에 실패 했습니다.');
		}
	}
}
