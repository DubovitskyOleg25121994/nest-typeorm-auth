import { Body, Controller, Post, Put, UseGuards, Res, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { RegistrationResponseDto } from './dto/registration-response.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserRoles } from './enums/role.enums';
import { SetPasswordDto } from './dto/set-password.dto';
import { TokenDataDto } from './dto/token-data.dto';
import { TokenDataResponseDto } from './dto/token-data-response.dto';
import { VERSION_API_V1 } from '../constants';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({
		summary: 'Логин',
	})
	@ApiBody({ type: LoginDto })
	@ApiResponse({ status: 200, type: TokenDataResponseDto })
	@Post('login')
	@Version(VERSION_API_V1)
	async login(@Res() res, @Body() loginDto: LoginDto): Promise<TokenDataDto> {
		const loginData = await this.authService.login(loginDto);
		const cookieOptions = {
			expires: this.authService.getRefreshTokenExpire(),
			httpOnly: true,
		};
		res.cookie('refreshToken', loginData.refreshToken, cookieOptions);
		const tokenDataResponse = plainToClass(TokenDataResponseDto, loginData);
		return res.send(tokenDataResponse);
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Регистрация',
	})
	@Roles(UserRoles.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBody({ type: RegistrationDto })
	@ApiResponse({ status: 200, type: RegistrationResponseDto })
	@Post('registration')
	@Version(VERSION_API_V1)
	registrationV1(@Body() registrationDto: RegistrationDto) {
		return plainToClass(RegistrationResponseDto, this.authService.registration(registrationDto));
	}

	@ApiOperation({
		summary: 'Установить пароль',
	})
	@ApiBody({ type: SetPasswordDto })
	@ApiResponse({ status: 200, type: RegistrationResponseDto })
	@Put('set-password')
	@Version(VERSION_API_V1)
	setPasswordV1(@Body() setPassword: SetPasswordDto) {
		return this.authService.setPassword(setPassword);
	}
}
