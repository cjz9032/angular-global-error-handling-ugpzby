import { Component, OnInit } from '@angular/core';

import { BatteryHealthService } from '../battery-health.service';
import { BatteryHealthTip } from '../battery-health.enum';

@Component({
	selector: 'vtr-battery-layout',
	templateUrl: './battery-layout.component.html',
	styleUrls: ['./battery-layout.component.scss'],
})
export class BatteryLayoutComponent implements OnInit {
	tipsCapability = false;
	constructor(private batteryHealthService: BatteryHealthService) {}

	ngOnInit(): void {
		this.batteryHealthService.batteryInfo.subscribe((batteryInfo) => {
			if (batteryInfo && batteryInfo.isSupportSmartBatteryV2 !== undefined) {
				this.tipsCapability = batteryInfo.isSupportSmartBatteryV2 && this.getTipsCapability(batteryInfo.batteryHealthTip);
			}
		});
	}

	getTipsCapability(tip: BatteryHealthTip): boolean {
		return tip !== BatteryHealthTip.ERROR;
	}
}
