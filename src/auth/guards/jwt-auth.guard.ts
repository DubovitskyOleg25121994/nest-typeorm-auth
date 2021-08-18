import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private readonly configService: ConfigService) {
		super();
	}

	handleRequest(err, user, info: Error): any {
		if (this.configService.get('REMOVE_GUARD') === 'true') {
			return user;
		}
		if (info && info.name === 'TokenExpiredError') {
			throw new UnauthorizedException('Jwt expired');
		}

		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}
