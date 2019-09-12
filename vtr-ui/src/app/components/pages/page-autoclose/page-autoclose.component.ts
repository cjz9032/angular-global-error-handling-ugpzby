import { position } from './../page-privacy/common/components/tooltip/tooltip.component';
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
	public autoCloseAppList: any;
	// Toggle status
	toggleStatus: boolean;
	needToAsk: any;
	getNeedStatus: boolean;
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
		this.refreshAutoCloseList();
		this.toggleStatus = this.gamingAutoCloseService.getAutoCloseStatusCache();
		this.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
	}

	openTargetModal() {
		try {
			this.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
			this.gamingAutoCloseService.setNeedToAskStatusCache(this.needToAsk);
			this.hiddenScroll(true);
			if (this.toggleStatus) {
				this.showAppsModal = true;
			} else if (!this.toggleStatus && (this.needToAsk || isUndefined(this.needToAsk))) {
				this.showTurnOnModal = true;
			} else if (!this.toggleStatus && !this.needToAsk) {
				this.showAppsModal = true;
			}
		} catch (error) {
			return undefined;
		}
	}

	doNotShowAction(event: any) {
		const status = event.target.checked;
		try {
			this.getNeedStatus = !status;
			this.gamingAutoCloseService.setNeedToAskStatusCache(this.getNeedStatus);
		} catch (error) {
		}
	}

	initTurnOnAction() {
		this.needToAsk = this.getNeedStatus;
		this.gamingAutoCloseService.setNeedToAskStatusCache(this.needToAsk);
		this.setAutoCloseStatus(true);
		this.showAppsModal = true;
		this.hiddenScroll(true);
	}

	initNotNowAction(notNowStatus: boolean) {
		this.needToAsk = this.getNeedStatus;
		this.gamingAutoCloseService.setNeedToAskStatusCache(this.needToAsk);
		this.showAppsModal = true;
		this.hiddenScroll(true);
	}

	modalCloseTurnOn(action: boolean) {
		this.showTurnOnModal = action;
		this.hiddenScroll(false);
		this.showAppsModal = true;
	}

	modalCloseAddApps(action: boolean) {
		this.showAppsModal = action;
		this.hiddenScroll(false);
	}

	hiddenScroll(action: boolean) {
		if (action) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	toggleAutoClose(event: any) {
		this.setAutoCloseStatus(event.switchValue);
	}

	setAutoCloseStatus(status: boolean) {
		this.gamingAutoCloseService.setAutoCloseStatus(status).then((response: boolean) => {
			if (response) {
				this.gamingAutoCloseService.setAutoCloseStatusCache(status);
				this.toggleStatus = status;
			}
		});
	}

	public refreshAutoCloseList() {
		this.autoCloseAppList = this.gamingAutoCloseService.getAutoCloseListCache();
		try {
			this.gamingAutoCloseService.getAppsAutoCloseList().then((appList: any) => {
				if (!isUndefined(appList.processList)) {
					this.autoCloseAppList = appList.processList;
					this.gamingAutoCloseService.setAutoCloseListCache(appList.processList);
					console.log('get Auto close List', appList.processList);
					console.log('Total Auto close List Apps', appList.processList.length);
				}
			});
		} catch (error) {
			return undefined;
		}
	}

	public addAppDataToList(event: any) {
		if (event.target.checked) {
			const addApp = event.target.value;
			try {
				this.gamingAutoCloseService.addAppsAutoCloseList(addApp).then((success: any) => {
					if (success) {
						this.refreshAutoCloseList();
					}
				});
			} catch (error) {
			}
		} else {
			this.gamingAutoCloseService.delAppsAutoCloseList(event.target.value).then((response: boolean) => {
				if (response) {
					this.refreshAutoCloseList();
					this.gamingAutoCloseService.setAutoCloseListCache(this.autoCloseAppList);
				}
			});
		}
	}

	async deleteAppFromList(appData: any) {
		try {
			// this.autoCloseAppList.splice(appData.index, 1);
			await this.gamingAutoCloseService.delAppsAutoCloseList(appData.name).then((response: boolean) => {
				if (response) {
					this.refreshAutoCloseList();
					this.gamingAutoCloseService.setAutoCloseListCache(this.autoCloseAppList);
				}
			});
		} catch (err) {
		}
	}
}
