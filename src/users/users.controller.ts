import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UseFilters,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/users.entity';
import { AccessTokenGuard } from '../auth/guard/jwt-token.guard';
import { IGiveToken } from '../auth/interface/auth-service.interface';
import { HttpExceptionFilter } from '../commons/exception-filter/http.exception-filter';
import { TransformInterceptor } from '../commons/interceptor/transform.interceptor';
import { User } from './decorator/users.decorator';

@Controller('users')
@UseInterceptors(TransformInterceptor)
@UseFilters(HttpExceptionFilter)
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
	async userUpdate(@User('id') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<string> {
		return await this.usersService.updateUser(userId, updateUserDto);
	}

	@UseGuards(AccessTokenGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	@Get('/:userId')
	async getUser(@User('id') userId: string): Promise<Users> {
		return this.usersService.findOne({ id: userId });
	}
}
