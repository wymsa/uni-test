import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  const configService = app.get<ConfigService>(ConfigService);

  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap();
