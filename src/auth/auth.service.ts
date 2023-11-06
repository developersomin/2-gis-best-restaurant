import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from '../users/entities/users.entity';
import { IGiveToken, IVerifyToken } from './interface/auth-service.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	//-----------------------------------인증---------------------------------------
	signToken(user: Pick<Users, 'nickname' | 'id'>, isRefreshToken: boolean): string {
		const payload = {
			sub: user.id,
			nickname: user.nickname,
			type: isRefreshToken ? 'refresh' : 'access',
		};

		return this.jwtService.sign(payload, {
			secret: process.env.JWT_SECRET,
			expiresIn: isRefreshToken ? 7200 : 600,
		});
	}
	giveToken(user: Pick<Users, 'nickname' | 'id'>): IGiveToken {
		return {
			accessToken: this.signToken(user, false),
			refreshToken: this.signToken(user, true),
		};
	}

	//-----------------------------------인가---------------------------------------
	extractTokenFromHeader(header: string): string {
		//authorization: 'Bearer {token}'
		const splitToken = header.split(' ');

		if (splitToken.length !== 2 || splitToken[0] !== 'Bearer') {
			throw new UnauthorizedException('잘못된 토큰 입니다.');
		}

		const token = splitToken[1];

		return token;
	}

	verifyToken(token: string): IVerifyToken {
		try {
			return this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
		} catch (e) {
			throw new UnauthorizedException('토큰 만료 또는 잘못된 토큰 입니다.');
		}
	}

	async rotateToken(token: string, isRefreshToken: boolean): Promise<string> {
		const decoded = this.jwtService.verify(token, {
			secret: process.env.JWT_SECRET,
		});

		if (decoded.type !== 'refresh') {
			throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다!');
		}

		return this.signToken(
			{
				...decoded,
			},
			isRefreshToken,
		);
	}
}
