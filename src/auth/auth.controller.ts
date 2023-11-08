import { Controller, Post, Headers, Body, UseGuards, UseInterceptors, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createTokenAccess, createTokenRefresh } from './interface/auth-controller.interface';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/jwt-token.guard';
import { TransformInterceptor } from '../commons/interceptor/transform.interceptor';
import { HttpExceptionFilter } from '../commons/exception-filter/http.exception-filter';

@Controller('auth')
@UseInterceptors(TransformInterceptor)
@UseFilters(HttpExceptionFilter)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(RefreshTokenGuard)
	@Post('token/access')
	async createTokenAccess(@Headers('authorization') rawToken: string): Promise<createTokenAccess> {
		const token = this.authService.extractTokenFromHeader(rawToken);
		return {
			accessToken: await this.authService.rotateToken(token, false),
		};
	}
	@UseGuards(RefreshTokenGuard)
	@Post('token/refresh')
	async createTokenRefresh(@Headers('authorization') rawToken: string): Promise<createTokenRefresh> {
		const token = this.authService.extractTokenFromHeader(rawToken);

		return {
			refreshToken: await this.authService.rotateToken(token, true),
		};
	}
}
