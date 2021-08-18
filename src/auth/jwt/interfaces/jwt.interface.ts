export interface IJwtPayload {
	email: string;
	roles: string[];
}

export interface IJwtResponse {
	email: string;
	role: string;
	exp: number;
	iat: number;
}
