import { Injectable } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	private dashboard: any;
	public isShellAvailable = false;
	constructor(shellService: VantageShellService) {
		this.dashboard = shellService.getDashboard();
		if (this.dashboard) {
			this.isShellAvailable = true;
		}
	}

	public getMicrophoneStatus(): Promise<FeatureStatus> {
		try {
			if (this.dashboard) {
				return this.dashboard.getMicphoneStatus();
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	public setMicrophoneStatus(value: boolean): Promise<boolean> {
		try {
			if (this.dashboard) {
				return this.dashboard.setMicphoneStatus(value);
			}
			return undefined;
		} catch (error) {
			throw Error(error.message);
		}
	}

	public getCameraStatus(): Promise<FeatureStatus> {
		if (this.dashboard) {
			return this.dashboard.getCameraStatus();
		}
		return undefined;
	}

	public setCameraStatus(value: boolean): Promise<boolean> {
		if (this.dashboard) {
			return this.dashboard.setCameraStatus(value);
		}
		return undefined;
	}

	public getEyeCareMode(): Promise<FeatureStatus> {
		if (this.dashboard) {
			return this.dashboard.getEyecareMode();
		}
		return undefined;
	}

	public setEyeCareMode(value: boolean): Promise<boolean> {
		if (this.dashboard) {
			return this.dashboard.setEyecareMode(value);
		}
		return undefined;
	}

	public getSystemInfo(): Promise<any> {
		if (this.dashboard) {
			return this.dashboard.getSystemInfo();
		}
		return undefined;
	}

	public getSecurityStatus(): Promise<any> {
		if (this.dashboard) {
			return this.dashboard.getSecurityStatus();
		}
		return undefined;
	}
}
