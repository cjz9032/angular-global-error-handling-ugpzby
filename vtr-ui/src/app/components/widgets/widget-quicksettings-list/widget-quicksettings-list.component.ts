import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-quicksettings-list',
	templateUrl: './widget-quicksettings-list.component.html',
	styleUrls: ['./widget-quicksettings-list.component.scss']
})
export class WidgetQuicksettingsListComponent implements OnInit {

	@Input() title = '';

	constructor() { }

	ngOnInit() {
	}
	public quickSettings = [
		{
			readMoreText: '',
			rightImageSource:'',
			leftImageSource:'',
			header: 'gaming.dashboard.device.quickSettings.title',
			name: 'gaming.dashboard.device.quickSettings.title',
			subHeader: '',
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
			header: 'gaming.dashboard.device.quickSettings.rapidCharge',
			name: 'gaming.dashboard.device.quickSettings.rapidCharge',
			subHeader: '',
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: true,
			tooltipText: '',
			type: 'auto-updates'
		}

	];
}
