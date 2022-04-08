import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('localhost+2-key.pem'),
    cert: fs.readFileSync('localhost+2.pem'),
  };
  const app = await NestFactory.create(AppModule, { cors: true, httpsOptions });
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.setGlobalPrefix('api');
  await app.listen(4000);
}
bootstrap();
