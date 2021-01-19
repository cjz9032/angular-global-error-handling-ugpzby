import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { BatteryHealthService } from '../battery-health.service';
import { BatteryHealthTip } from '../battery-health.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { Subscription } from 'rxjs';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
  selector: 'vtr-battery-health-tips',
  templateUrl: './battery-health-tips.component.html',
  styleUrls: ['./battery-health-tips.component.scss']
})
export class BatteryHealthTipsComponent implements OnInit {
  capability = false;
  condition = "t0";
  tipLevel = 0;
  tipsMap = new Map([
	[BatteryHealthTip.TIPS_0, 't0'],
	[BatteryHealthTip.TIPS_1, 't1'],
	[BatteryHealthTip.TIPS_2, 't2'],
	[BatteryHealthTip.TIPS_3, 't3'],
	[BatteryHealthTip.TIPS_4, 't4'],
	[BatteryHealthTip.TIPS_5, 't5'],
	[BatteryHealthTip.TIPS_6, 't6'],
	[BatteryHealthTip.TIPS_7, 't7'],
	[BatteryHealthTip.TIPS_8, 't8'],
	[BatteryHealthTip.ERROR, 'error']
]);
  constructor(
	private batteryHealthService: BatteryHealthService,
	public shellServices: VantageShellService,
	private logger: LoggerService
  ) { }

  ngOnInit(): void {
	  this.getBatteryDetails();
  }

  getBatteryDetails() {
	this.logger.info('BatteryTips: getBatteryDetails ==> start');
	this.batteryHealthService.batteryInfo.subscribe((batteryInfo) => {
		this.tipLevel = batteryInfo.batteryHealthTip;
		this.condition =  this.getTipsStr(this.tipLevel);
		this.capability = batteryInfo.isSupportSmartBatteryV2 && this.condition !== ''
		this.logger.info(
			`BatteryLifespan: getBatteryHealth-lifespan  ==> currenttipLevel ${this.tipLevel}, condition ${this.condition }, capability ${this.capability }`
		);
	});
  }

  getTipsStr(index: number): string {
	const mapVal = this.tipsMap.get(index);
	if(mapVal === 'error') {
		return '';
	} else {
		const val = "device.deviceSettings.power.batterySettings.batteryHealth.batteryTips.description." + mapVal;
		this.logger.info(`getTipsStr: ==> res ${val}`);
		return val ? val : '';
	}
  }
}
