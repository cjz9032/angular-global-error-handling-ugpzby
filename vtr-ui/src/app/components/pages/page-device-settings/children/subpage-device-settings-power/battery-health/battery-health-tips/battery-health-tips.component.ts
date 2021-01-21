import { Component, OnInit } from '@angular/core';

import { BatteryHealthService } from '../battery-health.service';
import { BatteryHealthTip } from '../battery-health.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
  selector: 'vtr-battery-health-tips',
  templateUrl: './battery-health-tips.component.html',
  styleUrls: ['./battery-health-tips.component.scss']
})
export class BatteryHealthTipsComponent implements OnInit {
  capability = false;
  condition = '';
  tipLevel = 0;
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
		this.capability = batteryInfo.isSupportSmartBatteryV2 && this.condition !== '';
		this.logger.info(
			`BatteryLifespan: getBatteryHealth-lifespan  ==> currenttipLevel ${this.tipLevel}, condition ${this.condition }, capability ${this.capability }`
		);
	});
  }

  getTipsStr(index: number): string {
	  if(index === BatteryHealthTip.ERROR) {
		return '';
	  } else {
		const val = "device.deviceSettings.power.batterySettings.batteryHealth.batteryTips.description.t" + index;
		this.logger.info(`getTipsStr: ==> res ${val}`);
	  	return val ? val : '';
	  }
  }
}
