import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { BatteryChargeStatus } from 'src/app/enums/battery-charge-status.enum';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { BatteryInformation } from 'src/app/enums/battery-information.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { ViewRef } from '@angular/core';
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
	remainingTimeText: string;
	batteryIndicators = new BatteryIndicator();
	private notificationSubscription: Subscription;
	public deviceChemistry = [];
	batteryChargeStatus = BatteryChargeStatus;

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
			'device.deviceSettings.batteryGauge.details.primary',
			'device.deviceSettings.batteryGauge.details.secondary',
			'device.deviceSettings.batteryGauge.details.tertiary'];
		if (response !== null && response !== undefined) {
			if (response.gauge !== undefined && response.gauge !== null) {
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
				if (response.gauge.isExpressCharging === undefined ||
					response.gauge.isExpressCharging === null) {
					this.batteryIndicators.expressCharging = false;
				} else {
					this.batteryIndicators.expressCharging = response.gauge.isExpressCharging;
				}
			}

			if (response.detail.length > 0 && response.detail[0].batteryHealth !== null &&
				response.detail[0].batteryHealth !== undefined) {
				this.batteryIndicators.batteryNotDetected = response.detail[0].batteryHealth === 4;
			} else {
				this.batteryIndicators.batteryNotDetected = false;
			}

			for (let i = 0; i < response.detail.length; i++) {
				if (response.detail[i] !== undefined && response.detail[i] !== null) {
					response.detail[i].remainingCapacity = Math.round(response.detail[i].remainingCapacity * 100) / 100;
					response.detail[i].fullChargeCapacity = Math.round(response.detail[i].fullChargeCapacity * 100) / 100;
					response.detail[i].voltage = Math.round(response.detail[i].voltage * 100) / 100;
					response.detail[i].wattage = Math.round(response.detail[i].wattage * 100) / 100;
					response.detail[i].heading = response.detail.length > 1 ? headings[i] : '';
					const id = response.detail[i].chargeStatus;
					response.detail[i].chargeStatusString = this.translate.instant(this.batteryChargeStatus.getBatteryChargeStatus(id));
					if (response.detail[i].chargeStatus === this.batteryChargeStatus.NO_ACTIVITY.id
						|| response.detail[i].chargeStatus === this.batteryChargeStatus.ERROR.id
						|| response.detail[i].chargeStatus === this.batteryChargeStatus.NOT_INSTALLED.id) {
						/// if chargeStatus is 'No activity' | 'Error' | 'Not installed'
						// remaining time will not be displayed
						response.detail[i].remainingTime = undefined;
					}
					// response[i].chargeStatus == this.batteryChargeStatus.CHARGING.id;
					if (response.gauge.timeType === 'timeCompletion') {
						response.detail[i].remainingTimeText = 'device.deviceSettings.batteryGauge.details.chargeCompletionTime';
					} else {
						response.detail[i].remainingTimeText = 'device.deviceSettings.batteryGauge.details.remainingTime';
					}
					const chemistry: string = response.detail[i].deviceChemistry;
					this.deviceChemistry[i] = this.translate.instant(
						'device.deviceSettings.batteryGauge.details.deviceChemistry.' + chemistry.toLowerCase());
				}
			}
		}
		this.dataSource = response.detail;
		this.dataSourceGauge = response.gauge;
		if (this.cd !== null &&
			this.cd !== undefined &&
			!(this.cd as ViewRef).destroyed) {
			this.cd.detectChanges();
		}
	}

	ngOnInit() {
		console.log('In ngOnInit');
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
