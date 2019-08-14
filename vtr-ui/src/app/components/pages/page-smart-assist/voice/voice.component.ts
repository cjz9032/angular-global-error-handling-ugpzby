import { Component, OnInit } from '@angular/core';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { TranslateService } from '@ngx-translate/core';
import { DownloadFailedModalComponent } from './download-failed-modal/download-failed-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

enum InstalledStatus {
	DONE = "InstallDone",
	FAILED = "InstallFailed",
	CANCELED = "InstallCanceled"
}

@Component({
	selector: 'vtr-voice',
	templateUrl: './voice.component.html',
	styleUrls: ['./voice.component.scss']
})
export class VoiceComponent implements OnInit {
	voiceToText: any = 'voiceToText';
	translation: any = 'translation';
	showLoader = false;
	btnText = "";
	installedStatus = InstalledStatus.CANCELED;
	voiceStatus = "";
	constructor(
		private smartAssist: SmartAssistService,
		private translate: TranslateService,
		private modalService: NgbModal) { }

	ngOnInit() {
		this.btnText = this.translate.instant('device.smartAssist.voice.installBtnText');
		this.voiceStatus="Install";
		this.isLenovoVoiceInstalled();
	}

	btnClicked() {
		if (this.installedStatus == InstalledStatus.DONE) {
			this.launchLenovoVoice();
		} else {
			this.downloadLenovoVoice()
		}
	}

	isLenovoVoiceInstalled() {
		console.log('isLenovoVoiceInstalled');
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.isLenovoVoiceInstalled()
					.then((status: boolean) => {
						console.log('isLenovoVoiceInstalled.then', status);
						if (status) {
							this.installedStatus = InstalledStatus.DONE;
							this.btnText = this.translate.instant('device.smartAssist.voice.launchBtnText');
							this.voiceStatus = "Launch";
						} else {
							this.installedStatus == InstalledStatus.CANCELED;
							this.btnText = this.translate.instant('device.smartAssist.voice.installBtnText');
							this.voiceStatus = "Install";
						}
					}).catch(error => {
						console.error('isLenovoVoiceInstalled', error);
					});
			}
		} catch (error) {
			console.error('isLenovoVoiceInstalled' + error.message);
		}
	}

	downloadLenovoVoice() {
		console.log('downloadLenovoVoice');
		this.showLoader = true;
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.downloadLenovoVoice()
					.then((status: string) => {
						console.log('downloadLenovoVoice.then', status);
						this.showLoader = false;
						if (status == InstalledStatus.DONE) {
							this.installedStatus = InstalledStatus.DONE;
							this.btnText = this.translate.instant('device.smartAssist.voice.launchBtnText');
							this.voiceStatus = "Launch";
						} else if (status == InstalledStatus.FAILED) {
							this.installedStatus = InstalledStatus.FAILED;
							this.onDownloadFailedModal();
						} else {
							this.installedStatus = InstalledStatus.FAILED;
						}
					}).catch(error => {
						this.showLoader = false;
						console.error('downloadLenovoVoice', error);
					});
			}
		} catch (error) {
			this.showLoader = false;
			console.error('downloadLenovoVoice' + error.message);
		}
	}

	launchLenovoVoice() {
		console.log('launchLenovoVoice');
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.launchLenovoVoice()
					.then((status: boolean) => {
						console.log('launchLenovoVoice.then', status);
					}).catch(error => {
						console.error('launchLenovoVoice', error);
					});
			}
		} catch (error) {
			console.error('launchLenovoVoice' + error.message);
		}
	}

	onDownloadFailedModal() {
		this.modalService.open(DownloadFailedModalComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			windowClass: 'voice-install-failed-modal'
		});
	}
}
