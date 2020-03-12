import { Injectable } from '@nestjs/common';
import cheerio from 'cheerio';

@Injectable()
export class CrawlerMediumService {

  public getProspectsList(messageList: any[]){
    let prospects = []
    messageList.forEach(message => {
      
      prospects = [
        ...prospects,
        { 
          date: message.date,
          subject: message.subject,
          content: this.getArticleList(message.email)
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

  private getPublicator(element){
    const $ = cheerio.load(element);

    let publicatorElement = $('table tr div.email-marginTop8 a').next();
    if (!publicatorElement.text()){
      publicatorElement = $('table div.email-marginTop12 a').next();
    }

    let pageLink = publicatorElement.attr('href') || null;
    if(pageLink){
      pageLink = pageLink.match(/(https?:\/\/[^ ?]*)/g)[0]
    }

    let publicatorId = pageLink || null;
    if (publicatorId){
      publicatorId = publicatorId.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '')
    }

    return {
      publicatorId,
      name: publicatorElement.text() || null,
      pageLink: pageLink
    }
  }

  private getAuthor(element: CheerioElement) {
    const $ = cheerio.load(element);

    let authorElement = $('table tr div.email-marginTop8 a');
    if (!authorElement.text()) {
      authorElement = $('table div.email-marginTop12 a');
    }

    let pageLink = authorElement.attr('href') || null;
    if (pageLink) {
      pageLink = pageLink.match(/(https?:\/\/[^ ?]*)/g)[0]
    }

    let authorId = pageLink || null;
    if (authorId) {
      authorId = authorId.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '')
    }

    return {
      authorId,
      name: authorElement.first().text(),
      pageLink: pageLink
    }
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

      const thumb = $('td a div').attr('style').match(/(https?:\/\/[^ )]*)/)[0];;

      const link = $('td a').attr('href').match(/(https?:\/\/[^ ?]*)/g)[0];

      const title = this.getArticleTitle(topic);

      const publicator = this.getPublicator(topic);

      const author = this.getAuthor(topic);

      const subtitle = this.getArticleSubtitle(topic);

      const article = { featured, title, subtitle, link, thumb, publicator, author };

      articleList = [...articleList, article]
    })
    return articleList
  }
}


