// below line is needed for js intellisense
/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/features/dashboard-feature.js' />

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
		if (this.dashboard) {
			return this.dashboard.getMicphoneStatus();
		}
		return undefined;
	}

	public setMicrophoneStatus(value: boolean): Promise<boolean> {
		if (this.dashboard) {
			return this.dashboard.setMicphoneStatus(value);
		}
		return undefined;
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
}
