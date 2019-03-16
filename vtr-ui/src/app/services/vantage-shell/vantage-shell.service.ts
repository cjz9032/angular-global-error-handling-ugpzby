/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/index.js' />

import { Injectable } from '@angular/core';
import * as inversify from 'inversify';
import bootstrap from '@lenovo/tan-client-bridge/src/index';

@Injectable({
	providedIn: 'root'
})
export class VantageShellService {
	private phoenix: any;
	constructor() {
		const shell = this.getVantageShell();
		if (shell) {
			const rpcClient = shell.VantageRpcClient ? new shell.VantageRpcClient() : null;
			const metricClient = shell.MetricsClient ? new shell.MetricsClient() : null;
			this.phoenix = bootstrap(
				new inversify.Container(),
				{ hsaBroker: rpcClient, metricsBroker: metricClient }
			);
		}
	}

	private getVantageShell(): any {
		const win: any = window;
		return win.VantageShellExtension;
	}

	public getLenovoId(): any {
		if (this.phoenix && this.phoenix.lid) {
			return this.phoenix.lid;
		}
		return undefined;
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

	/**
	 * returns dashboard object from VantageShellService of JS Bridge
	 */
	public getDevice(): any {
		if (this.phoenix) {
			return this.phoenix.device;
		}
	}

	// /**
	//  * returns hwsettings object from VantageShellService of JS Bridge
	// */
	// public getHwSettings(): any {
	// 	if (this.phoenix) {
	// 		return this.phoenix.hwsettings;
	// 	}
	// 	return undefined;
	// }

	/**
	 * returns sysinfo object from VantageShellService of JS Bridge
	 */
	public getSysinfo(): any {
		if (this.phoenix) {
			return this.phoenix.sysinfo;
		}
		return undefined;
	}

	/**
	 * returns warranty object from VantageShellService of JS Bridge
	 */
	public getWarranty(): any {
		if (this.phoenix) {
			return this.phoenix.warranty;
		}
		return undefined;
	}

	public getMetrics(): any {
		if (this.phoenix) {
			return this.phoenix.metrics;
		}
		return undefined;
	}

	/**
	 * returns sysinfo object from VantageShellService of JS Bridge
	 */
	public getSystemUpdate(): any {
		if (this.phoenix) {
			return this.phoenix.systemUpdate;
		}
		return undefined;
	}

	/**
	 * returns hardware settings object from VantageShellService of JS Bridge
	 */
	private getHwSettings(): any {
		if (this.phoenix && this.phoenix.hwsettings) {
			return this.phoenix.hwsettings;
		}
		return undefined;
	}

	/**
	 * returns audio settings object from VantageShellService of JS Bridge
	 */
	private getAudioSettings(): any {
		if (this.getHwSettings() && this.getHwSettings().audio) {
			return this.getHwSettings().audio;
		}
		return undefined;
	}

	/**
	 * returns dolby settings object from VantageShellService of JS Bridge
	 */
	public getDolbySettings(): any {
		if (this.getAudioSettings() && this.getAudioSettings().dolby) {
			return this.getAudioSettings().dolby;
		}
		return undefined;
	}

	/**
	 * returns microphone settings object from VantageShellService of JS Bridge
	 */
	public getMicrophoneSettings(): any {
		if (this.getAudioSettings() && this.getAudioSettings().microphone) {
			return this.getAudioSettings().microphone;
		}
		return undefined;
	}

	/**
	 * returns smart settings object from VantageShellService of JS Bridge
	 */
	public getSmartSettings(): any {
		if (this.getHwSettings() && this.getHwSettings().smartsettings) {
			return this.getHwSettings().smartsettings;
		}
		return undefined;
	}
	/**
	 * returns EyecareMode object from VantageShellService of JS Bridge
	 */
	public getEyeCareMode(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.display.eyeCareMode;
		}
		return undefined;
	}
	/**
	 * returns CameraPrivacy object from VantageShellService of JS Bridge
	 */
	public getCameraPrivacy(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.camera.cameraPrivacy;
		}
		return undefined;
	}
	/**
	 * returns cameraSettings object from VantageShellService of JS Bridge
	 */
	public getCameraSettings(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.camera.cameraSettings;
		}
		return undefined;
	}
}
