import { Component, Input, OnInit } from '@angular/core';

import { BatteryHealthService } from './battery-health.service';

@Component({
	selector: 'vtr-battery-health',
	templateUrl: './battery-health.component.html',
	styleUrls: ['./battery-health.component.scss'],
})
export class BatteryHealthComponent implements OnInit {
	batteryHealthCapability = false;
	@Input() hideSeparation = false;
	constructor(private batteryHealthService: BatteryHealthService) {}

	ngOnInit(): void {
		this.batteryHealthService.batteryInfo.subscribe((batteryInfo) => {
			if (batteryInfo && batteryInfo.isSupportSmartBatteryV2 !== undefined) {
				this.batteryHealthCapability = batteryInfo.isSupportSmartBatteryV2;
			}
		});
	}
}
