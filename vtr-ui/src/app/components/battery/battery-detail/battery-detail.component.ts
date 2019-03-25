import { Component, OnInit, OnDestroy } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryDetailMockService } from 'src/app/services/battery-detail/battery-detail.mock.service';
import { BaseBatteryDetail } from 'src/app/services/battery-detail/base-battery-detail';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { BatteryChargeStatus } from 'src/app/enums/battery-charge-status.enum';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
@Component({
	selector: 'vtr-battery-detail',
	templateUrl: './battery-detail.component.html',
	styleUrls: ['./battery-detail.component.scss'],
})
export class BatteryDetailComponent implements OnInit, OnDestroy {
	public dataSource: BatteryDetail[];
	batteryTimer: any;
	remainingTimeText = "Remaining time";
	batteryIndicators = new BatteryIndicator();
	constructor(private batteryService: BatteryDetailService, public shellServices: VantageShellService) {
		this.getBatteryDetail();
	}

	private getBatteryDetail() {
		console.log('In getBatteryDetail');
		try {
			if (this.batteryService.isShellAvailable) {
				this.batteryService.getBatteryDetail()
					.then((response: BatteryDetail[]) => {
						console.log('getBatteryDetail', response);
						this.preProcessBatteryDetailResponse(response);
						this.batteryTimer = setTimeout(() => {
							console.log('Trying after 30 seconds');
							this.getBatteryDetail();
						}, 30000);
					}).catch(error => {
						console.error('getBatteryDetail', error);
					});
			}
		} catch (error) {
			console.error("getBatteryDetail: " + error.message)
		}
	}

	preProcessBatteryDetailResponse(response: BatteryDetail[]) {
		for(let i=0; i<response.length ;i++) {	
			if (response[i].remainingTime == 0 
				&& this.dataSource != undefined 
				&& this.dataSource[0].remainingTime == 0) {
				// Don't update UI if remainingTime is 0.
				return;
			}
			let id = response[i].chargeStatus
			response[i].chargeStatusString = BatteryChargeStatus.getBatteryChargeStatus(id);
			if(response[i].chargeStatus == BatteryChargeStatus.NO_ACTIVITY.id
			|| response[i].chargeStatus == BatteryChargeStatus.ERROR.id
			|| response[i].chargeStatus == BatteryChargeStatus.NOT_INSTALLED.id) {
				response[i].chargeStatusString = "";
			} 
			if(response[i].chargeStatus == BatteryChargeStatus.CHARGING.id) {
				this.remainingTimeText = "Charge completion time"
			} else {
				this.remainingTimeText = "Remaining time";
			}
		}
		this.batteryIndicators.percent = response[0].remainingPercent;
		this.batteryIndicators.charging = response[0].chargeStatus == BatteryChargeStatus.CHARGING.id;
		this.batteryIndicators.expressCharging = response[0].isExpressCharging;
		this.batteryIndicators.voltageError = response[0].isVoltageError;
		this.batteryIndicators.convertMin(response[0].remainingTime);
		this.dataSource = response;
	}

	ngOnInit() {
		console.log('In ngOnInit');
		//TODO: Change this if event is fired
		this.shellServices.phoenix.on('pwrPowerSupplyStatusEvent', (val) => {
			console.log("Event fired===================");
		});
	}

	ngOnDestroy() {
		clearTimeout(this.batteryTimer);
		this.shellServices.phoenix.off('pwrRemainingPercentageEvent', ()=>{ });
	}
}
