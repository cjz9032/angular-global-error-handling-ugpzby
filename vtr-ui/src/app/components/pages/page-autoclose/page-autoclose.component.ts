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
	public loadingContent: any;
	// Running list
	runningList: any = [];
	// Toggle status
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
		this.refreshAutoCloseList();
		this.refreshRunningList();
		this.toggleStatus = this.gamingAutoCloseService.getAutoCloseStatusCache();
		this.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
	}

	openTargetModal() {
		this.loadingContent.loading = true;
		this.refreshAutoCloseList();
		this.refreshRunningList();
		try {
			this.gamingAutoCloseService.getNeedToAsk().then((needToAskStatus: boolean) => {
				this.gamingAutoCloseService.setNeedToAskStatusCache(needToAskStatus);
				console.log('first need status', needToAskStatus);
				this.needToAsk = needToAskStatus;
				this.hiddenScroll(true);
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

	doNotShowAction(event: any) {
		const status = event.target.checked;
		try {
			this.gamingAutoCloseService.setNeedToAsk(!status).then((response: any) => {
				console.log('Set successfully ------------------------>', !status);
				this.gamingAutoCloseService.setNeedToAskStatusCache(!status);
				this.needToAsk = !status;
			});
		} catch (error) {
			console.error(error.message);
		}
	}

	initTurnOnAction() {
		this.setAutoCloseStatus(true);
		this.showAppsModal = true;
		this.hiddenScroll(true);
	}

	initNotNowAction(notNowStatus: boolean) {
		this.showAppsModal = true;
		this.hiddenScroll(true);
	}

	modalCloseTurnOn(action: boolean) {
		this.showTurnOnModal = action;
		this.hiddenScroll(false);
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
				}
			});
		} catch (error) {
			console.error(error.message);
		}
	}

	public refreshRunningList() {
		try {
			this.gamingAutoCloseService.getAppsAutoCloseRunningList().then((list: any) => {
				if (!isUndefined(list.processList)) {
					this.runningList = list.processList;
					const noAppsRunning = this.runningList.length === 0 ? true : false;
					this.loadingContent = { loading: false, noApps: noAppsRunning };
				}
			});
		} catch (error) {
			const noAppsRunning = this.runningList.length === 0 ? true : false;
			this.loadingContent = { loading: false, noApps: noAppsRunning };
			console.error(error.message);
		}
	}

	public addAppDataToList(event: any) {
		console.log(event.target.checked);
		console.log(event.target.value);
		if (event.target.checked) {
			const addApp = event.target.value;
			try {
				this.gamingAutoCloseService.addAppsAutoCloseList(addApp).then((success: any) => {
					console.log('Added successfully ------------------------>', success);
					if (success) {
						this.refreshAutoCloseList();
						// this.refreshRunningList();
					}
				});
			} catch (error) {
				console.error(error.message);
			}
		}
	}

	deleteAppFromList(appData: any) {
		console.log(appData);
		this.gamingAutoCloseService.delAppsAutoCloseList(appData.name).then((response: boolean) => {
			console.log('Deleted successfully ------------------------>', response);
			if (response) {
				this.autoCloseAppList.splice(appData.index, 1);
				this.gamingAutoCloseService.setAutoCloseListCache(this.autoCloseAppList);
			}
		});
	}
}
