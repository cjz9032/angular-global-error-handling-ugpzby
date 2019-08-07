import { CommonService } from './../../../services/common/common.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { Component, OnInit } from '@angular/core';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
  selector: 'vtr-page-networkboost',
  templateUrl: './page-networkboost.component.html',
  styleUrls: ['./page-networkboost.component.scss']
})
export class PageNetworkboostComponent implements OnInit {
  public showTurnOnModal = false;
  public showAppsModal = false;
  changeListNum = 0;
  appsCount = 0;
  toggleStatus: boolean = this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoostStatus) || false;
  needToAsk: any;
  autoCloseStatusObj: any = {};
  needToAskStatusObj: any = {};

  // CMS Content block
  cardContentPositionA: any = {
    FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
  };
  cardContentPositionB: any = {
    FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
  };
  backId = 'vtr-gaming-macrokey-btn-back';

  constructor(private cmsService: CMSService, private networkBoostService: NetworkBoostService,
    private commonService: CommonService) { }

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
    // this.toggleStatus = this.commonService.getLocalStorageValue();
    this.getNetworkBoostStatus();
  }

  async	openTargetModal() {
    try {
      this.needToAsk = await this.networkBoostService.getNeedToAsk();
      this.needToAsk = this.needToAsk == undefined ? false : this.needToAsk;
      console.log('NEED TO ASK FROM JS BRIDGE =>', this.needToAsk);
      if (this.toggleStatus) {
        this.showAppsModal = true;
      } else if (!this.toggleStatus && !this.needToAsk) {
        this.showTurnOnModal = true;
      } else {
        this.setNetworkBoostStatus({ switchValue: true });
        this.showAppsModal = true;
      }
    } catch (error) {
      console.log(`ERROR in openTargetModal() `, error);
    }
  }

  doNotShowAction(status: boolean) {
    this.needToAsk = status;
  }

  initTurnOnAction(event: any) {
    this.setAksAgain(event.askAgainStatus);
    this.setNetworkBoostStatus({ switchValue: true });
    this.showAppsModal = true;
  }

  initNotNowAction(notNowStatus: boolean) {
    this.showAppsModal = true;
  }

  modalCloseTurnOn(action: boolean) {
    this.showTurnOnModal = action;
    if (!this.showTurnOnModal) {
      this.changeListNum += 1;
    }
  }

  modalCloseAddApps(action: boolean) {
    this.showAppsModal = action;
    if (!this.showAppsModal) {
      this.changeListNum += 1;
    }
  }

  async setNetworkBoostStatus(event: any) {
    try {
      this.toggleStatus = event.switchValue;
      await this.networkBoostService.setNetworkBoostStatus(event.switchValue);
      // need to set cache
    } catch (err) {
      console.log(`ERROR in setNetworkBoostStatus()`, err);
    }
  }

  async setAksAgain(status: boolean) {
    try {
      await this.networkBoostService.setNeedToAsk(status);
    } catch (error) {
      console.error(`ERROR in setAksAgain()`, error);
    }
  }
  async getNetworkBoostStatus() {
    try {
      this.toggleStatus = await this.networkBoostService.getNetworkBoostStatus();
      this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostStatus, this.toggleStatus);
    } catch (err) {
      console.log(`ERROR in setNetworkBoostStatus()`, err);
    }
  }
}
