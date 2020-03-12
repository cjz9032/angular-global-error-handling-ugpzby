import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';

//for cpt
import { Subject, Observable, empty } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { isNull, isUndefined } from 'util';

@Component({
  selector: 'vtr-cptpage-security',
  templateUrl: './cptpage-security.component.html',
  styleUrls: ['./cptpage-security.component.scss']
})
export class CptpageSecurityComponent implements OnInit, OnDestroy {

  title = 'My Security';
  cardContentPositionA: any = {};

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
      Page: 'security'
    };

    return new Observable((observer) => {
      this.cmsService.fetchCMSContent(queryOptions).subscribe(
        (response: any) => {

          observer.next(response);//cpt
          observer.complete();

          const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
          if (cardContentPositionA) {
            this.cardContentPositionA = cardContentPositionA;
            if (this.cardContentPositionA.BrandName) {
              this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
            }
          }
        },
        error => {
          observer.error(error);
        }
      );

    });
  }

  ngOnDestroy() { }
}