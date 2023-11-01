import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AreaService } from "./area/area.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(AreaService).readCSVAndInsertData();
  await app.listen(3000);
}
bootstrap();
