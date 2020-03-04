import { Injectable } from '@nestjs/common';
import cheerio from 'cheerio'

@Injectable()
export class CrawlerMediumService {

  public getProspectsList(messageList: any[]){
    let prospects = []
    messageList.forEach(message => {
      
      prospects = [
        ...prospects,
        { 
          mailId: Buffer.from(`${Date.now()}`).toString('base64'),
          mailContent: this.getArticleList(message.email)
        }
      ]
    })

    return prospects;
  }

  private getArticleTitle(element: CheerioElement) {
    const $ = cheerio.load(element);

    let titleElement = $('table td').next().find($('div.email-digestPostTitle a'));
    if (!titleElement.text()) {
      titleElement = $('table tr').next().find($('div.email-digestPostTitle--hero'));
    };
    return titleElement.text().replace(/\s+/g, ' ');
  }

  private getArticleSubtitle(element: CheerioElement) {
    const $ = cheerio.load(element)
    let subtitleElement = $('table td').next().find($('div.email-digestPostSubtitle'));
    if (!subtitleElement.text()) {
      subtitleElement = $('table tr').next().find($('div.email-digestPostSubtitle'));
    };
    return subtitleElement.text().replace(/\s+/g, ' ');
  }

  private getElementsList(html: string): Array<CheerioElement> {
    const $ = cheerio.load(html);

    const regularTopics = $('table.email-marginTop24').toArray();
    const featuredTopics = $('table.email-marginTop16').toArray();

    return [
      ...regularTopics,
      ...featuredTopics
    ]
  }

  private getArticleList(message){
    let articleList = []
    const list = this.getElementsList(message);

    list.forEach(topic => {
      const $ = cheerio.load(topic)

      const featured = $('table td').next().find($('div.email-digestPostTitle a')).text() ? false : true;

      const articleThumb = $('td a div').attr('style').match(/(https?:\/\/[^ )]*)/)[0];;

      const articleLink = $('td a').attr('href').match(/(https?:\/\/[^ ?]*)/g)[0];

      const articleTitle = this.getArticleTitle(topic);

      const articleSubtitle = this.getArticleSubtitle(topic);

      const article = { featured, articleTitle, articleSubtitle, articleLink, articleThumb };

      articleList = [...articleList, article]
    })
    return articleList
  }
}


