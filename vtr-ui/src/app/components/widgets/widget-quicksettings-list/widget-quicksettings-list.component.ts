import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-quicksettings-list',
	templateUrl: './widget-quicksettings-list.component.html',
	styleUrls: ['./widget-quicksettings-list.component.scss']
})
export class WidgetQuicksettingsListComponent implements OnInit {

	@Input() title = '';


	public quickSettings = [
		{
			readMoreText: '',
			rightImageSource:'',
			leftImageSource:'',
			header: 'gaming.dashboard.device.quickSettings.title',
			name: 'gaming.dashboard.device.quickSettings.title',
			subHeader: '',
			isCollapsible: true,
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			isChecked: false,
			tooltipText: '',
			type: 'auto-updates'
		},

		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.quickSettings.rapidCharge',
			name: 'gaming.dashboard.device.quickSettings.rapidCharge',
			subHeader: '',
			isCustomizable: false,
			setLink: '',
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource:'',
			header: 'gaming.dashboard.device.quickSettings.wifiSecurity',
			name: 'gaming.dashboard.device.quickSettings.wifiSecurity',
			subHeader: '',
			isCustomizable: true,
			routerLink: '/security/wifi-security',
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.quickSettings.dolby',
			name: 'gaming.dashboard.device.quickSettings.dolby',
			subHeader: '',
			isCustomizable: true,
			routerLink: '/device/device-settings/audio',
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates'
		}

	];

	public listingopt = [
		{
			header: 'gaming.dashboard.device.quickSettings.status.performance',
			name: 'gaming.dashboard.device.quickSettings.status.performance',
			defaultOption: false
		},
		{
			header: 'gaming.dashboard.device.quickSettings.status.balance',
			name: 'gaming.dashboard.device.quickSettings.status.balance',
			defaultOption: true
		},
		{
			header: 'gaming.dashboard.device.quickSettings.status.quiet',
			name: 'gaming.dashboard.device.quickSettings.status.quiet',
			defaultOption: false
		}
	];

	constructor() { }

	ngOnInit() {
	}
}
