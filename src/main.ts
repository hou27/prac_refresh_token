import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('localhost+2-key.pem'),
    cert: fs.readFileSync('localhost+2.pem'),
  };
  const app = await NestFactory.create(AppModule, { cors: true, httpsOptions });
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('JWT example')
    .setDescription('The simple API description')
    .setVersion('0.1')
    .addTag('jwt')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(4000);
}
bootstrap();
