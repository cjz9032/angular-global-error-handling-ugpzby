import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { DeviceService } from '../device/device.service';
import { CMSService } from '../cms/cms.service';
import { LoggerService } from '../logger/logger.service';
import { AppItem } from '../modern-preload/modern-preload.service';

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
	screenshots: []; 	// ["{app screenshot1}",  "{app screenshot2}"],
	by: string; 		// app manufacturer name
	updated: string; 	// app updated date
	type: string;
	filters: [];
	showAdditionalInfo: boolean;
	showStatus: number;
	constructor() {
		this.category = new Category();
		this.installtype = new Installtype();
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
		private logService: LoggerService
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
	systemUpdateBridge: any;

	private initialize() {
		this.culture = window.navigator.languages[0];
		let machineInfo = this.deviceService.getMachineInfoSync();
		if (!machineInfo) {
			this.deviceService.getMachineInfo().then((info) => {
				machineInfo = info;
				this.serialNumber = machineInfo.serialnumber;
				this.isInitialized = true;
			});
		} else {
			this.serialNumber = machineInfo.serialnumber;
			this.isInitialized = true;
		}
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
					////////////////////////////////////////////////////////////////////////
					// TODO: Mock data, please remove before release
					switch (appGuid) {
						case AppsForYouEnum.AppGuidAdobeCreativeCloud:
							this.cmsAppDetails.InstallType.Title = AppsForYouEnum.AppTypeWeb;
							break;
						case AppsForYouEnum.AppSiteCoreIdLenovoMigrationAssistant:
						default:
							this.cmsAppDetails.InstallType.Title = AppsForYouEnum.AppTypeDesktop;
							break;
					}
					////////////////////////////////////////////////////////////////////////
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
		appDetails.screenshots = Object.assign([], detailFromCMS.Screenshots);

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

	cancelInstall() {
		this.isCancelInstall = true;
		if (this.cancelToken) {
			this.cancelToken.cancel();
		}
	}
}

