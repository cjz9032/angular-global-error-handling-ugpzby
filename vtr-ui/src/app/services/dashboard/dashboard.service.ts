// below line is needed for js intellisense
//// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/features/dashboard-feature.js' />

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {

	constructor() {
	}

	// public getMicrophoneStatus(): Promise<FeatureStatus> {
	// 	// return Promise.resolve(null);
	// 	return this.dashboardBridge.getMicphoneStaus();
	// }

	// public setMicrophoneStatus(value: boolean): Promise<boolean> {
	// 	return this.dashboardBridge.setMicphoneStatus(value);
	// }

	// public getCameraStatus(): Promise<FeatureStatus> {
	// 	// return Promise.resolve(null);
	// 	return this.dashboardBridge.getCamaraStatus();
	// }

	// public setCameraStatus(value: boolean): Promise<boolean> {
	// 	// return Promise.resolve(null);
	// 	return this.dashboardBridge.setCamaraStatus(value);
	// }
}
