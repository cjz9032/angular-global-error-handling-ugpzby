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

	value = 1;

	headerMenuItems = [
		{
			title: 'Intelligent Cooling',
			path: 'cooling'
		},
		{
			title: 'Battery',
			path: 'battery',
		},
		{
			title: 'Power',
			path: 'power'
		},
		{
			title: 'Other',
			path: 'other'
		}
	];

	batterySettings = {
		status: {
			airplanePowerMode: false,
			batteryChargeThreshold: false,
			expressCharging: true,
			conservationMode: false,

		},
		items: [
			{
				readMoreText: 'Read More',
				rightImageSource: ['far', 'question-circle'],
				leftImageSource: ['far', 'gem'],
				header: 'Airplane Power Mode',
				subHeader: ' Protect the airplane AC power outlet by controlling the power consumption of your system. When Airplane Power Mode is enabled, the computer reduces power consumption by limiting the battery charging rate and system performance.',
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
					'If you primarily use your computer with the AC adapter attached and only infrequently use battery power, you can increase the lifespan of the battery by setting the maximum charge value to below 100%. This is useful because batteries that are used infrequently have a longer lifespan when they are maintained at less than a full charge.',
				isCheckBoxVisible: false,
				isSwitchVisible: false,
				tooltipText:
					`If your battery is currently charged above the stop-charging threshold, detach the power until the battery discharges to or below the stop-charging threshold.
			Depending on the battery status (old or new), the exact point at which the charging starts or stops might vary by up to 2 percentage points. If you enable the feature, it is recommended that you perform a Battery Gauge Reset occasionally to ensure an accurate report of the battery health.
			`
			},
			{
				readMoreText: 'Read More',
				rightImageSource: ['far', 'question-circle'],
				leftImageSource: ['far', 'gem'],
				header: 'Express Charging',
				subHeader:
					'Express Charge allows your battery to a full charge much faster than normal mode.',
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
					`This function is useful to  extend the lifespan of your battery when plugged. <br>
			When this mode is enabled, the battery will only be charged to 55-60% of capacity and the battery lifespan can be maximized. However, this will shorten the time you use your computer after it is disconnected from the AC power source.<br>Note: Express Charging and Conservation mode cannot work at the same time. IF one of the modes is turned on, the other one will be automatically turned off.	`,
				isCheckBoxVisible: false,
				isSwitchVisible: false,
				tooltipText:
					"When enabled, your battery will only charge to 55-60%. This will shorten the amount of time you can use your computer when disconnected from an AC power source, but it will maximize the amount of time before you will need to replace your computer's battery."
			}
		]
	};

	powerSettings = [
		{
			readMoreText: 'Read More',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['far', 'gem'],
			header: 'Always on USB*',
			subHeader:
				'Charge USB devices through the Always on USB connector on the computer when the computer is in sleep, hibernation, or off mode. A smartphone or tablet can be charged from the USB connector that is yellow-coded or silk-printed the specified icon.',
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
				`Enable this feature to improve your resume time if you frequently open and close your computer's lid.`,
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			tooltipText:
				`This feature will improve your resume time if you frequently open and close your computer’s lid.
				When enabled, your computer will enter a low power mode when you close its lid, but it will resume instantly if you reopen your lid within 15 minutes of closing it. This feature also allows your notebook
				to attempt to finish pending activities (such as sending email or downloading a file) before the system goes into suspend.`
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


	changeBatteryMode(event, mode) {
		// console.log(event.switchValue);
		// console.log('initially conservationMode:' + this.batterySettings.status.conservationMode);
		// console.log('initially expressCharging:' + this.batterySettings.status.expressCharging);
		if (mode !== undefined) {
			if (mode === 'expressCharging') {
				this.batterySettings.status.expressCharging = event.switchValue;
				this.batterySettings.status.conservationMode = !this.batterySettings.status.expressCharging;
			} else {
				this.batterySettings.status.conservationMode = event.switchValue;
				this.batterySettings.status.expressCharging = !this.batterySettings.status.conservationMode;
			}
		}
		// console.log(event.switchValue);
		// console.log('after conservationMode :' + this.batterySettings.status.conservationMode);
		// console.log('after expressCharging :' + this.batterySettings.status.expressCharging);

	}
	constructor() { }

	onIntelligentCoolingToggle(event) {
		this.intelligentCooling = event.switchValue;
	}

	ngOnInit() { }
}
