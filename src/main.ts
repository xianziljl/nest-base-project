import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
// import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useStaticAssets(join(__dirname, '..', 'public'))
  // console.log(join(__dirname, '..', 'public'))

  const options = new DocumentBuilder()
    .setTitle('Nest test example.')
    .setDescription('The nestjs test API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}
bootstrap();
