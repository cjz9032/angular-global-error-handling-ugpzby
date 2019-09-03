import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { DeviceService } from '../device/device.service';
import { CMSService } from '../cms/cms.service';
import { LoggerService } from '../logger/logger.service';
import { AppItem } from '../modern-preload/modern-preload.service';

export class AppDetails {
	id: string;
	title: string;
	image: string;
	description: string;
	category: {
		id: string; // app category id
		title: string; // app category title
	};
	privacyurl: string; // app privacy url
	pfn: string; // app pfn
	url: string; // app url
	installtype: {
		id: string; 	// app install type id
		title: string; 	// app install type i.e., Desktop or Windows Store app or Web App
	};
	downloadlink: string; // app download link
	videourl: string; 	// app video url
	recommendation: [{
		id: string; 	// app recommendation id
		title: string; 	// app recommendation title
	},
	{
		id: string; 	// app recommendation id
		title: string; 	// app recommendation title
	}];
	screenshots: []; 	// ["{app screenshot1}",  "{app screenshot2}"],
	by: string; 		// app manufacturer name
	updated: string; 	// app updated date
	filters: [];
	showStatus: number;
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
	private cmsAppDetails: any;
	systemUpdateBridge: any;

	private initialize() {
		let machineInfo = this.deviceService.getMachineInfoSync();
		if (!machineInfo) {
			this.deviceService.getMachineInfo().then((info) => {
				machineInfo = info;
				// TODO: use machineInfo.serialnumber
				this.isInitialized = true;
			});
		} else {
			// TODO: use machineInfo.serialnumber
			this.isInitialized = true;
		}
	}

	getAppDetails() {
		if (this.isInitialized && !this.cmsAppDetails) {
			const appId = '030B3E7E-9235-4A44-823A-8D02B7A6F30F';
			Promise.all([this.cmsService.fetchCMSAppDetails(appId, { Lang: 'en' })])
				.then((response) => {
					this.cmsAppDetails = response[0];
					this.logService.info('AppsForYouService.getAppDetails cms response.', JSON.stringify(this.cmsAppDetails));
					const appDetails: AppDetails = this.serializeCMSAppDetails(this.cmsAppDetails);
					this.commonService.sendNotification(AppsForYouEnum.GetAppDetailsRespond, appDetails);
				})
				.catch((error) => {
					this.logService.error('AppsForYouService.getAppDetails error.', JSON.stringify(error));
					this.commonService.sendNotification(AppsForYouEnum.CommonException, error);
				});
		}
	}

	private serializeCMSAppDetails(detailFromCMS: any) {
		const appDetails =  new AppDetails();
		appDetails.id = detailFromCMS.Id;
		appDetails.title = detailFromCMS.Title;
		appDetails.image = detailFromCMS.Image;
		appDetails.description = detailFromCMS.Description;
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

	cancelInstall() {
		this.isCancelInstall = true;
		if (this.cancelToken) {
			this.cancelToken.cancel();
		}
	}
}

