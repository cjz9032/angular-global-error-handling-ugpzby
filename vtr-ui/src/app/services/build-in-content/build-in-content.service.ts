import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuildInContentService {

  constructor(private httpClient: HttpClient) { }

  public getContents(queryParams: any): Promise<any> {

    return new Promise((resolve, reject) => {
      this.httpClient.get(`assets/build-in-contents/${queryParams.Lang}/${queryParams.Page}.json`).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          reject('load build-in contents error' + error);
        }
      );

    });
  }

  public getArticle(articId: any, lang: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const key = `${articId}_${lang}`;
      this.httpClient.get(`assets/build-in-contents/${lang}/${articId}.json`).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          reject('load the article of the build-in content error' + error);
        }
      );

    });
  }
}
