import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuildInContentService {
  private buildInContents = {};
  private buildInArticls = {};

  constructor(private httpClient: HttpClient) { }

  public getContents(queryParams: any): Promise<any> {

    return new Promise((resolve, reject) => {
      const defaults = {
        Page: "dashboard",
        Lang: "en"
      };
      const queryOptions = Object.assign(defaults, queryParams);
      const key = `${queryOptions.Page}_${queryOptions.Lang}`;
      if (this.buildInContents[key]) {
        resolve(this.buildInContents[key]);
      }
      else {

        this.httpClient.get(`assets/build-in-contents/${queryOptions.Lang}/${queryOptions.Page}.json`).subscribe(
          (res: any) => {
            this.buildInContents[key] = res;
            resolve(res);
          },
          (error: any) => {
            reject('load build-in contents error' + error);
          }
        );
      }

    });
  }

  public getArticle(articId: any, lang: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const key = `${articId}_${lang}`;
      if (this.buildInArticls[key]) {
        resolve(this.buildInArticls[key]);
      }
      else {

        this.httpClient.get(`assets/build-in-contents/${lang}/${articId}.json`).subscribe(
          (res: any) => {
            this.buildInArticls[key] = res;
            resolve(res);
          },
          (error: any) => {
            reject('load the article of the build-in content error' + error);
          }
        );
      }

    });
  }
}
