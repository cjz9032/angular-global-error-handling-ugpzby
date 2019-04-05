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
@Component({
	selector: 'vtr-battery-detail',
	templateUrl: './battery-detail.component.html',
	styleUrls: ['./battery-detail.component.scss'],
})
export class BatteryDetailComponent implements OnInit, OnDestroy {
	public dataSource: BatteryDetail[];
	@Input() data: BatteryDetail[];
	remainingTimeText = "Remaining time";
	batteryIndicators = new BatteryIndicator();
	private notificationSubscription: Subscription;
	constructor(
		private batteryService: BatteryDetailService,
		public shellServices: VantageShellService,
		public commonService: CommonService,
		public cd: ChangeDetectorRef) {
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case BatteryInformation.BatteryInfo:
					console.log("Received battery info notification: ", notification.payload);
					this.preProcessBatteryDetailResponse(notification.payload);
					break;
				default:
					break;
			}
		}
	}

	preProcessBatteryDetailResponse(response: BatteryDetail[]) {
		let headings = ["Primary Battery", "Secondary Battery", "Tertiary Battery"];
		this.batteryIndicators.percent = response[0].mainBatteryPercent;
		this.batteryIndicators.charging = response[0].chargeStatus == BatteryChargeStatus.CHARGING.id;
		this.batteryIndicators.expressCharging = response[0].isExpressCharging;
		this.batteryIndicators.voltageError = response[0].isVoltageError;
		this.batteryIndicators.convertMin(response[0].remainingTime);
		for(let i=0; i<response.length ;i++) {
			response[i].remainingCapacity = Math.round(response[i].remainingCapacity * 100) / 100;
			response[i].fullChargeCapacity = Math.round(response[i].fullChargeCapacity * 100) / 100;
			response[i].voltage = Math.round(response[i].voltage * 100) / 100;
			response[i].wattage = Math.round(response[i].wattage * 100) / 100;
			response[i].heading = response.length > 1 ? headings[i] : "";
			let id = response[i].chargeStatus
			response[i].chargeStatusString = BatteryChargeStatus.getBatteryChargeStatus(id);
			if(response[i].chargeStatus == BatteryChargeStatus.NO_ACTIVITY.id
			|| response[i].chargeStatus == BatteryChargeStatus.ERROR.id
			|| response[i].chargeStatus == BatteryChargeStatus.NOT_INSTALLED.id) {
				///if chargeStatus is 'No activity' | 'Error' | 'Not installed'
				// remaining time will not be displayed
				response[i].remainingTime = undefined;
			}
			if(response[i].chargeStatus == BatteryChargeStatus.CHARGING.id) {
				this.remainingTimeText = "Charge completion time"
			} else {
				this.remainingTimeText = "Remaining time";
			}
		}
		this.dataSource = response;
		this.cd.detectChanges();
	}

	ngOnInit() {
		console.log('In ngOnInit');
		this.dataSource = this.data;
		this.preProcessBatteryDetailResponse(this.dataSource);
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	ngOnDestroy() {
		//clearTimeout(this.batteryTimer);
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}
}
