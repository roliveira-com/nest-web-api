import { Controller, Get } from "@nestjs/common";
import { EmailConnectService } from "../services/email-connect.service";

@Controller("mail")
export class MailController {
  constructor(private mail: EmailConnectService) {}

  @Get("parser")
  parseMail() {
    this.mail.connect();
    return { status: "OK" };
  }
}
