import { browser, by, element } from 'protractor';

export class AppPage {

  public navigateTo(): Promise {
    return browser.get('/');
  }

  public getParagraphText(): string {
    return element(by.css('app-root h1')).getText();
  }
}
