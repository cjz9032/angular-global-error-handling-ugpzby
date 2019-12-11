import { Injectable } from '@angular/core';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { DolbyModeResponse } from 'src/app/data-models/audio/dolby-mode-response';
import { MicrophoneOptimizeModes } from 'src/app/data-models/audio/microphone-optimize-modes';

@Injectable({
	providedIn: 'root'
})
export class AudioService {
	private microphone: any;
	private dolby: any;
	private smartSettings: any;
	public isShellAvailable = false;
	constructor(shellService: VantageShellService) {
		this.microphone = shellService.getMicrophoneSettings();
		this.dolby = shellService.getDolbySettings();
		this.smartSettings = shellService.getSmartSettings();
		if (this.microphone && this.dolby && this.smartSettings) {
			this.isShellAvailable = true;
		}
	}

	setMicrophoneVolume(volumn: number): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicrophoneVolume(volumn);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// TODO: We need to remove this as we have to use dashboard.setMicphoneStatus
	setMicophoneOnMute(isAvailable: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicophoneMute(isAvailable);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setDolbyOnOff(onOff: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.smartSettings.absFeature.setDolbyFeatureStatus(onOff);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getDolbyFeatureStatus(): Promise<FeatureStatus> {
		try {
			if (this.isShellAvailable) {
				return this.smartSettings.absFeature.getDolbyFeatureStatus();
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setMicrophoneAutoOptimization(onOff: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicrophoneAutoOptimization(onOff);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setSuppressKeyboardNoise(onOff: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicrophoneKeyboardNoiseSuppression(onOff);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setMicrophoneAEC(onOff: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicrophoneAEC(onOff);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// getMicrophoneSettings(): Promise<Microphone> {
	// 	try {
	// 		if (this.isShellAvailable) {
	// 			return this.microphone.getMicrophoneSettings();
	// 		}
	// 		return undefined;
	// 	} catch (error) {
	// 		throw new Error(error.message);
	// 	}
	// }

	getDolbyMode(): Promise<DolbyModeResponse> {
		try {
			if (this.isShellAvailable) {
				return this.dolby.getDolbyMode();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setDolbyMode(mode: string): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.dolby.setDolbyMode(mode);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// getSupportedModes(): Promise<MicrophoneOptimizeModes> {
	// 	try {
	// 		if (this.isShellAvailable) {
	// 			return this.microphone.getSupportedModes();
	// 		}
	// 		return undefined;
	// 	} catch (error) {
	// 		throw new Error(error.message);
	// 	}
	// }

	setMicrophoneOpitimaztion(mode: string): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicrophoneOpitimaztion(mode);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	startMicrophoneMonitor(handler: any): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.startMonitor(handler);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	stopMicrophoneMonitor(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.stopMonitor();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	startMonitorForDolby(handler: any): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.dolby.startMonitor(handler);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	stopMonitorForDolby(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.dolby.stopMonitor();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getMicrophoneSettingsAsync(handler: any): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.getMicrophoneSettingsAsync(handler);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	
}
