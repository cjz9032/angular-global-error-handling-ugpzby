
import { ComponentFixture, async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { WidgetQuicksettingsListComponent } from './widget-quicksettings-list.component';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { WifiSecurityService } from 'src/app/services/security/wifi-security.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { PowerService } from 'src/app/services/power/power.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

describe('WidgetQuicksettingsListComponent', () => {

	let component: WidgetQuicksettingsListComponent;
	let fixture: ComponentFixture<WidgetQuicksettingsListComponent>;

	let smartFanFeatureCache = true;
	let thermalModeVersionCache = 1;
	let prevThermalModeStatusCache = 2;
	let currentThermalModeStatusCache = 2;
	let rapidChargeCache = { 'available': false, 'status': false };
	let wifiSecurityFeatureCache = false;
	let wifiSecurityStatusCache = 'enable';
	let dolbyAudioToggleCache = { 'available': false, 'supportedModes': ['Dynamic', 'Movie', 'Music', 'Games', 'Voip'], 'isAudioProfileEnabled': false, 'currentMode': 'Games', 'voIPStatus': 'True', 'entertainmentStatus': 'True' }
	let securityWifiSecurityInGamingDashboardCache = false;
	let securityWifiSecurityShowPluginMissingDialogCache = false;


	let thermalModeStatus = 2;
	let rapidChargeSettings = { 'available': false, 'status': false };
	let dolbyAudioToggle = { 'available': false, 'supportedModes': ['Dynamic', 'Movie', 'Music', 'Games', 'Voip'], 'isAudioProfileEnabled': false, 'currentMode': 'Games', 'voIPStatus': 'True', 'entertainmentStatus': 'True' }
	let setReturnValue = true;

	let commonServiceMock = {
		getLocalStorageValue(key: any, defaultValue?: any) {
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
		setLocalStorageValue(key: any, value: any) {
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
		getCapabalitiesNotification() {
			let res = {
				type: '[Gaming] GamingCapabilities',
				payload: {
					smartFanFeature: smartFanFeatureCache,
					thermalModeVersion: thermalModeVersionCache
				}
			}
			return of(res);
		},
		getSessionStorageValue(key: any, defaultValue?: any) {
			switch (key) {
				case '[SessionStorageKey] SecurityWifiSecurityInGamingDashboard':
					return securityWifiSecurityInGamingDashboardCache;
				case '[SessionStorageKey] SecurityWifiSecurityShowPluginMissingDialog':
					return securityWifiSecurityShowPluginMissingDialogCache;
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
			}
		}
	};

	let GamingAllCapabilitiesServiceMock = {
		isShellAvailable: true,
		getCapabilityFromCache(key: any) {
			switch (key) {
				case '[LocalStorageKey] SmartFanFeature':
					return smartFanFeatureCache;
				case '[LocalStorageKey] ThermalModeVersion':
					return thermalModeVersionCache;
			}
		}
	};

	let shellServiveSpy = jasmine.createSpyObj('VantageService', ['getGamingAllCapabilities', 'registerEvent', 'unRegisterEvent', , 'getSecurityAdvisor', 'getLogger']);
	let gamingThermalModeServiceSpy = jasmine.createSpyObj('GamingThermalModeService', ['getThermalModeStatus', 'setThermalModeStatus', 'regThermalModeChangeEvent']);
	let wifiSecurityServiceSpy = jasmine.createSpyObj('WifiSecurityService', ['isLWSEnabled', 'wifiSecurity']);
	let audioServiceSpy = jasmine.createSpyObj('AudioService', ['getDolbyMode', 'setDolbyAudioState', 'startMonitorForDolby', 'stopMonitorForDolby']);
	let powerServiceSpy = jasmine.createSpyObj('PowerService', ['getRapidChargeModeStatusIdeaNoteBook', 'setRapidChargeModeStatusIdeaNoteBook',]);
	let dialogServiceSpy = jasmine.createSpyObj('DialogService', ['wifiSecurityLocationDialog', '']);
	let guardSpy = jasmine.createSpyObj('GuardService', ['previousPageName']);
	let routerSpy = jasmine.createSpyObj('Router', ['routerState']);

	describe('thermalmode', () => {
		let gamingThermalModeService: any;
		let gamingThermalModeServiceMock = {
			getThermalModeSettingStatus() {
				return new Promise(resolve => {
					resolve(thermalModeStatus)
				})
			},
			setThermalModeSettingStatus(value: number) {
				if (setReturnValue) {
					thermalModeStatus = value;
				}
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			},
			regThermalModeChangeEvent() {
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			}
		}
		beforeEach(async(() => {
			shellServiveSpy.getSecurityAdvisor.and.returnValue(new Promise(resolve => { resolve(true) }));
			audioServiceSpy.getDolbyMode.and.returnValue(new Promise(resolve => { resolve(dolbyAudioToggle) }));
			audioServiceSpy.startMonitorForDolby.and.returnValue(new Promise(resolve => { resolve(setReturnValue) }));
			audioServiceSpy.stopMonitorForDolby.and.returnValue(new Promise(resolve => { resolve(setReturnValue) }));
			powerServiceSpy.getRapidChargeModeStatusIdeaNoteBook.and.returnValue(new Promise(resolve => { resolve(rapidChargeSettings) }));
			TestBed.configureTestingModule({
				declarations: [
					WidgetQuicksettingsListComponent
				],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock },
					{ provide: WifiSecurityService, useValue: wifiSecurityServiceSpy },
					{ provide: AudioService, useValue: audioServiceSpy },
					{ provide: PowerService, useValue: powerServiceSpy },
					{ provide: DialogService, useValue: dialogServiceSpy },
					{ provide: GuardService, useValue: guardSpy },
					{ provide: Router, useValue: routerSpy }
				],
				schemas: [NO_ERRORS_SCHEMA]
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
			spyOn(component, 'renderThermalModeStatus').and.callThrough();
			spyOn(component, 'registerThermalModeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettings[0].isVisible).toBe(false, 'thermal mode visible should be false');
			expect(component.renderThermalModeStatus).toHaveBeenCalledTimes(0);
			expect(component.registerThermalModeEvent).toHaveBeenCalledTimes(0);
		});

		it('ngOnInit thermalMode version is 2', () => {
			smartFanFeatureCache = true;
			thermalModeVersionCache = 2;
			spyOn(component, 'renderThermalModeStatus').and.callThrough();
			spyOn(component, 'registerThermalModeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettings[0].isVisible).toBe(false, 'thermal mode visible should be false');
			expect(component.renderThermalModeStatus).toHaveBeenCalledTimes(0);
			expect(component.registerThermalModeEvent).toHaveBeenCalledTimes(0);
		});

		it('ngOnInit thermalMode version is 1', () => {
			smartFanFeatureCache = true;
			thermalModeVersionCache = 1;
			spyOn(component, 'renderThermalModeStatus').and.callThrough();
			spyOn(component, 'registerThermalModeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettings[0].isVisible).toBe(true, 'thermal mode visible should be true');
			expect(component.renderThermalModeStatus).toHaveBeenCalledTimes(2);
			expect(component.registerThermalModeEvent).toHaveBeenCalledTimes(2);
		});

		it('renderThermalModeStatus', fakeAsync(() => {
			smartFanFeatureCache = true;
			thermalModeVersionCache = 1;
			for (let i = 1; i <= 3; i++) {
				thermalModeStatus = i;
				component.renderThermalModeStatus();
				tick();
				expect(component.drop.curSelected).toBe(i, `component.drop.curSelected should be ${i}`);
				expect(currentThermalModeStatusCache).toBe(i, `currentThermalModeStatusCache should be ${i}`);
			}

			for (let i = 1; i <= 3; i++) {
				thermalModeStatus = undefined;
				component.drop.curSelected = i;
				currentThermalModeStatusCache = i;
				component.renderThermalModeStatus();
				tick();
				expect(component.drop.curSelected).toBe(i, `component.drop.curSelected should keep ${i}`);
				expect(currentThermalModeStatusCache).toBe(i, `currentThermalModeStatusCache should keep ${i}`);
			}
		}));

		it('onOptionSelected', fakeAsync(() => {
			smartFanFeatureCache = true;
			thermalModeVersionCache = 1;
			setReturnValue = true;

			let event = {
				target: {
					name: 'gaming.dashboard.device.quickSettings.title'
				},
				option: {
					value: 2
				}
			}

			for (let i = 1; i <= 3; i++) {
				component.drop.curSelected = i
				thermalModeStatus = i;
				currentThermalModeStatusCache = i;
				for (let j = 1; j <= 3; j++) {
					event.option.value = j;
					component.onOptionSelected(event);
					tick();
					expect(component.drop.curSelected).toBe(j, `setReturnValue is ${setReturnValue}, component.drop.curSelected should be ${j}`);
					expect(thermalModeStatus).toBe(j, `setReturnValue is ${setReturnValue}, thermalModeStatus should be ${j}`);
					expect(currentThermalModeStatusCache).toBe(j, `setReturnValue is ${setReturnValue}, currentThermalModeStatusCache should be ${j}`);
				}
			}

			setReturnValue = false;
			for (let i = 1; i <= 3; i++) {
				component.drop.curSelected = i
				thermalModeStatus = i;
				currentThermalModeStatusCache = i;
				for (let j = 1; j <= 3; j++) {
					event.option.value = j;
					component.onOptionSelected(event);
					tick();
					expect(component.drop.curSelected).toBe(i, `setReturnValue is ${setReturnValue}, component.drop.curSelected should keep ${i}`);
					expect(thermalModeStatus).toBe(i, `setReturnValue is ${setReturnValue}, thermalModeStatus should keep ${i}`);
					expect(currentThermalModeStatusCache).toBe(i, `setReturnValue is ${setReturnValue}, currentThermalModeStatusCache should keep ${i}`);
				}
			}

			setReturnValue = true;
			for (let i = 1; i <= 3; i++) {
				event.target.name = 'gaming.dashboard.device.quickSettings.null';
				component.drop.curSelected = i;
				thermalModeStatus = i;
				currentThermalModeStatusCache = i;
				for (let j = 1; j <= 3; j++) {
					event.option.value = j;
					component.onOptionSelected(event);
					tick();
					expect(component.drop.curSelected).toBe(i, `setReturnValue is ${setReturnValue}, component.drop.curSelected should keep ${j}`);
					expect(thermalModeStatus).toBe(i, `setReturnValue is ${setReturnValue}, thermalModeStatus should keep ${j}`);
					expect(currentThermalModeStatusCache).toBe(i, `setReturnValue is ${setReturnValue}, currentThermalModeStatusCache should keep ${j}`);
				}
			}
		}));

		it('registerThermalModeEvent', () => {
			spyOn(gamingThermalModeService, 'regThermalModeChangeEvent').and.callThrough();
			component.gamingCapabilities.smartFanFeature = false
			component.registerThermalModeEvent();
			expect(gamingThermalModeService.regThermalModeChangeEvent).toHaveBeenCalledTimes(0);
			component.gamingCapabilities.smartFanFeature = true;
			component.registerThermalModeEvent();
			expect(gamingThermalModeService.regThermalModeChangeEvent).toHaveBeenCalledTimes(1);
		})

		it('onRegThermalModeEvent', fakeAsync(() => {
			for (let i = 1; i <= 3; i++) {
				component.onRegThermalModeEvent(i);
				tick();
				expect(component.drop.curSelected).toBe(i, `input is ${i}, component.drop.curSelected should be ${i}`);
				expect(currentThermalModeStatusCache).toBe(i, `input is ${i}, component.drop.curSelected should be ${i}`);
			}

			for (let i = 1; i <= 3; i++) {
				prevThermalModeStatusCache = i;
				component.onRegThermalModeEvent(undefined);
				tick();
				expect(component.drop.curSelected).toBe(i, `input is undefined, component.drop.curSelected should keep ${i}`);
			}
		}));
	});

	describe('rapidCharge', function () {
		let powerServiceMock = {
			getRapidChargeModeStatusIdeaNoteBook() {
				return new Promise(resolve => {
					resolve(rapidChargeSettings)
				})
			},
			setRapidChargeModeStatusIdeaNoteBook(value: boolean) {
				if (setReturnValue) {
					rapidChargeSettings.status = value;
				}
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			}
		}
		beforeEach(async(() => {
			shellServiveSpy.getSecurityAdvisor.and.returnValue(new Promise(resolve => { resolve(true) }));
			audioServiceSpy.getDolbyMode.and.returnValue(new Promise(resolve => { resolve(dolbyAudioToggle) }));
			audioServiceSpy.stopMonitorForDolby.and.returnValue(new Promise(resolve => { resolve(setReturnValue) }));
			TestBed.configureTestingModule({
				declarations: [
					WidgetQuicksettingsListComponent
				],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: WifiSecurityService, useValue: wifiSecurityServiceSpy },
					{ provide: AudioService, useValue: audioServiceSpy },
					{ provide: PowerService, useValue: powerServiceMock },
					{ provide: DialogService, useValue: dialogServiceSpy },
					{ provide: GuardService, useValue: guardSpy },
					{ provide: Router, useValue: routerSpy }
				],
				schemas: [NO_ERRORS_SCHEMA]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}))

		it('should create', () => {
			expect(component).toBeDefined();
		});

		it('ngOnInit not support rapidCharge', () => {
			rapidChargeCache.available = false;
			rapidChargeCache.status = false;
			rapidChargeSettings.available = false;
			rapidChargeSettings.status = false;
			component.ngOnInit();
			expect(component.quickSettings[1].isVisible).toBe(false, 'rapidCharge.visible should be false');
			expect(component.quickSettings[1].isChecked).toBe(false, 'rapidCharge.checked should be false');
		});

		it('initialiseRapidChargeCache', fakeAsync(() => {
			rapidChargeCache.available = true;
			rapidChargeCache.status = false;
			tick();
			component.initialiseRapidChargeCache();
			expect(component.quickSettings[1].isVisible).toBe(true, 'rapidCharge.visible should be true');
			expect(component.quickSettings[1].isChecked).toBe(false, 'rapidCharge.checked should be false');
			rapidChargeCache.available = true;
			rapidChargeCache.status = true;
			component.initialiseRapidChargeCache();
			expect(component.quickSettings[1].isVisible).toBe(true, 'rapidCharge.visible should be true');
			expect(component.quickSettings[1].isChecked).toBe(true, 'rapidCharge.checked should be true');
		}));

		it('initialiseRapidChargeSettings', fakeAsync(() => {
			rapidChargeSettings.available = false;
			rapidChargeSettings.status = false;
			component.initialiseRapidChargeSettings();
			tick();
			expect(component.quickSettings[1].isVisible).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.visible should be false`);
			expect(component.quickSettings[1].isChecked).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.checked should be false`);
			expect(rapidChargeCache.available).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be false`);
			expect(rapidChargeCache.status).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be false`);

			rapidChargeSettings.available = false;
			rapidChargeSettings.status = true;
			component.initialiseRapidChargeSettings();
			tick();
			expect(component.quickSettings[1].isVisible).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.visible should be false`);
			expect(component.quickSettings[1].isChecked).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.checked should be true`);
			expect(rapidChargeCache.available).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be false`);
			expect(rapidChargeCache.status).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be true`);

			rapidChargeSettings.available = true;
			rapidChargeSettings.status = false;
			component.initialiseRapidChargeSettings();
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.visible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.checked should be false`);
			expect(rapidChargeCache.available).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be false`);

			rapidChargeSettings.available = true;
			rapidChargeSettings.status = true;
			component.initialiseRapidChargeSettings();
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.visible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidCharge.checked should be true`);
			expect(rapidChargeCache.available).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be true`);
		}));

		it('setRapidChargeSettings', fakeAsync(() => {
			rapidChargeCache.available = true;
			setReturnValue = true;
			component.quickSettings[1].isVisible = true;
			component.quickSettings[1].isChecked = false;
			component.setRapidChargeSettings(false);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, rapidCharge.visible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, rapidCharge.checked should be false`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(false, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should be false`);
			tick();
			component.quickSettings[1].isChecked = true;
			component.setRapidChargeSettings(true);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, rapidCharge.visible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, rapidCharge.checked should be true`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should be true`);

			tick();
			setReturnValue = false;
			rapidChargeCache.status = true;
			component.quickSettings[1].isVisible = true;
			component.quickSettings[1].isChecked = false;
			component.setRapidChargeSettings(false);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, rapidCharge.visible should be true`);
			// expect(component.quickSettings[1].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, rapidCharge.checked should keep true`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep true`);
			tick();
			rapidChargeCache.status = false;
			component.quickSettings[1].isChecked = true;
			component.setRapidChargeSettings(true);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, rapidCharge.visible should be true`);
			// expect(component.quickSettings[1].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, rapidCharge.checked should keep false`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(false, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep false`);
		}));

		it('onToggleStateChanged', fakeAsync(() => {
			let event = {
				target: {
					name: 'gaming.dashboard.device.quickSettings.rapidCharge',
					value: 'false'
				}
			}
			rapidChargeCache.available = true;
			setReturnValue = true;
			component.quickSettings[1].isVisible = true;
			component.quickSettings[1].isChecked = false;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.visible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, rapidChargeCache.checked should be false`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(false, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should be false`);
			tick();
			component.quickSettings[1].isChecked = true;
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.visible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.checked should be true`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should be true`);

			tick();
			setReturnValue = false;
			rapidChargeCache.status = true;
			component.quickSettings[1].isVisible = true;
			component.quickSettings[1].isChecked = false;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.visible should be true`);
			// expect(component.quickSettings[1].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.checked should keep true`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep true`);
			tick();
			rapidChargeCache.status = false;
			component.quickSettings[1].isChecked = true;
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.visible should be true`);
			// expect(component.quickSettings[1].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, rapidChargeCache.checked should keep false`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(false, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep false`);
		}));
	});

	describe('wifisecurity', function () {
		let securityAdvisorStub = {
			wifiSecurity: {
				on(event: any, handler: any) {
				},
				refresh() {
					return new Promise(resolve => {
						resolve(true);
					});
				},
				getWifiState() {
					return new Promise(resolve => {
						resolve(true);
					});
				},
				getWifiSecurityState() {
					return true;
				}
			}
		}

		let wifiSecurityServiceMock = {
			isLWSEnabled: false,
			wifiSecurity: {
				disableWifiSecurity() {
					return Promise.resolve(setReturnValue);
				},
				enableWifiSecurity() {
					return Promise.resolve(setReturnValue);
				}
			}
		}

		let guardMock = {
			previousPageName: '',
			getWifiSecurityState() {
				return true;
			}
		}
		beforeEach(async(() => {
			shellServiveSpy.getSecurityAdvisor.and.returnValue(securityAdvisorStub);
			audioServiceSpy.getDolbyMode.and.returnValue(new Promise(resolve => { resolve(dolbyAudioToggle) }));
			audioServiceSpy.startMonitorForDolby.and.returnValue(new Promise(resolve => { resolve(setReturnValue) }));
			audioServiceSpy.stopMonitorForDolby.and.returnValue(new Promise(resolve => { resolve(setReturnValue) }));
			powerServiceSpy.getRapidChargeModeStatusIdeaNoteBook.and.returnValue(new Promise(resolve => { resolve(rapidChargeSettings) }));
			TestBed.configureTestingModule({
				declarations: [
					WidgetQuicksettingsListComponent
				],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: WifiSecurityService, useValue: wifiSecurityServiceMock },
					{ provide: AudioService, useValue: audioServiceSpy },
					{ provide: PowerService, useValue: powerServiceSpy },
					{ provide: DialogService, useValue: dialogServiceSpy },
					{ provide: GuardService, useValue: guardMock },
					{ provide: Router, useValue: routerSpy },
				],
				schemas: [NO_ERRORS_SCHEMA]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
			component = fixture.debugElement.componentInstance;
			spyOn(component, 'runLocationService').and.returnValue();
			fixture.detectChanges();
		}));

		afterEach(() => {
			wifiSecurityServiceMock.isLWSEnabled = false;
		})


		it('ngOnInit not support wifiSecurity', () => {
			wifiSecurityFeatureCache = false;
			wifiSecurityStatusCache = 'never-used';
			component.ngOnInit();
			expect(component.quickSettings[2].isVisible).toBe(false, `wifi Security visible should be false`);
			expect(component.quickSettings[2].isChecked).toBe(false, `wifi Security checked should be false`);
		});

		it('initializeWifiSecCache', () => {
			wifiSecurityFeatureCache = true;
			wifiSecurityStatusCache = 'never-used';
			component.initializeWifiSecCache();
			expect(component.quickSettings[2].isVisible).toBe(true, `wifi Security visible should be true`);
			expect(component.quickSettings[2].isChecked).toBe(false, `wifi Security checked should be false`);

			wifiSecurityFeatureCache = true;
			wifiSecurityStatusCache = 'enabled';
			component.initializeWifiSecCache();
			expect(component.quickSettings[2].isVisible).toBe(true, `wifi Security visible should be true`);
			expect(component.quickSettings[2].isChecked).toBe(true, `wifi Security checked should be true`);
		});

		it('getWifiSecuritySettings', () => {
			securityWifiSecurityInGamingDashboardCache = false;
			securityWifiSecurityShowPluginMissingDialogCache = false;
			component.getWifiSecuritySettings();
			expect(securityWifiSecurityInGamingDashboardCache).toBe(true, `isLWSEnabled is flase, securityWifiSecurityInGamingDashboardCache shoulde be true`);
			expect(securityWifiSecurityShowPluginMissingDialogCache).toBe(true, `isLWSEnabled is flase, securityWifiSecurityShowPluginMissingDialogCache shoulde be true`);
			expect(component.quickSettings[2].isChecked).toBe(false, `isLWSEnabled is flase, wifi Security checked shoulde be false`)

			securityWifiSecurityInGamingDashboardCache = false;
			securityWifiSecurityShowPluginMissingDialogCache = false;
			wifiSecurityServiceMock.isLWSEnabled = true;
			component.getWifiSecuritySettings();
			expect(securityWifiSecurityInGamingDashboardCache).toBe(true, `isLWSEnabled is true, securityWifiSecurityInGamingDashboardCache shoulde be true`);
			expect(securityWifiSecurityShowPluginMissingDialogCache).toBe(true, `isLWSEnabled is true, securityWifiSecurityShowPluginMissingDialogCache shoulde be true`);
			expect(component.quickSettings[2].isChecked).toBe(true, `isLWSEnabled is true, wifi Security checked shoulde be true`)
		});

		it('updateWifiSecurityState', () => {
			component.updateWifiSecurityState(false);
			expect(component.quickSettings[2].isVisible).toBe(false, `wifi Security visible shoulde be true`);
			expect(wifiSecurityFeatureCache).toBe(false, 'wifiSecurityFeatureCache shoulde be true');

			component.updateWifiSecurityState(true);
			expect(component.quickSettings[2].isVisible).toBe(true, `wifi Security visible shoulde be true`);
			expect(wifiSecurityFeatureCache).toBe(true, 'wifiSecurityFeatureCache shoulde be true');

		});

		it('setWifiSecuritySettings', fakeAsync(() => {
			securityWifiSecurityInGamingDashboardCache = true;
			wifiSecurityServiceMock.isLWSEnabled = true;
			component.quickSettings[2].isChecked = true;
			setReturnValue = true;
			component.setWifiSecuritySettings(false);
			tick();
			expect(wifiSecurityServiceMock.isLWSEnabled).toBe(false, `setReturnValue is true, set false, wifiSecurityServiceMock.isLWSEnabled should be false`);
			expect(component.quickSettings[2].isChecked).toBe(false, `setReturnValue is true, set false, wifiSecurityServiceMock.isChecked should be false`);
			expect(component.quickSettings[2].readonly).toBe(true, `setReturnValue is true, set false, wifiSecurityServiceMock.readonly should be true`);

			wifiSecurityServiceMock.isLWSEnabled = true;
			setReturnValue = false;
			component.setWifiSecuritySettings(false);
			tick();
			expect(wifiSecurityServiceMock.isLWSEnabled).toBe(true, `setReturnValue is false, set false, wifiSecurityServiceMock.isLWSEnabled should keep true`);
			expect(component.quickSettings[2].isChecked).toBe(true, `setReturnValue is false, set false, wifiSecurityServiceMock.isChecked should keep true`);
			expect(component.quickSettings[2].readonly).toBe(false, `setReturnValue is false, set false, wifiSecurityServiceMock.readonly should keep false`);

			wifiSecurityServiceMock.isLWSEnabled = false;
			setReturnValue = true;
			component.setWifiSecuritySettings(true);
			tick();
			expect(wifiSecurityServiceMock.isLWSEnabled).toBe(true, `setReturnValue is true, set true, wifiSecurityServiceMock.isLWSEnabled should be true`);
			expect(component.quickSettings[2].isChecked).toBe(true, `setReturnValue is true, set true, wifiSecurityServiceMock.isChecked should be true`);
			expect(component.quickSettings[2].readonly).toBe(false, `setReturnValue is true, set true, wifiSecurityServiceMock.readonly should be false`);

			wifiSecurityServiceMock.isLWSEnabled = false;
			setReturnValue = false;
			component.setWifiSecuritySettings(true);
			tick();
			expect(wifiSecurityServiceMock.isLWSEnabled).toBe(false, `setReturnValue is false, set true, wifiSecurityServiceMock.isLWSEnabled should be false`);
			expect(component.quickSettings[2].isChecked).toBe(false, `setReturnValue is false, set true, wifiSecurityServiceMock.isChecked should be false`);
			expect(component.quickSettings[2].readonly).toBe(true, `setReturnValue is false, set true, wifiSecurityServiceMock.readonly should be true`);
		}));
	});

	describe('dolby', function () {
		let audioService: any;
		let audioServiceMock = {
			getDolbyMode() {
				return new Promise(resolve => {
					resolve(dolbyAudioToggle);
				})
			},
			setDolbyAudioState(value: any) {
				if (setReturnValue) {
					dolbyAudioToggle.isAudioProfileEnabled = value
				}
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			},
			startMonitorForDolby(value: any) {
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			},
			stopMonitorForDolby() {
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			}
		}
		beforeEach(async(() => {
			shellServiveSpy.getSecurityAdvisor.and.returnValue(new Promise(resolve => { resolve(true) }));
			powerServiceSpy.getRapidChargeModeStatusIdeaNoteBook.and.returnValue(new Promise(resolve => { resolve(rapidChargeSettings) }));
			TestBed.configureTestingModule({
				declarations: [
					WidgetQuicksettingsListComponent
				],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: WifiSecurityService, useValue: wifiSecurityServiceSpy },
					{ provide: AudioService, useValue: audioServiceMock },
					{ provide: PowerService, useValue: powerServiceSpy },
					{ provide: DialogService, useValue: dialogServiceSpy },
					{ provide: GuardService, useValue: guardSpy },
					{ provide: Router, useValue: routerSpy }
				],
				schemas: [NO_ERRORS_SCHEMA]
			}).compileComponents();
			audioService = TestBed.inject(AudioService);
			fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}))

		it('should create', () => {
			expect(component).toBeDefined();
		});

		it('ngOnInit not support dolby', () => {
			dolbyAudioToggleCache.available = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			spyOn(component, 'registerDolbyChangeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettings[3].isVisible).toBe(false, `dolby.visible should be false`);
			expect(component.quickSettings[3].isChecked).toBe(false, `dolby.checked should be false`);
			expect(component.registerDolbyChangeEvent).toHaveBeenCalledTimes(0);
		});

		it('initialiseDolbyCache', () => {
			dolbyAudioToggleCache.available = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			spyOn(component, 'registerDolbyChangeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettings[3].isVisible).toBe(true, `dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(false, `dolby.checked should be false`);
			expect(component.registerDolbyChangeEvent).toHaveBeenCalledTimes(1);

			dolbyAudioToggleCache.available = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			component.ngOnInit();
			expect(component.quickSettings[3].isVisible).toBe(true, `dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `dolby.checked should be true`);
			expect(component.registerDolbyChangeEvent).toHaveBeenCalledTimes(2);
		});

		it('getDolbySettings', fakeAsync(() => {
			dolbyAudioToggleCache.available = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			dolbyAudioToggle.available = false
			dolbyAudioToggle.isAudioProfileEnabled = false;
			component.quickSettings[3].isVisible = false;
			component.quickSettings[3].isChecked = false;
			component.getDolbySettings();
			tick();
			expect(component.quickSettings[3].isVisible).toBe(false, `dolbyAudio is ${dolbyAudioToggle}, dolby.visible should be false`);
			expect(component.quickSettings[3].isChecked).toBe(false, `dolbyAudio is ${dolbyAudioToggle}, dolby.checked should be false`);
			expect(dolbyAudioToggleCache.available).toBe(false, `dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.available should be false`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.isAudioProfileEnabled should be false`);

			tick();
			dolbyAudioToggle.available = true;
			dolbyAudioToggle.isAudioProfileEnabled = false;
			component.quickSettings[3].isChecked = true;
			component.getDolbySettings();
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `dolbyAudio is ${dolbyAudioToggle}, dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(false, `dolbyAudio is ${dolbyAudioToggle}, dolby.checked should be false`);
			expect(dolbyAudioToggleCache.available).toBe(true, `dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.isAudioProfileEnabled should be false`);

			tick();
			dolbyAudioToggle.available = true;
			dolbyAudioToggle.isAudioProfileEnabled = true;
			component.quickSettings[3].isChecked = false;
			component.getDolbySettings();
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `dolbyAudio is ${dolbyAudioToggle}, dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `dolbyAudio is ${dolbyAudioToggle}, dolby.checked should be true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.isAudioProfileEnabled should be true`);

			dolbyAudioToggle = undefined;
			component.getDolbySettings();
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `dolbyAudio is ${dolbyAudioToggle}, dolby.visible should keep true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `dolbyAudio is ${dolbyAudioToggle}, dolby.checked should keep true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.available should keep true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `dolbyAudio is ${dolbyAudioToggle}, dolbyAudioToggleCache.isAudioProfileEnabled should keep true`);
			tick();
			dolbyAudioToggle = { 'available': false, 'supportedModes': ['Dynamic', 'Movie', 'Music', 'Games', 'Voip'], 'isAudioProfileEnabled': false, 'currentMode': 'Games', 'voIPStatus': 'True', 'entertainmentStatus': 'True' }
		}));

		it('setDolbySettings', fakeAsync(() => {
			setReturnValue = true;
			dolbyAudioToggle.available = true;
			dolbyAudioToggle.isAudioProfileEnabled = true;
			dolbyAudioToggleCache.available = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			component.quickSettings[3].isVisible = true;
			component.setDolbySettings(false);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, dolby.visible should be false`);
			expect(component.quickSettings[3].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, dolby.checked should be false`);
			expect(dolbyAudioToggle.available).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggle.available should be false`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(false, `setReturnValue is ${setReturnValue}, dolbyAudioToggle.isAudioProfileEnabled should be false`);
			expect(dolbyAudioToggleCache.available).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.available should be false`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.isAudioProfileEnabled should be false`);

			tick();
			dolbyAudioToggle.isAudioProfileEnabled = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			component.setDolbySettings(true);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, dolby.checked should be true`);
			expect(dolbyAudioToggle.available).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggle.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggle.isAudioProfileEnabled should be true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.isAudioProfileEnabled should be true`);

			tick();
			setReturnValue = false;
			dolbyAudioToggle.isAudioProfileEnabled = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			component.setDolbySettings(false);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, dolby.checked should keep true`);
			expect(dolbyAudioToggle.available).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggle.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggle.isAudioProfileEnabled should keep true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.isAudioProfileEnabled should keep true`);

			tick();
			dolbyAudioToggle.isAudioProfileEnabled = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			component.setDolbySettings(true);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, dolby.checked should keep false`);
			expect(dolbyAudioToggle.available).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggle.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(false, `setReturnValue is ${setReturnValue}, dolbyAudioToggle.isAudioProfileEnabled should keep false`);
			expect(dolbyAudioToggleCache.available).toBe(true, `setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `setReturnValue is ${setReturnValue}, dolbyAudioToggleCache.isAudioProfileEnabled should keep false`);
		}));

		it('onToggleStateChanged', fakeAsync(() => {
			let event = {
				target: {
					name: 'gaming.dashboard.device.quickSettings.dolby',
					value: 'false'
				}
			}
			dolbyAudioToggleCache.available = true;
			dolbyAudioToggle.available = true;
			component.quickSettings[3].isVisible = true;
			setReturnValue = true;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, event is ${event}, dolby.checked should be false`);
			expect(dolbyAudioToggle.available).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(false, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.isAudioProfileEnabled should be false`);
			expect(dolbyAudioToggleCache.available).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.isAudioProfileEnabled should be false`);
			tick();
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolby.checked should be true`);
			expect(dolbyAudioToggle.available).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.isAudioProfileEnabled should be true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.isAudioProfileEnabled should be true`);

			tick();
			setReturnValue = false;
			dolbyAudioToggle.isAudioProfileEnabled = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolby.checked should keep true`);
			expect(dolbyAudioToggle.available).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.isAudioProfileEnabled should keep true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.isAudioProfileEnabled should keep true`);
			tick();
			dolbyAudioToggle.isAudioProfileEnabled = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolby.visible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, event is ${event}, dolby.checked should keep false`);
			expect(dolbyAudioToggle.available).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(false, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggle.isAudioProfileEnabled should keep false`);
			expect(dolbyAudioToggleCache.available).toBe(true, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `setReturnValue is ${setReturnValue}, event is ${event}, dolbyAudioToggleCache.isAudioProfileEnabled should keep false`);
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
			component.quickSettings[3].isChecked = false;
			component.handleDolbyChangeEvent(dolbyAudioToggle);
			expect(component.quickSettings[3].isChecked).toBe(true, `input is ${dolbyAudioToggle.isAudioProfileEnabled}, dolby.checked should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `dolbyAudioToggle.isAudioProfileEnabled != dolby.checked, dolbyAudioToggleCache.isAudioProfileEnabled should be true`);

			dolbyAudioToggle.isAudioProfileEnabled = false;
			component.quickSettings[3].isChecked = true;
			component.handleDolbyChangeEvent(dolbyAudioToggle);
			expect(component.quickSettings[3].isChecked).toBe(false, `input is ${dolbyAudioToggle.isAudioProfileEnabled}, dolby.checked should be false`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `dolbyAudioToggle.isAudioProfileEnabled != dolby.checked, dolbyAudioToggleCache.isAudioProfileEnabled should be false`);

			dolbyAudioToggle.available = undefined;
			dolbyAudioToggle.isAudioProfileEnabled = false;
			component.quickSettings[3].isChecked = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			component.handleDolbyChangeEvent(dolbyAudioToggle);
			expect(component.quickSettings[3].isChecked).toBe(true, `input is ${dolbyAudioToggle.isAudioProfileEnabled}, dolby.checked should keep true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `dolbyAudioToggle.available = undefined, dolbyAudioToggleCache.isAudioProfileEnabled should keep true`);

			dolbyAudioToggle.available = true;
			dolbyAudioToggle.isAudioProfileEnabled = undefined;
			component.quickSettings[3].isChecked = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			component.handleDolbyChangeEvent(dolbyAudioToggle);
			expect(component.quickSettings[3].isChecked).toBe(false, `input is ${dolbyAudioToggle.isAudioProfileEnabled}, dolby.cChecked should keep false`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `dolbyAudioToggle.isAudioProfileEnabled = undefined, dolbyAudioToggleCache.isAudioProfileEnabled should keep false`);
		}));
	});

	describe('catch error', () => {
		let loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['getMessage', 'debug', 'error', 'info', 'exception']);
		beforeEach(async(() => {
			shellServiveSpy.getSecurityAdvisor.and.returnValue(new Promise(resolve => { resolve(true) }));
			audioServiceSpy.getDolbyMode.and.returnValue(new Promise(resolve => { resolve(dolbyAudioToggle) }));
			audioServiceSpy.startMonitorForDolby.and.returnValue(new Promise(resolve => { resolve(setReturnValue) }));
			audioServiceSpy.stopMonitorForDolby.and.returnValue(new Promise(resolve => { resolve(setReturnValue) }));
			powerServiceSpy.getRapidChargeModeStatusIdeaNoteBook.and.returnValue(new Promise(resolve => { resolve(rapidChargeSettings) }));
			TestBed.configureTestingModule({
				declarations: [
					WidgetQuicksettingsListComponent
				],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: WifiSecurityService, useValue: wifiSecurityServiceSpy },
					{ provide: AudioService, useValue: audioServiceSpy },
					{ provide: PowerService, useValue: powerServiceSpy },
					{ provide: DialogService, useValue: dialogServiceSpy },
					{ provide: GuardService, useValue: guardSpy },
					{ provide: Router, useValue: routerSpy },
					{ provide: LoggerService, useValue: loggerServiceSpy }
				],
				schemas: [NO_ERRORS_SCHEMA]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
			component = fixture.debugElement.componentInstance;
			spyOn(component, 'runLocationService').and.returnValue();
			fixture.detectChanges();
		}));

		it('getDolbySettings error', fakeAsync(() => {
			audioServiceSpy.getDolbyMode.and.throwError('getDolbySettings error');
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.getDolbySettings()
			tick();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		}));

		it('getDolbySettings error', fakeAsync(() => {
			audioServiceSpy.setDolbyAudioState.and.throwError('getDolbySettings error');
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.setDolbySettings(true)
			tick();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		}));
	})
})
