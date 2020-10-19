import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { MetricsTranslateService } from 'src/app/services/mertics-traslate/metrics-translate.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { SPHeaderImageType } from 'src/app/enums/smart-performance.enum';

@Component({
	selector: 'vtr-subpage-smart-performance-dashboard',
	templateUrl: './subpage-smart-performance-dashboard.component.html',
	styleUrls: ['./subpage-smart-performance-dashboard.component.scss']
})
export class SubpageSmartPerformanceDashboardComponent implements OnInit, OnDestroy {

	@Output() scanEmitter = new EventEmitter();

	private subscription: Subscription;

	public isOnline = true;

	SPHeaderImageType = SPHeaderImageType;

	constructor(
		private commonService: CommonService,
		public smartPerformanceService: SmartPerformanceService,
		public shellServices: VantageShellService,
		public metricsTranslateService: MetricsTranslateService,
		public metricsService: MetricService,
	) {
	}

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;
		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	scanNow() {
		this.scanEmitter.emit();
	}

}
