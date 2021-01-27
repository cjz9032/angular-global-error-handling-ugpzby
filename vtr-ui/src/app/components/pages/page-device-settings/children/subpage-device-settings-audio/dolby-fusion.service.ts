import { Injectable } from '@angular/core';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { AudioVendorService } from './audio-vendor.service';
import { DeviceService } from '../../../../../services/device/device.service';

@Injectable()
export class DolbyFusionService extends AudioVendorService {
	isVendorSupported = true;

	constructor(
		private vantageShellService: VantageShellService,
		private deviceService: DeviceService,
	) {
		super();
	}

	isPanelInstalled() {
		return (window as any).VantageShellExtension.Utils
			.MSStore.isAppInstalledAsync('DolbyLaboratories.DolbyAccess_rz1tebttyb220');
	}

	launchDownloadLink() {
		this.deviceService.launchUri('ms-windows-store://pdp/?productid=9N0866FS04W8');
	}

	launchPanel() {
		this.vantageShellService.deviceFilter({
			'InstalledApp.Version': {
				key: 'DolbyLaboratories.DolbyAccess_rz1tebttyb220',
				operator: '>=',
				value: '3.7.0.0'
			}
		}).then((versionGreaterThan) => {
			this.deviceService.launchUri(versionGreaterThan
				? 'dl-dolbyaccess://Navigate/VoiceSettings'
				: 'dl-dolbyaccess://Navigate/PcVoiceSettings');
		});
	}

}
