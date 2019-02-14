import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-subpage-device-settings-power',
	templateUrl: './subpage-device-settings-power.component.html',
	styleUrls: ['./subpage-device-settings-power.component.scss']
})
export class SubpageDeviceSettingsPowerComponent implements OnInit {

	title = 'Power Settings';
	headerCaption = 'This section enables you to dynamically adjust thermal performance and maximize the battery life. It also has other popular power-related features. You can check the default settings in this section and customize your system according to your needs.';
	headerMenuTitle = 'Jump to Settings';

	headerMenuItems = [
		{
			title: 'Battery',
			path: '/battery'
		},
		{
			title: 'Power',
			path: '/power'
		},
		{
			title: 'Cooling',
			path: '/cooling'
		},
		{
			title: 'Other',
			path: '/other'
		}
	]


	dummyCollapsibleContainerItemArray = [
		{
			'readMoreText': 'Readmore',
			'rightImageSource': ['far', 'question-circle'],
			'leftImageSource': ['far', 'gem'],
			'header': 'Always on USB',
			'subHeader': 'Charge USb devices through the Always on USB connector on the computer',
			'isCheckBoxVisible': true,
			'isSwitchVisible': true
		},
		{
			'readMoreText': 'Readmore',
			'rightImageSource': ['far', 'question-circle'],
			'leftImageSource': ['far', 'gem'],
			'header': 'Easy Resume',
			'subHeader': 'orem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
			'isCheckBoxVisible': false,
			'isSwitchVisible': false
		}
	];

	intelligentCooling: boolean = false;

	constructor() { }

	onIntelligentCoolingToggle(event) {
		this.intelligentCooling = event.switchValue;
	}

	ngOnInit() {
	}
}
