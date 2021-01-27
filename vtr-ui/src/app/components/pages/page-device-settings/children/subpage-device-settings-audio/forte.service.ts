import { Injectable } from '@angular/core';
import { AudioVendorService } from './audio-vendor.service';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { DeviceService } from '../../../../../services/device/device.service';

@Injectable()
export class ForteService extends AudioVendorService {
	isVendorSupported = true;
	private microphone: any;

	constructor(
		private vantageShellService: VantageShellService,
		private deviceService: DeviceService,
	) {
		super();
		this.microphone = vantageShellService.getMicrophoneSettings();
	}

	isPanelInstalled(): Promise<boolean> {
		return (window as any).VantageShellExtension.Utils
			.MSStore.isAppInstalledAsync('4505Fortemedia.FMAPOControl_4pejv7q2gmsnr');
	}

	launchDownloadLink() {
		this.deviceService.launchUri('ms-windows-store://pdp/?productid=9PMHKXF40N04');
	}

	launchPanel() {
		this.microphone.launchForteMediaPanel();
	}

}
