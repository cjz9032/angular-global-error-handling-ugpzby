import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonService } from '../../../../../../services/common/common.service';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';

export const VIDEO_POPUP_ID = 'videoPopupId';

@Component({
	selector: 'vtr-video-widget',
	templateUrl: './video-widget.component.html',
	styleUrls: ['./video-widget.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoWidgetComponent {
	videoPopupId = VIDEO_POPUP_ID;
	@Input() margin: 'top' | 'bottom' = 'top';

	constructor(
		private commonService: CommonService,
		private commonPopupService: CommonPopupService,
	) {
	}

	openVideo() {
		if (!this.commonService.isOnline) {
			return;
		}

		this.commonPopupService.open(this.videoPopupId);
	}
}
