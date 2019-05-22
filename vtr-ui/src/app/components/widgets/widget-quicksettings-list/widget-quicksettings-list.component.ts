import { Component, OnInit, Input } from '@angular/core';
import { GamingQuickSettingsService } from 'src/app/services/gaming/gaming-quick-settings/gaming-quick-settings.service';
import { ThermalModeStatus } from 'src/app/data-models/gaming/thermal-mode-status.model';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-widget-quicksettings-list',
	templateUrl: './widget-quicksettings-list.component.html',
	styleUrls: ['./widget-quicksettings-list.component.scss']
})
export class WidgetQuicksettingsListComponent implements OnInit {

	@Input() title = '';


	public quickSettings = [];

	public listingopt = [
		{
			header: 'gaming.dashboard.device.quickSettings.status.performance',
			name: 'gaming.dashboard.device.quickSettings.status.performance',
			selectedOption: false,
			defaultOption: false,
			value: 3
		},
		{
			header: 'gaming.dashboard.device.quickSettings.status.balance',
			name: 'gaming.dashboard.device.quickSettings.status.balance',
			selectedOption: false,
			defaultOption: true,
			value: 2
		},
		{
			header: 'gaming.dashboard.device.quickSettings.status.quiet',
			name: 'gaming.dashboard.device.quickSettings.status.quiet',
			selectedOption: false,
			defaultOption: false,
			value: 1
		}
	];
	public thermalModeStatusObj: ThermalModeStatus;

	constructor(
		private gamingQuickSettingsService: GamingQuickSettingsService,
		private deviceService: DeviceService
	) {
		if (this.deviceService.isSmartFanFeature) {
			this.quickSettings = [
				{
					readMoreText: '',
					rightImageSource: '',
					leftImageSource: '',
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
					leftImageSource: '',
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
		} else {
			this.quickSettings = [
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
					leftImageSource: '',
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
		}
	}

	ngOnInit() {
		if (this.deviceService.isSmartFanFeature) {
			this.thermalModeStatusObj = this.gamingQuickSettingsService.GetThermalModeStatus();
			if (this.thermalModeStatusObj !== undefined) {
				this.listingopt.forEach((option) => {
					if (this.thermalModeStatusObj.thermalModeStatus === option.value) {
						option.selectedOption = true;
					}
				});
			} else {
				this.thermalModeStatusObj = new ThermalModeStatus();
				this.gamingQuickSettingsService.setThermalModeStatus(this.thermalModeStatusObj, this.thermalModeStatusObj);
			}
		}
	}

	onOptionSelected(event) {
		if (this.deviceService.isSmartFanFeature) {
			if (event.target.name === 'gaming.dashboard.device.quickSettings.title') {
				if (this.thermalModeStatusObj === undefined) {
					this.thermalModeStatusObj = new ThermalModeStatus();
				}
				this.thermalModeStatusObj.thermalModeStatus = event.option.value;
				const oldThermalModeStatusObj = this.gamingQuickSettingsService.GetThermalModeStatus();
				console.log(this.thermalModeStatusObj, oldThermalModeStatusObj);
				this.gamingQuickSettingsService.setThermalModeStatus(this.thermalModeStatusObj, oldThermalModeStatusObj);
			}
		}
	}
}
