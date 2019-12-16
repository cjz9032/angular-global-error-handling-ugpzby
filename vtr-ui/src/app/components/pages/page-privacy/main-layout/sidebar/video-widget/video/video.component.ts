import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'vtr-video',
	templateUrl: './video.component.html',
	styleUrls: ['./video.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent {
	isShowSpinner = true;

	hideSpinner() {
		this.isShowSpinner = false;
	}
}
