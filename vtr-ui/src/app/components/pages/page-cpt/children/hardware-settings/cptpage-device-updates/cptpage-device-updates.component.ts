import { Component, OnInit, Input, OnDestroy, SecurityContext } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';

//for cpt
import { Subject, Observable, empty } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { isNull, isUndefined } from 'util';

@Component({
  selector: 'vtr-cptpage-device-updates',
  templateUrl: './cptpage-device-updates.component.html',
  styleUrls: ['./cptpage-device-updates.component.scss']
})
export class CptpageDeviceUpdatesComponent implements OnInit, OnDestroy {

  title = 'systemUpdates.title';
  cardContentPositionA: any = {};

  constructor(private commonService: CommonService,
    private cmsService: CMSService,
    private translate: TranslateService) { }

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
      Page: 'system-updates'
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

  ngOnDestroy() {
  }

}
