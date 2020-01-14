import { Module } from '@nestjs/common';
import { AppController, HomeController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, HomeController],
  providers: [AppService],
})
export class AppModule {}
