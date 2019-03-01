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
	constructor(private vantageShellService: VantageShellService) {
		this.dashboard = vantageShellService.getDashboard();
	}

	public getFeedbackUrl(): string {
		return this.dashboard.feedbackLink;
	}

	public getMicrophoneStatus(): Promise<FeatureStatus> {
		return this.dashboard.getMicphoneStatus();
	}

	public setMicrophoneStatus(value: boolean): Promise<boolean> {
		return this.dashboard.setMicphoneStatus(value);
	}

	public getCameraStatus(): Promise<FeatureStatus> {
		return this.dashboard.getCameraStatus();
	}

	public setCameraStatus(value: boolean): Promise<boolean> {
		return this.dashboard.setCameraStatus(value);
	}

	public getEyeCareMode(): Promise<FeatureStatus> {
		return this.dashboard.getEyecareMode();
	}

	public setEyeCareMode(value: boolean): Promise<boolean> {
		return this.dashboard.setEyecareMode(value);
	}
}
