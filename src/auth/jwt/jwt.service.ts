import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenDataDto } from '../dto/token-data.dto';
import { IJwtPayload, IJwtResponse } from './interfaces/jwt.interface';

@Injectable()
export class JwtAuthService {
	constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

	getTokeData(accessToken: string, refreshToken: string): TokenDataDto {
		const { exp } = this.verifyToken(accessToken);
		const tokenDataDto = new TokenDataDto();
		tokenDataDto.accessToken = accessToken;
		tokenDataDto.refreshToken = refreshToken;
		tokenDataDto.expiresIn = exp;

		return tokenDataDto;
	}

	createAccessToken(payload: IJwtPayload): string {
		return this.generateToken(payload, this.JWT_EXPIRES_IN);
	}

	verifyToken(token: string): IJwtResponse {
		return this.jwtService.verify(token);
	}

	private generateToken(payload: IJwtPayload, expiresIn: string) {
		return this.jwtService.sign(payload, {
			expiresIn,
		});
	}

	private get JWT_EXPIRES_IN() {
		return this.configService.get<string>('JWT_EXPIRES_IN');
	}
}
