import { Antivirus } from '@lenovo/tan-client-bridge';

export class AntivirusErrorHandle {
	constructor(private antivirus: Antivirus) {
	}

	refreshAntivirus() {
		const errorData = !this.antivirus.mcafee && !this.antivirus.others && !this.antivirus.windowsDefender;
		const timeOut = 30000;
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
