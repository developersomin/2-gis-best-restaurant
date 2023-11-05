import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/users.entity';
import { AccessTokenGuard } from '../auth/guard/jwt-token.guard';
import { IGiveToken } from '../auth/interface/auth-service.interface';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseInterceptors(ClassSerializerInterceptor)
	@Post()
	async createUser(@Body() createUserDto: CreateUserDto): Promise<Users> {
		return await this.usersService.createUser(createUserDto);
	}
	@Post('login')
	async login(@Body('nickname') nickname: string, @Body('password') password: string): Promise<IGiveToken> {
		return await this.usersService.login({ nickname, password });
	}
	@UseGuards(AccessTokenGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	@Patch('/:userId')
	async userUpdate(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<Users> {
		return await this.usersService.updateUser(userId, updateUserDto);
	}

	@UseGuards(AccessTokenGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	@Get('/:userId')
	async getUser(@Param('userId') id: string): Promise<Users> {
		return await this.usersService.findOne({ id });
	}
}
