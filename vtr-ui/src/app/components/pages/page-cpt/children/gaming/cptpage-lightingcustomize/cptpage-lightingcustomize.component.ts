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
  selector: 'vtr-cptpage-lightingcustomize',
  templateUrl: './cptpage-lightingcustomize.component.html',
  styleUrls: ['./cptpage-lightingcustomize.component.scss']
})
export class CptpageLightingcustomizeComponent implements OnInit, OnDestroy {
  title = 'Lighting';
  cardContentPositionC: any = {};
  cardContentPositionF: any = {};
  dynamic_metricsItem: any = 'lighting_profile_cms_inner_content';

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
      Page: 'lighting'
    };

    return new Observable((observer) => {
      this.cmsService.fetchCMSContent(queryOptions).subscribe(
        (response: any) => {

          observer.next(response);//cpt
          observer.complete();

          const cardContentPositionF = this.cmsService.getOneCMSContent(response, 'half-width-top-image-title-link', 'position-F')[0];
          if (cardContentPositionF) {
            this.cardContentPositionF = cardContentPositionF;
          }

          const cardContentPositionC = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-C')[0];
          if (cardContentPositionC) {
            this.cardContentPositionC = cardContentPositionC;
            if (this.cardContentPositionC.BrandName) {
              this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split('|')[0];
            }
          }

        },
        error => {
          //this.loggerService.error('cptpage-lightingcustomize.component.getCmsJsonResponse', 'fetchCMSContent error()-->' + error);
          observer.error(error);
        }
      );

    });
  }

  ngOnDestroy() { }

}
