import { Component, OnInit, Input, OnDestroy, SecurityContext } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
//import { DeviceService } from 'src/app/services/device/device.service';

//for cpt
import { Subject, Observable, empty } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { isNull, isUndefined } from 'util';

//from dashboard
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'vtr-cptpage-dashboard',
  templateUrl: './cptpage-dashboard.component.html',
  styleUrls: ['./cptpage-dashboard.component.scss']
})
export class CptpageDashboardComponent implements OnInit, OnDestroy {
  title = 'Dashboard';
  offlineConnection = 'offline-connection';
	public isOnline = true;

  heroBannerItems = []; // tile A
	cardContentPositionB: any = {};
	cardContentPositionC: any = {};
	cardContentPositionD: any = {};
	cardContentPositionE: any = {};
	cardContentPositionF: any = {};

	heroBannerDemoItems = [];
	canShowDccDemo$: Promise<boolean>;

	heroBannerItemsCms: []; // tile A
	cardContentPositionBCms: any = {};
	cardContentPositionCCms: any = {};
	cardContentPositionDCms: any = {};
	cardContentPositionECms: any = {};
	cardContentPositionFCms: any = {};

	upeRequestResult = {
		tileA: true,
		tileB: true,
		tileC: true,
		tileD: true,
		tileE: true,
		tileF: true
	};

	cmsRequestResult = {
		tileA: false,
		tileB: false,
		tileC: false,
		tileD: false,
		tileE: false,
		tileF: false
	};

	tileSource = {
		tileA: 'CMS',
		tileB: 'CMS',
		tileC: 'CMS',
		tileD: 'CMS',
		tileE: 'CMS',
		tileF: 'CMS'
	};

  constructor(
    private commonService: CommonService,
    private cmsService: CMSService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer
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
      Page: 'dashboard'
    };

    return new Observable((observer) => {
      this.cmsService.fetchCMSContent(queryOptions).subscribe(
        (response: any) => {

          observer.next(response);//cpt

          this.getCMSHeroBannerItems(response);
					this.getCMSCardContentB(response);
					this.getCMSCardContentC(response);
					this.getCMSCardContentD(response);
					this.getCMSCardContentE(response);
					this.getCMSCardContentF(response);
        },
        error => {
          console.log('fetchCMSContent error', error);
        }
      );

    });
  }

  getCMSHeroBannerItems(response) {
		const heroBannerItems = this.cmsService
			.getOneCMSContent(response, 'home-page-hero-banner', 'position-A')
			.map((record, index) => {
				return {
					albumId: 1,
					id: record.Id,
					source: this.sanitizer.sanitize(SecurityContext.HTML, record.Title),
					title: this.sanitizer.sanitize(SecurityContext.HTML, record.Description),
					url: record.FeatureImage,
					ActionLink: record.ActionLink,
					ActionType: record.ActionType,
					DataSource: 'cms'
				};
      });
      

		if (heroBannerItems && heroBannerItems.length && this.cmsHeroBannerChanged(heroBannerItems, this.heroBannerItemsCms)) {
			this.heroBannerItemsCms = heroBannerItems;
			this.cmsRequestResult.tileA = true;
			if (!this.upeRequestResult.tileA || this.tileSource.tileA === 'CMS') {
				this.heroBannerItems = this.heroBannerItemsCms;
				//this.dashboardService.heroBannerItemsOnline = this.heroBannerItemsCms;
			}
    }
	}

  
	cmsHeroBannerChanged(bannerItems1, bannerItems2) {
		let result =  false;
		if ((bannerItems1 && !bannerItems2)
		|| (!bannerItems1 && bannerItems2)) {
			result = true;
		} else if (bannerItems1 && bannerItems2) {
			if (bannerItems1.length !== bannerItems2.length) {
				result = true;
			} else {
				for (let i = 0; i < bannerItems1.length; i++) {
					if ((bannerItems1[i] && !bannerItems2[i])
						|| (!bannerItems1[i] && bannerItems2[i])) {
						result = true;
						break;
					} else if (bannerItems1[i] && bannerItems2[i]
						&& JSON.stringify(bannerItems2[i]) !== JSON.stringify(bannerItems1[i])) {
						result = true;
						break;
					}
				}
			}
		}
		return result;
  }
    
	getCMSCardContentB(response) {
		const cardContentPositionB = this.cmsService.getOneCMSContent(
			response,
			'half-width-title-description-link-image',
			'position-B'
		)[0];
		if (cardContentPositionB) {
			this.cardContentPositionBCms = cardContentPositionB;
			if (this.cardContentPositionBCms.BrandName) {
				this.cardContentPositionBCms.BrandName = this.cardContentPositionBCms.BrandName.split('|')[0];
			}
			this.cardContentPositionBCms.DataSource = 'cms';
			this.cmsRequestResult.tileB = true;
			if (!this.upeRequestResult.tileB || this.tileSource.tileB === 'CMS') {
				this.cardContentPositionB = this.cardContentPositionBCms;
				//this.dashboardService.cardContentPositionBOnline = this.cardContentPositionBCms;
			}
		}
  }
    
	getCMSCardContentC(response) {
		const cardContentPositionC = this.cmsService.getOneCMSContent(
			response,
			'half-width-title-description-link-image',
			'position-C'
		)[0];
		if (cardContentPositionC) {
			this.cardContentPositionCCms = cardContentPositionC;
			if (this.cardContentPositionC.BrandName) {
				this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split('|')[0];
			}
			this.cardContentPositionCCms.DataSource = 'cms';
			this.cmsRequestResult.tileC = true;
			if (!this.upeRequestResult.tileC || this.tileSource.tileC === 'CMS') {
				this.cardContentPositionC = this.cardContentPositionCCms;
				//this.dashboardService.cardContentPositionCOnline = this.cardContentPositionCCms;
			}
		}
	}

	getCMSCardContentD(response) {
		const cardContentPositionD = this.cmsService.getOneCMSContent(
			response,
			'full-width-title-image-background',
			'position-D'
		)[0];
		if (cardContentPositionD) {
			this.cardContentPositionDCms = cardContentPositionD;
			this.cardContentPositionDCms.DataSource = 'cms';
			this.cmsRequestResult.tileD = true;
			if (!this.upeRequestResult.tileD || this.tileSource.tileD === 'CMS') {
				this.cardContentPositionD = this.cardContentPositionDCms;
				//this.dashboardService.cardContentPositionDOnline = this.cardContentPositionDCms;
			}
		}
  }
  
	getCMSCardContentE(response) {
		const cardContentPositionE = this.cmsService.getOneCMSContent(
			response,
			'half-width-top-image-title-link',
			'position-E'
		)[0];
		if (cardContentPositionE) {
			this.cardContentPositionECms = cardContentPositionE;
			this.cardContentPositionECms.DataSource = 'cms';
			this.cmsRequestResult.tileE = true;
			if (!this.upeRequestResult.tileE || this.tileSource.tileE === 'CMS') {
				this.cardContentPositionE = this.cardContentPositionECms;
				//this.dashboardService.cardContentPositionEOnline = this.cardContentPositionECms;
			}
		}
	}

	getCMSCardContentF(response) {
		const cardContentPositionF = this.cmsService.getOneCMSContent(
			response,
			'half-width-top-image-title-link',
			'position-F'
		)[0];
		if (cardContentPositionF) {
			this.cardContentPositionFCms = cardContentPositionF;
			this.cardContentPositionFCms.DataSource = 'cms';
			this.cmsRequestResult.tileF = true;
			if (!this.upeRequestResult.tileF || this.tileSource.tileF === 'CMS') {
				this.cardContentPositionF = this.cardContentPositionFCms;
				//this.dashboardService.cardContentPositionFOnline = this.cardContentPositionFCms;
			}
		}
	}

  ngOnDestroy() {
  }

}
