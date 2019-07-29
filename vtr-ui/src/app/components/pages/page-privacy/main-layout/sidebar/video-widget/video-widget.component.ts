import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../../../../services/common/common.service';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';
import { filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';

@Component({
	selector: 'vtr-video-widget',
	templateUrl: './video-widget.component.html',
	styleUrls: ['./video-widget.component.scss']
})
export class VideoWidgetComponent implements OnInit, OnDestroy {
	videoPopupId = 'videoPopupId';
	@Input() margin: 'top' | 'bottom' = 'top';
	@Output() videoWatched$ = new EventEmitter<boolean>();

	constructor(
		private commonService: CommonService,
		private commonPopupService: CommonPopupService,
	) {
	}

	ngOnInit() {
		this.commonPopupService.getOpenState(this.videoPopupId)
			.pipe(
				takeUntil(instanceDestroyed(this)),
				filter((state) => !state.isOpenState)
			)
			.subscribe(() => {
				this.videoWatched$.emit(true);
			});
	}

	ngOnDestroy() {
	}

	openVideo() {
		if (!this.commonService.isOnline) {
			return;
		}

		this.commonPopupService.open(this.videoPopupId);
	}
}
