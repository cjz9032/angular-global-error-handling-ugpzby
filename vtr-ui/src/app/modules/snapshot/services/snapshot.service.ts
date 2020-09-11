import { Injectable } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class SnapshotService {

	private snapshotBridge: any;

	constructor(
		shellService: VantageShellService,
		private logger: LoggerService) {
		this.snapshotBridge = shellService.getSnapshot();
	}

	public getLoadInstalledProgramsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadInstalledProgramsInfo()
			.catch((error) => {
				this.logger.error('[GetLoadInstalledProgramsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadVideoCardsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadVideoCardsInfo()
			.catch((error) => {
				this.logger.error('[getLoadVideoCardsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadProcessorsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadProcessorsInfo()
			.catch((error) => {
				this.logger.error('[getLoadProcessorsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadMemoryInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadMemoryInfo()
			.catch((error) => {
				this.logger.error('[getLoadMemoryInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadMotherboardInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadMotherboardInfo()
			.catch((error) => {
				this.logger.error('[getLoadMotherboardInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadSoundCardsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadSoundCardsInfo()
			.catch((error) => {
				this.logger.error('[getLoadSoundCardsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadStartupProgramsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadStartupProgramsInfo()
			.catch((error) => {
				this.logger.error('[getLoadStartupProgramsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadDisplayDevicesInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadDisplayDevicesInfo()
			.catch((error) => {
				this.logger.error('[getLoadDisplayDevicesInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadKeyboardsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadKeyboardsInfo()
			.catch((error) => {
				this.logger.error('[getLoadKeyboardsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadPrintersInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadPrintersInfo()
			.catch((error) => {
				this.logger.error('[getLoadPrintersInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadMouseDevicesInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadMouseDevicesInfo()
			.catch((error) => {
				this.logger.error('[getLoadMouseDevicesInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadWebBrowsersInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadWebBrowsersInfo()
			.catch((error) => {
				this.logger.error('[getLoadWebBrowsersInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadCdRomDrivesInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadCdRomDrivesInfo()
			.catch((error) => {
				this.logger.error('[getLoadCdRomDrivesInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadOperatingSystemsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadOperatingSystemsInfo()
			.catch((error) => {
				this.logger.error('[getLoadOperatingSystemsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadStorageDevicesInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadStorageDevicesInfo()
			.catch((error) => {
				this.logger.error('[getLoadStorageDevicesInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadNetworkDevicesInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadNetworkDevicesInfo()
			.catch((error) => {
				this.logger.error('[getLoadNetworkDevicesInfo] ' + error);
			});
		}
		return undefined;
	}
}
