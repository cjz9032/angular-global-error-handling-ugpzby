import { Component, OnInit, OnDestroy } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryDetailMockService } from 'src/app/services/battery-detail/battery-detail.mock.service';
import { BaseBatteryDetail } from 'src/app/services/battery-detail/base-battery-detail';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
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
						this.preProcessBatteryDetailResponse(response);
						this.dataSource = response;
						console.log('getBatteryDetail', response);
						this.batteryTimer = setTimeout(() => {
							console.log('Trying after 30 seconds');
							this.getBatteryDetail();
						}, 30000);
					}).catch(error => {
						console.error('getBatteryDetail', error);
					});
			}
		} catch (error) {
			console.error("getBatteryDetail" + error.message)
		}
	}

	preProcessBatteryDetailResponse(response: BatteryDetail[]) {
		let heading = ["Primary Battery", "Secondary Battery", "Tertiary Battery"];
		for(let i=0; i<response.length ;i++) {
			response[i].heading = heading[i];
		}
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
