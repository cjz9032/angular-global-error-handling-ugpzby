import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-subpage-device-settings-power',
	templateUrl: './subpage-device-settings-power.component.html',
	styleUrls: ['./subpage-device-settings-power.component.scss']
})
export class SubpageDeviceSettingsPowerComponent implements OnInit {
	title = 'Power Settings';
	headerCaption =
		'This section enables you to dynamically adjust thermal performance and maximize the battery life.' +
		' It also has other popular power-related features.' +
		' You can check the default settings in this section and customize your system according to your needs.';
	headerMenuTitle = 'Jump to Settings';

	intelligentCooling = false;

	showBatteryThreshold:boolean=false;

	headerMenuItems = [
		{
			title: 'Battery',
			path: 'battery',
		},
		{
			title: 'Power',
			path: 'power'
		},
		{
			title: 'Cooling',
			path: 'cooling'
		},
		{
			title: 'Other',
			path: 'other'
		}
	];

	batterySettings = [
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Airplane Power Mode',
			subHeader: ' fdasdfads ',
			isCheckBoxVisible: true,
			isSwitchVisible: true
		},
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Battery Charge Threshold',
			subHeader:
				'This feature dynamically adjusts thermal settings to your needs.',
			isCheckBoxVisible: false,
			isSwitchVisible: false
		},
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Express Charging',
			subHeader:
				'Express Charge allows you to charge your system battery much faster but this may reduce the lifetime of the battery.',
			isCheckBoxVisible: false,
			isSwitchVisible: false
		},
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Conservation Mode',
			subHeader:
				'This function is useful to extend the lifespan of your battery when plugged.',
			isCheckBoxVisible: false,
			isSwitchVisible: false
		}
	];

	powerSettings = [
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Always on USB*',
			subHeader:
				'Charge USb devices through the Always on USB connector on the computer',
			isCheckBoxVisible: true,
			isSwitchVisible: true
		},
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Easy Resume',
			subHeader:
				'orem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
			isCheckBoxVisible: false,
			isSwitchVisible: false
		}
	];

	otherSettings = [
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Lenovo Vantage Toolbar',
			subHeader:
				'Pin Vantage Toolbar to the Windows task bar to easily get more battery details and access to your quick settings.',
			isCheckBoxVisible: true,
			isSwitchVisible: true
		}
	];

	constructor() {}

	onIntelligentCoolingToggle(event) {
		this.intelligentCooling = event.switchValue;
	}

	ngOnInit() {}
}
