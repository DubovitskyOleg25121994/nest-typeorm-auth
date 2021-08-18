import { Body, Controller, Post, Put, UseGuards, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({
		summary: 'Логин',
	})
	@ApiResponse({ status: 200, type: TokenDataResponseDto })
	@Post('login')
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
	@ApiResponse({ status: 200, type: RegistrationResponseDto })
	@Post('registration')
	registration(@Body() registrationDto: RegistrationDto) {
		return plainToClass(RegistrationResponseDto, this.authService.registration(registrationDto));
	}

	@ApiOperation({
		summary: 'Установить пароль',
	})
	@ApiResponse({ status: 200, type: RegistrationResponseDto })
	@Put('set-password')
	setPassword(@Body() setPassword: SetPasswordDto) {
		return this.authService.setPassword(setPassword);
	}
}
