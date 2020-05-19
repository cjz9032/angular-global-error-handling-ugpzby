import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { TranslateService } from '@ngx-translate/core';
import { DownloadFailedModalComponent } from './download-failed-modal/download-failed-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { WinRT } from '@lenovo/tan-client-bridge';

enum InstalledStatus {
	DONE = 'InstallDone',
	FAILED = 'InstallFailed',
	CANCELED = 'InstallCanceled'
}

@Component({
	selector: 'vtr-voice',
	templateUrl: './voice.component.html',
	styleUrls: ['./voice.component.scss']
})
export class VoiceComponent implements OnInit, OnDestroy {
	private isInstalledInterval: any;
	voiceToText: any = 'voiceToText';
	translation: any = 'translation';
	showLoader = false;
	btnText = '';
	installedStatus = InstalledStatus.CANCELED;
	voiceStatus = '';
	constructor(
		private smartAssist: SmartAssistService,
		private translate: TranslateService,
		private logger: LoggerService,
		private modalService: NgbModal) { }

	ngOnInit() {
		this.btnText = this.translate.instant('device.smartAssist.voice.installBtnText');
		this.voiceStatus = 'Install';
		this.isLenovoVoiceInstalled();
	}

	btnClicked() {
		if (this.installedStatus === InstalledStatus.DONE) {
			this.launchLenovoVoice();
		} else {
			this.downloadLenovoVoice();
		}
	}

	async isLenovoVoiceInstalled() {
        try {
			const win: any = window;
			if (win.VantageShellExtension
				&& win.VantageShellExtension.Utils
				&& win.VantageShellExtension.Utils.MSStore) {
					const status = await win.VantageShellExtension.Utils.MSStore.isAppInstalledAsync('E046963F.LenovoVoice_k1h2ywk1493x8');
					if (status) {
						this.installedStatus = InstalledStatus.DONE;
						this.btnText = this.translate.instant('device.smartAssist.voice.launchBtnText');
						this.voiceStatus = 'Launch';
						this.showLoader = false;
						clearInterval(this.isInstalledInterval);
					} else {
						this.installedStatus = InstalledStatus.CANCELED;
						this.btnText = this.translate.instant('device.smartAssist.voice.installBtnText');
						this.voiceStatus = 'Install';
					}
			}
			// if (this.smartAssist.isShellAvailable) {
			// 	this.smartAssist.isLenovoVoiceInstalled()
			// 		.then((status: boolean) => {
            //         if (status) {
            //             this.installedStatus = InstalledStatus.DONE;
            //             this.btnText = this.translate.instant('device.smartAssist.voice.launchBtnText');
            //             this.voiceStatus = 'Launch';
            //         } else {
            //             this.installedStatus = InstalledStatus.CANCELED;
            //             this.btnText = this.translate.instant('device.smartAssist.voice.installBtnText');
            //             this.voiceStatus = 'Install';
            //         }
            //     }).catch(error => {
			// 			this.logger.error('isLenovoVoiceInstalled', error.message);
			// 			return EMPTY;
			// 		});
			// }
		} catch (error) {
			this.logger.error('isLenovoVoiceInstalled' + error.message);
			return EMPTY;
		}
    }

	downloadLenovoVoice() {
        this.showLoader = true;
        try {
			WinRT.launchUri('ms-windows-store://pdp/?productid=9NF8GNW9H43H');
			this.isInstalledInterval = setInterval(async () => {
				this.logger.debug('Trying after 30 seconds for getting isLenovoVoiceInstalled status');
				this.isLenovoVoiceInstalled();
			}, 30000);
			// if (this.smartAssist.isShellAvailable) {
			// 	this.smartAssist.downloadLenovoVoice()
			// 		.then((status: string) => {
            //         this.showLoader = false;
            //         if (status === InstalledStatus.DONE) {
            //             this.installedStatus = InstalledStatus.DONE;
            //             this.btnText = this.translate.instant('device.smartAssist.voice.launchBtnText');
            //             this.voiceStatus = 'Launch';
            //         } else if (status === InstalledStatus.FAILED) {
            //             this.installedStatus = InstalledStatus.FAILED;
            //             this.onDownloadFailedModal();
            //         } else {
            //             this.installedStatus = InstalledStatus.FAILED;
            //         }
            //     }).catch(error => {
			// 			this.showLoader = false;
			// 			this.logger.error('downloadLenovoVoice', error.message);
			// 			return EMPTY;
			// 		});
			// }
		} catch (error) {
			this.showLoader = false;
			this.logger.error('downloadLenovoVoice' + error.message);
			return EMPTY;
		}
    }

	launchLenovoVoice() {
        try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.launchLenovoVoice()
					.then((status: boolean) => {}).catch(error => {
						this.logger.error('launchLenovoVoice', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('launchLenovoVoice' + error.message);
			return EMPTY;
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

	ngOnDestroy() {
		clearInterval(this.isInstalledInterval);
	}
}
