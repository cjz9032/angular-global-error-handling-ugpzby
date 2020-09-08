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
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[GetLoadInstalledProgramsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadVideoCardsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadVideoCardsInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadVideoCardsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadProcessorsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadProcessorsInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadProcessorsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadMemoryInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadMemoryInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadMemoryInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadMotherboardInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadMotherboardInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadMotherboardInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadSoundCardsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadSoundCardsInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadSoundCardsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadStartupProgramsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadStartupProgramsInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadStartupProgramsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadDisplayDevicesInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadDisplayDevicesInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadDisplayDevicesInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadKeyboardsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadKeyboardsInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadKeyboardsInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadPrintersInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadPrintersInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadPrintersInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadMouseDevicesInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadMouseDevicesInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadMouseDevicesInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadWebBrowsersInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadWebBrowsersInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadWebBrowsersInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadCdRomDrivesInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadCdRomDrivesInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadCdRomDrivesInfo] ' + error);
			});
		}
		return undefined;
	}

	public getLoadOperatingSystemsInfo() {
		if (this.snapshotBridge) {
			return this.snapshotBridge.getLoadOperatingSystemsInfo((response: any) => { })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				this.logger.error('[getLoadOperatingSystemsInfo] ' + error);
			});
		}
		return undefined;
	}
}
