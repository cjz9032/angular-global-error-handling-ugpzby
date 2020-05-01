import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { MetricService } from 'src/app/services/metric/metric.service';

@Component({
	selector: 'vtr-intelligent-media',
	templateUrl: './intelligent-media.component.html',
	styleUrls: ['./intelligent-media.component.scss']
})
export class IntelligentMediaComponent implements OnInit {
	@Input() isChecked = false;
	@Input() isLoading = true;
	@Input() intelligentMediaAvailable = false;
	@Output() videoPlaybackToggle: EventEmitter<any> = new EventEmitter();

	@Input() isSRChecked = false;
	@Input() isSRLoading = true;
	@Input() superResolutionAvailable = false;
	@Output() superResolutionToggle: EventEmitter<any> = new EventEmitter();
	public image = '/assets/images/smart-assist/intelligent-media/VideoResolutionUpscaling.png';

	constructor(
		private smartAssist: SmartAssistService,
		private logger: LoggerService,
		private metrics: MetricService
	) { }

	ngOnInit() {
	}

	public setVideoPauseResumeStatus(event) {
		this.videoPlaybackToggle.emit(event.switchValue);
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.setVideoPauseResumeStatus(event.switchValue)
					.then((value: boolean) => { }).catch(error => {
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
				this.smartAssist.setSuperResolutionStatus(event.switchValue)
					.then((value: boolean) => {
						this.logger.info('setSuperResolutionStatus', value);
					}).catch(error => {
						this.logger.error('setSuperResolutionStatus' + error.message);
					});
			}
		} catch (error) { }
	}
}
