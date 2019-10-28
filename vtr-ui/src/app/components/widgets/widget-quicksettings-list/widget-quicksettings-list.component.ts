import { Router } from '@angular/router';
import { isUndefined } from 'util';
import { StatusTextPipe } from 'src/app/pipe/ui-security-statusbar/status-text.pipe';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from './../../../services/dialog/dialog.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { PowerService } from './../../../services/power/power.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { Component, OnInit, Input, AfterViewInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { ThermalModeStatus } from 'src/app/data-models/gaming/thermal-mode-status.model';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { Gaming } from 'src/app/enums/gaming.enum';
import { EventTypes, WifiSecurity, PluginMissingError, SecurityAdvisor, ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { WifiHomeViewModel, SecurityHealthViewModel } from 'src/app/data-models/security-advisor/wifisecurity.model';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { GuardService } from 'src/app/services/guard/security-guardService.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
	selector: 'vtr-widget-quicksettings-list',
	templateUrl: './widget-quicksettings-list.component.html',
	styleUrls: ['./widget-quicksettings-list.component.scss']
})
export class WidgetQuicksettingsListComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() title = '';
	securityAdvisor: SecurityAdvisor;
	wifiSecurity: WifiSecurity;
	isShowInvitationCode: boolean;
	wifiHomeViewModel: WifiHomeViewModel;
	securityHealthViewModel: SecurityHealthViewModel;
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
			readonly: false,
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			isChecked: false,
			tooltipText: '',
			id: 'quicksettings thermalmode',
			ariaLabel: 'thermal mode',
			type: 'auto-updates',
			settings: ''
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
			isVisible: true,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: false,
			tooltipText: '',
			id: 'quicksettings repidcharge',
			ariaLabel: 'repid charge',
			type: 'gaming.dashboard.device.quickSettings.rapidCharge',
			settings: ''
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
			readonly: true,
			isCollapsible: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: false,
			tooltipText: '',
			id: 'quicksettings wifisecurity',
			ariaLabel: 'wifi security',
			type: 'auto-updates',
			settings: 'quicksettings_wifisecurity'
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
			readonly: false,
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: false,
			tooltipText: '',
			id: 'quicksettings dolby',
			ariaLabel: 'dolby',
			type: 'gaming.dashboard.device.quickSettings.dolby',
			settings: 'quicksettings_dolby_gear'
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
	public gamingSettings: any = {};
	public isQuickSettingsVisible = true;
	constructor(
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private gamingThermalModeService: GamingThermalModeService,
		private commonService: CommonService,
		public shellServices: VantageShellService,
		private audioService: AudioService,
		private powerService: PowerService,
		private dialogService: DialogService,
		private ngZone: NgZone,
		public translate: TranslateService,
		public deviceService: DeviceService,
		private guard: GuardService,
		private router: Router
	) { }

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

		if (!this.gamingCapabilities.smartFanFeature) {
			this.quickSettings[0].isVisible = false;
		}

		if (!this.gamingSettings.winKeyLockFeature) {
			this.quickSettings[2].isVisible = true;
		}
		this.checkQuickSettingsVisibility();
		// Initialize Quicksetting;
		this.quicksettingListInit();
		// Binding regThermalMode event
		if (this.gamingCapabilities.smartFanFeature) {
			this.registerThermalModeEvent();
		}
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.gamingCapabilities = response.payload;
				if (this.gamingCapabilities.smartFanFeature) {
					this.registerThermalModeEvent();
				}
				this.quicksettingListInit();
			}
		});
	}
	private handleError(err) {
		if (err && err instanceof PluginMissingError) {
			this.dialogService.wifiSecurityErrorMessageDialog();
		}
	}
	ngAfterViewInit() { }
	public unRegisterThermalModeEvent() {
		this.shellServices.unRegisterEvent(
			EventTypes.gamingThermalModeChangeEvent,
			this.onRegThermalModeEvent.bind(this)
		);
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
		if (status !== undefined) {
			const regThermalModeStatusObj = new ThermalModeStatus();
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
		this.quickSettings[0].isVisible = gamingStatus.smartFanFeature;
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
				if (thermalModeStatus !== undefined) {
					this.drop.curSelected = thermalModeStatus;
					const ThermalModeStatusObj = new thermalModeStatus();
					ThermalModeStatusObj.thermalModeStatus = thermalModeStatus;
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
				.setThermalModeStatus(this.setThermalModeStatus.thermalModeStatus)
				.then((statusValue: boolean) => {
					if (!statusValue) {
						this.drop.curSelected = this.GetThermalModeCacheStatus();
					} else if (statusValue) {
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
				.catch((error) => { });
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
			const dolbySettings = await this.audioService.getDolbyFeatureStatus();
			this.quickSettings[3].isVisible = dolbySettings.available;
			this.quickSettings[3].isChecked = dolbySettings.status;
			this.commonService.setLocalStorageValue(LocalStorageKey.DolbyModeCache, dolbySettings);
		} catch (err) {
		} finally {
			this.checkQuickSettingsVisibility();
		}
	}

	public async setDolbySettings(value: any) {
		try {
			const isDolbyUpdated = await this.audioService.setDolbyOnOff(value);
			if (isDolbyUpdated) {
				this.commonService.setLocalStorageValue(LocalStorageKey.DolbyModeCache, {
					available: this.quickSettings[3].isVisible,
					status: value
				});
			} else {
				this.quickSettings[3].isChecked = !value;
			}
		} catch (err) { }
	}

	public async getWifiSecuritySettings() {
		this.securityAdvisor = this.shellServices.getSecurityAdvisor();
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		this.wifiHomeViewModel = new WifiHomeViewModel(this.wifiSecurity, this.commonService, this.ngZone, this.dialogService);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage, true);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog, true);
		await this.wifiSecurity.getWifiState().then((res) => { }, (error) => {
			this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
		});
		// To check if wifi security feature is available
		if (!this.wifiSecurity.isSupported) {
			this.quickSettings[2].isVisible = false;
		} else {
			this.commonService.setLocalStorageValue(LocalStorageKey.WifiSecurityCache, true);
			this.quickSettings[2].isVisible = true;
		}
		if (this.wifiHomeViewModel.isLWSEnabled) {
			this.quickSettings[2].isChecked = true;
		} else {
			this.quickSettings[2].isChecked = false;
		}
		if (this.wifiSecurity) {
			if (this.guard.previousPageName !== 'device-gaming' && !this.guard.previousPageName.startsWith('Security')) {
				await this.wifiSecurity.refresh().catch((err) => this.handleError(err));
				await this.wifiSecurity.getWifiSecurityState().catch((err) => this.handleError(err));
			}
		}
	}

	public runLocationService() {
		const wifiSecurity = this.securityAdvisor.wifiSecurity;
		wifiSecurity.on(EventTypes.wsStateEvent, (value) => {
			if (value) {
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value);
				if (this.wifiSecurity.isLocationServiceOn !== undefined) {
					this.wifiHomeViewModel.isLWSEnabled = (value === 'enabled' && this.wifiSecurity.isLocationServiceOn);
					if (value === 'enabled' && this.wifiHomeViewModel.isLWSEnabled === true) {
						this.quickSettings[2].isChecked = true;
					} else {
						this.quickSettings[2].isChecked = false;
					}
				}
			}
		}).on(EventTypes.wsIsLocationServiceOnEvent, (value) => {
			this.ngZone.run(() => {
				if (value && this.wifiHomeViewModel.isLWSEnabled === true) {
					this.quickSettings[2].isChecked = true;
				} else {
					this.quickSettings[2].isChecked = false;
				}
			});
		});
	}

	public async setWifiSecuritySettings(value: any) {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage) === true) {
			if (this.wifiHomeViewModel.isLWSEnabled) {
				this.wifiHomeViewModel.wifiSecurity.disableWifiSecurity().then((res) => {
					if (res === true) {
						this.wifiHomeViewModel.isLWSEnabled = false;
						this.quickSettings[2].isChecked = false;
						this.quickSettings[2].readonly = true;

					} else {
						this.wifiHomeViewModel.isLWSEnabled = true;
						this.quickSettings[2].isChecked = true;
						this.quickSettings[2].readonly = false;
					}
				});
			} else {
				this.wifiHomeViewModel.wifiSecurity.enableWifiSecurity().then((res) => {
					if (res === true) {
						this.wifiHomeViewModel.isLWSEnabled = true;
						this.quickSettings[2].isChecked = true;
						this.quickSettings[2].readonly = false;
					} else {
						this.wifiHomeViewModel.isLWSEnabled = false;
						this.quickSettings[2].isChecked = false;
						this.quickSettings[2].readonly = true;
					}
				},
					(error) => {
						this.dialogService.wifiSecurityLocationDialog(this.wifiHomeViewModel.wifiSecurity);
						this.quickSettings[2].isChecked = false;
						this.quickSettings[2].readonly = true;
						this.wifiHomeViewModel.isLWSEnabled = false;
					}
				);
			}
		}
	}

	public initialiseDolbyCache() {
		try {
			const { available, status } = this.commonService.getLocalStorageValue(LocalStorageKey.DolbyModeCache, {
				available: false,
				status: false
			});
			this.quickSettings[3].isVisible = available;
			this.quickSettings[3].isChecked = status;
		} catch (err) { }
	}

	public initializeWifiSecCache() {
		const cacheWifiSecurityState = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const status = this.commonService.getLocalStorageValue(LocalStorageKey.WifiSecurityCache);
		cacheWifiSecurityState === 'enabled' ? this.quickSettings[2].isChecked = true : this.quickSettings[2].isChecked = false;
		status === true ? this.quickSettings[2].isVisible = true : this.quickSettings[2].isVisible = false;
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
			}
		} catch (err) { }
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
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityInWifiPage, false);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowPluginMissingDialog, false);
		if (this.router.routerState.snapshot.url.indexOf('security') === -1 && this.router.routerState.snapshot.url.indexOf('device-gaming') === -1) {
			if (this.securityAdvisor.wifiSecurity) {
				this.securityAdvisor.wifiSecurity.cancelGetWifiSecurityState();
			}
		}
	}
}
