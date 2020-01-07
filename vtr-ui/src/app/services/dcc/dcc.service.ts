import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DeviceService } from '../device/device.service';
import { CommonService } from '../common/common.service';

@Injectable({
	providedIn: 'root'
})
export class DccService {

	public showDemo = false;
	public isDccDevice = false;
	private cmsHeaderDccBackgroundUpdated = false;
	private backgroundProperties = ' no-repeat center / cover';
	public headerBackground = 'url(/assets/images/HeaderImage.jpg)' + this.backgroundProperties;
	private headerDccBackground = 'url(/assets/images/HeaderImageDcc.jpg)' + this.backgroundProperties;

	constructor(
		private modalService: NgbModal,
		private logger: LoggerService,
		private cmsService: CMSService,
		private deviceService: DeviceService,
		private commonService: CommonService,
		private vantageShellService: VantageShellService
	) {
		this.initialize();
	}

	private initialize() {
		this.deviceService.getMachineInfo().then((machineInfo) => {
			if (!this.deviceService.isGaming) {
				const queryOptions: any = {
					Page: 'dashboard'
				};
				this.cmsService.fetchCMSContent(queryOptions).subscribe(
					(response: any) => {
						if (response && response.length > 0) {
							this.getCMSHeaderImageDcc(response);
						}
					});
			}
		});
	}

	private getCMSHeaderImageDcc(response) {
		const headerImage = this.cmsService.getOneCMSContent(
			response,
			'header',
			null
		)[0];
		if (headerImage && headerImage.Title === 'Header Image DCC') {
			this.cmsHeaderDccBackgroundUpdated = true;
			this.headerBackground = 'url(' + headerImage.FeatureImage + ')' + this.backgroundProperties;
		}
	}

	public isDccCapableDevice(): Promise<boolean> {
		return new Promise(resolve => {
			const filter: Promise<any> = this.vantageShellService.calcDeviceFilter('{"var":"DeviceTags.System.DccGroup"}');
			if (filter) {
				filter.then((hyp) => {
					if (hyp === 'true') {
						this.isDccDevice = true;
						if (!this.deviceService.isGaming) {
							if (!this.cmsHeaderDccBackgroundUpdated && this.commonService.isOnline) {
								this.headerBackground = '';
							} else if (!this.commonService.isOnline) {
								this.headerBackground = this.headerDccBackground;
							}
						}
					}
					resolve(this.isDccDevice);
				}, (error) => {
					this.logger.error('DccService.isDccDeviceCapableDevice: promise error ', error);
					resolve(false);
				});
			}
		});
	}

	public canShowDccDemo(): Promise<boolean> {
		return new Promise(resolve => {
			const filter: Promise<any> = this.vantageShellService.calcDeviceFilter('{"var":"DeviceTags.System.Demo"}');
			if (filter) {
				filter.then((hyp) => {
					if (hyp === 'CES-2019' && !this.deviceService.isGaming) {
						this.showDemo = true;
						this.headerBackground = this.headerDccBackground;
					}
					resolve(this.showDemo);
				}, (error) => {
					this.logger.error('DccService.canShowDccDemo: promise error ', error);
					resolve(false);
				});
			}
		});
	}
}
