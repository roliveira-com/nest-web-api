import { Controller, Get } from "@nestjs/common";
import { EmailConnectService } from "../services/email-connect.service";
import { CrawlerMediumService } from "../services/crawler-medium.service"

@Controller("mail")
export class MailController {
  constructor(
    private mail: EmailConnectService,
    private parser: CrawlerMediumService
  ) {}

  @Get("parser")
  async parseMail(): Promise<any> {
    const messagesList = await this.mail.searchMessagesByAddressAndDate();
    return this.parser.getProspectsList(messagesList.result);
  }
}
