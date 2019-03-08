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

	showBatteryThreshold = false;

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
			isSwitchVisible: true,
			tooltipText:
				'Protect the airplane AC power outlet by controlling the power consumption of your system. When Airplane Power Mode is enabled, the computer reduces power consumption by limiting the battery charging rate and system performance.'
		},
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Battery Charge Threshold',
			subHeader:
				'This feature dynamically adjusts thermal settings to your needs.',
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			tooltipText:
				`If you primarily use your computer with the AC adapter attached and only infrequently use battery power, you can increase the lifespan of the battery by setting the maximum charge value to below 100%.
				 This is useful because batteries that are used infrequently have a longer lifespan when they are maintained at less than a full charge.`
		},
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Express Charging',
			subHeader:
				'Express Charge allows you to charge your system battery much faster but this may reduce the lifetime of the battery.',
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			tooltipText:
				'Express Charge allows you to charge your system battery much faster but this may reduce the lifetime of the battery.'
		},
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Conservation Mode',
			subHeader:
				'This function is useful to extend the lifespan of your battery when plugged.',
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			tooltipText:
				"When enabled, your battery will only charge to 55-60%. This will shorten the amount of time you can use your computer when disconnected from an AC power source, but it will maximize the amount of time before you will need to replace your computer's battery."
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
			isSwitchVisible: true,
			tooltipText:
				`Charge USB devices through the Always on USB connector on the computer when the computer is in sleep, hibernation, or off mode.
				A smartphone or tablet can be charged from the USB connector that is yellow-coded or silk-printed the specified icon.`
		},
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Easy Resume',
			subHeader:
				'orem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			tooltipText:
				`Improve your resume time if you frequently open and close your computer 's lid.
				The context if user click on the question mark:
				This feature will improve your resume time if you frequently open and close your computer’s lid.
				When enabled, your computer will enter a low power mode when you close its lid, but it will resume
				instantly if you reopen your lid within 15 minutes of closing it. This feature also allows your notebook
				to attempt to finish pending activities  (such as sending email or downloading a file) before
				the system goes into suspend.`
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

	constructor() { }

	onIntelligentCoolingToggle(event) {
		this.intelligentCooling = event.switchValue;
	}

	ngOnInit() { }
}
