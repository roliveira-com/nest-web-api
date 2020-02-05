import { Module } from '@nestjs/common';
import { AppController, HomeController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [AppController, HomeController],
  providers: [AppService],
})
export class AppModule {}
