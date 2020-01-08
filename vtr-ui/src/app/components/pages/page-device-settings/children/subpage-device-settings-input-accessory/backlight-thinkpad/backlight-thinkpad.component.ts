import { Component, OnInit } from '@angular/core';
import { BacklightStatusEnum } from '../backlight/backlight.enum';

@Component({
  selector: 'vtr-backlight-thinkpad',
  templateUrl: './backlight-thinkpad.component.html',
  styleUrls: ['./backlight-thinkpad.component.scss']
})
export class BacklightThinkpadComponent implements OnInit {
	currentMode = BacklightStatusEnum.AUTO;
	modes = [
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.auto',
			value: BacklightStatusEnum.AUTO,
			available: true
		},
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.low',
			value: BacklightStatusEnum.LEVEL_1,
			available: true
		},
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.high',
			value: BacklightStatusEnum.LEVEL_2,
			available: true
		},
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.off',
			value: BacklightStatusEnum.OFF,
			available: true
		},
	];
  constructor() { }

  ngOnInit() {
  }

  updateMode(mode) {
	this.currentMode = mode;
  }

}
