import { AudioService } from 'src/app/services/audio/audio.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ThermalModeStatus } from 'src/app/data-models/gaming/thermal-mode-status.model';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { Gaming } from 'src/app/enums/gaming.enum';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-widget-quicksettings-list',
	templateUrl: './widget-quicksettings-list.component.html',
	styleUrls: ['./widget-quicksettings-list.component.scss']
})
export class WidgetQuicksettingsListComponent implements OnInit, AfterViewInit {

	@Input() title = '';

	public thermalModeStatusObj = new ThermalModeStatus();
	public setThermalModeStatus: any;
	public gamingCapabilities: any = new GamingAllCapabilities();

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
			isChecked: false,
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
			isChecked: false,
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
			isChecked: false,
			tooltipText: '',
			type: 'gaming.dashboard.device.quickSettings.dolby'
		}
	];

	public drop = {
		curSelected: 2,
		modeType: 2,
		dropOptions:
			[
				{
					header: 'gaming.dashboard.device.quickSettings.status.performance',
					name: 'gaming.dashboard.device.quickSettings.status.performance',
					description: 'gaming.dashboard.device.quickSettings.statusText.perText',
					//selectedOption: false,
					//defaultOption: false,
					value: 1
				},
				{
					header: 'gaming.dashboard.device.quickSettings.status.balance',
					name: 'gaming.dashboard.device.quickSettings.status.balance',
					description: 'gaming.dashboard.device.quickSettings.statusText.balText',
					//selectedOption: false,
					//defaultOption: true,
					value: 2
				},
				{
					header: 'gaming.dashboard.device.quickSettings.status.quiet',
					name: 'gaming.dashboard.device.quickSettings.status.quiet',
					description: 'gaming.dashboard.device.quickSettings.statusText.quietText',
					//selectedOption: false,
					//defaultOption: false,
					value: 3
				}
			]
	}

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
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private gamingThermalModeService: GamingThermalModeService,
		private commonService: CommonService,
		private shellServices: VantageShellService,
		private audioService: AudioService
	) { }

	ngOnInit() {
		this.initialiseDolbyCache();
		this.getDolbySettings();

		this.gamingCapabilities.smartFanFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.CurrentThermalModeStatus);

		this.gamingCapabilities.smartFanFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.PrevThermalModeStatus);

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

		// Initialize Quicksetting 
		this.quicksettingListInit();
		this.commonService.notification.subscribe((response) => {
			if (response.type === Gaming.GamingCapablities) {
				this.gamingCapabilities = response.payload;
				this.quicksettingListInit();
			}
		});

		// Binding regThermalMode event
		if (this.gamingSettings.smartFanFeature) {
			this.gamingThermalModeService.regThermalModeEvent();
			this.shellServices.registerEvent(
				EventTypes.gamingThermalModeChangeEvent,
				this.onRegThermalModeEvent.bind(this)
			);
		}

	}

	ngAfterViewInit() {
	}

	public onRegThermalModeEvent(status: any) {
		if (status !== undefined) {
			const regThermalModeStatusObj = new ThermalModeStatus();
			// setting previous value to localstorage 
			const regThermalModePreValue = this.GetThermalModeCacheStatus();
			this.commonService.setLocalStorageValue(
				LocalStorageKey.PrevThermalModeStatus,
				regThermalModePreValue
			);
			// setting current value to local storage
			this.commonService.setLocalStorageValue(
				LocalStorageKey.CurrentThermalModeStatus,
				status
			);
			// updating model with current value
			this.thermalModeStatusObj.thermalModeStatus = status;
			// UI binding with current value
			this.drop.curSelected = status;

		} else {
			const regThermalModeObj = new ThermalModeStatus();
			// getting previous value from localstorage 
			const thermalModePreValue = this.GetThermalModePrevCacheStatus();
			// updating model with previous value
			regThermalModeObj.thermalModeStatus = thermalModePreValue;
			// UI binding with previous value
			this.drop.curSelected = regThermalModeObj.thermalModeStatus;
		}
	}

	public quicksettingListInit() {
		const gamingStatus = this.gamingCapabilities;
		this.quickSettings[0].isVisible = gamingStatus.smartFanFeature;
		// console.log('thermal mode smart feature', gamingStatus.smartFanFeature);
		if (gamingStatus.smartFanFeature) {
			this.renderThermalModeStatus();
		}
	}

	public GetThermalModeCacheStatus(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus);
	}

	public GetThermalModePrevCacheStatus(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.PrevThermalModeStatus);
	}

	public renderThermalModeStatus() {
		try {
			if (this.commonService) {
				this.drop.curSelected = this.GetThermalModeCacheStatus();
			} else if (this.gamingThermalModeService) {
				this.gamingThermalModeService.getThermalModeStatus().then((thermalModeStatus) => {
					if (thermalModeStatus !== undefined) {
						const ThermalModeStatusObj = new thermalModeStatus();
						//updating model
						ThermalModeStatusObj.thermalModeStatus = thermalModeStatus;
						this.drop.curSelected = ThermalModeStatusObj.thermalModeStatus;
					}
				});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	public onOptionSelected(event) {
		if (event.target.name === 'gaming.dashboard.device.quickSettings.title') {
			if (this.setThermalModeStatus === undefined) {
				this.setThermalModeStatus = new ThermalModeStatus();
			}
			this.setThermalModeStatus.thermalModeStatus = event.option.value;
			this.gamingThermalModeService
				.setThermalModeStatus(this.setThermalModeStatus.thermalModeStatus)
				.then((statusValue: boolean) => {
					// console.log('value for setThermalModeStatus value then', value);
					if (!statusValue) {
						this.drop.curSelected = this.GetThermalModeCacheStatus();

					} else if (statusValue) {
						// binding to UI
						this.drop.curSelected = this.setThermalModeStatus.thermalModeStatus;

						// updating the previous local cache value with last value of current local cache value
						const previousValue = this.GetThermalModeCacheStatus();
						this.commonService.setLocalStorageValue(
							LocalStorageKey.PrevThermalModeStatus,
							previousValue
						);

						try {
							// updating the current local cache value
							this.commonService.setLocalStorageValue(
								LocalStorageKey.CurrentThermalModeStatus,
								this.drop.curSelected
							);
						} catch (error) {
							// fail update loading previous cache value
							this.drop.curSelected = this.GetThermalModePrevCacheStatus();
							console.error('setThermalCurrentLocalCache', error);
						}
					}
				})
				.catch((error) => {
					console.error('setThermalModeStatusError', error);
				});
		}
	}

	public onToggleStateChanged(event: any) {
		const { name } = event.target;
		if (name === 'gaming.dashboard.device.quickSettings.dolby') {
			this.setDolbySettings(event.switchValue);
		}
	}
	public async getDolbySettings() {
		try {
			const dolbySettings = await this.audioService.getDolbyFeatureStatus();
			this.quickSettings[3].isVisible = dolbySettings.available;
			this.quickSettings[3].isChecked = dolbySettings.status;
		} catch (err) {
			console.log(`ERROR in getDolbySettings()`, err);
		}
	}

	public async setDolbySettings(value: any) {
		try {
			const isDolbyUpdated = await this.audioService.setDolbyOnOff(value);
			if (isDolbyUpdated) {
				this.commonService.setLocalStorageValue(LocalStorageKey.DolbyModeCache, { available: true, status: value });
			} else {
				this.quickSettings[3].isChecked = !value;
			}
		} catch (err) {
			console.log(`ERROR in setDolbySettings()`, err);
		}
	}

	public initialiseDolbyCache() {
		const { available, status } = this.commonService.getLocalStorageValue(LocalStorageKey.DolbyModeCache);
		this.quickSettings[3].isVisible = available;
		this.quickSettings[3].isChecked = status;
	}
}
