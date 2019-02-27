// below line is needed for js intellisense
/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/features/dashboard-feature.js' />

import { Injectable } from '@angular/core';

import * as DashboardBridge from '@lenovo/tan-client-bridge/src/features/dashboard-feature';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	private dashboardBridge: DashboardBridge.default;

	constructor() {
		this.dashboardBridge = new DashboardBridge.default();
	}

	public getFeedbackUrl(): string {
		return this.dashboardBridge.feedbackLink;
	}

	public getMicrophoneStatus(): Promise<FeatureStatus> {
		return this.dashboardBridge.getMicphoneStaus();
	}

	public setMicrophoneStatus(value: boolean): Promise<boolean> {
		return this.dashboardBridge.setMicphoneStatus(value);
	}

	public getCameraStatus(): Promise<FeatureStatus> {
		return this.dashboardBridge.getCamaraStatus();
	}

	public setCameraStatus(value: boolean): Promise<boolean> {
		return this.dashboardBridge.setCamaraStatus(value);
	}
}
