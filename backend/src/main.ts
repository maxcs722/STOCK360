import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 app.enableCors();

  await app.listen(4000);

  console.log('🚀 STOCK360 Backend');
  console.log('🌐 http://localhost:4000');
}

bootstrap();
