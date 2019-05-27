import { Component, OnInit, Input } from '@angular/core';
import { GamingQuickSettingsService } from 'src/app/services/gaming/gaming-quick-settings/gaming-quick-settings.service';
import { ThermalModeStatus } from 'src/app/data-models/gaming/thermal-mode-status.model';
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
			rightImageSource: '',
			leftImageSource: '',
			header: 'gaming.dashboard.device.quickSettings.title',
			name: 'gaming.dashboard.device.quickSettings.title',
			subHeader: '',
			isVisible: true,
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
			isVisible: true,
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
			isVisible: true,
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
			isVisible: true,
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
			description: 'gaming.dashboard.device.quickSettings.statusText.perText',
			selectedOption: false,
			defaultOption: false,
			value: 3
		},
		{
			header: 'gaming.dashboard.device.quickSettings.status.balance',
			name: 'gaming.dashboard.device.quickSettings.status.balance',
			description: 'gaming.dashboard.device.quickSettings.statusText.balText',
			selectedOption: false,
			defaultOption: true,
			value: 2
		},
		{
			header: 'gaming.dashboard.device.quickSettings.status.quiet',
			name: 'gaming.dashboard.device.quickSettings.status.quiet',
			description: 'gaming.dashboard.device.quickSettings.statusText.quietText',
			selectedOption: false,
			defaultOption: false,
			value: 1
		}
	];
	public thermalModeStatusObj: ThermalModeStatus;
	public gamingSettings: any = {
		cpuInfoFeature: true,
		gpuInfoFeature: true,
		memoryInfoFeature: true,
		hddInfoFeature: true,
		winKeyLockFeature: true,
		rapidChargeFeature: true,
		dolbySoundFeature: true,
		touchpadLockFeature: true,
		networkBoostFeature: true,
		cpuOCFeature: true,
		ledSetFeature: true,
		memOCFeature: true,
		macroKeyFeature: true,
		hybridModeFeature: true,
		optimizationFeature: true,
		smartFanFeature: true,
		xtuService: true,
		fbnetFilter: true,
		ledDriver: true
	};

	constructor(
		private gamingQuickSettingsService: GamingQuickSettingsService
	) { }

	ngOnInit() {
		if (!this.gamingSettings.smartFanFeature) {
			this.quickSettings[0].isVisible = false;
		}

		if (!this.gamingSettings.rapidChargeFeature) {
			this.quickSettings[1].isVisible = false;
		}

		if (!this.gamingSettings.winKeyLockFeature) {
			this.quickSettings[2].isVisible = false;
		}

		if (!this.gamingSettings.dolbySoundFeature) {
			this.quickSettings[3].isVisible = false;
		}

		if (this.gamingSettings.smartFanFeature) {
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
		if (this.gamingSettings.smartFanFeature) {
			if (event.target.name === 'gaming.dashboard.device.quickSettings.title') {
				if (this.thermalModeStatusObj === undefined) {
					this.thermalModeStatusObj = new ThermalModeStatus();
				}
				this.thermalModeStatusObj.thermalModeStatus = event.option.value;
				const oldThermalModeStatusObj = this.gamingQuickSettingsService.GetThermalModeStatus();
				this.gamingQuickSettingsService.setThermalModeStatus(this.thermalModeStatusObj, oldThermalModeStatusObj);
			}
		}
	}
}
