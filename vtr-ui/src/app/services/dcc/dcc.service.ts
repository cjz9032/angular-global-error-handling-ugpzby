import { Injectable } from '@angular/core';

import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DeviceService } from '../device/device.service';
import { CommonService } from '../common/common.service';
import { SelfSelectService, SegmentConst } from './../self-select/self-select.service';

@Injectable({
	providedIn: 'root',
})
export class DccService {
	public showDemo = false;
	public isDccDevice = false;
	private cmsHeaderDccBackgroundUpdated = false;
	public headerBackground = '';
	private headerDefaultBackground = 'assets/images/HeaderImage.jpg';
	private headerDccBackground = 'assets/images/HeaderImageDcc.jpg';
	private headerSmbBackground = 'assets/images/HeaderImageSmb.png';

	constructor(
		private logger: LoggerService,
		private cmsService: CMSService,
		private deviceService: DeviceService,
		private commonService: CommonService,
		private vantageShellService: VantageShellService,
		private selfSelectService: SelfSelectService
	) {
		this.initialize();
	}

	private async initialize() {
		const segment = await this.selfSelectService.getSegment();
		if (segment === SegmentConst.SMB) {
			this.headerBackground = this.headerSmbBackground;
		} else {
			const isDccDevice = await this.isDccCapableDevice();
			this.headerBackground =
				isDccDevice && this.needUpdateDccHeaderBackground()
					? this.headerDccBackground
					: this.headerDefaultBackground;
		}
		if (!this.deviceService.isGaming) {
			const queryOptions: any = {
				Page: 'dashboard',
			};
			this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
				if (response && response.length > 0) {
					this.getCMSHeaderImage(response);
				}
			});
		}
	}

	private getCMSHeaderImage(response) {
		const headerImage = this.cmsService.getOneCMSContent(response, 'header', null)[0];
		if (headerImage) {
			if (headerImage.Title.toLowerCase().indexOf('header image dcc') > -1) {
				this.cmsHeaderDccBackgroundUpdated = true;
			}
			this.headerBackground = headerImage.FeatureImage;
		}
	}

	private needUpdateDccHeaderBackground() {
		if (
			!this.deviceService.isGaming &&
			this.headerBackground !== this.headerDccBackground &&
			(!this.commonService.isOnline || !this.cmsHeaderDccBackgroundUpdated)
		) {
			return true;
		}
		return false;
	}

	public isDccCapableDevice(): Promise<boolean> {
		return new Promise((resolve) => {
			const filter: Promise<any> = this.vantageShellService.calcDeviceFilter(
				'{"var":"DeviceTags.System.DccGroup"}'
			);
			if (filter) {
				filter.then(
					(hyp) => {
						if (hyp === 'true') {
							this.isDccDevice = true;
						}
						resolve(this.isDccDevice);
					},
					(error) => {
						this.logger.error(
							'DccService.isDccDeviceCapableDevice: promise error ',
							error
						);
						resolve(false);
					}
				);
			} else {
				resolve(false);
			}
		});
	}

	public canShowDccDemo(): Promise<boolean> {
		return new Promise((resolve) => {
			const filter: Promise<any> = this.vantageShellService.calcDeviceFilter(
				'{"var":"DeviceTags.System.Demo"}'
			);
			if (filter) {
				filter.then(
					(hyp) => {
						if (hyp === 'CES-2019' && !this.deviceService.isGaming) {
							this.showDemo = true;
							this.headerBackground = this.headerDccBackground;
						}
						resolve(this.showDemo);
					},
					(error) => {
						this.logger.error('DccService.canShowDccDemo: promise error ', error);
						resolve(false);
					}
				);
			} else {
				resolve(false);
			}
		});
	}
}
