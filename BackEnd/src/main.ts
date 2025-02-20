import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalFilter } from './filters/globalFilter.filter';
import helmet from 'helmet';
import * as session from "express-session"
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';

declare module 'express-session' {
  export interface SessionData {
    user: {email:string};
  }
}


const redisSessionClient = new Redis({
  host:"redis-sessions"
})

redisSessionClient.connect().catch(console.error)
let redisStore = new RedisStore({
  client: redisSessionClient,
  prefix: "myapp:"
})


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())
  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET as string,
      resave: false, 
      saveUninitialized: false,
      cookie: {
        httpOnly: true, 
        secure: false, 
        maxAge: 1000 * 60 * 60, 
      },
    })
  )
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new GlobalFilter())
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
