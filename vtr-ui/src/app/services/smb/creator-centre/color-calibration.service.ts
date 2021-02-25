import { Injectable } from '@angular/core';
import { ColorCalibrationEnum } from 'src/app/enums/color-calibration.enum';
import { CommonService } from '../../common/common.service';
import { LocalInfoService } from '../../local-info/local-info.service';
import { LoggerService } from '../../logger/logger.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root',
})

export class ColorCalibrationService {
	private isCancelInstall = false;

	constructor(private shellService: VantageShellService,
		private commonService: CommonService) {
	}

	public async installApp(appGuid: any) {
		if (!this.isCancelInstall) {
			const systemUpdateBridge = this.shellService.getSystemUpdate();
			if (systemUpdateBridge) {
				const applicationGuid = appGuid;
				const result = await systemUpdateBridge.downloadAndInstallApp(
					applicationGuid,
					null,
					(progressResponse) => {
						this.commonService.sendNotification(
							ColorCalibrationEnum.ActionInstallAppProgress,
							progressResponse
						);
					}
				);
				this.commonService.sendNotification(ColorCalibrationEnum.ActionInstallAppResult, result);
			}
		}
	}

	public getAppStatus(appGuid) {
		const systemUpdateBridge = this.shellService.getSystemUpdate();
		if (systemUpdateBridge) {
			systemUpdateBridge.getAppStatus(appGuid).then((status) => {
				this.commonService.sendNotification(ColorCalibrationEnum.ActionGetAppStatusResult, status);
			});
		}
	}

	cancelInstall() {
		this.isCancelInstall = true;
	}


	resetCancelInstall() {
		this.isCancelInstall = false;
	}
}
