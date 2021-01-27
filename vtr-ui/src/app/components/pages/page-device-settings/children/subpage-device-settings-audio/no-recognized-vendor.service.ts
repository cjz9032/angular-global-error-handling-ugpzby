import { Injectable } from '@angular/core';
import { AudioVendorService } from './audio-vendor.service';

@Injectable()
export class NoRecognizedVendorService extends AudioVendorService {
	isVendorSupported = false;

	constructor() {
		super();
	}

	// should never call this function, if called in, something went wrong.
	isPanelInstalled(): Promise<boolean> {
		return Promise.resolve(false);
	}

	launchDownloadLink() {
		return false;
	}

	launchPanel() {
		return false;
	}
}
