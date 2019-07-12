// import { Injectable } from '@angular/core';
// import { VantageShellService } from '../vantage-shell/vantage-shell.service';

// @Injectable({
// 	providedIn: 'root'
// })
// export class HwsettingsService {
// 	private hwsettings: any;
// 	public isShellAvailable = false;
// 	constructor(
// 		public shellService: VantageShellService
// 	) {
// 		this.hwsettings = this.shellService.getHwSettings();
// 		console.log(this.hwsettings);
// 		if (this.hwsettings) {
// 			this.isShellAvailable = true;
// 		}
// 	}

// 	public getDolbyStatus(): Promise<any> {
// 		if (this.hwsettings) {
// 			return this.hwsettings.audio.dolby.getDolbyStatus();
// 		}
// 		return undefined;
// 	}

// 	public getMicrophoneSettings(): Promise<any> {
// 		if (this.hwsettings) {
// 			return this.hwsettings.audio.microphone.getMicrophoneSettings();
// 		}
// 		return undefined;
// 	}

// 	public getMicrophoneProperties(): any {
// 		if (this.hwsettings) {
// 			return this.hwsettings.audio.microphone;
// 		}
// 		return undefined;
// 	}

// 	public getMicrophoneMute(): Promise<any> {
// 		if (this.hwsettings) {
// 			return this.hwsettings.audio.microphone.getMicrophoneMute();
// 		}
// 		return undefined;
// 	}

// 	public setMicrophoneMute(value: boolean): Promise<boolean> {
// 		if (this.hwsettings) {
// 			return this.hwsettings.audio.microphone.setMicrophoneMute(value);
// 		}
// 		return undefined;
// 	}

// 	public getSupportedModes(): Promise<any> {
// 		if (this.hwsettings) {
// 			return this.hwsettings.audio.microphone.getSupportedModes();
// 		}
// 		return undefined;
// 	}

// 	public setMicrophoneVolume(volume: number): Promise<boolean> {
// 		if (this.hwsettings) {
// 			if (volume > 0 && volume <= 100) {
// 				return this.hwsettings.audio.microphone.setMicrophoneVolume(volume);
// 			}
// 		}
// 		return undefined;
// 	}

// 	public setMicrophoneOpitimaztion(name: string): Promise<boolean> {
// 		if (this.hwsettings) {
// 			return this.hwsettings.audio.microphone.setMicrophoneOpitimaztion(name);
// 		}
// 		return undefined;
// 	}

// 	public setMicrophoneAutoOptimization(value: boolean): Promise<boolean> {
// 		if (this.hwsettings) {
// 			return this.hwsettings.audio.microphone.setMicrophoneAutoOptimization(value);
// 		}
// 		return undefined;
// 	}

// 	public setMicrophoneAEC(value: boolean): Promise<boolean> {
// 		if (this.hwsettings) {
// 			return this.hwsettings.audio.microphone.setMicrophoneAEC(value);
// 		}
// 		return undefined;
// 	}

// 	public setMicrophoneKeyboardNoiseSuppression(value: boolean): Promise<boolean> {
// 		if (this.hwsettings) {
// 			return this.hwsettings.audio.microphone.setMicrophoneKeyboardNoiseSuppression(value);
// 		}
// 		return undefined;
// 	}


// }
