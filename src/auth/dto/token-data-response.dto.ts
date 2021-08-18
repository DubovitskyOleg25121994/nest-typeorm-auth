import { ApiProperty } from '@nestjs/swagger';

export class TokenDataResponseDto {
	@ApiProperty({ description: 'Токен доступа' })
	accessToken: string;

	@ApiProperty({ description: 'Дата окончания действия токена' })
	expiresIn: number;

	toJSON() {
		return {
			accessToken: this.accessToken,
			expiresIn: this.expiresIn,
		};
	}
}
