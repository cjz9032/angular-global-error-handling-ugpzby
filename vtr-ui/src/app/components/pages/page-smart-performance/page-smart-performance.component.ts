import {Component, OnDestroy, OnInit} from '@angular/core';
import {SystemEventService} from '../../../services/system-event/system-event.service';
import {CommonService} from '../../../services/common/common.service';
import {Subscription} from 'rxjs';

@Component({
	selector: 'vtr-page-smart-performance',
	templateUrl: './page-smart-performance.component.html',
	styleUrls: ['./page-smart-performance.component.scss']
})
export class PageSmartPerformanceComponent implements OnInit, OnDestroy {
	private notificationSub: Subscription;
	eventName = 'SmartPerformance.ScheduleEventStarted'
	isScanningStarted = 0;
	retryCount = 0;

	constructor(private systemEventService: SystemEventService,
				private commonService: CommonService) {
	}

	ngOnInit() {
		this.registerScanEvent();
	}

	async registerScanEvent() {
		const isRegistered = await this.systemEventService.registerCustomEvent(this.eventName);
		if (isRegistered) {
			this.notificationSub = this.commonService.notification.subscribe(notification => {
				if (notification && notification.type && notification.type.toString() === this.eventName) {
					this.isScanningStarted += 1;
				}
			})
		} else {
			await this.unregisterScanEvent();
			if (this.retryCount < 1) {
				this.registerScanEvent();
			}
			this.retryCount += 1;
		}
	}

	async unregisterScanEvent() {
		await this.systemEventService.unRegisterCustomEvent(this.eventName)
	}

	ngOnDestroy(): void {
		this.unregisterScanEvent();
		if (this.notificationSub) {
			this.notificationSub.unsubscribe();
		}
	}

}
