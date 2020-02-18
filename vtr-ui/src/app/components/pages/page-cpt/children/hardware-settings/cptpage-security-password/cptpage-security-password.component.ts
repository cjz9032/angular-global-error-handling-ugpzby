import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';

//for cpt
import { Subject, Observable, empty } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { isNull, isUndefined } from 'util';

@Component({
  selector: 'vtr-cptpage-security-password',
  templateUrl: './cptpage-security-password.component.html',
  styleUrls: ['./cptpage-security-password.component.scss']
})
export class CptpageSecurityPasswordComponent implements OnInit,OnDestroy {
  title = 'Password Health';
  cardContentPositionA: any = {};
  dashlaneArticleId = '0EEB43BE718446C6B49F2C83FC190758';
	dashlaneArticleCategory: string;

  constructor(
    private commonService: CommonService,
    private cmsService: CMSService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  /**
     * For cpt, 
     * To send response to parent component, 
     * Observable added before  
     * this.cmsService.fetchCMSContent
     */
  getCmsJsonResponse() {
    const queryOptions = {
      Page: 'password-protection'
    };

    return new Observable((observer) => {
      this.cmsService.fetchCMSContent(queryOptions).subscribe(
        (response: any) => {

          observer.next(response);//cpt

          const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
          if (cardContentPositionA) {
            this.cardContentPositionA = cardContentPositionA;
            if (this.cardContentPositionA.BrandName) {
              this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
            }
          }

          this.cmsService.fetchCMSArticle(this.dashlaneArticleId, { Lang: 'EN' }).then((response: any) => {
            if (response && response.Results && response.Results.Category) {
              this.dashlaneArticleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
            }
          });

        },
        error => {}
      );

    });
  }

  ngOnDestroy() { }

}
