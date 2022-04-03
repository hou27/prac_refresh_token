import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.setGlobalPrefix('api');
  await app.listen(4000);
}
bootstrap();
