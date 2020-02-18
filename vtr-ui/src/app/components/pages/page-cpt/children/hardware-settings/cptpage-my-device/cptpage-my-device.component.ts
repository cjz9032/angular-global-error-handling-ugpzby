import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
//import { DeviceService } from 'src/app/services/device/device.service';

//for cpt
import { Subject, Observable, empty } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { isNull, isUndefined } from 'util';

@Component({
  selector: 'vtr-cptpage-my-device',
  templateUrl: './cptpage-my-device.component.html',
  styleUrls: ['./cptpage-my-device.component.scss']
})
export class CptpageMyDeviceComponent implements OnInit, OnDestroy {
  title = 'My device';
  cardContentPositionA: any = {};

  constructor(
    private commonService: CommonService,
    private cmsService: CMSService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
  }

  /* copied from page-my-device */
  /*fetchCMSArticles() {
    const queryOptions = {
      Page: 'device'
    };

    this.cmsService.fetchCMSContent(queryOptions).subscribe(
      (response: any) => {
        const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
        if (cardContentPositionA) {
          this.cardContentPositionA = cardContentPositionA;
          if (this.cardContentPositionA.BrandName) {
            this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
          }
          if (cardContentPositionA.ActionLink && cardContentPositionA.ActionLink.indexOf('[SerialNumber]') > -1) {
            this.deviceService.getMachineInfo().then((data) => {
              this.cardContentPositionA.ActionLink = cardContentPositionA.ActionLink.replace(/\[SerialNumber\]/g, data.serialnumber);
            });
          }
        }
      },
      error => {
        console.log('fetchCMSContent error', error);
      }
    );
    //console.log('I am at mydevice', this.cmsJsonResponse);
  }
  */


  /**
   * For cpt, 
   * To send response to parent component, 
   * Observable added before  
   * this.cmsService.fetchCMSContent
   */
  getCmsJsonResponse() {
    const queryOptions = {
      Page: 'device'
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
            if (cardContentPositionA.ActionLink && cardContentPositionA.ActionLink.indexOf('[SerialNumber]') > -1) {
              /*this.deviceService.getMachineInfo().then((data) => {
                this.cardContentPositionA.ActionLink = cardContentPositionA.ActionLink.replace(/\[SerialNumber\]/g, data.serialnumber);
              });*/
              this.cardContentPositionA.ActionLink = cardContentPositionA.ActionLink.replace(/\[SerialNumber\]/g, 'xxxxxxxxxx');
            }
          }
        },
        error => {}
      );

    });
  }

  ngOnDestroy() {
  }

}
