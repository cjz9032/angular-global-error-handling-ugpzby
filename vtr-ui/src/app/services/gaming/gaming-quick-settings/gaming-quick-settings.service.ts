import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { CommonService } from '../../common/common.service';
import { ThermalModeStatus } from 'src/app/data-models/gaming/thermal-mode-status.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Injectable({
	providedIn: 'root'
})
export class GamingQuickSettingsService {
	public quickSettingsAvailable: Boolean = false;
	public quickSettings: any;
	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService) {
		this.quickSettings = shellService.getQuickSettings();
		if (this.quickSettings) {
			this.quickSettingsAvailable = true;
		}
	}

	public GetThermalModeStatus(): any {
		if (this.quickSettingsAvailable) {
			return this.shellService.getThermalModeStatus();
		}
		return undefined;
	}

	public setThermalModeStatus(newThermalModeStatus: ThermalModeStatus, oldThermalModeStatus: ThermalModeStatus) {
		this.UpdateThermalModeCacheStatus(newThermalModeStatus, oldThermalModeStatus);
		const shellServiceResponseStaus: Boolean = this.shellService.setThermalModeStatus(newThermalModeStatus);
		this.SetThermalModeCacheStatus(shellServiceResponseStaus);
	}

	public SetThermalModeCacheStatus(status: Boolean) {
		if (!status) {
			const thermalModeStatusObj = this.commonService.getLocalStorageValue(LocalStorageKey.PrevThermalModeStatus);
			this.commonService.setLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus, thermalModeStatusObj);
		}
	}

	public getThermalModeCacheStatus(key: any) {
			return this.commonService.getLocalStorageValue(key, 0);
	}
	public UpdateThermalModeCacheStatus(newThermalModeStatus: ThermalModeStatus, oldThermalModeStatus: ThermalModeStatus) {
		this.commonService.setLocalStorageValue(LocalStorageKey.PrevThermalModeStatus, oldThermalModeStatus);
		this.commonService.setLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus, newThermalModeStatus);
	}
}
