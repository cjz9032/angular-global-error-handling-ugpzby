import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';

//for cpt
import { Subject, Observable, empty } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { isNull, isUndefined } from 'util';

@Component({
  selector: 'vtr-cptpage-device-gaming',
  templateUrl: './cptpage-device-gaming.component.html',
  styleUrls: ['./cptpage-device-gaming.component.scss']
})
export class CptpageDeviceGamingComponent implements OnInit, OnDestroy {
  title = 'Gaming Dashboard';
  cardContentPositionD: any = {};

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
      Page: 'gaming-dashboard'
    };

    return new Observable((observer) => {
      this.cmsService.fetchCMSContent(queryOptions).subscribe(
        (response: any) => {

          observer.next(response);//cpt
          observer.complete();

          const cardContentPositionD = this.cmsService.getOneCMSContent(response, 'full-width-title-image-background', 'position-D')[0];
          if (cardContentPositionD) {
            this.cardContentPositionD = cardContentPositionD;
            /*if (this.cardContentPositionD.BrandName) {
              this.cardContentPositionD.BrandName = this.cardContentPositionD.BrandName.split('|')[0];
            }*/
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
