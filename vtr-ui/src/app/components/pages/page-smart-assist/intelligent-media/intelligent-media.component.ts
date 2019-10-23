import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';

@Component({
	selector: 'vtr-intelligent-media',
	templateUrl: './intelligent-media.component.html',
	styleUrls: ['./intelligent-media.component.scss']
})
export class IntelligentMediaComponent implements OnInit {
	@Input() isChecked = false;
	@Input() isLoading = true;
	@Input() intelligentMediaAvailable = true;
	@Output() videoPlaybackToggle: EventEmitter<any> = new EventEmitter();

	constructor(
		private smartAssist: SmartAssistService,
		private logger: LoggerService,
	) { }

	ngOnInit() {
	}

	public setVideoPauseResumeStatus(event) {
		this.videoPlaybackToggle.emit(event.value);
		console.log('setVideoPauseResumeStatus');
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.setVideoPauseResumeStatus(event.switchValue)
					.then((value: boolean) => {
						console.log('setVideoPauseResumeStatus.then', value);
					}).catch(error => {
						this.logger.error('setVideoPauseResumeStatus', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setVideoPauseResumeStatus' + error.message);
			return EMPTY;
		}
	}
}
