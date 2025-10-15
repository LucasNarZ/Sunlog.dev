import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalFilter } from './filters/globalFilter.filter';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.use(helmet());
	app.use(cookieParser());
	app.enableCors({
		origin: ['https://sunlog.dev', 'http://localhost'],
		credentials: true,
	});
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new GlobalFilter());
	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
