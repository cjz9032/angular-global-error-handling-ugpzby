/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/index.js' />
/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/registered-types.js' />

import { Injectable } from '@angular/core';
import * as inversify from 'inversify';

import { BaseShellService } from './base-shell.service';
import RegisteredTypes from '@lenovo/tan-client-bridge/src/registered-types';
import Dashboard from '@lenovo/tan-client-bridge/src/features/dashboard-feature';
import HwsCameraComposer from '@lenovo/tan-client-bridge/src/composers/hardwaresettings/hws.camera-composer';
import HwsMicrophoneComposer from '@lenovo/tan-client-bridge/src/composers/hardwaresettings/hws.audio.microphone-composer';
import HwsEyeCareModeComposer from '@lenovo/tan-client-bridge/src/composers/hardwaresettings/hws.display.eyecaremode-composer';
import HwSettings from '@lenovo/tan-client-bridge/src/features/hardwaresettings/hwsettings-feature';


@Injectable({
	providedIn: 'root'
})
export class VantageShellWorkaroundService implements BaseShellService {

	private phoenix = { dashboard: {} };
	private shell: any;
	private container: inversify.Container;
	constructor() {
		this.shell = this.getVantageShell();
		if (this.shell) {
			this.container = new inversify.Container();
			this.loadDashboardBridge();
		}
	}

	private getVantageShell(): any {
		const win: any = window;
		return win.VantageShellExtension;
	}

	private loadDashboardBridge() {
		this.container.bind(RegisteredTypes.HSABroker).toConstantValue(new this.shell.VantageRpcClient());
		this.container.bind(RegisteredTypes.HwsCameraComposer).to(HwsCameraComposer);
		this.container.bind(RegisteredTypes.HwsMicrophoneComposer).to(HwsMicrophoneComposer);
		this.container.bind(RegisteredTypes.HwsEyeCareModeComposer).to(HwsEyeCareModeComposer);
		this.container.bind(RegisteredTypes.HwSettings).to(HwSettings);
		this.phoenix.dashboard = new Dashboard(null, null, this.container.get(RegisteredTypes.HwSettings), null, null);
	}

	/**
	 * returns dashboard object from VantageShellService of JS Bridge
	 */
	public getDashboard(): any {
		if (this.phoenix) {
			return this.phoenix.dashboard;
		}
		return undefined;
	}
}
