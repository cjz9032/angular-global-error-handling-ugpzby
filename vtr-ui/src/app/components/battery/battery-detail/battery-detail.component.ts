import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryDetailMockService } from 'src/app/services/battery-detail/battery-detail.mock.service';
import { BaseBatteryDetail } from 'src/app/services/battery-detail/base-battery-detail';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { BatteryChargeStatus } from 'src/app/enums/battery-charge-status.enum';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { BatteryInformation } from 'src/app/enums/battery-information.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { ViewRef_ } from '@angular/core/src/view';
import { TranslateService } from '@ngx-translate/core';
import BatteryGaugeDetail from 'src/app/data-models/battery/battery-gauge-detail-model';
@Component({
	selector: 'vtr-battery-detail',
	templateUrl: './battery-detail.component.html',
	styleUrls: ['./battery-detail.component.scss'],
})
export class BatteryDetailComponent implements OnInit, OnDestroy {
	public dataSource: BatteryDetail[];
	public dataSourceGauge: BatteryGaugeDetail; // BI Update
	@Input() data: BatteryDetail[];
	@Input() dataGauge: BatteryGaugeDetail; // BI Update
	@Input() batteryConditionStatus: string;
	remainingTimeText = '';
	chargeCompletionTimeText = '';
	batteryIndicators = new BatteryIndicator();
	private notificationSubscription: Subscription;
	public deviceChemistry = [];
	constructor(
		private batteryService: BatteryDetailService,
		public shellServices: VantageShellService,
		public commonService: CommonService,
		public cd: ChangeDetectorRef,
		public translate: TranslateService) {
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case BatteryInformation.BatteryInfo:
					console.log('Received battery info notification: ', notification.payload);
					this.preProcessBatteryDetailResponse(notification.payload);
					break;
				default:
					break;
			}
		}
	}

	preProcessBatteryDetailResponse(response: any) {
		const headings = [
			this.translate.instant('device.deviceSettings.batteryGauge.details.primary'),
			this.translate.instant('device.deviceSettings.batteryGauge.details.secondary'),
			this.translate.instant('device.deviceSettings.batteryGauge.details.tertiary')];
		this.batteryIndicators.percent = response.gauge.percentage;
		this.batteryIndicators.charging = response.gauge.isAttached;
		this.batteryIndicators.expressCharging = response.gauge.isExpressCharging;
		this.batteryIndicators.convertMin(response.gauge.time);

		this.batteryIndicators.timeText = response.gauge.timeType;

		// this.batteryIndicators.voltageError = response.detail[0].isVoltageError;

		// let batteryIndex = -1;
		// let batteryHealth = 0;
		// if (response.detail !== undefined && response.detail.length !== 0) {
		// 	response.detail.forEach((info) => {
		// 		if (info.batteryHealth >= batteryHealth) {
		// 			batteryHealth = info.batteryHealth;
		// 			batteryIndex += 1;
		// 		}
		// 	});
		// }

		if (response.batteryGauge.isExpressCharging === undefined ||
			response.batteryGauge.isExpressCharging === null) {
			this.batteryIndicators.expressCharging = false;
		} else {
			this.batteryIndicators.expressCharging = response.batteryGauge.isExpressCharging;
		}

		if (response.detail.length > 0 && response.detail[0].batteryHealth !== null &&
			response.detail[0].batteryHealth !== undefined) {
			this.batteryIndicators.batteryNotDetected = response.detail[0].batteryHealth === 4;
		} else {
			this.batteryIndicators.batteryNotDetected = false;
		}

		for (let i = 0; i < response.detail.length; i++) {
			response.detail[i].remainingCapacity = Math.round(response.detail[i].remainingCapacity * 100) / 100;
			response.detail[i].fullChargeCapacity = Math.round(response.detail[i].fullChargeCapacity * 100) / 100;
			response.detail[i].voltage = Math.round(response.detail[i].voltage * 100) / 100;
			response.detail[i].wattage = Math.round(response.detail[i].wattage * 100) / 100;
			response.detail[i].heading = response.detail.length > 1 ? headings[i] : '';
			const id = response.detail[i].chargeStatus;
			response.detail[i].chargeStatusString = this.translate.instant(BatteryChargeStatus.getBatteryChargeStatus(id));
			if (response.detail[i].chargeStatus === BatteryChargeStatus.NO_ACTIVITY.id
				|| response.detail[i].chargeStatus === BatteryChargeStatus.ERROR.id
				|| response.detail[i].chargeStatus === BatteryChargeStatus.NOT_INSTALLED.id) {
				/// if chargeStatus is 'No activity' | 'Error' | 'Not installed'
				// remaining time will not be displayed
				response.detail[i].remainingTime = undefined;
			}
			// response[i].chargeStatus == BatteryChargeStatus.CHARGING.id
			if (response.gauge.timeType === 'timeCompletion') {
				response.detail[i].remainingTimeText = this.chargeCompletionTimeText;
			} else {
				response.detail[i].remainingTimeText = this.remainingTimeText;
			}
			const chemistry: string = response.detail[i].deviceChemistry;
			this.deviceChemistry[i] = this.translate.instant('device.deviceSettings.batteryGauge.details.deviceChemistry.' + chemistry.toLowerCase());
		}
		this.dataSource = response.detail;
		this.dataSourceGauge = response.gauge;
		if (this.cd !== null &&
			this.cd !== undefined &&
			!(this.cd as ViewRef_).destroyed) {
			this.cd.detectChanges();
		}
	}

	ngOnInit() {
		console.log('In ngOnInit');
		this.remainingTimeText = this.translate.instant('device.deviceSettings.batteryGauge.details.remainingTime');
		this.chargeCompletionTimeText = this.translate.instant('device.deviceSettings.batteryGauge.details.chargeCompletionTime');
		this.dataSource = this.data;
		this.dataSourceGauge = this.dataGauge;
		this.preProcessBatteryDetailResponse({ detail: this.dataSource, gauge: this.dataSourceGauge });
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	isValid(val: any) {
		if (val === undefined || val === null) {
			return false;
		}
		if (typeof val === 'number' && val === 0) {
			return false;
		}
		if (typeof val === 'string' && val === '') {
			return false;
		}
		return true;
	}


	ngOnDestroy() {
		// clearTimeout(this.batteryTimer);
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}
}
