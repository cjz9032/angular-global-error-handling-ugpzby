import { Component, OnInit } from '@angular/core';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { TranslateService } from '@ngx-translate/core';
import { DownloadFailedModalComponent } from './download-failed-modal/download-failed-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';

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
export class VoiceComponent implements OnInit {
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

	isLenovoVoiceInstalled() {
        try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.isLenovoVoiceInstalled()
					.then((status: boolean) => {
                    if (status) {
                        this.installedStatus = InstalledStatus.DONE;
                        this.btnText = this.translate.instant('device.smartAssist.voice.launchBtnText');
                        this.voiceStatus = 'Launch';
                    } else {
                        this.installedStatus = InstalledStatus.CANCELED;
                        this.btnText = this.translate.instant('device.smartAssist.voice.installBtnText');
                        this.voiceStatus = 'Install';
                    }
                }).catch(error => {
						this.logger.error('isLenovoVoiceInstalled', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('isLenovoVoiceInstalled' + error.message);
			return EMPTY;
		}
    }

	downloadLenovoVoice() {
        this.showLoader = true;
        try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.downloadLenovoVoice()
					.then((status: string) => {
                    this.showLoader = false;
                    if (status === InstalledStatus.DONE) {
                        this.installedStatus = InstalledStatus.DONE;
                        this.btnText = this.translate.instant('device.smartAssist.voice.launchBtnText');
                        this.voiceStatus = 'Launch';
                    } else if (status === InstalledStatus.FAILED) {
                        this.installedStatus = InstalledStatus.FAILED;
                        this.onDownloadFailedModal();
                    } else {
                        this.installedStatus = InstalledStatus.FAILED;
                    }
                }).catch(error => {
						this.showLoader = false;
						this.logger.error('downloadLenovoVoice', error.message);
						return EMPTY;
					});
			}
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
}
