import { Controller, Post, Headers, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IGiveToken } from './interface/auth-service.interface';
import { createTokenAccess, createTokenRefresh } from './interface/auth-controller.interface';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/jwt-token.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(AccessTokenGuard)
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
