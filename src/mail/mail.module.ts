import { Module } from "@nestjs/common";
import { EmailConnectService } from "./services/email-connect.service";
import { MailController } from "./controllers/mail.controller";
import { CrawlerMediumService } from './services/crawler-medium.service';

@Module({
  providers: [EmailConnectService, CrawlerMediumService],
  controllers: [MailController]
})
export class MailModule {}
