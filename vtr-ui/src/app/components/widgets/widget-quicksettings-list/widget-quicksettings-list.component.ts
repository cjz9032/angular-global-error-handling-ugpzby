import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { EventTypes, SecurityAdvisor, WifiSecurity} from '@lenovo/tan-client-bridge';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { DolbyModeResponse } from 'src/app/data-models/audio/dolby-mode-response';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { PowerService } from './../../../services/power/power.service';
import { WifiSecurityService } from 'src/app/services/security/wifi-security.service';
import { DialogService } from './../../../services/dialog/dialog.service';
import { AudioService } from 'src/app/services/audio/audio.service';

@Component({
	selector: 'vtr-widget-quicksettings-list',
	templateUrl: './widget-quicksettings-list.component.html',
	styleUrls: ['./widget-quicksettings-list.component.scss'],
})
export class WidgetQuicksettingsListComponent implements OnInit, OnDestroy {
	@Input() title = '';
	public quickSettingsListIndex = {
		thermalMode: 0,
		rapidCharge: 1,
		wifiSecurity: 2,
		dolby: 3
	}
	public quickSettingsList = [
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
			isQuickSettings: true,
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
			isQuickSettings: true,
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
			isQuickSettings: true,
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
			isQuickSettings: true,
		},
	];
	public thermalModeDropList = {
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
				value: 3,
			},
			{
				header: 'gaming.dashboard.device.quickSettings.status.balance',
				name: 'gaming.dashboard.device.quickSettings.status.balance',
				description: 'gaming.dashboard.device.quickSettings.statusText.balText',
				id: 'thermal mode balance',
				ariaLabel: 'balance',
				metricitem: 'thermalmode_balance',
				value: 2,
			},
			{
				header: 'gaming.dashboard.device.quickSettings.status.quiet',
				name: 'gaming.dashboard.device.quickSettings.status.quiet',
				description: 'gaming.dashboard.device.quickSettings.statusText.quietText',
				id: 'thermal mode quiet',
				ariaLabel: 'quiet',
				metricitem: 'thermalmode_quiet',
				value: 1,
			},
		],
	};

	
	public gamingCapabilities = new GamingAllCapabilities();
	public isQuickSettingsVisible = false;
	// only support thermal mode 1.0
	public thermalModeEvent: any;
	public rapidChargeSettings: any;
	public locationServiceState = false;
	public dolbySettings: DolbyModeResponse;
	private notificationService: Subscription;

	// public wifiSecurity: WifiSecurity;
	// public securityAdvisor: SecurityAdvisor;
	
	
	constructor(
		public shellServices: VantageShellService,
		private commonService: CommonService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private gamingThermalModeService: GamingThermalModeService,
		private powerService: PowerService,
		private wifiSecurityService: WifiSecurityService,
		private localCacheService: LocalCacheService,
		private dialogService: DialogService,
		private audioService: AudioService,
		private logger: LoggerService,
		private ngZone: NgZone
	) {}

	ngOnInit() {
		//////////////////////////////////////////////////////////////////////
		// Get capabilities from cache                                      //
		// Feature 0: Smart fan feature & thermal Mode version              //
		// Feature 1: Rapid charge                                          //
		// Feature 2: Wifi Security                                         //
		// Feature 3: Dolby                                                 //
		//////////////////////////////////////////////////////////////////////
		this.gamingCapabilities.smartFanFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.smartFanFeature
		);
		this.gamingCapabilities.thermalModeVersion = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.thermalModeVersion
		);
		if (this.gamingCapabilities.smartFanFeature && this.gamingCapabilities.thermalModeVersion === 1) {
			this.quickSettingsList[this.quickSettingsListIndex.thermalMode].isVisible = true;
		}
		this.rapidChargeSettings = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.RapidChargeCache, 
			{
				available: false,
				status: false,
			}
		);
		this.quickSettingsList[this.quickSettingsListIndex.rapidCharge].isVisible = this.rapidChargeSettings.available;
		// wifi
		this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.WifiSecurityCache,
			false
		)
		// dolby
		this.dolbySettings = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.DolbyAudioToggleCache
		)
		if(this.dolbySettings) {
			this.quickSettingsList[this.quickSettingsListIndex.dolby].isVisible = this.dolbySettings.available;
		}
		
		//////////////////////////////////////////////////////////////////////
		// Get status from cache                                            //
		// Feature 0: Smart fan feature & thermal Mode version              //
		// Feature 1: Rapid charge                                          //
		// Feature 2: Wifi Security                                         //
		// Feature 3: Dolby                                                 //
		//////////////////////////////////////////////////////////////////////
		if(this.quickSettingsList[this.quickSettingsListIndex.thermalMode].isVisible === true) {
			this.thermalModeDropList.curSelected = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.CurrentThermalModeStatus
			);
		}
		if(this.quickSettingsList[this.quickSettingsListIndex.rapidCharge].isVisible) {
			this.quickSettingsList[this.quickSettingsListIndex.rapidCharge].isChecked = this.rapidChargeSettings.status;
		}
		// wifi
		if(this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible) {
			this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.SecurityWifiSecurityState
			) === 'enabled' ? true : false;
		}
		// dolby
		if(this.quickSettingsList[this.quickSettingsListIndex.dolby].isVisible) {
			this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked = this.dolbySettings.isAudioProfileEnabled;
		}
		//////////////////////////////////////////////////////////////////////
		// Initialize Quick Settings Component                              //
		//////////////////////////////////////////////////////////////////////
		this.quicksettingListInit();
	}

	ngOnDestroy(): void {
		if(this.gamingCapabilities.smartFanFeature && this.gamingCapabilities.thermalModeVersion === 1) {
			this.unRegisterThermalModeChangeEvent();
		}

		if (this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible) {
			this.commonService.setSessionStorageValue(
				SessionStorageKey.SecurityWifiSecurityInGamingDashboard,
				false
			);
			this.commonService.setSessionStorageValue(
				SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog,
				false
			);
			this.wifiSecurityService.wifiSecurity.cancelGetWifiSecurityState();
			this.wifiSecurityService.wifiSecurity.off(
				EventTypes.wsStateEvent,
				this.wifiSecurityStateEventHandler
			);
			this.wifiSecurityService.wifiSecurity.off(
				EventTypes.wsIsLocationServiceOnEvent,
				this.wifiSecurityLocationServiceEventHandler
			);
			this.wifiSecurityService.wifiSecurity.off(
				EventTypes.wsPluginMissingEvent,
				this.wifiSecurityPluginMissingEventHandler
			);
			this.wifiSecurityService.wifiSecurity.off(
				EventTypes.wsIsSupportWifiEvent,
				this.wifiSecuritySupportedEventHandler
			);
		}

		if(this.dolbySettings.available) {
			this.unRegisterDolbyEvent();
		}

		if (this.notificationService) {
			this.notificationService.unsubscribe();
		}
	}


	public quicksettingListInit() {
		//////////////////////////////////////////////////////////////////////
		// Render isVisiable & get status from JSBridge                     //
		// Feature 0: Refresh gaming capabilities                           //
		// Feature 1: Thermal Mode 1.0                                      //
		// Feature 2: Rapid Charge                                          //
		// Feature 3: Wifi Security                                         //
		// Feature 4: Dolby                                                 //
		//////////////////////////////////////////////////////////////////////
		this.notificationService = this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === '[Gaming] GamingCapabilities') {
				this.gamingCapabilities = response.payload;
				if (this.gamingCapabilities.smartFanFeature &&
					this.gamingCapabilities.thermalModeVersion === 1
				) {
					this.quickSettingsList[this.quickSettingsListIndex.thermalMode].isVisible = true;
					this.unRegisterThermalModeChangeEvent();
					this.getThermalModeStatus();
					this.thermalModeEvent = this.onRegThermalModeChangeEvent.bind(this);
					this.registerThermalChangeModeEvent();
				} else {
					this.quickSettingsList[this.quickSettingsListIndex.thermalMode].isVisible = false;
					this.unRegisterThermalModeChangeEvent();
				}
				this.checkQuickSettingsVisibility();
			}
		});
		if (this.quickSettingsList[this.quickSettingsListIndex.thermalMode].isVisible === true) {
			this.getThermalModeStatus();
			this.thermalModeEvent = this.onRegThermalModeChangeEvent.bind(this);
			this.registerThermalChangeModeEvent();
		}
		this.getRapidChargeSettings();
		this.getWifiSecuritySupported();
		this.getDolbySettings();
		this.checkQuickSettingsVisibility();
	}

	//////////////////////////////////////////////////////////////////////
	// Common Function                                                  //
	// 1. Check quick settings visibility                               //
	// 2. Drop down menu iption selected for thermal mode 1.0           //
	// 2. Toggle statue changed                                         //
	//////////////////////////////////////////////////////////////////////
	public checkQuickSettingsVisibility() {
		let isVisible = false;
		this.quickSettingsList.forEach((settings: any) => {
			if (settings.isVisible) {
				isVisible = true;
				this.logger.info(
					`Widget-QuickSettingsList-CheckQuickSettingsVisibility: 
						${settings.name} is visible`
				);
			}
		});
		this.isQuickSettingsVisible = isVisible;
	}
	public onOptionSelected(event) {
		this.logger.info(
			`Widget-QuickSettingsList-OnOptionSelected: 
				event name is ${event.target.name}, event status is ${event.option.value}`
		);
		if (event.target.name === 'gaming.dashboard.device.quickSettings.title') {
			this.setThermalModeStatus(event.option.value);
		}
	}
	public onToggleStateChanged(event: any) {
		let { name } = event.target;
		let status = event.target.value === 'false' ? false : true;
		this.logger.info(
			`Widget-QuickSettingsList-OnToggleStateChanged: 
				event name is ${event.target}, event status is ${status}`
		);
		if (name === 'gaming.dashboard.device.quickSettings.rapidCharge') {
			this.setRapidChargeSettings(status);
		} else if (name === 'gaming.dashboard.device.quickSettings.wifiSecurity') {
			this.setWifiSecuritySettings(status);
		} else if (name === 'gaming.dashboard.device.quickSettings.dolby') {
			this.setDolbySettings(status);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Thermal Mode 1.0                                                 //
	// 1. Get status of thermal mode from JSBridge                      //
	// 2. Set thermal mode status                                       //
	// 2. Register thermal mode change event                            //
	// 3. Unregister thermal mode change event                          //
	// 4. Callback of thermal mode change event                         //
	//////////////////////////////////////////////////////////////////////
	public getThermalModeStatus() {
		try {
			this.gamingThermalModeService.getThermalModeSettingStatus().then(res => {
				this.logger.info(
					`Widget-QuickSettingsList-GetThermalModeStatus: 
						get value from ${this.thermalModeDropList.curSelected} to ${res}`
				);
				if(res !== undefined && res !== this.thermalModeDropList.curSelected) {
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.PrevThermalModeStatus, 
						this.thermalModeDropList.curSelected
					);
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.CurrentThermalModeStatus, res
					);
					this.thermalModeDropList.curSelected = res;
				}
			})
		} catch (error) {
			this.logger.error(
				'Widget-QuickSettingsList-GetThermalModeStatus: get fail; Error message: ', 
				error.message
			);
		}
	}
	public setThermalModeStatus(value: number) {
		if (value !== this.thermalModeDropList.curSelected) {
			let prevThermalModeStatus = this.thermalModeDropList.curSelected;
			this.thermalModeDropList.curSelected = value;
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.CurrentThermalModeStatus, this.thermalModeDropList.curSelected
			);
			try {
				this.gamingThermalModeService.setThermalModeSettingStatus(value).then((res) => {
					if (res) {
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.PrevThermalModeStatus, prevThermalModeStatus
						);
						this.logger.info(
							`Widget-QuickSettingsList-setThermalModeStatus: 
								return value: ${res}, thermalmode setting from ${prevThermalModeStatus} to ${this.thermalModeDropList.curSelected}`
						);
					} else {
						this.thermalModeDropList.curSelected = prevThermalModeStatus;
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.CurrentThermalModeStatus, this.thermalModeDropList.curSelected
						);
						this.logger.error(
							`Widget-QuickSettingsList-setThermalModeStatus: 
								return value: ${res}, thermalmode setting unchanged`
						);
					}
				});
			} catch (error) {
				this.thermalModeDropList.curSelected = prevThermalModeStatus;
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.CurrentThermalModeStatus,	this.thermalModeDropList.curSelected
				);
				this.logger.error(
					`Widget-QuickSettingsList-setThermalModeStatus: set fail; Error message: `, 
					error.message
				);
				throw new Error(error.message);
			}
		}
	}
	public registerThermalChangeModeEvent() {
		if (this.gamingCapabilities.smartFanFeature) {
			try {
				this.gamingThermalModeService.regThermalModeChangeEvent();
				this.shellServices.registerEvent(EventTypes.gamingThermalModeChangeEvent, this.thermalModeEvent);
				this.logger.info(
					'Widget-QuickSettingsList-registerThermalModeEvent: register success'
				);
			} catch (error) {
				this.logger.error(
					'Widget-QuickSettingsList-registerThermalModeEvent: register fail; Error message: ', 
					error.message
				);
				throw new Error(error.message);
			}
		}
	}
	public unRegisterThermalModeChangeEvent() {
		this.shellServices.unRegisterEvent(
			EventTypes.gamingThermalModeChangeEvent, 
			this.thermalModeEvent
		);
	}
	public onRegThermalModeChangeEvent(status: any) {
		this.logger.info(
			`Widget-QuickSettingsList-OnRegThermalModeEvent: 
				call back from ${this.thermalModeDropList.curSelected} to ${status}`
		);
		if (status !== undefined) {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.PrevThermalModeStatus, 
				this.thermalModeDropList.curSelected
			);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.CurrentThermalModeStatus, 
				status
			);
			this.thermalModeDropList.curSelected = status;
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Rapid Charge                                                     //
	// 1. Get rapid charge settings from JSBridge                       //
	// 2. Set rapid charge state                                        //
	//////////////////////////////////////////////////////////////////////
	public getRapidChargeSettings() {
		try {
			this.powerService.getRapidChargeModeStatusIdeaNoteBook().then(res => {
				this.logger.info(
					`Widget-QuickSettingsList-getRapidChargeSettings: 
						get value from ${this.rapidChargeSettings} to ${res}`
				);
				if(res !== undefined && res.available === true) {
					if(res.status !== undefined && res.status !== this.rapidChargeSettings.status) {
						this.rapidChargeSettings = res;
						this.quickSettingsList[this.quickSettingsListIndex.rapidCharge].isChecked = res.status;
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.RapidChargeCache,
							res
						);
					}
				} else {
					this.quickSettingsList[this.quickSettingsListIndex.rapidCharge].isVisible = false;
				}
			})
		} catch (error) {
			this.logger.error(
				'Widget-QuickSettingsList-GetThermalModeStatus: get fail; Error message: ', 
				error.message
			);
		} finally {
			this.checkQuickSettingsVisibility();
		}
	}
	public setRapidChargeSettings(status: any) {
		try {
			this.powerService.setRapidChargeModeStatusIdeaNoteBook(status).then(res => {
				this.logger.info(
					`Widget-QuickSettingsList-setThermalModeStatus: 
						return value: ${res}, thermalmode setting from ${this.rapidChargeSettings} to ${status}`
				);
				if(res !== undefined) {
					this.rapidChargeSettings.status = status;
					this.quickSettingsList[this.quickSettingsListIndex.rapidCharge].isChecked = status;
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.RapidChargeCache,
						this.rapidChargeSettings
					);
				}
			})
		} catch (error) {
			this.logger.error(
				'Widget-QuickSettingsList-setRapidChargeSettings: get fail; Error message: ', 
				error.message
			);
		}
	}

	//////////////////////////////////////////////////////////////////////
	// Wifi Security                                                    //
	// 1. Get wifi security supported state form JSBridge               //
	// 2. Get wifi security state form JSBridge                         //
	// 3. Set wifi security state                                       //
	// 4. Handle wifi security supported change event                   //
	// 5. Handle wifi security plugin missing event                     //
	// 6. Handle wifi security state change event                       //
	// 7. Handle location service change event                          //
	//////////////////////////////////////////////////////////////////////
	public getWifiSecuritySupported() {
		let isSupported = this.wifiSecurityService.wifiSecurity.isSupported;
		this.logger.info(
			`Widget-QuickSettingsList-GetWifiSecuritySupported: 
				get value from ${this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible} to ${isSupported}`
		);
		if(isSupported !== undefined &&
			this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible !== isSupported
		) {
			this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible = isSupported;
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.WifiSecurityCache, 
				isSupported
			)
		}
		this.wifiSecurityService.wifiSecurity.on(EventTypes.wsIsSupportWifiEvent, this.wifiSecuritySupportedEventHandler);
		this.wifiSecurityService.wifiSecurity.on(EventTypes.wsPluginMissingEvent, this.wifiSecurityPluginMissingEventHandler);
		this.checkQuickSettingsVisibility();
		if(this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible) {
			this.getWifiSecuritySettings();
		}
	}

	public async getWifiSecuritySettings() {
		//  Pop up location permission dialog
		this.wifiSecurityService.wifiSecurity.getWifiState().then(
			(res) => {
			},
			(error) => {
				this.logger.info(
					`Widget-QuickSettingsList-GetWifiSecuritySettings: 
						Location Service off, pop up a dialog`
				);
				this.dialogService.wifiSecurityLocationDialog(this.wifiSecurityService.wifiSecurity);
			}
		);
		this.logger.info(
			`Widget-QuickSettingsList-GetWifiSecuritySettings: 
				get value from ${this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked} to ${this.wifiSecurityService.isLWSEnabled}`
		);
		if(this.wifiSecurityService.isLWSEnabled !== undefined) {
			this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = this.wifiSecurityService.isLWSEnabled;
		}
		this.commonService.setSessionStorageValue(
			SessionStorageKey.SecurityWifiSecurityInGamingDashboard,
			true
		);
		this.commonService.setSessionStorageValue(
			SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog,
			true
		);
		this.wifiSecurityService.wifiSecurity.on(EventTypes.wsStateEvent, this.wifiSecurityStateEventHandler);
		this.wifiSecurityService.wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, this.wifiSecurityLocationServiceEventHandler);
		// Event connected of JSBridge and plugin ???
		this.wifiSecurityService.wifiSecurity.getWifiSecurityState();
	}

	public async setWifiSecuritySettings(value: any) {
		if (this.wifiSecurityService.isLWSEnabled) {
			this.wifiSecurityService.wifiSecurity.disableWifiSecurity().then((res) => {
				this.logger.info(
					`Widget-QuickSettingsList-SetWifiSecuritySettings: 
						return value: ${res}, wifiSecurity state from ${this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked} to ${!res}`
				);
				if (res === true) {
					this.wifiSecurityService.isLWSEnabled = false;
					this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = false;
					this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].readonly = true;
				} else {
					this.wifiSecurityService.isLWSEnabled = true;
					this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = true;
					this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].readonly = false;
				}
			});
		} else {
			this.wifiSecurityService.wifiSecurity.enableWifiSecurity().then((res) => {
				this.logger.info(
					`Widget-QuickSettingsList-SetWifiSecuritySettings: 
						return value: ${res}, wifiSecurity state from ${this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked} to ${res}`
				);
				if (res === true) {
					this.wifiSecurityService.isLWSEnabled = true;
					this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = true;
					this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].readonly = false;
				} else {
					this.wifiSecurityService.isLWSEnabled = false;
					this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = false;
					this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].readonly = true;
				}
			}, (error) => {
				//  Pop up location permission dialog
				this.logger.info(
					`Widget-QuickSettingsList-SetWifiSecuritySettings: 
						Location Service off, pop up a dialog`
				);
				this.dialogService.wifiSecurityLocationDialog(
					this.wifiSecurityService.wifiSecurity
				);
				this.wifiSecurityService.isLWSEnabled = false;
				this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = false;
				this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].readonly = true;
			});
		}
	}
	
	wifiSecuritySupportedEventHandler = (res) => {
		this.logger.info(
			`Widget-QuickSettingsList-WifiSecuritySupportedEventHandler: 
				call back from ${this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible} to ${res}`
		);
		if(res !== undefined && res !== this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible) {
			this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible =  res;
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.WifiSecurityCache, 
				res
			)
			this.checkQuickSettingsVisibility();
		}
	};

	wifiSecurityPluginMissingEventHandler = () => {
		this.logger.info(
			`Widget-QuickSettingsList-WifiSecurityPluginMissingEventHandler: 
				call back from ${this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible} to false`
		);
		this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isVisible =  false;
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.WifiSecurityCache, 
			false
		)
		this.checkQuickSettingsVisibility();
	};

	wifiSecurityStateEventHandler = (value) => {
		this.logger.info(
			`Widget-QuickSettingsList-WifiSecurityStateEventHandler: 
				call back from ${this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked} to ${this.wifiSecurityService.isLWSEnabled}`
		);
		this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = this.wifiSecurityService.isLWSEnabled;
	};

	wifiSecurityLocationServiceEventHandler = (value) => {
		this.ngZone.run(() => {
			if (value !== undefined) {
				this.logger.info(
					`Widget-QuickSettingsList-WifiSecurityLocationServiceEventHandler: 
						location service state is ${value}`
				);
				if (!value && 
					this.wifiSecurityService.wifiSecurity.state === 'enabled' && 
					this.wifiSecurityService.wifiSecurity.hasSystemPermissionShowed
				) {
					this.logger.info(
						`Widget-QuickSettingsList-WifiSecurityLocationServiceEventHandler: 
							wifiSecurite state from ${this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked} to false,
							pop up a dialog`
					);
					this.dialogService.wifiSecurityLocationDialog(this.wifiSecurityService.wifiSecurity);
					this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = false;
					this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].readonly = true;
				} else if (value) {
					if (this.commonService.getSessionStorageValue(
							SessionStorageKey.SecurityWifiSecurityLocationFlag
						) === 'yes'
					) {
						this.commonService.setSessionStorageValue(
							SessionStorageKey.SecurityWifiSecurityLocationFlag,
							'no'
						);
						this.wifiSecurityService.wifiSecurity.enableWifiSecurity().then(res => {
							this.logger.info(
								`Widget-QuickSettingsList-WifiSecurityLocationServiceEventHandler:
									locationFlag is yes,
									enableWifiSecurity return value: ${res}, 
									wifiSecurity state from ${this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked} to ${res}`
							);
							if (res === true) {
								this.wifiSecurityService.isLWSEnabled = true;
								this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = true;
								this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].readonly = false;
							} else {
								this.wifiSecurityService.isLWSEnabled = false;
								this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = false;
								this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].readonly = true;
							}
						});
					} else {
						this.logger.info(
							`Widget-QuickSettingsList-WifiSecurityLocationServiceEventHandler:
								locationFlag is no,
								wifiSecurity state from ${this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked} to ${this.wifiSecurityService.isLWSEnabled}`
						);
						this.quickSettingsList[this.quickSettingsListIndex.wifiSecurity].isChecked = this.wifiSecurityService.isLWSEnabled;
					}
				}
			}
		});
	};
	

	//////////////////////////////////////////////////////////////////////
	// Dolby                                                            //
	// 1. Get dolby settings from JSBridge                              //
	// 2. Set dolby status                                              //
	// 3. Version 3.3: Register dolby change event                      //
	// 4. Version 3.3: Unregister dolby change event                    //
	// 5. Version 3.3: Handle dolby change event                        //
	//////////////////////////////////////////////////////////////////////
	public getDolbySettings() {
		try {
			this.audioService.getDolbyMode().then((res: DolbyModeResponse) => {
				if (res !== undefined) {
					this.logger.info(
						`Widget-quicksettingslist-GetDolbySettings: 
							return value: ${res}, dolby.checked from ${this.quickSettingsList[3].isChecked} to: ${res.isAudioProfileEnabled}`
					);
					if (this.quickSettingsList[this.quickSettingsListIndex.dolby].isVisible !== res.available ||
						this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked !== res.isAudioProfileEnabled
					) {
						this.dolbySettings = res;
						this.quickSettingsList[this.quickSettingsListIndex.dolby].isVisible = res.available;
						this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked = res.isAudioProfileEnabled;
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.DolbyAudioToggleCache,
							res
						);
					}
					if(res.available) {
						this.registerDolbyChangeEvent();
					}
				} else {
					this.logger.error(
						`Widget-quicksettingslist-GetDolbySettings: 
							return value: ${res}; dolby.visible keep ${this.quickSettingsList[this.quickSettingsListIndex.dolby].isVisible}, 
							dolby.checked keep ${this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked}`
					);
				}
			});
		} catch (error) {
			this.logger.error(
				`Widget-quicksettingslist-GetDolbySettings: get fail; Error message: `,
				error.message
			);
		}
	}
	public setDolbySettings(value: any) {
		try {
			// version 3.3 update due to dolby API modification
			this.audioService.setDolbyAudioState(value).then((res) => {
				if (res) {
					this.logger.info(
						`Widget-quicksettingslist-setDolbySettings: 
							return value: ${res}, dolbyMode from ${this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked} to: ${value}`
					);
					this.dolbySettings.isAudioProfileEnabled = value;
					this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked = value;
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.DolbyAudioToggleCache,
						this.dolbySettings
					);
				} else {
					this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked = !value;
					this.logger.error(
						`Widget-quicksettingslist-setDolbySettings: 
							return value: ${res}, dolbyMode from ${this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked} to: ${value}`
					);
				}
			});
		} catch (error) {
			this.logger.error(
				`Widget-quicksettingslist-SetDolbySettings: set fail; Error message: `,
				error.message
			);
		}
	}
	public registerDolbyChangeEvent() {
		try {
			this.audioService
				.startMonitorForDolby(this.handleDolbyChangeEvent.bind(this)).then((res) => {
					if (res) {
						this.logger.info(
							`Widget-QuickSettingsList-RegisterDolbyChangeEvent: return value: ${res}`
						);
					} else {
						this.logger.error(
							`Widget-QuickSettingsList-RegisterDolbyChangeEvent: return value: ${res}`
						);
					}
				});
		} catch (error) {
			this.logger.error(
				`Widget-QuickSettingsList-RegisterDolbyChangeEvent: register fail; Error message: `,
				error.message
			);
		}
	}
	public unRegisterDolbyEvent() {
		try {
			this.audioService.stopMonitorForDolby().then((res) => {
				if (res) {
					this.logger.info(
						`Widget-QuickSettingsList-UnRegisterDolbyEvent: return value: ${res}`
					);
				} else {
					this.logger.error(
						`Widget-QuickSettingsList-UnRegisterDolbyEvent: return value: ${res}`
					);
				}
			});
		} catch (error) {
			this.logger.error(
				`Widget-QuickSettingsList-UnRegisterDolbyEvent: unRegisterDolbyEvent fail; Error message: `,
				error.message
			);
		}
	}
	public handleDolbyChangeEvent(dolbyModeResponse) {
		if (dolbyModeResponse.available !== undefined &&
			dolbyModeResponse.isAudioProfileEnabled !== undefined
		) {
			this.logger.info(
				`Widget-quicksettingslist-handleDolbyChangeEvent: 
					return value: ${dolbyModeResponse}, dolbyMode from ${this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked} to: ${dolbyModeResponse.isAudioProfileEnabled}`
			);
			if (dolbyModeResponse.isAudioProfileEnabled !== this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked) {
				this.dolbySettings.isAudioProfileEnabled = dolbyModeResponse.isAudioProfileEnabled
				this.quickSettingsList[this.quickSettingsListIndex.dolby].isChecked = dolbyModeResponse.isAudioProfileEnabled;
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.DolbyAudioToggleCache,
					this.dolbySettings
				);
			}
		} else {
			this.logger.error(
				`Widget-quicksettingslist-handleDolbyChangeEvent: wrong response: ${dolbyModeResponse}`
			);
		}
	}
}
