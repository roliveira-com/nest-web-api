import { Injectable } from '@nestjs/common';

@Injectable()
export class ScrapperService {

  public articleList = [];

  public articleTopicsList = document.querySelectorAll('table.email-marginTop24')
  public topics = document.querySelectorAll('table.email-marginTop25')
  public majorTopics = document.querySelectorAll('table.email-marginTop16')


  constructor(){
    this.articleTopicsList = [...this.topics, ...this.articleTopicsList, ...this.majorTopics]
  }

  getArticleTitle(element) {
    let titleElement = element.querySelector('td:nth-child(2) div a:nth-child(2)');
    if (!titleElement) {
      titleElement = element.querySelector('tr td div a:nth-child(2)');
    };
    return titleElement = titleElement.innerHTML.replace(/\s+/g, ' ');
  }

  getArticleSubtitle(element) {
    let subtitleElement = element.querySelector('td:nth-child(2) div:nth-child(3)');
    if (!subtitleElement) {
      subtitleElement = element.querySelector('tr td div:nth-child(3)');
    };
    return subtitleElement = subtitleElement.innerHTML.replace(/\s+/g, ' ');
  }

  getArticleList(list: Array<any>){
    let articleList = []

    list.forEach(topic => {
      let featured = topic.classList.contains('email-marginTop16') ? true : false;

      let articleThumb = topic.querySelector('td a div').getAttribute('style');
      articleThumb = articleThumb.match(/(https?:\/\/[^ )]*)/)[0];

      let articleLink = topic.querySelector('td a').getAttribute('href');
      // articleLink = articleLink.match(/(https?: \/\/[^ ?]*)/);

      let articleTitle = this.getArticleTitle(topic);

      let articleSubtitle = this.getArticleSubtitle(topic);

      let article = { featured, articleTitle, articleSubtitle, articleLink, articleThumb };

      articleList = [...articleList, article]
    })

    return articleList
  }


