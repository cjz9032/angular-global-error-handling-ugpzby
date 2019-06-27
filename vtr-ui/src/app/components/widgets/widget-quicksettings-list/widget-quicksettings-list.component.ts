import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { PowerService } from './../../../services/power/power.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
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
export class WidgetQuicksettingsListComponent implements OnInit, AfterViewInit, OnDestroy {


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
			type: 'gaming.dashboard.device.quickSettings.rapidCharge'
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
					value: 3
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
					value: 1
				}
			]
	}
	public gamingSettings: any = {};
	public isQuickSettingsVisible = true;
	constructor(
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private gamingThermalModeService: GamingThermalModeService,
		private commonService: CommonService,
		private shellServices: VantageShellService,
		private audioService: AudioService,
		private powerService: PowerService
	) { }

	ngOnInit() {
		this.initialiseDolbyCache();
		this.initialiseRapidChargeCache();
		this.getDolbySettings();
		this.initialiseRapidChargeSettings();
		this.gamingCapabilities.smartFanFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.smartFanFeature);

		this.gamingCapabilities.smartFanStatus = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.PrevThermalModeStatus);

		if (!this.gamingCapabilities.smartFanFeature) {
			this.quickSettings[0].isVisible = false;
		}

		if (!this.gamingSettings.winKeyLockFeature) {
			this.quickSettings[2].isVisible = false;
		}
		this.checkQuickSettingsVisibility();
		// Initialize Quicksetting;
		this.quicksettingListInit();
		this.commonService.notification.subscribe((response) => {
			if (response.type === Gaming.GamingCapablities) {
				this.gamingCapabilities = response.payload;
				this.quicksettingListInit();
				this.registerThermalModeEvent();
			}
		});

		// Binding regThermalMode event
		this.registerThermalModeEvent();
	}

	ngAfterViewInit() {
	}
	public unRegisterThermalModeEvent() {
		this.shellServices.unRegisterEvent(EventTypes.gamingThermalModeChangeEvent, this.onRegThermalModeEvent.bind(this));
	}

	public registerThermalModeEvent() {
		if (this.gamingCapabilities.smartFanFeature) {
			this.gamingThermalModeService.regThermalModeEvent();
			this.shellServices.registerEvent(
				EventTypes.gamingThermalModeChangeEvent,
				this.onRegThermalModeEvent.bind(this)
			);
		}
	}

	public onRegThermalModeEvent(status: any) {
		console.log('onRegThermalModeEvent callback event, ============><', status);
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

	public checkQuickSettingsVisibility() {
		let isVisible = false;
		this.quickSettings.forEach((settings: any) => {
			if (settings.isVisible) {
				isVisible = true;
			}
		});
		this.isQuickSettingsVisible = isVisible;
	}
	public quicksettingListInit() {
		const gamingStatus = this.gamingCapabilities;
		this.quickSettings[0].isVisible = gamingStatus.smartFanFeature;
		// console.log('thermal mode smart feature', gamingStatus.smartFanFeature);
		if (gamingStatus.smartFanFeature) {
			this.renderThermalModeStatus();
		}
		this.checkQuickSettingsVisibility();
	}

	public GetThermalModeCacheStatus(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus, 2);
	}

	public GetThermalModePrevCacheStatus(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.PrevThermalModeStatus);
	}

	public async renderThermalModeStatus() {
		try {
			this.drop.curSelected = this.GetThermalModeCacheStatus();
			if (this.gamingThermalModeService) {
				const thermalModeStatus = await this.gamingThermalModeService.getThermalModeStatus();
				console.log(`SUCCESSFULLY got thermal mode status`, thermalModeStatus);
				if (thermalModeStatus !== undefined) {
					this.drop.curSelected = thermalModeStatus;
					const ThermalModeStatusObj = new thermalModeStatus();
					ThermalModeStatusObj.thermalModeStatus = thermalModeStatus;
					this.commonService.setLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus, this.drop.curSelected);
				}
			}
		} catch (error) {
			console.error(`ERROR in renderThermalModeStatus() of widget.quicksettings-list.component`, error);
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
		} else if (name === 'gaming.dashboard.device.quickSettings.rapidCharge') {
			this.setRapidChargeSettings(event.switchValue);
		}
	}
	public async getDolbySettings() {
		try {
			const dolbySettings = await this.audioService.getDolbyFeatureStatus();
			this.quickSettings[3].isVisible = dolbySettings.available;
			this.quickSettings[3].isChecked = dolbySettings.status;
			this.commonService.setLocalStorageValue(LocalStorageKey.DolbyModeCache, dolbySettings);

		} catch (err) {
			console.log(`ERROR in getDolbySettings()`, err);
		} finally {
			this.checkQuickSettingsVisibility();
		}
	}

	public async setDolbySettings(value: any) {
		try {
			const isDolbyUpdated = await this.audioService.setDolbyOnOff(value);
			if (isDolbyUpdated) {
				this.commonService.setLocalStorageValue(LocalStorageKey.DolbyModeCache, { available: this.quickSettings[3].isVisible, status: value });
			} else {
				this.quickSettings[3].isChecked = !value;
			}
		} catch (err) {
			console.log(`ERROR in setDolbySettings()`, err);
		}
	}

	public initialiseDolbyCache() {
		try {
			const { available, status } = this.commonService.getLocalStorageValue(LocalStorageKey.DolbyModeCache, { available: false, status: false });
			console.log(available,'=====================<>DOLBY', status);
			this.quickSettings[3].isVisible = available;
			this.quickSettings[3].isChecked = status;
		} catch (err) {
			console.log(`ERROR in initialiseDolbyCache()`, err);
		}
	}

	public async initialiseRapidChargeSettings() {
		try {
			const rapidChargeSettings: FeatureStatus = await this.powerService.getRapidChargeModeStatusIdeaNoteBook();
			this.commonService.setLocalStorageValue(LocalStorageKey.RapidChargeCache, rapidChargeSettings);
			this.quickSettings[1].isVisible = rapidChargeSettings.available || false;
			this.quickSettings[1].isChecked = rapidChargeSettings.status || false;
		} catch (err) {
			console.log(`ERROR in getRapidChargeSettings() of quickSettings`, err);
		} finally {
			this.checkQuickSettingsVisibility();
		}
	}

	public async setRapidChargeSettings(status: any) {
		try {
			const isRapidChargeStatusUpdated = await this.powerService.setRapidChargeModeStatusIdeaNoteBook(status);
			if (isRapidChargeStatusUpdated) {
				this.commonService.setLocalStorageValue(LocalStorageKey.RapidChargeCache, { available: this.quickSettings[1].isVisible, status: status });
			}
		} catch (err) {
			console.log(`ERROR in setRapidChargeSettings() of quickSettings`, err);
		}
	}

	public initialiseRapidChargeCache() {
		const { available, status } = this.commonService.getLocalStorageValue(LocalStorageKey.RapidChargeCache, { available: false, status: false });
		this.quickSettings[1].isVisible = available;
		this.quickSettings[1].isChecked = status;
	}

	ngOnDestroy(): void {
		this.unRegisterThermalModeEvent();
	}
}
