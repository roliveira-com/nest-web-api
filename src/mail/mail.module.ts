import { Module } from "@nestjs/common";
import { EmailConnectService } from "./services/email-connect.service";
import { MailController } from "./controllers/mail.controller";
import { ScrapperService } from './services/scrapper.service';

@Module({
  providers: [EmailConnectService, ScrapperService],
  controllers: [MailController]
})
export class MailModule {}
