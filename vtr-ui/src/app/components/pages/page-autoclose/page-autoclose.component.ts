import { GamingAutoCloseService } from './../../../services/gaming/gaming-autoclose/gaming-autoclose.service';
import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DomSanitizer } from '@angular/platform-browser';
import { isUndefined } from 'util';
import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { AutoCloseNeedToAsk } from 'src/app/data-models/gaming/autoclose/autoclose-need-to-ask.model';

@Component({
  selector: 'vtr-page-autoclose',
  templateUrl: './page-autoclose.component.html',
  styleUrls: ['./page-autoclose.component.scss']
})
export class PageAutocloseComponent implements OnInit {
  public showTurnOnModal: boolean = false;
  public showAppsModal: boolean = false;
  toggleStatus: boolean;
  needToAsk: any;
  autoCloseStatusObj: AutoCloseStatus = new AutoCloseStatus();
  needToAskStatusObj: AutoCloseNeedToAsk = new AutoCloseNeedToAsk();

  // CMS Content block
  cardContentPositionA: any = {
    FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
  };
  cardContentPositionB: any = {
    FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
  };
  backId = 'vtr-gaming-autoclose-btn-back';

  constructor(private cmsService: CMSService, private gamingAutoCloseService: GamingAutoCloseService) { }

  ngOnInit() {
    const queryOptions = {
      Page: 'dashboard',
      Lang: 'EN',
      GEO: 'US',
      OEM: 'Lenovo',
      OS: 'Windows',
      Segment: 'SMB',
      Brand: 'Lenovo'
    };

    this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
      const cardContentPositionA = this.cmsService.getOneCMSContent(
        response,
        'half-width-top-image-title-link',
        'position-F'
      )[0];
      if (cardContentPositionA) {
        this.cardContentPositionA = cardContentPositionA;
      }

      const cardContentPositionB = this.cmsService.getOneCMSContent(
        response,
        'half-width-title-description-link-image',
        'position-B'
      )[0];
      if (cardContentPositionB) {
        this.cardContentPositionB = cardContentPositionB;
        if (this.cardContentPositionB.BrandName) {
          this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
        }
      }
    });

    // AutoClose Init
    this.toggleStatus = this.gamingAutoCloseService.getAutoCloseStatusCache();
  }

  openTargetModal() {
    try {
      this.gamingAutoCloseService.getNeedToAsk().then((response: any) => {
        this.gamingAutoCloseService.getNeedToAskStatusCache();
        console.log("fist need status", response);
        this.needToAsk = response;
        if (this.toggleStatus) {
          this.showAppsModal = true;
        } else if (!this.toggleStatus && this.needToAsk) {
          this.showTurnOnModal = true;
        } else if (!this.toggleStatus && !this.needToAsk) {
          this.showAppsModal = true;
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  doNotShowAction(status: boolean) {
    this.needToAsk = status;
    console.log("status================Need", this.needToAsk);

  }

  initTurnOnAction(turnBtnAction: boolean) {
    this.toggleStatus = turnBtnAction;
    this.gamingAutoCloseService.setAutoCloseStatus(true).then((status: any) => {
      this.gamingAutoCloseService.setAutoCloseStatusCache(status);
    });
    this.showAppsModal = true;
  }

  initNotNowAction(notNowStatus: boolean) {
    this.showAppsModal = true;
  }

  modalCloseTurnOn(action: boolean) {
    this.showTurnOnModal = action;
  }

  modalCloseAddApps(action: boolean) {
    this.showAppsModal = action;
  }

  toggleAutoClose(event: any) {
    console.log(event.switchValue);
    this.toggleStatus = event.switchValue;
    this.gamingAutoCloseService.setAutoCloseStatus(event.switchValue).then((response: any) => {
      this.gamingAutoCloseService.setAutoCloseStatusCache(event.switchValue);
      this.toggleStatus = event.switchValue;
    });
  }
}
