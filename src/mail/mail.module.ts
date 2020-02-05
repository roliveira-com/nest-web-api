import { Module } from "@nestjs/common";
import { EmailConnectService } from "./services/email-connect.service";
import { MailController } from "./controllers/mail.controller";

@Module({
  providers: [EmailConnectService],
  controllers: [MailController]
})
export class MailModule {}
