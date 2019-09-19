import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { DeviceService } from '../device/device.service';
import { CMSService } from '../cms/cms.service';
import { LoggerService } from '../logger/logger.service';
import { LocalInfoService } from '../local-info/local-info.service';

export class Category {
	id: string; 	// app category id
	title: string; 	// app category title
}

export class Installtype {
	id: string; 	// app install type id
	title: string; 	// app install type i.e., Desktop or Windows Store app or Web App
}

export class Recommendation {
	id: string; 	// app recommendation id
	title: string; 	// app recommendation title
}

export class Screenshot {
	id: string;			// apps-for-you-screenshot-n
	imageUrl: string;	// url of app screenshot-n
	position: number;	// n
	isRepeat: boolean;	// false
	show: string;		// show
}

export class AppDetails {
	id: string;
	title: string;
	image: string;
	description: string;
	category: Category;
	privacyurl: string; 	// app privacy url
	pfn: string;			// app pfn
	url: string; 			// app url
	installtype: Installtype;
	downloadlink: string;	// app download link (see more url)
	videourl: string; 		// app video url
	recommendations: Recommendation[];
	screenshots: Screenshot[];
	by: string; 		// app manufacturer name
	updated: string; 	// app updated date
	type: string;
	filters: [];
	showAdditionalInfo: boolean;
	showStatus: number;
	constructor() {
		this.category = new Category();
		this.installtype = new Installtype();
		this.screenshots = Array(new Screenshot());
		this.recommendations =  Array(new Recommendation());
	}
}

@Injectable({
	providedIn: 'root'
})
export class AppsForYouService {

	constructor(
		private vantageShellService: VantageShellService,
		private cmsService: CMSService,
		private deviceService: DeviceService,
		private commonService: CommonService,
		private logService: LoggerService,
		private localInfoService: LocalInfoService,
	) {
		this.initialize();
		this.systemUpdateBridge = vantageShellService.getSystemUpdate();
	}

	private isInitialized = false;
	private cancelToken = undefined;
	private isCancelInstall = false;
	private cmsAppDetailsArray = [];	// Cached app details
	private cmsAppDetails: any;
	private culture: any;
	private serialNumber: string;
	private familyName: string;
	private localInfo: any;
	systemUpdateBridge: any;

	private initialize() {
		this.culture = window.navigator.languages[0];
		let machineInfo = this.deviceService.getMachineInfoSync();
		if (!machineInfo) {
			this.deviceService.getMachineInfo().then((info) => {
				machineInfo = info;
				this.serialNumber = machineInfo.serialnumber;
				this.familyName = machineInfo.family;
				this.isInitialized = true;
			});
		} else {
			this.serialNumber = machineInfo.serialnumber;
			this.familyName = machineInfo.family;
			this.isInitialized = true;
		}
		this.localInfoService.getLocalInfo().then(result => {
			this.localInfo = result;
		}).catch(e => {
			console.log(e);
		});
	}

	getAppDetails(appGuid) {
		const findItem = this.cmsAppDetailsArray.find(item => item.key === appGuid);
		this.cmsAppDetails = findItem ? findItem.value : undefined;
		if (this.isInitialized && !this.cmsAppDetails) {
			let appId = AppsForYouEnum.AppSiteCoreIdLenovoMigrationAssistant;
			switch (appGuid) {
				case AppsForYouEnum.AppGuidAdobeCreativeCloud:
					appId = AppsForYouEnum.AppSiteCoreIdAdobeCreativeCloud;
					break;
				case AppsForYouEnum.AppSiteCoreIdLenovoMigrationAssistant:
				default:
					appId = AppsForYouEnum.AppSiteCoreIdLenovoMigrationAssistant;
					break;
			}
			Promise.all([this.cmsService.fetchCMSAppDetails(appId, { Lang: this.culture })])
				.then((response) => {
					this.cmsAppDetails = response[0];
					if (this.cmsAppDetailsArray.findIndex(i => i.key === appGuid) === -1) {
						this.cmsAppDetailsArray.push({
							key: appGuid,
							value: this.cmsAppDetails
						});
					}
					this.handleGetAppDetailsResponse(this.cmsAppDetails);
				})
				.catch((error) => {
					this.logService.error('AppsForYouService.getAppDetails error.', JSON.stringify(error));
					this.commonService.sendNotification(AppsForYouEnum.CommonException, error);
				});
		} else if (this.cmsAppDetails) {
			this.handleGetAppDetailsResponse(this.cmsAppDetails);
		}
	}

	private handleGetAppDetailsResponse(cmsAppDetails: any) {
		if (cmsAppDetails) {
			this.logService.info('AppsForYouService.handleGetAppDetailsResponse response.', JSON.stringify(cmsAppDetails));
			const appDetails: AppDetails = this.serializeCMSAppDetails(this.cmsAppDetails);
			this.commonService.sendNotification(AppsForYouEnum.GetAppDetailsRespond, appDetails);
		}
	}

	private serializeCMSAppDetails(detailFromCMS: any) {
		const appDetails =  new AppDetails();
		appDetails.id = detailFromCMS.Id;
		appDetails.title = detailFromCMS.Title;
		appDetails.image = detailFromCMS.Image;

		// Description
		appDetails.description = detailFromCMS.Description;

		// Screenshots
		let n = 1;
		appDetails.screenshots = [];
		detailFromCMS.Screenshots.forEach((imageUrl: string) => {
			const screenshot = new Screenshot();
			screenshot.id = `apps-for-you-screenshot-${n}`;
			screenshot.imageUrl = imageUrl;
			screenshot.isRepeat = false;
			screenshot.position = n;
			screenshot.show = 'show';
			appDetails.screenshots.push(screenshot);
			n++;
		});

		// Video
		appDetails.videourl = detailFromCMS.VideoUrl;

		// See More Url
		appDetails.downloadlink = detailFromCMS.DownloadLink;

		// Additional Information
		appDetails.by = detailFromCMS.By;
		const dateString = detailFromCMS.Updated;
		if (dateString && dateString.length >= 8) {
			appDetails.updated =  dateString.substr(4, 2) + '-' +  dateString.substr(6, 2) + '-' + dateString.substr(0, 4);
		} else {
			appDetails.updated = '';
		}
		appDetails.installtype.id = detailFromCMS.InstallType.Id;
		appDetails.installtype.title = detailFromCMS.InstallType.Title;
		appDetails.category.id = detailFromCMS.Category.Id;
		appDetails.category.title = detailFromCMS.Category.Title;

		// Legal Agreement
		appDetails.privacyurl = detailFromCMS.PrivacyURL;

		if (appDetails.by === '' &&
			appDetails.updated === '' &&
			appDetails.installtype.title === ''	&&
			appDetails.category.title === '' &&
			appDetails.privacyurl === '') {
			appDetails.showAdditionalInfo = false;
		} else {
			appDetails.showAdditionalInfo = true;
		}

		return appDetails;
	}

	public async installApp(appGuid: any) {
		if (this.isInitialized && !this.isCancelInstall) {
			this.cancelToken = {};
			if (this.systemUpdateBridge) {
				const applicationGuid = appGuid;
				const result = await this.systemUpdateBridge.downloadAndInstallApp(applicationGuid, null,
				  (progressResponse) => {
					this.commonService.sendNotification(AppsForYouEnum.InstallAppProgress, progressResponse);
				  });
				this.commonService.sendNotification(AppsForYouEnum.InstallAppResult, result);
			}
		}
	}

	public openSeeMoreUrl() {
		// Open new window with default browser to browse external link
		if (window && this.serialNumber) {
			const url = AppsForYouEnum.SeeMoreUrlAdobeCreativeCloud.replace('[SerialNumber]', this.serialNumber);
			window.open(url);
		}
	}

	// Wether or not to show 'adobe redemption' in user drop down menu
	public showAdobeMenu() {
		if (this.familyName && this.familyName.indexOf(AppsForYouEnum.AdobeFamilyNameFilter) !== -1 &&
			this.localInfo && this.localInfo.Lang.indexOf('en') !== -1 &&
			(this.localInfo.Segment.indexOf('SMB') !== -1 || this.localInfo.Segment.indexOf('Consumer') !== -1))  {
			return true;
		} else {
			return false;
		}
	}

	cancelInstall() {
		this.isCancelInstall = true;
		if (this.cancelToken) {
			this.cancelToken.cancel();
		}
	}
}

