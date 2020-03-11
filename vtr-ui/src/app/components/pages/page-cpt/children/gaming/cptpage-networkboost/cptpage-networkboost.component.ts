import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

//for cpt
import { Subject, Observable, empty } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { isNull, isUndefined } from 'util';

@Component({
  selector: 'vtr-cptpage-networkboost',
  templateUrl: './cptpage-networkboost.component.html',
  styleUrls: ['./cptpage-networkboost.component.scss']
})
export class CptpageNetworkboostComponent implements OnInit, OnDestroy {
  title = 'Network Boost';
  cardContentPositionC: any = {};
  cardContentPositionF: any = {};
  dynamic_metricsItem: any = 'networkboost_cms_inner_content';
  useProdCMSTemplate = false;//for cpt

  constructor(
    private commonService: CommonService,
    private cmsService: CMSService,
    private translate: TranslateService,
    private loggerService: LoggerService
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
      Page: 'network-boost'
    };

    return new Observable((observer) => {
      this.cmsService.fetchCMSContent(queryOptions).subscribe(
        (response: any) => {

          observer.next(response);//cpt
          observer.complete();

          /*const cardContentPositionF = this.cmsService.getOneCMSContent(response, 'half-width-top-image-title-link', 'position-F')[0];
          if (cardContentPositionF) {
            this.cardContentPositionF = cardContentPositionF;
          }

          const cardContentPositionC = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-C')[0];
          if (cardContentPositionC) {
            this.cardContentPositionC = cardContentPositionC;
            if (this.cardContentPositionC.BrandName) {
              this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split('|')[0];
            }
          }*/

          const cardContentPositionC = this.cmsService.getOneCMSContent(
            response,
            'half-width-title-description-link-image',
            'position-C'
          )[0];
          if (cardContentPositionC) {
            this.cardContentPositionC = cardContentPositionC;
          }

          const cardContentPositionF = this.cmsService.getOneCMSContent(
            response,
            (this.useProdCMSTemplate ? 'half-width-top-image-title-link' :'inner-page-right-side-article-image-background'),
            'position-F'
          )[0];
          if (cardContentPositionF) {
            this.cardContentPositionF = cardContentPositionF;
            if (this.cardContentPositionF.BrandName) {
              this.cardContentPositionF.BrandName = this.cardContentPositionF.BrandName.split('|')[0];
            }
          }

        },
        error => {
          //this.loggerService.error('cptpage-networkboost.component.getCmsJsonResponse', 'fetchCMSContent error' + error);
          observer.error(error);
        }
      );

    });
  }

  ngOnDestroy() { }

}
