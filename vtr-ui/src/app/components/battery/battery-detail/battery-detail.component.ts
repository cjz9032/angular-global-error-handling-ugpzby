import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef, ViewRef } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { BatteryChargeStatus } from 'src/app/enums/battery-charge-status.enum';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { BatteryInformation } from 'src/app/enums/battery-information.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
@Component({
	selector: 'vtr-battery-detail',
	templateUrl: './battery-detail.component.html',
	styleUrls: ['./battery-detail.component.scss'],
})
export class BatteryDetailComponent implements OnInit, OnDestroy {
	public dataSource: BatteryDetail[];
	@Input() dataInfo: BatteryDetail[];
	@Input() dataIndicator: BatteryIndicator; // BI Update
	@Input() dataConditions: BatteryConditionModel[];

	remainingTimeText: string;
	batteryIndicator = new BatteryIndicator();
	private notificationSubscription: Subscription;
	public deviceChemistry = [];
	batteryConditions: BatteryConditionModel[];
	batteryChargeStatus = BatteryChargeStatus;

	remainingHours: number[] = [];
	remainingMinutes: number[] = [];

	hourText: string;
	minutesText: string;

	constructor(
		public shellServices: VantageShellService,
		public commonService: CommonService,
		public cd: ChangeDetectorRef,
		public translate: TranslateService) {
	}

	onNotification(notification: AppNotification) {
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
		if (response) {
			if (response.detail) {
				this.remainingHours = [];
				this.remainingMinutes = [];
				for (let i = 0; i < response.detail.length; i++) {
					if (response.detail[i] && response.detail[i] !== null) {
						response.detail[i].remainingCapacity = Math.round(response.detail[i].remainingCapacity * 100) / 100;
						response.detail[i].fullChargeCapacity = Math.round(response.detail[i].fullChargeCapacity * 100) / 100;
						response.detail[i].voltage = Math.round(response.detail[i].voltage * 100) / 100;
						response.detail[i].wattage = Math.round(response.detail[i].wattage * 100) / 100;
						response.detail[i].heading = response.detail.length > 1 ? headings[i] : '';
						const id = response.detail[i].chargeStatus;

						response.detail[i].chargeStatusString = this.batteryChargeStatus.getBatteryChargeStatus(id);

						if (response.detail[i].chargeStatus === this.batteryChargeStatus.NO_ACTIVITY.id
							|| response.detail[i].chargeStatus === this.batteryChargeStatus.ERROR.id
							|| response.detail[i].chargeStatus === this.batteryChargeStatus.NOT_INSTALLED.id) {
							/// if chargeStatus is 'No activity' | 'Error' | 'Not installed'
							// remaining time will not be displayed
							response.detail[i].remainingTime = undefined;
						} else {
							const totalMin = response.detail[i].remainingTime;
							this.remainingHours.push(Math.trunc(totalMin / 60));
							this.remainingMinutes.push(Math.trunc(totalMin % 60));

							this.hourText = this.remainingHours[i] > 0 && this.remainingHours[i] < 2 ?
								'device.deviceSettings.batteryGauge.hour' :
								'device.deviceSettings.batteryGauge.hours';

							this.minutesText = this.remainingMinutes[i] > 0 && this.remainingMinutes[i] < 2 ?
								'device.deviceSettings.batteryGauge.minute' :
								'device.deviceSettings.batteryGauge.minutes';
						}
						if (response.indicator.timeText === 'timeCompletion') {
							response.detail[i].remainingTimeText = 'device.deviceSettings.batteryGauge.details.chargeCompletionTime';
						} else {
							response.detail[i].remainingTimeText = 'device.deviceSettings.batteryGauge.details.remainingTime';
						}
						const chemistry: string = response.detail[i].deviceChemistry;
						if (chemistry === null || chemistry === undefined || chemistry === '') {
							this.deviceChemistry[i] = chemistry;
						} else {
							this.deviceChemistry[i] =
								'device.deviceSettings.batteryGauge.details.deviceChemistry.' + chemistry.toLowerCase();
						}
					}
				}
			}
			this.dataSource = response.detail;
			this.batteryIndicator = response.indicator;
			this.batteryConditions = response.conditions;
		}

		if (this.cd &&
			this.cd !== null &&
			!(this.cd as ViewRef).destroyed) {
			this.cd.detectChanges();
		}
	}

	ngOnInit() {
		console.log('In ngOnInit');
		this.dataSource = this.dataInfo;
		this.batteryIndicator = this.dataIndicator;
		this.batteryConditions = this.dataConditions;

		this.preProcessBatteryDetailResponse({ detail: this.dataSource, indicator: this.dataIndicator, conditions: this.dataConditions });
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	isValid(val: any) {
		if (!val || val === null) {
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
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}
}
