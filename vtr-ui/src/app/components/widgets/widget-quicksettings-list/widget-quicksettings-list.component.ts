import { Router } from '@angular/router';
import { DialogService } from './../../../services/dialog/dialog.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { PowerService } from './../../../services/power/power.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { Component, OnInit, Input, OnDestroy, NgZone, HostListener } from '@angular/core';
import { ThermalModeStatus } from 'src/app/data-models/gaming/thermal-mode-status.model';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { Gaming } from 'src/app/enums/gaming.enum';
// It is better to import the bridge in service, but there is no service belong to wifi security to integrate all dependency
import { EventTypes, WifiSecurity, PluginMissingError, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { WifiSecurityService } from 'src/app/services/security/wifiSecurity.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { DolbyModeResponse } from 'src/app/data-models/audio/dolby-mode-response';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-widget-quicksettings-list',
	templateUrl: './widget-quicksettings-list.component.html',
	styleUrls: ['./widget-quicksettings-list.component.scss']
})
export class WidgetQuicksettingsListComponent implements OnInit, OnDestroy {
	@Input() title = '';
	securityAdvisor: SecurityAdvisor;
	wifiSecurity: WifiSecurity;
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
			isVisible: false,
			isCollapsible: true,
			readonly: false,
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			isChecked: false,
			tooltipText: '',
			id: 'quicksettings thermalmode',
			ariaLabel: 'thermal mode',
			type: 'auto-updates',
			settings: '',
			isQuickSettings: true
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
			readonly: false,
			isVisible: false,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: false,
			tooltipText: '',
			id: 'quicksettings repidcharge',
			ariaLabel: 'repid charge',
			type: 'gaming.dashboard.device.quickSettings.rapidCharge',
			settings: '',
			isQuickSettings: true
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
			isVisible: false,
			readonly: true,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: false,
			tooltipText: '',
			id: 'quicksettings wifisecurity',
			ariaLabel: 'wifi security',
			type: 'auto-updates',
			settings: 'quicksettings_wifisecurity',
			isQuickSettings: true
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
			isVisible: false,
			isCollapsible: false,
			readonly: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: false,
			tooltipText: '',
			id: 'quicksettings dolby',
			ariaLabel: 'dolby',
			type: 'gaming.dashboard.device.quickSettings.dolby',
			settings: 'quicksettings_dolby_gear',
			isQuickSettings: true
		}
	];

	public drop = {
		curSelected: 2,
		modeType: 2,
		dropOptions: [
			{
				header: 'gaming.dashboard.device.quickSettings.status.performance',
				name: 'gaming.dashboard.device.quickSettings.status.performance',
				description: 'gaming.dashboard.device.quickSettings.statusText.perText',
				id: 'thermal mode performance',
				ariaLabel: 'performance',
				metricitem: 'thermalmode_performance',
				value: 3
			},
			{
				header: 'gaming.dashboard.device.quickSettings.status.balance',
				name: 'gaming.dashboard.device.quickSettings.status.balance',
				description: 'gaming.dashboard.device.quickSettings.statusText.balText',
				id: 'thermal mode balance',
				ariaLabel: 'balance',
				metricitem: 'thermalmode_balance',
				value: 2
			},
			{
				header: 'gaming.dashboard.device.quickSettings.status.quiet',
				name: 'gaming.dashboard.device.quickSettings.status.quiet',
				description: 'gaming.dashboard.device.quickSettings.statusText.quietText',
				id: 'thermal mode quiet',
				ariaLabel: 'quiet',
				metricitem: 'thermalmode_quiet',
				value: 1
			}
		]
	};
	public isQuickSettingsVisible = false;
	wsPluginMissingEventHandler = () => {
		this.updateWifiSecurityState(false);
		this.handleError(new PluginMissingError());
	};
	wsIsSupportWifiEventHandler = (res) => {
		this.updateWifiSecurityState(res);
	};
	wsStateEventHandler = (value) => {
		if (value) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value);
			if (this.wifiSecurity.isLocationServiceOn !== undefined) {
				if (value === 'enabled' && this.wifiSecurityService.isLWSEnabled === true) {
					this.quickSettings[2].isChecked = true;
				} else {
					this.quickSettings[2].isChecked = false;
				}
			}
		}
	};
	wsIsLocationServiceOnEventHandler = (value) => {
		this.ngZone.run(() => {
			if (value !== undefined) {
				if (!value && this.wifiSecurity.state === 'enabled' && this.wifiSecurity.hasSystemPermissionShowed) {
					this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
					this.quickSettings[2].isChecked = false;
				} else if (value) {
					if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag) === 'yes') {
						this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag, 'no');
						this.wifiSecurity.enableWifiSecurity();
					}
					if (this.wifiSecurityService.isLWSEnabled) {
						this.quickSettings[2].isChecked = true;
					} else {
						this.quickSettings[2].isChecked = false;
					}
				}
			}
		});
	};

	thermalModeEvent: any;

	constructor(
		public wifiSecurityService: WifiSecurityService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private gamingThermalModeService: GamingThermalModeService,
		private commonService: CommonService,
		public shellServices: VantageShellService,
		private audioService: AudioService,
		private powerService: PowerService,
		private dialogService: DialogService,
		private ngZone: NgZone,
		private guard: GuardService,
		private router: Router,
		private logger: LoggerService,
	) {
		this.thermalModeEvent = this.onRegThermalModeEvent.bind(this);
	}

	ngOnInit() {
		this.initializeWifiSecCache();
		this.initialiseDolbyCache();
		this.initialiseRapidChargeCache();
		this.getDolbySettings();
		this.initialiseRapidChargeSettings();
		this.getWifiSecuritySettings();
		this.runLocationService();
		this.gamingCapabilities.smartFanFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.smartFanFeature
		);
		this.gamingCapabilities.smartFanStatus = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.PrevThermalModeStatus
		);
		this.gamingCapabilities.thermalModeVersion = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.thermalModeVersion
		);

		if (!this.gamingCapabilities.smartFanFeature) {
			this.quickSettings[0].isVisible = false;
		}

		this.checkQuickSettingsVisibility();
		// Initialize Quicksetting;
		this.quicksettingListInit();
		// Binding regThermalMode event
		if (this.gamingCapabilities.smartFanFeature && this.gamingCapabilities.thermalModeVersion === 1) {
			this.registerThermalModeEvent();
		}
		// Version3.3 Binding regDolby event
		if(this.quickSettings[3].isVisible) {
			this.registerDolbyChangeEvent();
		}
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.gamingCapabilities = response.payload;
				if (this.gamingCapabilities.smartFanFeature && this.gamingCapabilities.thermalModeVersion === 1) {
					this.unRegisterThermalModeEvent();
					this.registerThermalModeEvent();
				}
				this.quicksettingListInit();
			}
		});
	}

	handleError(err) {
		if (err && err instanceof PluginMissingError) {
			this.quickSettings[2].isVisible = false;
		} else {
			this.quickSettings[2].isVisible = true;
		}
	}

	public unRegisterThermalModeEvent() {
		this.shellServices.unRegisterEvent(
			EventTypes.gamingThermalModeChangeEvent,
			this.thermalModeEvent
		);
	}

	public registerThermalModeEvent() {
		if (this.gamingCapabilities.smartFanFeature) {
			this.gamingThermalModeService.regThermalModeChangeEvent();
			this.shellServices.registerEvent(
				EventTypes.gamingThermalModeChangeEvent,
				this.thermalModeEvent
			);
		}
	}

	public onRegThermalModeEvent(status: any) {
		if (status !== undefined) {
			// setting previous value to localstorage
			const regThermalModePreValue = this.GetThermalModeCacheStatus();
			this.commonService.setLocalStorageValue(LocalStorageKey.PrevThermalModeStatus, regThermalModePreValue);
			// setting current value to local storage
			this.commonService.setLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus, status);
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
		// Version 3.2 thermalModeVersion 2.0
		if (gamingStatus.thermalModeVersion === 2) {
			this.quickSettings[0].isVisible = false;
		} else {
			this.quickSettings[0].isVisible = gamingStatus.smartFanFeature;
			if (gamingStatus.smartFanFeature) {
				this.renderThermalModeStatus();
			}
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
				const thermalModeStatus = await this.gamingThermalModeService.getThermalModeSettingStatus();
				if (thermalModeStatus !== undefined) {
					this.drop.curSelected = thermalModeStatus;
					this.commonService.setLocalStorageValue(
						LocalStorageKey.CurrentThermalModeStatus,
						this.drop.curSelected
					);
				}
			}
		} catch (error) { }
	}

	public onOptionSelected(event) {
		if (event.target.name === 'gaming.dashboard.device.quickSettings.title') {
			if (this.setThermalModeStatus === undefined) {
				this.setThermalModeStatus = new ThermalModeStatus();
			}
			this.setThermalModeStatus.thermalModeStatus = event.option.value;
			this.gamingThermalModeService
				.setThermalModeSettingStatus(this.setThermalModeStatus.thermalModeStatus)
				.then((statusValue: boolean) => {
				if (!statusValue) {
					this.drop.curSelected = this.GetThermalModeCacheStatus();
				}
				if (statusValue) {
						// binding to UI
						this.drop.curSelected = this.setThermalModeStatus.thermalModeStatus;
						// updating the previous local cache value with last value of current local cache value
						const previousValue = this.GetThermalModeCacheStatus();
						this.commonService.setLocalStorageValue(LocalStorageKey.PrevThermalModeStatus, previousValue);
						try {
							// updating the current local cache value
							this.commonService.setLocalStorageValue(
								LocalStorageKey.CurrentThermalModeStatus,
								this.drop.curSelected
							);
						} catch (error) {
							// fail update loading previous cache value
							this.drop.curSelected = this.GetThermalModePrevCacheStatus();
						}
				}
				})
				.catch((error) => {throw new Error(error.message) });
		}
	}

	public onToggleStateChanged(event: any) {
		const { name } = event.target;
		let status = event.target.value;
		status = status === 'false' ? false : true;
		if (name === 'gaming.dashboard.device.quickSettings.dolby') {
			this.setDolbySettings(status);
		} else if (name === 'gaming.dashboard.device.quickSettings.rapidCharge') {
			this.setRapidChargeSettings(status);
		} else if (name === 'gaming.dashboard.device.quickSettings.wifiSecurity') {
			this.setWifiSecuritySettings(status);
		}
	}
	public async getDolbySettings() {
		try {
			// version 3.3  update due to dolby API modification
			this.audioService.getDolbyMode().then((res: DolbyModeResponse) => {
				if(res !== undefined ){
					this.logger.info(`Widget-quicksettingslist-getDolbySettings: return value: ${res}, dolby.checked from ${this.quickSettings[3].isChecked} to: ${res.isAudioProfileEnabled}`);
					if(this.quickSettings[3].isVisible !== res.available || this.quickSettings[3].isChecked !== res.isAudioProfileEnabled) {
						this.quickSettings[3].isVisible = res.available;
						this.quickSettings[3].isChecked = res.isAudioProfileEnabled;
						this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, res);
					}
				} else {
					this.logger.error(`Widget-quicksettingslist-getDolbySettings: return value: ${res}; dolby.visible keep ${this.quickSettings[3].isVisible}, dolby.checked keep ${this.quickSettings[3].isChecked}`);
				}
			});
		} catch (error) {
			this.logger.error(`Widget-quicksettingslist-getDolbySettings: get fail; Error message: `, error.message);
			throw new Error(error.message);
		} finally {
			this.checkQuickSettingsVisibility();
		}
	}

	public async setDolbySettings(value: any) {
		try {
			// version 3.3 update due to dolby API modification
			this.audioService.setDolbyAudioState(value).then(res => {
				if(res) {
					this.logger.info(`Widget-quicksettingslist-setDolbySettings: return value: ${res}, dolbyMode from ${this.quickSettings[3].isChecked} to: ${value}`);
					this.quickSettings[3].isChecked = value;
					const dolbyAudioCache: DolbyModeResponse = this.commonService.getLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache);
					dolbyAudioCache.isAudioProfileEnabled = value;
					this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, dolbyAudioCache);
				} else {
					this.quickSettings[3].isChecked = !value;
					this.logger.error(`Widget-quicksettingslist-setDolbySettings: return value: ${res}, dolbyMode from ${this.quickSettings[3].isChecked} to: ${value}`);
				}
			});
		} catch (error) {
			this.logger.error(`Widget-quicksettingslist-getDolbySettings: set fail; Error message: `, error.message);
			throw new Error(error.message);
		}
	}

	public async getWifiSecuritySettings() {
		// It's unreasonable to get bridge in component, there are too many works that shouldn't do here
		// maybe you need a wifiSecurity service to deal this processes
		this.securityAdvisor = this.shellServices.getSecurityAdvisor();
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		if (this.wifiSecurity) {
			this.wifiSecurity.on(EventTypes.wsPluginMissingEvent, this.wsPluginMissingEventHandler);
			this.wifiSecurity.on(EventTypes.wsIsSupportWifiEvent, this.wsIsSupportWifiEventHandler);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInGamingDashboard, true);
			this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog,true);
			this.wifiSecurity.getWifiState().then((res) => { },(error) => {
					this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
				});
			if (this.wifiSecurityService.isLWSEnabled) {
				this.quickSettings[2].isChecked = true;
			} else {
				this.quickSettings[2].isChecked = false;
			}
			if (
				this.guard.previousPageName !== 'device-gaming' &&
				!this.guard.previousPageName.startsWith('Security')
			) {
				// do nothing after getWifiSecurityState, is it reasonable?
				// getWifiSecurityState is a intermediate API, if the data changed, we can be notified by events.
				await this.wifiSecurity.refresh().catch((err) => this.handleError(err));
				this.wifiSecurity.getWifiSecurityState();
			}
		}
	}

	public updateWifiSecurityState(state = false) {
		this.commonService.setLocalStorageValue(LocalStorageKey.WifiSecurityCache, state);
		this.quickSettings[2].isVisible = state;
		this.checkQuickSettingsVisibility();
	}

	public runLocationService() {
		const wifiSecurity = this.securityAdvisor.wifiSecurity;
		if (this.wifiSecurity) {
			wifiSecurity.on(EventTypes.wsStateEvent, this.wsStateEventHandler)
				.on(EventTypes.wsIsLocationServiceOnEvent, this.wsIsLocationServiceOnEventHandler);
		}
	}

	public async setWifiSecuritySettings(value: any) {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInGamingDashboard) === true) {
			if (this.wifiSecurityService.isLWSEnabled) {
				this.wifiSecurityService.wifiSecurity.disableWifiSecurity().then((res) => {
					if (res === true) {
						this.wifiSecurityService.isLWSEnabled = false;
						this.quickSettings[2].isChecked = false;
						this.quickSettings[2].readonly = true;
					} else {
						this.wifiSecurityService.isLWSEnabled = true;
						this.quickSettings[2].isChecked = true;
						this.quickSettings[2].readonly = false;
					}
				});
			} else {
				this.wifiSecurityService.wifiSecurity.enableWifiSecurity().then(
					(res) => {
						if (res === true) {
							this.wifiSecurityService.isLWSEnabled = true;
							this.quickSettings[2].isChecked = true;
							this.quickSettings[2].readonly = false;
						} else {
							this.wifiSecurityService.isLWSEnabled = false;
							this.quickSettings[2].isChecked = false;
							this.quickSettings[2].readonly = true;
						}
					},
					(error) => {
						this.dialogService.wifiSecurityLocationDialog(this.wifiSecurityService.wifiSecurity);
						this.quickSettings[2].isChecked = false;
						this.quickSettings[2].readonly = true;
						this.wifiSecurityService.isLWSEnabled = false;
					}
				);
			}
		}
	}

	public initialiseDolbyCache() {
		try {
			// version 3.3 update due to dolby api modification
			const dolbyAudioCache: DolbyModeResponse = this.commonService.getLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache);
			if(dolbyAudioCache){
			this.quickSettings[3].isVisible = dolbyAudioCache.available;
			this.quickSettings[3].isChecked = dolbyAudioCache.isAudioProfileEnabled;
			}
		} catch (error) {
			throw new Error(error.message);
		 }
	}

	public initializeWifiSecCache() {
		const cacheWifiSecurityState = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const status = this.commonService.getLocalStorageValue(LocalStorageKey.WifiSecurityCache);
		cacheWifiSecurityState === 'enabled' ? (this.quickSettings[2].isChecked = true) : (this.quickSettings[2].isChecked = false);
		status === true ? (this.quickSettings[2].isVisible = true) : (this.quickSettings[2].isVisible = false);
	}

	public async initialiseRapidChargeSettings() {
		try {
			const rapidChargeSettings: FeatureStatus = await this.powerService.getRapidChargeModeStatusIdeaNoteBook();
			this.commonService.setLocalStorageValue(LocalStorageKey.RapidChargeCache, rapidChargeSettings);
			this.quickSettings[1].isVisible = rapidChargeSettings.available || false;
			this.quickSettings[1].isChecked = rapidChargeSettings.status || false;
		} catch (err) {
		} finally {
			this.checkQuickSettingsVisibility();
		}
	}

	public async setRapidChargeSettings(status: any) {
		try {
			const isRapidChargeStatusUpdated = await this.powerService.setRapidChargeModeStatusIdeaNoteBook(status);
			if (isRapidChargeStatusUpdated) {
				this.commonService.setLocalStorageValue(LocalStorageKey.RapidChargeCache, {
					available: this.quickSettings[1].isVisible,
					status
				});
			} else {
				this.initialiseRapidChargeCache();
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public initialiseRapidChargeCache() {
		const { available, status } = this.commonService.getLocalStorageValue(LocalStorageKey.RapidChargeCache, {
			available: false,
			status: false
		});
		this.quickSettings[1].isVisible = available;
		this.quickSettings[1].isChecked = status;
	}

	@HostListener('window:focus')
	onFocus(): void {
		if (this.wifiSecurity) {
			this.wifiSecurity.refresh().catch((err) => this.handleError(err));
		}
	}

	ngOnDestroy(): void {
		this.unRegisterThermalModeEvent();
		this.unRegisterDolbyEvent();
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInGamingDashboard, false);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog, false);
		if (this.securityAdvisor !== undefined && this.securityAdvisor.wifiSecurity) {
			if (
				this.router.routerState.snapshot.url.indexOf('security') === -1 &&
				this.router.routerState.snapshot.url.indexOf('device-gaming') === -1
			) {
				this.securityAdvisor.wifiSecurity.cancelGetWifiSecurityState();
			}
			this.securityAdvisor.wifiSecurity.off(EventTypes.wsStateEvent, this.wsStateEventHandler);
			this.securityAdvisor.wifiSecurity.off(EventTypes.wsIsLocationServiceOnEvent, this.wsIsLocationServiceOnEventHandler);
			this.securityAdvisor.wifiSecurity.off(EventTypes.wsPluginMissingEvent, this.wsPluginMissingEventHandler);
			this.securityAdvisor.wifiSecurity.off(EventTypes.wsIsSupportWifiEvent, this.wsIsSupportWifiEventHandler);
		}
	}

	// version 3.3 register & unregister dolby event
	public registerDolbyChangeEvent() {
		try {
			this.audioService.startMonitorForDolby(this.handleDolbyChangeEvent.bind(this)).then(res => {
				if(res) {
					this.logger.info(`Widget-quicksettingslist-registerDolbyChangeEvent: return value: ${res}`);
				} else {
					this.logger.error(`Widget-quicksettingslist-registerDolbyChangeEvent: return value: ${res}`);
				}
			})
		} catch (error) {
			this.logger.error(`Widget-quicksettingslist-registerDolbyChangeEvent: register fail; Error message: `, error.message);
			throw new Error(error.message);
		}
	}

	public handleDolbyChangeEvent(dolbyModeResponse) {
		if (dolbyModeResponse.available !== undefined && dolbyModeResponse.isAudioProfileEnabled !== undefined) {
			this.logger.info(`Widget-quicksettingslist-handleDolbyChangeEvent: return value: ${dolbyModeResponse}, dolbyMode from ${this.quickSettings[3].isChecked} to: ${dolbyModeResponse.isAudioProfileEnabled}`);
			if (dolbyModeResponse.isAudioProfileEnabled !== this.quickSettings[3].isChecked) {
				this.quickSettings[3].isChecked = dolbyModeResponse.isAudioProfileEnabled;
				const dolbyAudioCache: DolbyModeResponse = this.commonService.getLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache);
				dolbyAudioCache.isAudioProfileEnabled = dolbyModeResponse.isAudioProfileEnabled;
				this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, dolbyAudioCache);
			}
		} else {
			this.logger.error(`Widget-quicksettingslist-handleDolbyChangeEvent: wrong response: ${dolbyModeResponse}`);
		}
	}

	public unRegisterDolbyEvent() {
		try {
			this.audioService.stopMonitorForDolby().then(res => {
				if(res) {
					this.logger.info(`Widget-quicksettingslist-unRegisterDolbyEvent: return value: ${res}`);
				} else {
					this.logger.error(`Widget-quicksettingslist-unRegisterDolbyEvent: return value: ${res}`);
				}
			})
		} catch (error) {
			this.logger.error(`Widget-quicksettingslist-unRegisterDolbyEvent: unRegisterDolbyEvent fail; Error message: `, error.message);
			throw new Error(error.message);
		}
	}
}
