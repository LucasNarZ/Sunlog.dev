import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalFilter } from './filters/ValidationErroItem.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new GlobalFilter())
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
