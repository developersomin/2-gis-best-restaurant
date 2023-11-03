import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/usesr.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseInterceptors(ClassSerializerInterceptor)
	@Post()
	async createUser(@Body() createUserDto: CreateUserDto): Promise<Users> {
		return await this.usersService.createUser(createUserDto);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Patch('/:userId')
	async userUpdate(@Param('userId') id: string, @Body() updateUserDto: UpdateUserDto): Promise<Users> {
		return await this.usersService.updateUser(id, updateUserDto);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get('/:userId')
	async getUser(@Param('userId') id: string): Promise<Users> {
		return await this.usersService.findOne({ id });
	}
}
