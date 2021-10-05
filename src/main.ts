import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			validationError: {
				target: false,
			},
		}),
	);
	app.enableVersioning({
		type: VersioningType.URI,
	});

	const config = new DocumentBuilder()
		.addServer('/')
		.setTitle('ADMIN PANEL API')
		.setDescription('ADMIN PANEL API description')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	await app.listen(3000);
}
bootstrap();
