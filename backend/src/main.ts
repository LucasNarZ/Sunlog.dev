import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalFilter } from './filters/globalFilter.filter';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { logger } from './logger/logger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { logger });
	app.setGlobalPrefix('api');
	app.use(helmet());
	app.use(cookieParser());
	app.enableCors({
		origin: ['https://sunlog.dev', 'http://localhost'],
		credentials: true,
	});
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new GlobalFilter());

	const config = new DocumentBuilder()
		.setTitle('Sunlog.dev API Docs')
		.setDescription('Sunlog.dev API Docs')
		.setVersion('1.0')
		.addTag('sunlog.dev')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, documentFactory);

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
