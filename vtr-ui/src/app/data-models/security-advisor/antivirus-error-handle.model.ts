import { Antivirus } from '@lenovo/tan-client-bridge';

export class AntivirusErrorHandle {
	constructor(private antivirus: Antivirus) {
	}

	refreshAntivirus() {
		const timeOut = 30000;
		if (this.antivirus.status) {
			if (this.antivirus.status === 'failed') {
				setTimeout(() => {
					this.antivirus.refresh().then(() => {
						this.refreshAntivirus();
					});
				}, timeOut);
			}
		} else {
			const errorData = !this.antivirus.mcafee && !this.antivirus.others && !this.antivirus.windowsDefender;
			let onlyWindowAV;
			if (this.antivirus.windowsDefender) {
				onlyWindowAV = !this.antivirus.mcafee && !this.antivirus.others && typeof this.antivirus.windowsDefender.firewallStatus !== 'boolean' && typeof this.antivirus.windowsDefender.status === 'boolean';
			}
			if (errorData || onlyWindowAV) {
				setTimeout(() => {
					this.antivirus.refresh().then(() => {
						this.refreshAntivirus();
					});
				}, timeOut);
			}
		}
	}

}
