import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';

@Component({
	selector: 'vtr-intelligent-media',
	templateUrl: './intelligent-media.component.html',
	styleUrls: ['./intelligent-media.component.scss']
})
export class IntelligentMediaComponent implements OnInit {

	playbackStatus = new FeatureStatus(true, true);
	showPlaybackLoader = true;

	@Output() isMediaSettingHidden: EventEmitter<any> = new EventEmitter();

	constructor(private smartAssist: SmartAssistService) { }

	ngOnInit() {
		this.getVideoPauseResumeStatus();
	}

	getVideoPauseResumeStatus() {
		console.log('getVideoPauseResumeStatus');
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.getVideoPauseResumeStatus()
					.then((response: FeatureStatus) => {
						this.playbackStatus = response;
						this.showPlaybackLoader = false;
						this.playbackStatus.available = true;
						this.remoteMediaLink();
						console.log('getVideoPauseResumeStatus.then:', response);
					}).catch(error => {
						console.error('getVideoPauseResumeStatus.error', error);
					});
			}
		} catch (error) {
			console.error('getVideoPauseResumeStatus' + error.message);
		}
	}

	public setVideoPauseResumeStatus(event) {
		this.playbackStatus.status = event.switchValue;
		console.log('setVideoPauseResumeStatus');
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.setVideoPauseResumeStatus(event.switchValue)
					.then((value: boolean) => {
						console.log('setVideoPauseResumeStatus.then', value);
					}).catch(error => {
						console.error('setVideoPauseResumeStatus', error);
					});
			}
		} catch (error) {
			console.error('setVideoPauseResumeStatus' + error.message);
		}
	}

	remoteMediaLink() {
		if (!this.playbackStatus.available) {
			this.isMediaSettingHidden.emit(true);
		}
	}

}
