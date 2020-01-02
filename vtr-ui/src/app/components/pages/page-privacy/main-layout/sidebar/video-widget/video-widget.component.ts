import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../../../../../services/common/common.service';
import { CommonPopupService } from '../../../core/services/popups/common-popup.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { NetworkStatus } from '../../../../../../enums/network-status.enum';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';

export const VIDEO_POPUP_ID = 'videoPopupId';

@Component({
	selector: 'vtr-video-widget',
	templateUrl: './video-widget.component.html',
	styleUrls: ['./video-widget.component.scss'],
})
export class VideoWidgetComponent implements OnInit, OnDestroy {
	videoPopupId = VIDEO_POPUP_ID;
	isOnline = this.commonService.isOnline;

	@Input() margin: 'top' | 'bottom' = 'top';

	constructor(
		private commonService: CommonService,
		private commonPopupService: CommonPopupService,
	) {
	}

	ngOnInit() {
		this.checkOnline();
	}

	ngOnDestroy() {
	}

	openVideo() {
		if (!this.isOnline) {
			return;
		}

		this.commonPopupService.open(this.videoPopupId);
	}

	private checkOnline() {
		this.commonService.notification.pipe(
			filter((notification) => notification.type === NetworkStatus.Online || notification.type === NetworkStatus.Offline),
			map((notification) => notification.payload),
			takeUntil(instanceDestroyed(this))
		).subscribe((payload) => {
			this.isOnline = payload.isOnline;
		});
	}
}
