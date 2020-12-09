import { Component, OnDestroy, OnInit } from '@angular/core';
import { WinRT } from '@lenovo/tan-client-bridge';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import VoiceInterface from './voice.interface';

const installedStatus = {
	done: 'InstallDone',
	failed: 'InstallFailed',
	canceled: 'InstallCanceled',
};

@Component({
	selector: 'vtr-voice',
	templateUrl: './voice.component.html',
	styleUrls: ['./voice.component.scss'],
})
export class VoiceComponent implements OnInit, OnDestroy {
	public voiceToText = 'voiceToText';
	public translation = 'translation';
	public showLoader = false;
	public btnText = '';
	public installedStatus = installedStatus.canceled;
	public voiceStatus = '';

	private isInstalledInterval: any;
	private voiceOnlineConfig: VoiceInterface;

	constructor(
		private translate: TranslateService,
		private logger: LoggerService
	) { }

	ngOnInit() {
		this.btnText = this.translate.instant('device.smartAssist.voice.installBtnText');
		this.voiceStatus = 'Install';
		this.loadOnlineConfig();
	}

	ngOnDestroy() {
		clearInterval(this.isInstalledInterval);
	}

	handleClickVoiceButton() {
		if (this.installedStatus === installedStatus.done) {
			this.launchLenovoVoice();
		} else {
			this.downloadLenovoVoice();
		}
	}

	private async loadOnlineConfig(): Promise<any>  {
		const win: any = window;
		win.VantageShellExtension.OnlineConfig.getAll()
			.then(data => {
				this.voiceOnlineConfig = data;
				this.isLenovoVoiceInstalled();
			});
	}

	private async isLenovoVoiceInstalled(): Promise<any> {
		try {
			const win: any = window;
			if (
				win.VantageShellExtension &&
				win.VantageShellExtension.Utils &&
				win.VantageShellExtension.Utils.MSStore
			) {
				const status = await win.VantageShellExtension.Utils.MSStore.isAppInstalledAsync(this.voiceOnlineConfig.LenovoVoiceFamilyName);
				if (status) {
					this.installedStatus = installedStatus.done;
					this.btnText = this.translate.instant('device.smartAssist.voice.launchBtnText');
					this.voiceStatus = 'Launch';
					this.showLoader = false;
					clearInterval(this.isInstalledInterval);
				} else {
					this.installedStatus = installedStatus.canceled;
					this.btnText = this.translate.instant(
						'device.smartAssist.voice.installBtnText'
					);
					this.voiceStatus = 'Install';
				}
			}
		} catch (error) {
			this.logger.error('isLenovoVoiceInstalled' + error.message);
		}
	}

	private downloadLenovoVoice() {
		this.showLoader = true;
		try {
			WinRT.launchUri(this.voiceOnlineConfig.LenovoVoiceDownLoadLink);
			this.isInstalledInterval = setInterval(async () => {
				this.logger.debug('Trying after 30 seconds for getting isLenovoVoiceInstalled status');
				this.isLenovoVoiceInstalled();
			}, 30000);
		} catch (error) {
			this.showLoader = false;
			this.logger.error('downloadLenovoVoice' + error.message);
		}
	}

	private launchLenovoVoice() {
		try {
			WinRT.launchUri(this.voiceOnlineConfig.LenovoVoiceLaunchURI);
		} catch (error) {
			this.logger.error('launchLenovoVoice' + error.message);
		}
	}
}
