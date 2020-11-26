import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class AndroidService {
	public android = (<any>window).Android;
	isAndroid = false;

	constructor() {
		let version = this.getAndroidVersion();
		if (version.length > 0) {
			this.isAndroid = true;
		}
	}

	private showToast(message: string) {
		this.android.showToast(message);
	}

	public getAndroidDeviceLanguage(): string {
		if (this.android != null || this.android != undefined) {
			return this.android.getDeviceLanguage();
		}
		return '';
	}

	public getAndroidVersion(): string {
		//this.showToast(this.android.getVersion());
		if (this.android != null || this.android != undefined) {
			return this.android.getVersion();
		}
		return '';
	}
}
