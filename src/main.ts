import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
// import { AllExceptionFilter } from './shared/all-exception.filter'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.setGlobalPrefix('api')
  app.use(helmet())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  // app.useGlobalFilters(new AllExceptionFilter())

  const options = new DocumentBuilder()
    .setTitle('Nest test example.')
    .setDescription('The nestjs test API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(3000)
  // console.log(process.env)
}
bootstrap()
