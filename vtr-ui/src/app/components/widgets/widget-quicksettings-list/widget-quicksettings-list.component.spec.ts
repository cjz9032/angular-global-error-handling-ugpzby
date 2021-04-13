import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AudioService } from 'src/app/services/audio/audio.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PowerService } from 'src/app/services/power/power.service';
import { WifiSecurityService } from 'src/app/services/security/wifi-security.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { WidgetQuicksettingsListComponent } from './widget-quicksettings-list.component';

describe('WidgetQuicksettingsListComponent', () => {
	let component: WidgetQuicksettingsListComponent;
	let fixture: ComponentFixture<WidgetQuicksettingsListComponent>;

	let smartFanFeatureCache = true;
	let thermalModeVersionCache = 1;
	let prevThermalModeStatusCache = 2;
	let currentThermalModeStatusCache = 2;
	let rapidChargeCache = { available: false, status: false };
	let wifiSecurityFeatureCache = false;
	let wifiSecurityStatusCache = 'enable';
	let dolbyAudioToggleCache = {
		available: false,
		supportedModes: ['Dynamic', 'Movie', 'Music', 'Games', 'Voip'],
		isAudioProfileEnabled: false,
		currentMode: 'Games',
		voIPStatus: 'True',
		entertainmentStatus: 'True',
	};
	let securityWifiSecurityInGamingDashboardCache = false;
    let securityWifiSecurityShowPluginMissingDialogCache = false;
    let securityWifiSecurityLocationFlagCache = 'yes';

	let thermalModeStatus = 2;
	const rapidChargeSettings = { available: false, status: false };
	let dolbyAudioToggle = {
		available: false,
		supportedModes: ['Dynamic', 'Movie', 'Music', 'Games', 'Voip'],
		isAudioProfileEnabled: false,
		currentMode: 'Games',
		voIPStatus: 'True',
		entertainmentStatus: 'True',
	};
	let setReturnValue = true;

	const commonServiceMock = {
		getCapabalitiesNotification() {
			const res = {
				type: '[Gaming] GamingCapabilities',
				payload: {
					smartFanFeature: smartFanFeatureCache,
					thermalModeVersion: thermalModeVersionCache,
				},
			};
			return of(res);
		},
		getSessionStorageValue(key: any, defaultValue?: any) {
			switch (key) {
				case '[SessionStorageKey] SecurityWifiSecurityInGamingDashboard':
					return securityWifiSecurityInGamingDashboardCache;
				case '[SessionStorageKey] SecurityWifiSecurityShowPluginMissingDialog':
                    return securityWifiSecurityShowPluginMissingDialogCache;
                case '[SessionStorageKey] SecurityWifiSecurityLocationFlag':
                    return securityWifiSecurityLocationFlagCache;
			}
		},
		setSessionStorageValue(key: any, value: any) {
			switch (key) {
				case '[SessionStorageKey] SecurityWifiSecurityInGamingDashboard':
					securityWifiSecurityInGamingDashboardCache = value;
					break;
				case '[SessionStorageKey] SecurityWifiSecurityShowPluginMissingDialog':
					securityWifiSecurityShowPluginMissingDialogCache = value;
                    break;
                case '[SessionStorageKey] SecurityWifiSecurityLocationFlag':
                    securityWifiSecurityLocationFlagCache = value;
                    break;
			}
		},
	};
	let localCacheServiceMock = {
		getLocalCacheValue(key: any, defaultValue?: any) {
			switch (key) {
				case '[LocalStorageKey] PrevThermalModeStatus':
					return prevThermalModeStatusCache;
				case '[LocalStorageKey] CurrentThermalModeStatus':
					return currentThermalModeStatusCache;
				case '[LocalStorageKey] RapidChargeCache':
					return rapidChargeCache;
				case '[LocalStorageKey] WifiSecurityCache':
					return wifiSecurityFeatureCache;
				case '[LocalStorageKey] SecurityWifiSecurityState':
					return wifiSecurityStatusCache;
				case '[LocalStorageKey] DolbyAudioToggleCache':
					return dolbyAudioToggleCache;
			}
		},
		setLocalCacheValue(key: any, value: any) {
			switch (key) {
				case '[LocalStorageKey] PrevThermalModeStatus':
					prevThermalModeStatusCache = value;
					break;
				case '[LocalStorageKey] CurrentThermalModeStatus':
					currentThermalModeStatusCache = value;
					break;
				case '[LocalStorageKey] RapidChargeCache':
					rapidChargeCache = value;
					break;
				case '[LocalStorageKey] WifiSecurityCache':
					wifiSecurityFeatureCache = value;
					break;
				case '[LocalStorageKey] SecurityWifiSecurityState':
					wifiSecurityStatusCache = value;
					break;
				case '[LocalStorageKey] DolbyAudioToggleCache':
					dolbyAudioToggleCache = value;
					break;
			}
		},
	};
	const gamingAllCapabilitiesServiceMock = {
		isShellAvailable: true,
		getCapabilityFromCache(key: any) {
			switch (key) {
				case '[LocalStorageKey] SmartFanFeature':
					return smartFanFeatureCache;
				case '[LocalStorageKey] ThermalModeVersion':
					return thermalModeVersionCache;
			}
		},
    };
	let wifiSecurityServiceMock = {
        isLWSEnabled: false,
		wifiSecurity: {
            isSupported: false,
            state: 'enabled',
            hasSystemPermissionShowed: true,
			disableWifiSecurity() {
				return Promise.resolve(setReturnValue);
			},
			enableWifiSecurity() {
				return Promise.resolve(setReturnValue);
            },
            on() {
                return Promise.resolve(setReturnValue);
            },
            off() {
                return Promise.resolve(setReturnValue);
            },
            getWifiState() {
                return Promise.resolve(setReturnValue);
            },
            getWifiSecurityState() {
                return Promise.resolve(setReturnValue);
            },
            cancelGetWifiSecurityState() {
                return Promise.resolve(setReturnValue);
            }
		},
    };

	const shellServiveSpy = jasmine.createSpyObj('VantageService', [
		'getGamingAllCapabilities',
		'registerEvent',
		'unRegisterEvent',
		,
		'getSecurityAdvisor',
		'getLogger',
	]);
	const gamingThermalModeServiceSpy = jasmine.createSpyObj('GamingThermalModeService', [
		'getThermalModeSettingStatus',
		'setThermalModeSettingStatus',
		'regThermalModeChangeEvent',
	]);
	const audioServiceSpy = jasmine.createSpyObj('AudioService', [
		'getDolbyMode',
		'setDolbyAudioState',
		'startMonitorForDolby',
		'stopMonitorForDolby',
	]);
	const powerServiceSpy = jasmine.createSpyObj('PowerService', [
		'getRapidChargeModeStatusIdeaNoteBook',
		'setRapidChargeModeStatusIdeaNoteBook'
	]);
	const dialogServiceSpy = jasmine.createSpyObj('DialogService', [
		'wifiSecurityLocationDialog',
		'',
	]);
	const guardSpy = jasmine.createSpyObj('GuardService', ['previousPageName']);
	const routerSpy = jasmine.createSpyObj('Router', ['routerState']);

	describe('thermalmode', () => {
		let gamingThermalModeService: any;
		const gamingThermalModeServiceMock = {
			getThermalModeSettingStatus() {
				return new Promise((resolve) => {
					resolve(thermalModeStatus);
				});
			},
			setThermalModeSettingStatus(value: number) {
				if (setReturnValue) {
					thermalModeStatus = value;
				}
				return new Promise((resolve) => {
					resolve(setReturnValue);
				});
			},
			regThermalModeChangeEvent() {
				return new Promise((resolve) => {
					resolve(setReturnValue);
				});
			},
		};
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetQuicksettingsListComponent],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: gamingAllCapabilitiesServiceMock,
					},
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock },
					{ provide: WifiSecurityService, useValue: wifiSecurityServiceMock },
					{ provide: AudioService, useValue: audioServiceSpy },
					{ provide: PowerService, useValue: powerServiceSpy },
					{ provide: DialogService, useValue: dialogServiceSpy },
					{ provide: GuardService, useValue: guardSpy },
					{ provide: Router, useValue: routerSpy },
				],
				schemas: [NO_ERRORS_SCHEMA],
			}).compileComponents();
			gamingThermalModeService = TestBed.inject(GamingThermalModeService);
			fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		it('should create', () => {
			expect(component).toBeDefined();
		});

		it('ngOnInit not support thermalMode', () => {
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			spyOn(component, 'registerThermalModeChangeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.thermalMode].isVisible).toBe(
				false,
				'thermal mode visible should be false'
			);
			expect(component.registerThermalModeChangeEvent).toHaveBeenCalledTimes(0);
		});

		it('ngOnInit thermalMode version is 2', () => {
			smartFanFeatureCache = true;
			thermalModeVersionCache = 2;
			spyOn(component, 'registerThermalModeChangeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.thermalMode].isVisible).toBe(
				false,
				'thermal mode visible should be false'
			);
			expect(component.registerThermalModeChangeEvent).toHaveBeenCalledTimes(0);
		});

		it('ngOnInit thermalMode version is 1', () => {
			smartFanFeatureCache = true;
			thermalModeVersionCache = 1;
            spyOn(component, 'registerThermalModeChangeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.thermalMode].isVisible).toBe(
				true,
				'thermal mode visible should be true'
			);
			expect(component.registerThermalModeChangeEvent).toHaveBeenCalledTimes(2);
		});

		it('getThermalModeStatus', fakeAsync(() => {
			smartFanFeatureCache = true;
			thermalModeVersionCache = 1;
			for (let i = 1; i <= 3; i++) {
				thermalModeStatus = i;
				component.getThermalModeStatus();
				tick();
				expect(component.thermalModeDropList.curSelected).toBe(
					i,
					`component.drop.curSelected should be ${i}`
				);
				expect(currentThermalModeStatusCache).toBe(
					i,
					`currentThermalModeStatusCache should be ${i}`
				);
			}

			for (let i = 1; i <= 3; i++) {
				thermalModeStatus = undefined;
				component.thermalModeDropList.curSelected = i;
				currentThermalModeStatusCache = i;
				component.getThermalModeStatus();
				tick();
				expect(component.thermalModeDropList.curSelected).toBe(
					i,
					`component.thermalModeDropList.curSelected should keep ${i}`
				);
				expect(currentThermalModeStatusCache).toBe(
					i,
					`currentThermalModeStatusCache should keep ${i}`
				);
			}
		}));

		it('onOptionSelected', fakeAsync(() => {
			smartFanFeatureCache = true;
			thermalModeVersionCache = 1;
			setReturnValue = true;

			const event = {
				target: {
					name: 'gaming.dashboard.device.quickSettings.title',
				},
				option: {
					value: 2,
				},
			};

			for (let i = 1; i <= 3; i++) {
				component.thermalModeDropList.curSelected = i;
				thermalModeStatus = i;
				currentThermalModeStatusCache = i;
				for (let j = 1; j <= 3; j++) {
					event.option.value = j;
					component.onOptionSelected(event);
					tick();
					expect(component.thermalModeDropList.curSelected).toBe(
						j,
						`setReturnValue is ${setReturnValue}, component.thermalModeDropList.curSelected should be ${j}`
					);
					expect(thermalModeStatus).toBe(
						j,
						`setReturnValue is ${setReturnValue}, thermalModeStatus should be ${j}`
					);
					expect(currentThermalModeStatusCache).toBe(
						j,
						`setReturnValue is ${setReturnValue}, currentThermalModeStatusCache should be ${j}`
					);
				}
			}

			setReturnValue = false;
			for (let i = 1; i <= 3; i++) {
				component.thermalModeDropList.curSelected = i;
				thermalModeStatus = i;
				currentThermalModeStatusCache = i;
				for (let j = 1; j <= 3; j++) {
					event.option.value = j;
					component.onOptionSelected(event);
					tick();
					expect(component.thermalModeDropList.curSelected).toBe(
						i,
						`setReturnValue is ${setReturnValue}, component.drop.curSelected should keep ${i}`
					);
					expect(thermalModeStatus).toBe(
						i,
						`setReturnValue is ${setReturnValue}, thermalModeStatus should keep ${i}`
					);
					expect(currentThermalModeStatusCache).toBe(
						i,
						`setReturnValue is ${setReturnValue}, currentThermalModeStatusCache should keep ${i}`
					);
				}
			}

			setReturnValue = true;
			for (let i = 1; i <= 3; i++) {
				event.target.name = 'gaming.dashboard.device.quickSettings.null';
				component.thermalModeDropList.curSelected = i;
				thermalModeStatus = i;
				currentThermalModeStatusCache = i;
				for (let j = 1; j <= 3; j++) {
					event.option.value = j;
					component.onOptionSelected(event);
					tick();
					expect(component.thermalModeDropList.curSelected).toBe(
						i,
						`setReturnValue is ${setReturnValue}, component.drop.curSelected should keep ${j}`
					);
					expect(thermalModeStatus).toBe(
						i,
						`setReturnValue is ${setReturnValue}, thermalModeStatus should keep ${j}`
					);
					expect(currentThermalModeStatusCache).toBe(
						i,
						`setReturnValue is ${setReturnValue}, currentThermalModeStatusCache should keep ${j}`
					);
				}
			}
		}));

		it('registerThermalModeEvent', () => {
			spyOn(gamingThermalModeService, 'regThermalModeChangeEvent').and.callThrough();
			component.gamingCapabilities.smartFanFeature = false;
			component.registerThermalModeChangeEvent();
			expect(gamingThermalModeService.regThermalModeChangeEvent).toHaveBeenCalledTimes(0);
			component.gamingCapabilities.smartFanFeature = true;
			component.registerThermalModeChangeEvent();
			expect(gamingThermalModeService.regThermalModeChangeEvent).toHaveBeenCalledTimes(1);
		});

		it('onRegThermalModeEvent', fakeAsync(() => {
			for (let i = 1; i <= 3; i++) {
				component.onRegThermalModeChangeEvent(i);
				tick();
				expect(component.thermalModeDropList.curSelected).toBe(
					i,
					`input is ${i}, component.thermalModeDropList.curSelected should be ${i}`
				);
				expect(currentThermalModeStatusCache).toBe(
					i,
					`input is ${i}, component.thermalModeDropList.curSelected should be ${i}`
				);
			}

			for (let i = 1; i <= 3; i++) {
                component.thermalModeDropList.curSelected = i;
				component.onRegThermalModeChangeEvent(undefined);
				tick();
				expect(component.thermalModeDropList.curSelected).toBe(
					i,
					`input is undefined, component.thermalModeDropList.curSelected should keep ${i}`
				);
			}
		}));
	});

	describe('rapidCharge', () => {
		const powerServiceMock = {
			getRapidChargeModeStatusIdeaNoteBook() {
				return new Promise((resolve) => {
					resolve(rapidChargeSettings);
				});
			},
			setRapidChargeModeStatusIdeaNoteBook(value: boolean) {
				if (setReturnValue) {
					rapidChargeSettings.status = value;
				}
				return new Promise((resolve) => {
					resolve(setReturnValue);
				});
			},
		};
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetQuicksettingsListComponent],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: gamingAllCapabilitiesServiceMock,
					},
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: WifiSecurityService, useValue: wifiSecurityServiceMock },
					{ provide: AudioService, useValue: audioServiceSpy },
					{ provide: PowerService, useValue: powerServiceMock },
					{ provide: DialogService, useValue: dialogServiceSpy },
					{ provide: GuardService, useValue: guardSpy },
					{ provide: Router, useValue: routerSpy },
				],
				schemas: [NO_ERRORS_SCHEMA],
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		it('should create', () => {
			expect(component).toBeDefined();
		});

		it('ngOnInit not support rapidCharge', () => {
			rapidChargeCache.available = false;
			rapidChargeCache.status = false;
			rapidChargeSettings.available = false;
            rapidChargeSettings.status = false;
            spyOn(component, 'quicksettingListInit').and.returnValue();
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				false,
				'rapidCharge.visible should be false'
			);
		});

		it('ngOnInit rapidCharge supported', fakeAsync(() => {
			rapidChargeCache.available = true;
			rapidChargeCache.status = false;
			tick();
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				'rapidCharge.visible should be true'
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked).toBe(
				false,
				'rapidCharge.checked should be false'
			);
			rapidChargeCache.available = true;
			rapidChargeCache.status = true;
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				'rapidCharge.visible should be true'
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked).toBe(
				true,
				'rapidCharge.checked should be true'
			);
		}));

		it('getRapidChargeSettings', fakeAsync(() => {
			rapidChargeSettings.available = false;
			rapidChargeSettings.status = false;
			component.getRapidChargeSettings();
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				false,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.visible should be false`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked).toBe(
				false,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.checked should be false`
			);
			expect(rapidChargeCache.available).toBe(
				false,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be false`
			);
			expect(rapidChargeCache.status).toBe(
				false,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be false`
			);

			rapidChargeSettings.available = false;
			rapidChargeSettings.status = true;
			component.getRapidChargeSettings();
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				false,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.visible should be false`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked).toBe(
				true,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.checked should be true`
			);
			expect(rapidChargeCache.available).toBe(
				false,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be false`
			);
			expect(rapidChargeCache.status).toBe(
				true,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be true`
			);

			rapidChargeSettings.available = true;
			rapidChargeSettings.status = false;
			component.getRapidChargeSettings();
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked).toBe(
				false,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.checked should be false`
			);
			expect(rapidChargeCache.available).toBe(
				true,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be true`
			);
			expect(rapidChargeCache.status).toBe(
				false,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be false`
			);

			rapidChargeSettings.available = true;
			rapidChargeSettings.status = true;
			component.getRapidChargeSettings();
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked).toBe(
				true,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.checked should be true`
			);
			expect(rapidChargeCache.available).toBe(
				true,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be true`
			);
			expect(rapidChargeCache.status).toBe(
				true,
				`rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be true`
			);
		}));

		it('setRapidChargeSettings', fakeAsync(() => {
			rapidChargeCache.available = true;
			setReturnValue = true;
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible = true;
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked = false;
			component.setRapidChargeSettings(false);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidCharge.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked).toBe(
				false,
				`setReturnValue is ${setReturnValue}, rapidCharge.checked should be false`
			);
			expect(rapidChargeCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`
			);
			expect(rapidChargeCache.status).toBe(
				false,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.status should be false`
			);
			tick();
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked = true;
			component.setRapidChargeSettings(true);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidCharge.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidCharge.checked should be true`
			);
			expect(rapidChargeCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`
			);
			expect(rapidChargeCache.status).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.status should be true`
			);

			tick();
			setReturnValue = false;
			rapidChargeCache.status = true;
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible = true;
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked = false;
			component.setRapidChargeSettings(false);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidCharge.visible should be true`
			);
			expect(rapidChargeCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`
			);
			expect(rapidChargeCache.status).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep true`
			);
			tick();
			rapidChargeCache.status = false;
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked = true;
			component.setRapidChargeSettings(true);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidCharge.visible should be true`
			);

			expect(rapidChargeCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`
			);
			expect(rapidChargeCache.status).toBe(
				false,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep false`
			);
		}));

		it('onToggleStateChanged', fakeAsync(() => {
			const event = {
				target: {
					name: 'gaming.dashboard.device.quickSettings.rapidCharge',
					value: 'false',
				},
			};
			rapidChargeCache.available = true;
			setReturnValue = true;
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible = true;
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked = false;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked).toBe(
				false,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.checked should be false`
			);
			expect(rapidChargeCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`
			);
			expect(rapidChargeCache.status).toBe(
				false,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.status should be false`
			);
			tick();
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked = true;
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.checked should be true`
			);
			expect(rapidChargeCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`
			);
			expect(rapidChargeCache.status).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.status should be true`
			);

			tick();
			setReturnValue = false;
			rapidChargeCache.status = true;
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible = true;
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked = false;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.visible should be true`
			);
			expect(rapidChargeCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`
			);
			expect(rapidChargeCache.status).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep true`
			);
			tick();
			rapidChargeCache.status = false;
			component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isChecked = true;
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.rapidCharge].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.visible should be true`
			);
			expect(rapidChargeCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`
			);
			expect(rapidChargeCache.status).toBe(
				false,
				`setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep false`
			);
		}));
	});

	describe('wifisecurity', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetQuicksettingsListComponent],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: gamingAllCapabilitiesServiceMock,
					},
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: WifiSecurityService, useValue: wifiSecurityServiceMock },
					{ provide: AudioService, useValue: audioServiceSpy },
					{ provide: PowerService, useValue: powerServiceSpy },
					{ provide: DialogService, useValue: dialogServiceSpy },
					{ provide: Router, useValue: routerSpy },
				],
				schemas: [NO_ERRORS_SCHEMA],
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
            wifiSecurityServiceMock.wifiSecurity.isSupported = false;
			wifiSecurityServiceMock.isLWSEnabled = false;
		});

		it('ngOnInit not support wifiSecurity', () => {
			wifiSecurityFeatureCache = false;
            wifiSecurityStatusCache = 'never-used';
            spyOn(component, 'quicksettingListInit').and.returnValue();
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				false,
				`wifi Security visible should be false`
			);
		});

		it('ngOnInit wifiSecurity supported', () => {
			wifiSecurityFeatureCache = true;
            wifiSecurityStatusCache = 'never-used';
            spyOn(component, 'quicksettingListInit').and.returnValue();
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				true,
				`wifi Security visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				false,
				`wifi Security checked should be false`
			);

			wifiSecurityFeatureCache = true;
			wifiSecurityStatusCache = 'enabled';
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				true,
				`wifi Security visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				true,
				`wifi Security checked should be true`
			);
		});

        it('getWifiSecuritySupported', () => {
            wifiSecurityServiceMock.wifiSecurity.isSupported = false;
			component.getWifiSecuritySupported();
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				false,
				`wifi Security visible shoulde be false`
			);
			expect(wifiSecurityFeatureCache).toBe(
				false,
				'wifiSecurityFeatureCache shoulde be false'
			);

            wifiSecurityServiceMock.wifiSecurity.isSupported = true;
			component.getWifiSecuritySupported();
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				true,
				`wifi Security visible shoulde be true`
			);
			expect(wifiSecurityFeatureCache).toBe(true, 'wifiSecurityFeatureCache shoulde be true');
        });
        
		it('getWifiSecuritySettings', () => {
			securityWifiSecurityInGamingDashboardCache = false;
			securityWifiSecurityShowPluginMissingDialogCache = false;
			component.getWifiSecuritySettings();
			expect(securityWifiSecurityInGamingDashboardCache).toBe(
				true,
				`isLWSEnabled is flase, securityWifiSecurityInGamingDashboardCache shoulde be true`
			);
			expect(securityWifiSecurityShowPluginMissingDialogCache).toBe(
				true,
				`isLWSEnabled is flase, securityWifiSecurityShowPluginMissingDialogCache shoulde be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				false,
				`isLWSEnabled is flase, wifi Security checked shoulde be false`
			);

			securityWifiSecurityInGamingDashboardCache = false;
			securityWifiSecurityShowPluginMissingDialogCache = false;
			wifiSecurityServiceMock.isLWSEnabled = true;
			component.getWifiSecuritySettings();
			expect(securityWifiSecurityInGamingDashboardCache).toBe(
				true,
				`isLWSEnabled is true, securityWifiSecurityInGamingDashboardCache shoulde be true`
			);
			expect(securityWifiSecurityShowPluginMissingDialogCache).toBe(
				true,
				`isLWSEnabled is true, securityWifiSecurityShowPluginMissingDialogCache shoulde be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				true,
				`isLWSEnabled is true, wifi Security checked shoulde be true`
			);
		});

		it('setWifiSecuritySettings', fakeAsync(() => {
			securityWifiSecurityInGamingDashboardCache = true;
			wifiSecurityServiceMock.isLWSEnabled = true;
			component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked = true;
			setReturnValue = true;
			component.setWifiSecuritySettings(false);
			tick();
			expect(wifiSecurityServiceMock.isLWSEnabled).toBe(
				false,
				`setReturnValue is true, set false, wifiSecurityServiceMock.isLWSEnabled should be false`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				false,
				`setReturnValue is true, set false, wifiSecurityServiceMock.isChecked should be false`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].readonly).toBe(
				true,
				`setReturnValue is true, set false, wifiSecurityServiceMock.readonly should be true`
			);

			wifiSecurityServiceMock.isLWSEnabled = true;
			setReturnValue = false;
			component.setWifiSecuritySettings(false);
			tick();
			expect(wifiSecurityServiceMock.isLWSEnabled).toBe(
				true,
				`setReturnValue is false, set false, wifiSecurityServiceMock.isLWSEnabled should keep true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				true,
				`setReturnValue is false, set false, wifiSecurityServiceMock.isChecked should keep true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].readonly).toBe(
				false,
				`setReturnValue is false, set false, wifiSecurityServiceMock.readonly should keep false`
			);

			wifiSecurityServiceMock.isLWSEnabled = false;
			setReturnValue = true;
			component.setWifiSecuritySettings(true);
			tick();
			expect(wifiSecurityServiceMock.isLWSEnabled).toBe(
				true,
				`setReturnValue is true, set true, wifiSecurityServiceMock.isLWSEnabled should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				true,
				`setReturnValue is true, set true, wifiSecurityServiceMock.isChecked should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].readonly).toBe(
				false,
				`setReturnValue is true, set true, wifiSecurityServiceMock.readonly should be false`
			);

			wifiSecurityServiceMock.isLWSEnabled = false;
			setReturnValue = false;
			component.setWifiSecuritySettings(true);
			tick();
			expect(wifiSecurityServiceMock.isLWSEnabled).toBe(
				false,
				`setReturnValue is false, set true, wifiSecurityServiceMock.isLWSEnabled should be false`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				false,
				`setReturnValue is false, set true, wifiSecurityServiceMock.isChecked should be false`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].readonly).toBe(
				true,
				`setReturnValue is false, set true, wifiSecurityServiceMock.readonly should be true`
			);
        }));
        
        it('wifiSecuritySupportedEventHandler', () => {
            component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible = false;
            component.wifiSecuritySupportedEventHandler(true);
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				true,
				`wifi Security visible shoulde be true`
			);
			expect(wifiSecurityFeatureCache).toBe(
				true,
				'wifiSecurityFeatureCache shoulde be true'
			);

            component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible = true;
            component.wifiSecuritySupportedEventHandler(false);
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				false,
				`wifi Security visible shoulde be false`
			);
			expect(wifiSecurityFeatureCache).toBe(
				false,
				'wifiSecurityFeatureCache shoulde be false'
			);
        });

        it('wifiSecurityPluginMissingEventHandler', () => {
            component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible = true;
            component.wifiSecurityPluginMissingEventHandler();
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				false,
				`wifi Security visible shoulde be false`
			);
			expect(wifiSecurityFeatureCache).toBe(
				false,
				'wifiSecurityFeatureCache shoulde be false'
			);
        });

        it('wifiSecurityStateEventHandler ', () => {
            wifiSecurityServiceMock.isLWSEnabled = false;
            component.wifiSecurityStateEventHandler(false);
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				false,
				`wifi Security state shoulde be false`
			);

            wifiSecurityServiceMock.isLWSEnabled = true;
            component.wifiSecurityStateEventHandler(true);
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				true,
				`wifi Security state shoulde be true`
			);
        });

        it('wifiSecurityLocationServiceEventHandler', fakeAsync(() => {
            wifiSecurityServiceMock.wifiSecurity.state = 'enabled';
            wifiSecurityServiceMock.wifiSecurity.hasSystemPermissionShowed = true;
            component.wifiSecurityLocationServiceEventHandler(false);
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				false,
				`wifi Security state shoulde be false`
            );
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].readonly).toBe(
				true,
				`wifi Security readonly shoulde be true`
            );

            setReturnValue = true;
            component.wifiSecurityLocationServiceEventHandler(true);
            tick();
            expect(securityWifiSecurityLocationFlagCache).toBe(
                'no',
                `securityWifiSecurityLocationFlagCache should be no`
            )
            expect(wifiSecurityServiceMock.isLWSEnabled).toBe(
				true,
				`isLWSEnabled shoulde be true`
            );
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				true,
				`wifi Security state shoulde be true`
            );
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].readonly).toBe(
				false,
				`wifi Security readonly shoulde be false`
            );

            securityWifiSecurityLocationFlagCache = 'yes';
            setReturnValue = false;
            component.wifiSecurityLocationServiceEventHandler(true);
            tick();
            expect(wifiSecurityServiceMock.isLWSEnabled).toBe(
				false,
				`isLWSEnabled shoulde be false`
            );
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				false,
				`wifi Security state shoulde be false`
            );
            expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].readonly).toBe(
				true,
				`wifi Security readonly shoulde be true`
            );
        }));
        it('onToggleStateChanged', fakeAsync(() => {
			const event = {
				target: {
					name: 'gaming.dashboard.device.quickSettings.wifiSecurity',
					value: 'false',
				},
            };

            wifiSecurityServiceMock.isLWSEnabled = false;
			setReturnValue = true;
			component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible = true;
            component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked = false;
			component.onToggleStateChanged(event);
            tick();
            expect(wifiSecurityServiceMock.isLWSEnabled).toBe(
				true,
				`setReturnValue is ${setReturnValue}, isLWSEnabled should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, wifiSecurity.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				true,
				`setReturnValue is ${setReturnValue}, wifiSecurity.checked should be true`
			);

            wifiSecurityServiceMock.isLWSEnabled = false;
            setReturnValue = false;
			component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked = false;
			component.onToggleStateChanged(event);
            tick();
            expect(wifiSecurityServiceMock.isLWSEnabled).toBe(
				false,
				`setReturnValue is ${setReturnValue}, isLWSEnabled should keep false`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, wifiSecurity.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				false,
				`setReturnValue is ${setReturnValue}, wifiSecurity.checked should keep false`
			);

            wifiSecurityServiceMock.isLWSEnabled = true;
			setReturnValue = true;
			component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible = true;
			component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked = true;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
            tick();
            expect(wifiSecurityServiceMock.isLWSEnabled).toBe(
				false,
				`setReturnValue is ${setReturnValue}, isLWSEnabled should be false`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, wifiSecurity.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				false,
				`setReturnValue is ${setReturnValue}, wifiSecurity.available should be false`
			);

            wifiSecurityServiceMock.isLWSEnabled = true;
			setReturnValue = false;
			component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked = true;
			component.onToggleStateChanged(event);
            tick();
            expect(wifiSecurityServiceMock.isLWSEnabled).toBe(
				true,
				`setReturnValue is ${setReturnValue}, isLWSEnabled should keep true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, wifiSecurity.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.wifiSecurity].isChecked).toBe(
				true,
				`setReturnValue is ${setReturnValue}, wifiSecurity.available should keep true`
			);
		}));
	});

	describe('dolby', () => {
		let audioService: any;
		const audioServiceMock = {
			getDolbyMode() {
				return new Promise((resolve) => {
					resolve(dolbyAudioToggle);
				});
			},
			setDolbyAudioState(value: any) {
				if (setReturnValue) {
					dolbyAudioToggle.isAudioProfileEnabled = value;
				}
				return new Promise((resolve) => {
					resolve(setReturnValue);
				});
			},
			startMonitorForDolby(value: any) {
				return new Promise((resolve) => {
					resolve(setReturnValue);
				});
			},
			stopMonitorForDolby() {
				return new Promise((resolve) => {
					resolve(setReturnValue);
				});
			},
		};
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetQuicksettingsListComponent],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: gamingAllCapabilitiesServiceMock,
					},
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: WifiSecurityService, useValue: wifiSecurityServiceMock },
					{ provide: AudioService, useValue: audioServiceMock },
					{ provide: PowerService, useValue: powerServiceSpy },
					{ provide: DialogService, useValue: dialogServiceSpy },
					{ provide: GuardService, useValue: guardSpy },
					{ provide: Router, useValue: routerSpy },
				],
				schemas: [NO_ERRORS_SCHEMA],
			}).compileComponents();
			audioService = TestBed.inject(AudioService);
			fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		it('should create', () => {
			expect(component).toBeDefined();
		});

		it('ngOnInit not support dolby', () => {
			dolbyAudioToggleCache.available = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			spyOn(component, 'registerDolbyChangeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				false,
				`dolby.visible should be false`
			);
			expect(component.registerDolbyChangeEvent).toHaveBeenCalledTimes(0);
		});

		it('initialiseDolbyCache', () => {
			dolbyAudioToggleCache.available = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
            spyOn(component, 'quicksettingListInit').and.returnValue();
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(true, `dolby.visible should be true`);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				false,
				`dolby.checked should be false`
			);

			dolbyAudioToggleCache.available = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			component.ngOnInit();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(true, `dolby.visible should be true`);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(true, `dolby.checked should be true`);
		});

		it('getDolbySettings', fakeAsync(() => {
			dolbyAudioToggleCache.available = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			dolbyAudioToggle.available = false;
			dolbyAudioToggle.isAudioProfileEnabled = false;
			component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible = false;
			component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked = false;
			component.getDolbySettings();
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				false,
				`dolbyAudio is ${dolbyAudioToggle}, dolby.visible should be false`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				false,
				`dolbyAudio is ${dolbyAudioToggle}, dolby.checked should be false`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				false,
				`dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.available should be false`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				false,
				`dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.isAudioProfileEnabled should be false`
			);

			tick();
			dolbyAudioToggle.available = true;
			dolbyAudioToggle.isAudioProfileEnabled = false;
			component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked = true;
			component.getDolbySettings();
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`dolbyAudio is ${dolbyAudioToggle}, dolby.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				false,
				`dolbyAudio is ${dolbyAudioToggle}, dolby.checked should be false`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.available should be true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				false,
				`dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.isAudioProfileEnabled should be false`
			);

			tick();
			dolbyAudioToggle.available = true;
			dolbyAudioToggle.isAudioProfileEnabled = true;
			component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked = false;
			component.getDolbySettings();
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`dolbyAudio is ${dolbyAudioToggle}, dolby.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				true,
				`dolbyAudio is ${dolbyAudioToggle}, dolby.checked should be true`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.available should be true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				true,
				`dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.isAudioProfileEnabled should be true`
			);

			dolbyAudioToggle = undefined;
			component.getDolbySettings();
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`dolbyAudio is ${dolbyAudioToggle}, dolby.visible should keep true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				true,
				`dolbyAudio is ${dolbyAudioToggle}, dolby.checked should keep true`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.available should keep true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				true,
				`dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.isAudioProfileEnabled should keep true`
			);
			tick();
			dolbyAudioToggle = {
				available: false,
				supportedModes: ['Dynamic', 'Movie', 'Music', 'Games', 'Voip'],
				isAudioProfileEnabled: false,
				currentMode: 'Games',
				voIPStatus: 'True',
				entertainmentStatus: 'True',
			};
		}));

		it('setDolbySettings', fakeAsync(() => {
			setReturnValue = true;
			dolbyAudioToggle.available = true;
			dolbyAudioToggle.isAudioProfileEnabled = true;
			dolbyAudioToggleCache.available = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible = true;
			component.setDolbySettings(false);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolby.visible should be false`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				false,
				`setReturnValue is ${setReturnValue}, dolby.checked should be false`
			);
			expect(dolbyAudioToggle.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggle.available should be false`
			);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(
				false,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggle.isAudioProfileEnabled should be false`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.available should be false`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				false,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.isAudioProfileEnabled should be false`
			);

			tick();
			dolbyAudioToggle.isAudioProfileEnabled = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			component.setDolbySettings(true);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolby.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolby.checked should be true`
			);
			expect(dolbyAudioToggle.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggle.available should be true`
			);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggle.isAudioProfileEnabled should be true`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.available should be true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.isAudioProfileEnabled should be true`
			);

			tick();
			setReturnValue = false;
			dolbyAudioToggle.isAudioProfileEnabled = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			component.setDolbySettings(false);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolby.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolby.checked should keep true`
			);
			expect(dolbyAudioToggle.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggle.available should be true`
			);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggle.isAudioProfileEnabled should keep true`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.available should be true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.isAudioProfileEnabled should keep true`
			);

			tick();
			dolbyAudioToggle.isAudioProfileEnabled = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			component.setDolbySettings(true);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolby.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				false,
				`setReturnValue is ${setReturnValue}, dolby.checked should keep false`
			);
			expect(dolbyAudioToggle.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggle.available should be true`
			);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(
				false,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggle.isAudioProfileEnabled should keep false`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.available should be true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				false,
				`setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.isAudioProfileEnabled should keep false`
			);
		}));

		it('onToggleStateChanged', fakeAsync(() => {
			const event = {
				target: {
					name: 'gaming.dashboard.device.quickSettings.dolby',
					value: 'false',
				},
			};
			dolbyAudioToggleCache.available = true;
			dolbyAudioToggle.available = true;
			component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible = true;
			setReturnValue = true;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolby.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				false,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolby.checked should be false`
			);
			expect(dolbyAudioToggle.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.available should be true`
			);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(
				false,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.isAudioProfileEnabled should be false`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.available should be true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				false,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.isAudioProfileEnabled should be false`
			);
			tick();
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolby.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolby.checked should be true`
			);
			expect(dolbyAudioToggle.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.available should be true`
			);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.isAudioProfileEnabled should be true`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.available should be true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.isAudioProfileEnabled should be true`
			);

			tick();
			setReturnValue = false;
			dolbyAudioToggle.isAudioProfileEnabled = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolby.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolby.checked should keep true`
			);
			expect(dolbyAudioToggle.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.available should be true`
			);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.isAudioProfileEnabled should keep true`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.available should be true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.isAudioProfileEnabled should keep true`
			);
			tick();
			dolbyAudioToggle.isAudioProfileEnabled = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isVisible).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolby.visible should be true`
			);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				false,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolby.checked should keep false`
			);
			expect(dolbyAudioToggle.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.available should be true`
			);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(
				false,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.isAudioProfileEnabled should keep false`
			);
			expect(dolbyAudioToggleCache.available).toBe(
				true,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.available should be true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				false,
				`setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.isAudioProfileEnabled should keep false`
			);
		}));

		it('registerDolbyChangeEvent', () => {
			spyOn(audioService, 'startMonitorForDolby').and.callThrough();
			expect(audioService.startMonitorForDolby).toHaveBeenCalledTimes(0);
			setReturnValue = false;
			component.registerDolbyChangeEvent();
			expect(audioService.startMonitorForDolby).toHaveBeenCalledTimes(1);
			setReturnValue = true;
			component.registerDolbyChangeEvent();
			expect(audioService.startMonitorForDolby).toHaveBeenCalledTimes(2);
		});

		it('unRegisterDolbyEvent', () => {
			spyOn(audioService, 'stopMonitorForDolby').and.callThrough();
			expect(audioService.stopMonitorForDolby).toHaveBeenCalledTimes(0);
			setReturnValue = false;
			component.unRegisterDolbyEvent();
			expect(audioService.stopMonitorForDolby).toHaveBeenCalledTimes(1);
			setReturnValue = true;
			component.unRegisterDolbyEvent();
			expect(audioService.stopMonitorForDolby).toHaveBeenCalledTimes(2);
		});

		it('handleDolbyChangeEvent', fakeAsync(() => {
			dolbyAudioToggleCache.available = true;
			dolbyAudioToggle.available = true;

			dolbyAudioToggle.isAudioProfileEnabled = true;
			component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked = false;
			component.handleDolbyChangeEvent(dolbyAudioToggle);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				true,
				`input is ${dolbyAudioToggle.isAudioProfileEnabled}, dolby.checked should be true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				true,
				`dolbyAudioToggle.isAudioProfileEnabled != dolby.checked, dolbyAudioToggleCache.isAudioProfileEnabled should be true`
			);

			dolbyAudioToggle.isAudioProfileEnabled = false;
			component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked = true;
			component.handleDolbyChangeEvent(dolbyAudioToggle);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				false,
				`input is ${dolbyAudioToggle.isAudioProfileEnabled}, dolby.checked should be false`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				false,
				`dolbyAudioToggle.isAudioProfileEnabled != dolby.checked, dolbyAudioToggleCache.isAudioProfileEnabled should be false`
			);

			dolbyAudioToggle.available = undefined;
			dolbyAudioToggle.isAudioProfileEnabled = false;
			component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			component.handleDolbyChangeEvent(dolbyAudioToggle);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				true,
				`input is ${dolbyAudioToggle.isAudioProfileEnabled}, dolby.checked should keep true`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				true,
				`dolbyAudioToggle.available = undefined, dolbyAudioToggleCache.isAudioProfileEnabled should keep true`
			);

			dolbyAudioToggle.available = true;
			dolbyAudioToggle.isAudioProfileEnabled = undefined;
			component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			component.handleDolbyChangeEvent(dolbyAudioToggle);
			expect(component.quickSettingsList[component.quickSettingsListIndex.dolby].isChecked).toBe(
				false,
				`input is ${dolbyAudioToggle.isAudioProfileEnabled}, dolby.cChecked should keep false`
			);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(
				false,
				`dolbyAudioToggle.isAudioProfileEnabled = undefined, dolbyAudioToggleCache.isAudioProfileEnabled should keep false`
			);
		}));
	});

	describe('catch error', () => {
		const loggerServiceSpy = jasmine.createSpyObj('LoggerService', [
			'getMessage',
			'debug',
			'error',
			'info',
			'exception',
        ]);

        let wifiSecurityServiceMock = {
        isLWSEnabled: false,
		wifiSecurity: {
            isSupported: false,
            state: 'enabled',
            hasSystemPermissionShowed: true,
			disableWifiSecurity() {
				return Promise.resolve(setReturnValue);
			},
			enableWifiSecurity() {
				return Promise.resolve(setReturnValue);
            },
            on() {
                return Promise.resolve(setReturnValue);
            },
            off() {
                return Promise.resolve(setReturnValue);
            },
            getWifiState() {
                return Promise.resolve(setReturnValue);
            },
            getWifiSecurityState() {
                return Promise.resolve(setReturnValue);
            },
            cancelGetWifiSecurityState() {
                return Promise.resolve(setReturnValue);
            }
		},
    };

		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetQuicksettingsListComponent],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: gamingAllCapabilitiesServiceMock,
					},
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: WifiSecurityService, useValue: wifiSecurityServiceMock },
					{ provide: AudioService, useValue: audioServiceSpy },
					{ provide: PowerService, useValue: powerServiceSpy },
					{ provide: DialogService, useValue: dialogServiceSpy },
					{ provide: GuardService, useValue: guardSpy },
					{ provide: Router, useValue: routerSpy },
					{ provide: LoggerService, useValue: loggerServiceSpy },
				],
				schemas: [NO_ERRORS_SCHEMA],
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
        }));
        
        it('getThermalModeStatus error', fakeAsync(() => {
			gamingThermalModeServiceSpy.getThermalModeSettingStatus.and.throwError('getThermalModeStatus error');
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.getThermalModeStatus();
			tick();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		}));

		it('setThermalModeStatus error', fakeAsync(() => {
            gamingThermalModeServiceSpy.setThermalModeSettingStatus.and.throwError('setThermalModeStatus error');
            component.thermalModeDropList.curSelected = 2;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.setThermalModeStatus(3);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
        }));
        
        it('registerThermalModeChangeEvent error', fakeAsync(() => {
			gamingThermalModeServiceSpy.regThermalModeChangeEvent.and.throwError('registerThermalModeChangeEvent error');
            let calledTimes = loggerServiceSpy.error.calls.count();
			component.registerThermalModeChangeEvent();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
        }));
        
        it('getRapidChargeSettings error', fakeAsync(() => {
			powerServiceSpy.getRapidChargeModeStatusIdeaNoteBook.and.throwError('getRapidChargeSettings error');
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.getRapidChargeSettings();
			tick();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		}));

		it('setRapidChargeSettings error', fakeAsync(() => {
			powerServiceSpy.setRapidChargeModeStatusIdeaNoteBook.and.throwError('setRapidChargeSettings error');
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.setRapidChargeSettings(true);
			tick();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
        }));

		it('getDolbySettings error', fakeAsync(() => {
			audioServiceSpy.getDolbyMode.and.throwError('getDolbySettings error');
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.getDolbySettings();
			tick();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		}));

		it('setDolbySettings error', fakeAsync(() => {
			audioServiceSpy.setDolbyAudioState.and.throwError('getDolbySettings error');
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.setDolbySettings(true);
			tick();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
        }));

        it('registerDolbyChangeEvent error', fakeAsync(() => {
			audioServiceSpy.startMonitorForDolby.and.throwError('registerDolbyChangeEvent error');
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.registerDolbyChangeEvent();
			tick();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
        }));

        it('unRegisterDolbyEvent error', fakeAsync(() => {
			audioServiceSpy.stopMonitorForDolby.and.throwError('unRegisterDolbyEvent error');
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.unRegisterDolbyEvent();
			tick();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		}));
	});
});
