import { Component, OnInit, OnDestroy } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryDetailMockService } from 'src/app/services/battery-detail/battery-detail.mock.service';
import { BaseBatteryDetail } from 'src/app/services/battery-detail/base-battery-detail';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { BatteryChargeStatus } from 'src/app/enums/battery-charge-status.enum';
@Component({
	selector: 'vtr-battery-detail',
	templateUrl: './battery-detail.component.html',
	styleUrls: ['./battery-detail.component.scss'],
	// providers: [
	// 	{ provide: BaseBatteryDetail, useClass: BatteryDetailService }
	// ]
})
export class BatteryDetailComponent implements OnInit, OnDestroy {
	public dataSource: BatteryDetail[];
	batteryTimer: any;
	remainingTimeText = "Remaining time";
	remainingPercent = 0;
	isCharging = false;
	constructor(private batteryService: BatteryDetailService, public shellServices: VantageShellService) {
		//TODO: Change this if event is fired
		shellServices.phoenix.on('pwrPowerSupplyStatusEvent', (val) => {
			console.log("Event fired===================");
		});
	}

	public getBatteryDetail() {
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
		let heading = ["Primary Battery", "Secondary Battery", "Tertiary Battery"];
		for(let i=0; i<response.length ;i++) {
			if (response[i].remainingTime == 0 
				&& this.dataSource != undefined 
				&& this.dataSource[0].remainingTime == 0) {
				// Don't update UI if remainingTime is 0.
				return;
			}
			response[i].heading = heading[i];
			if(response[i].chargeStatus == BatteryChargeStatus.NO_ACTIVITY.toString() 
			|| response[i].chargeStatus == BatteryChargeStatus.ERROR.toString()
			|| response[i].chargeStatus == BatteryChargeStatus.NOT_INSTALLED.toString()) {
				response[i].chargeStatus = "";
			} 
			if(response[i].chargeStatus == BatteryChargeStatus.CHARGING.toString()) {
				this.remainingTimeText = "Charge completion time"
			} else {
				this.remainingTimeText = "Remaining time";
			}
		}
		this.remainingPercent = response[0].remainingPercent;
		this.isCharging = response[0].chargeStatus == BatteryChargeStatus.CHARGING.toString();
		this.dataSource = response;
	}

	ngOnInit() {
		console.log('In ngOnInit');
		
		this.getBatteryDetail();
	}

	ngOnDestroy() {
		clearTimeout(this.batteryTimer);
		this.shellServices.phoenix.off('pwrRemainingPercentageEvent', ()=>{ });
	}
}
