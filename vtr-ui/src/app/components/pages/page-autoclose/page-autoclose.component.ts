import { GamingAutoCloseService } from './../../../services/gaming/gaming-autoclose/gaming-autoclose.service';
import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DomSanitizer } from '@angular/platform-browser';
import { isUndefined } from 'util';

@Component({
  selector: 'vtr-page-autoclose',
  templateUrl: './page-autoclose.component.html',
  styleUrls: ['./page-autoclose.component.scss']
})
export class PageAutocloseComponent implements OnInit {
  public showTurnOnModal: boolean = false;
  public showAppsModal: boolean = false;
  toggleStatus: boolean;
  cardContentPositionA: any = {
    FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
  };
  cardContentPositionB: any = {
    FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
  };
  backId = 'vtr-gaming-macrokey-btn-back';
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
  }

  openTargetModal(modalOpenType: any) {
    if ((modalOpenType.toggleStatus && modalOpenType.needToAsk)) {
      this.showAppsModal = true;
    } else {
      this.showTurnOnModal = true;
    }
  }

  doNotShowAction(event: any) {
    try {
      this.gamingAutoCloseService.setNeedToAsk(event).then((response: any) => {
        console.log('Set successfully ------------------------>', response);
        this.gamingAutoCloseService.setNeedToAskStatusCache(event.target.checked);
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  initTurnOnAction(turnBtnAction: boolean) {
    this.toggleStatus = turnBtnAction;
    this.gamingAutoCloseService.setAutoCloseStatus(true).then((status: any) => {
      this.gamingAutoCloseService.setAutoCloseStatusCache(status);
    });
    this.showAppsModal = true;
  }

  modalCloseTurnOn(action: boolean) {
    this.showTurnOnModal = action;
  }

  modalCloseAddApps(action: boolean) {
    this.showAppsModal = action;
  }
}
