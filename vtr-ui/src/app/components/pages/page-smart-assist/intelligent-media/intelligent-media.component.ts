import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';

@Component({
	selector: 'vtr-intelligent-media',
	templateUrl: './intelligent-media.component.html',
	styleUrls: ['./intelligent-media.component.scss']
})
export class IntelligentMediaComponent implements OnInit {
	@Input() isChecked = false;
	@Input() isLoading = true;
	@Output() videoPlaybackToggle: EventEmitter<any> = new EventEmitter();

	constructor(private smartAssist: SmartAssistService) { }

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
						console.error('setVideoPauseResumeStatus', error);
					});
			}
		} catch (error) {
			console.error('setVideoPauseResumeStatus' + error.message);
		}
	}
}
