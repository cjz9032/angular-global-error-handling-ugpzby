import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-subpage-device-settings-power',
	templateUrl: './subpage-device-settings-power.component.html',
	styleUrls: ['./subpage-device-settings-power.component.scss']
})
export class SubpageDeviceSettingsPowerComponent implements OnInit {

	title = 'Power Settings';
	dummyCollapsibleContainerItemArray = [
		{
			'readMoreText':'Always on USB',
			'rightImageSource': '',
			'leftImageSource': './assets/images/coll-container-item-img.png',
			'header': 'Always on USB',
			'subHeader': 'Charge USb devices through the Always on USB connector on the computer',
			'isCheckBoxVisible': false,
			'isSwitchVisible': false
		},
		{
			'readMoreText': 'Easy Resume',
			'rightImageSource': 'processor',
			'leftImageSource': './assets/images/coll-container-item-img.png',
			'header': 'Easy Resume',
			'subHeader': 'orem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
			'isCheckBoxVisible': false,
			'isSwitchVisible': false
		}		
	];
	constructor() { }

	ngOnInit() {
	}

}
