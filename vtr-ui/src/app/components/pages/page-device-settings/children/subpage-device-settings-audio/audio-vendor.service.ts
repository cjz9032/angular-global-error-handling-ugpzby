import { Injectable } from '@angular/core';

@Injectable()
export abstract class AudioVendorService {
	abstract isVendorSupported: boolean;

	abstract isPanelInstalled(): Promise<boolean>;

	abstract launchPanel();

	abstract launchDownloadLink();
}
