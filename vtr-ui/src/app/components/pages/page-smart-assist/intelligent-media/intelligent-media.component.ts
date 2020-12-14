import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EMPTY } from 'rxjs';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { WindowsVersionService } from 'src/app/services/windows-version/windows-version.service';

@Component({
	selector: 'vtr-intelligent-media',
	templateUrl: './intelligent-media.component.html',
	styleUrls: ['./intelligent-media.component.scss'],
})
export class IntelligentMediaComponent implements OnInit {
	@Input() isChecked = false;
	@Input() isLoading = true;
	@Input() intelligentMediaAvailable = false;
	@Output() videoPlaybackToggle: EventEmitter<any> = new EventEmitter();

	@Input() isSRChecked = false;
	@Input() isSRLoading = true;
	@Input() superResolutionAvailable = false;
	@Input() superResolutionTip: string;
	@Output() superResolutionToggle: EventEmitter<any> = new EventEmitter();
	public image = this.windowsVerisonService.isNewerThanRS4()
		? '/assets/images/hardware-settings/smart-assist/intelligent-media/VideoResolutionUpscaling.webp'
		: '/assets/images/hardware-settings/smart-assist/intelligent-media/VideoResolutionUpscaling.png';

	@Input() videoPlaybackSupportHSA = false;

	constructor(
		private smartAssist: SmartAssistService,
		private logger: LoggerService,
		private windowsVerisonService: WindowsVersionService
	) {}

	ngOnInit() {}

	public setVideoPauseResumeStatus(event) {
		this.videoPlaybackToggle.emit(event.switchValue);
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist
					.setVideoPauseResumeStatus(event.switchValue)
					.then((value: boolean) => {})
					.catch((error) => {
						this.logger.error('setVideoPauseResumeStatus', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setVideoPauseResumeStatus' + error.message);
			return EMPTY;
		}
	}

	public setSuperResolutionStatus(event) {
		this.superResolutionToggle.emit(event.switchValue);
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist
					.setSuperResolutionStatus(event.switchValue)
					.then((value: boolean) => {
						this.logger.info('setSuperResolutionStatus', value);
					})
					.catch((error) => {
						this.logger.error('setSuperResolutionStatus' + error.message);
					});
			}
		} catch (error) {}
	}
}
