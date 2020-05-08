
import { ComponentFixture, async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { WidgetQuicksettingsListComponent } from "./widget-quicksettings-list.component";
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { PowerService } from 'src/app/services/power/power.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';


describe("WidgetQuicksettingsListComponent", () => {

	let component: WidgetQuicksettingsListComponent;
	let fixture: ComponentFixture<WidgetQuicksettingsListComponent>;
	let shellService: any;

	let smartFanFeatureCache = true;
	let thermalModeVersionCache = 1;
	let prevThermalModeStatusCache = 2;
	let currentThermalModeStatusCache = 2;
	let rapidChargeCache = { "available": false, "status": false};
	let wifiSecurityFeatureCache = false;
	let wifiSecurityStatusCache = false;
	let dolbyAudioToggleCache = { "available": false, "supportedModes": ["Dynamic", "Movie", "Music", "Games", "Voip"], "isAudioProfileEnabled": false, "currentMode": "Games", "voIPStatus": "True", "entertainmentStatus": "True" }



	let thermalModeStatus = 2;
	let rapidChargeSettings = { "available": false, "status": false };
	//let wifiSecurity = {}
	let dolbyAudioToggle = { "available": false, "supportedModes": ["Dynamic", "Movie", "Music", "Games", "Voip"], "isAudioProfileEnabled": false, "currentMode": "Games", "voIPStatus": "True", "entertainmentStatus": "True" }
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

		},
		setSessionStorageValue(key: any, value: any) {

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

	let gamingThermalModeServiceSpy = jasmine.createSpyObj('GamingThermalModeService', ['getThermalModeStatus', 'setThermalModeStatus', 'regThermalModeChangeEvent']);
	let audioServiceSpy = jasmine.createSpyObj('AudioService', ['getDolbyMode', 'setDolbyAudioState', 'startMonitorForDolby', 'stopMonitorForDolby']);
	let powerServiceSpy = jasmine.createSpyObj('PowerService', ['getRapidChargeModeStatusIdeaNoteBook', 'setRapidChargeModeStatusIdeaNoteBook', ]);
	let dialogServiceSpy = jasmine.createSpyObj('DialogService', ['wifiSecurityLocationDialog', '']);
	let guardSpy = jasmine.createSpyObj('GuardService', ['previousPageName']);
	let routerSpy = jasmine.createSpyObj('Router', ['routerState']);

	describe("thermalmode", () => {
		let shellServiveSpy = jasmine.createSpyObj('VantageService', ['getGamingAllCapabilities', 'registerEvent', 'unRegisterEvent', ,'getSecurityAdvisor', 'getLogger']);
		let gamingThermalModeServiceMock = {
			getThermalModeSettingStatus() {
				return new Promise( resolve => {
					resolve(thermalModeStatus)
				})
			},
			setThermalModeSettingStatus(value: number) {
				if (setReturnValue) {
					thermalModeStatus = value;
				}
				return new Promise( resolve => {
					resolve(setReturnValue);
				})
			},
			regThermalModeChangeEvent() {
				return new Promise( resolve => {
					resolve(setReturnValue);
				})
			}
		}
		let gamingThermalModeService: any;
		shellServiveSpy.getSecurityAdvisor.and.returnValue(new Promise(resolve => { resolve(true)}));
		audioServiceSpy.getDolbyMode.and.returnValue(new Promise( resolve => { resolve(dolbyAudioToggle)}));
		audioServiceSpy.startMonitorForDolby.and.returnValue(new Promise( resolve => { resolve(setReturnValue)}));
		audioServiceSpy.stopMonitorForDolby.and.returnValue(new Promise( resolve => { resolve(setReturnValue)}));
		powerServiceSpy.getRapidChargeModeStatusIdeaNoteBook.and.returnValue(new Promise( resolve => {resolve(rapidChargeSettings)}));
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [
					WidgetQuicksettingsListComponent
				],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock},
					{ provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock},
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock},
					{ provide: AudioService, useValue: audioServiceSpy},
					{ provide: PowerService, useValue: powerServiceSpy},
					{ provide: DialogService, useValue: dialogServiceSpy},
					{ provide: GuardService, useValue: guardSpy},
					{ provide: Router, useValue: routerSpy}
				],
				schemas: [NO_ERRORS_SCHEMA]
			}).compileComponents();
			shellService = TestBed.inject(VantageShellService);
			gamingThermalModeService = TestBed.inject(GamingThermalModeService);
			fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}))

		it('should create', () => {
			expect(component).toBeDefined();
		});

		it('ngOnInit not support thermalMode', () => {
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			fixture.detectChanges();
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
			fixture.detectChanges();
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
			fixture.detectChanges();
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
			for(let i = 1;i<=3; i++) {
				thermalModeStatus = i;
				fixture.detectChanges();
				component.renderThermalModeStatus();
				tick();
				expect(component.drop.curSelected).toBe(i, `component.drop.curSelected should be ${i}`);
				expect(currentThermalModeStatusCache).toBe(i, `currentThermalModeStatusCache should be ${i}`);
			} 

			for(let i = 1;i<=3; i++) {
				thermalModeStatus = undefined;
				component.drop.curSelected = i;
				currentThermalModeStatusCache = i;
				fixture.detectChanges();
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

			for(let i = 1; i<=3; i++) {
				component.drop.curSelected = i
				thermalModeStatus = i;
				currentThermalModeStatusCache = i;
				for(let j = 1; j<=3; j++) {
					event.option.value = j;
					component.onOptionSelected(event);
					tick();
					expect(component.drop.curSelected).toBe(j, `setReturnValue is ${setReturnValue}, component.drop.curSelected should be ${j}`);
					expect(thermalModeStatus).toBe(j, `setReturnValue is ${setReturnValue}, thermalModeStatus should be ${j}`);
					expect(currentThermalModeStatusCache).toBe(j, `setReturnValue is ${setReturnValue}, currentThermalModeStatusCache should be ${j}`);
				}
			}

			setReturnValue = false;
			for(let i = 1; i<=3; i++) {
				component.drop.curSelected = i
				thermalModeStatus = i;
				currentThermalModeStatusCache = i;
				for(let j = 1; j<=3; j++) {
					event.option.value = j;
					component.onOptionSelected(event);
					tick();
					expect(component.drop.curSelected).toBe(i, `setReturnValue is ${setReturnValue}, component.drop.curSelected should keep ${i}`);
					expect(thermalModeStatus).toBe(i, `setReturnValue is ${setReturnValue}, thermalModeStatus should keep ${i}`);
					expect(currentThermalModeStatusCache).toBe(i, `setReturnValue is ${setReturnValue}, currentThermalModeStatusCache should keep ${i}`);
				}
			}

			setReturnValue = true;
			for(let i = 1; i<=3; i++) {
				event.target.name = 'gaming.dashboard.device.quickSettings.rapidCharge';
				component.drop.curSelected = i;
				thermalModeStatus = i;
				currentThermalModeStatusCache = i;
				for(let j = 1; j<=3; j++) {
					event.option.value = j;
					component.onOptionSelected(event);
					tick();
					expect(component.drop.curSelected).toBe(i, `setReturnValue is ${setReturnValue}, component.drop.curSelected should keep ${j}`);
					expect(thermalModeStatus).toBe(i, `setReturnValue is ${setReturnValue}, thermalModeStatus should keep ${j}`);
					expect(currentThermalModeStatusCache).toBe(i, `setReturnValue is ${setReturnValue}, currentThermalModeStatusCache should keep ${j}`);
				}
			}
		}));

		it('registerThermalModeEvent' , () => {
			spyOn(gamingThermalModeService, 'regThermalModeChangeEvent').and.callThrough();
			component.gamingCapabilities.smartFanFeature = false
			fixture.detectChanges();
			component.registerThermalModeEvent();
			expect(gamingThermalModeService.regThermalModeChangeEvent).toHaveBeenCalledTimes(0);
			component.gamingCapabilities.smartFanFeature = true;
			fixture.detectChanges();
			component.registerThermalModeEvent();
			expect(gamingThermalModeService.regThermalModeChangeEvent).toHaveBeenCalledTimes(1);
		})

		it('onRegThermalModeEvent', fakeAsync(() => {
			for(let i = 1; i<=3; i++) {
				component.onRegThermalModeEvent(i);
				tick();
				expect(component.drop.curSelected).toBe(i, `input is ${i}, component.drop.curSelected should be ${i}`);
				expect(currentThermalModeStatusCache).toBe(i, `input is ${i}, component.drop.curSelected should be ${i}`);
			}

			for(let i = 1; i<=3; i++) {
				prevThermalModeStatusCache = i;
				component.onRegThermalModeEvent(undefined);
				tick();
				expect(component.drop.curSelected).toBe(i, `input is undefined, component.drop.curSelected should be ${i}`);
			}
		}));
	});

	describe("repidcharge", function () {
		let shellServiveSpy = jasmine.createSpyObj('VantageService', ['getGamingAllCapabilities', 'registerEvent', 'unRegisterEvent', ,'getSecurityAdvisor', 'getLogger']);
		let powerServiceMock = {
			getRapidChargeModeStatusIdeaNoteBook() {
				return new Promise( resolve => {
					resolve(rapidChargeSettings)
				})
			},
			setRapidChargeModeStatusIdeaNoteBook(value: boolean) {
				if (setReturnValue) {
					rapidChargeSettings.status = value;
				}
				return new Promise( resolve => {
					resolve(setReturnValue);
				})
			}
		}
		shellServiveSpy.getSecurityAdvisor.and.returnValue(new Promise(resolve => { resolve(true)}));
		audioServiceSpy.getDolbyMode.and.returnValue(new Promise( resolve => { resolve(dolbyAudioToggle)}));
		audioServiceSpy.stopMonitorForDolby.and.returnValue(new Promise( resolve => { resolve(setReturnValue)}));
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [
					WidgetQuicksettingsListComponent
				],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock},
					{ provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock},
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy},
					{ provide: AudioService, useValue: audioServiceSpy},
					{ provide: PowerService, useValue: powerServiceMock},
					{ provide: DialogService, useValue: dialogServiceSpy},
					{ provide: GuardService, useValue: guardSpy},
					{ provide: Router, useValue: routerSpy}
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
			fixture.detectChanges();
			component.ngOnInit();
			expect(component.quickSettings[1].isVisible).toBe(false, 'component.quickSettings[1].isVisible should be false');
			expect(component.quickSettings[1].isChecked).toBe(false, 'component.quickSettings[1].isChecked should be false');
		});

		it('initialiseRapidChargeCache', fakeAsync(() => {
			rapidChargeCache.available = true;
			rapidChargeCache.status = false;
			fixture.detectChanges();
			tick();
			component.initialiseRapidChargeCache();
			expect(component.quickSettings[1].isVisible).toBe(true, 'component.quickSettings[1].isVisible should be true');
			expect(component.quickSettings[1].isChecked).toBe(false, 'component.quickSettings[1].isChecked should be false');
			rapidChargeCache.available = true;
			rapidChargeCache.status = true;
			component.initialiseRapidChargeCache();
			expect(component.quickSettings[1].isVisible).toBe(true, 'component.quickSettings[1].isVisible should be true');
			expect(component.quickSettings[1].isChecked).toBe(true, 'component.quickSettings[1].isChecked should be true');
		}));

		it('initialiseRapidChargeSettings', fakeAsync(() => {
			rapidChargeSettings.available = false;
			rapidChargeSettings.status = false;
			fixture.detectChanges();
			component.initialiseRapidChargeSettings();
			tick();
			expect(component.quickSettings[1].isVisible).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, component.quickSettings[1].isVisible visible should be false`);
			expect(component.quickSettings[1].isChecked).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, component.quickSettings[1].isChecked should be false`);
			expect(rapidChargeCache.available).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be false`);
			expect(rapidChargeCache.status).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be false`);

			rapidChargeSettings.available = false;
			rapidChargeSettings.status = true;
			fixture.detectChanges();
			component.initialiseRapidChargeSettings();
			tick();
			expect(component.quickSettings[1].isVisible).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, component.quickSettings[1].isVisible visible should be false`);
			expect(component.quickSettings[1].isChecked).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, component.quickSettings[1].isChecked should be true`);
			expect(rapidChargeCache.available).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be false`);
			expect(rapidChargeCache.status).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be true`);

			rapidChargeSettings.available = true;
			rapidChargeSettings.status = false;
			fixture.detectChanges();
			component.initialiseRapidChargeSettings();
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, component.quickSettings[1].isVisible visible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, component.quickSettings[1].isChecked should be false`);
			expect(rapidChargeCache.available).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(false, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be false`);

			rapidChargeSettings.available = true;
			rapidChargeSettings.status = true;
			fixture.detectChanges();
			component.initialiseRapidChargeSettings();
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, component.quickSettings[1].isVisible visible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, component.quickSettings[1].isChecked should be true`);
			expect(rapidChargeCache.available).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(true, `rapidChargeSettings is ${rapidChargeSettings}, rapidChargeCache.status should be true`);
		}));

		it('setRapidChargeSettings', fakeAsync(() => {
			rapidChargeCache.available = true;
			setReturnValue = true;
			fixture.detectChanges();
			component.quickSettings[1].isVisible = true;
			component.quickSettings[1].isChecked = false;
			component.setRapidChargeSettings(false);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isVisible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isChecked should be false`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(false, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should be false`);
			tick();
			component.quickSettings[1].isChecked = true;
			component.setRapidChargeSettings(true);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isVisible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isChecked should be true`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should be true`);

			tick();
			setReturnValue = false;
			rapidChargeCache.status = true;
			component.quickSettings[1].isVisible = true;
			component.quickSettings[1].isChecked = false;
			component.setRapidChargeSettings(false);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isVisible should be true`);
			// expect(component.quickSettings[1].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isChecked should keep true`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep true`);
			tick();
			rapidChargeCache.status = false;
			component.quickSettings[1].isChecked = true;
			component.setRapidChargeSettings(true);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isVisible should be true`);
			// expect(component.quickSettings[1].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isChecked should keep false`);
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
			fixture.detectChanges();
			component.quickSettings[1].isVisible = true;
			component.quickSettings[1].isChecked = false;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isVisible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isChecked should be false`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(false, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should be false`);
			tick();
			component.quickSettings[1].isChecked = true;
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isVisible should be true`);
			expect(component.quickSettings[1].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isChecked should be true`);
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
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isVisible should be true`);
			// expect(component.quickSettings[1].isChecked).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isChecked should keep true`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep true`);
			tick();
			rapidChargeCache.status = false;
			component.quickSettings[1].isChecked = true;
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[1].isVisible).toBe(true, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isVisible should be true`);
			// expect(component.quickSettings[1].isChecked).toBe(false, `setReturnValue is ${setReturnValue}, component.quickSettings[1].isChecked should keep false`);
			expect(rapidChargeCache.available).toBe(true, `setReturnValue is ${setReturnValue}, rapidChargeCache.available should be true`);
			expect(rapidChargeCache.status).toBe(false, `setReturnValue is ${setReturnValue}, rapidChargeCache.status should keep false`);
		}));
	});

	describe("wifisecurity", function () {

	});

	describe("dolby", function () {
		let shellServiveSpy = jasmine.createSpyObj('VantageService', ['getGamingAllCapabilities', 'registerEvent', 'unRegisterEvent', ,'getSecurityAdvisor', 'getLogger']);
		let audioServiceMock = {
			getDolbyMode() {
				return new Promise( resolve => {
					resolve(dolbyAudioToggle)
				})
			},
			setDolbyAudioState(value: any) {
				if (setReturnValue) {
					dolbyAudioToggle.isAudioProfileEnabled = value
				}
				return new Promise( resolve => {
					resolve(setReturnValue);
				})
			},
			startMonitorForDolby(value: any) {
				return new Promise( resolve => {
					resolve(setReturnValue)
				})
			},
			stopMonitorForDolby() {
				return new Promise( resolve => {
					resolve(setReturnValue)
				})
			}
		}
		shellServiveSpy.getSecurityAdvisor.and.returnValue(new Promise(resolve => { resolve(true)}));
		audioServiceSpy.getDolbyMode.and.returnValue(new Promise( resolve => { resolve(dolbyAudioToggle)}));
		audioServiceSpy.startMonitorForDolby.and.returnValue(new Promise( resolve => { resolve(setReturnValue)}));
		audioServiceSpy.stopMonitorForDolby.and.returnValue(new Promise( resolve => { resolve(setReturnValue)}));
		powerServiceSpy.getRapidChargeModeStatusIdeaNoteBook.and.returnValue(new Promise( resolve => {resolve(rapidChargeSettings)}));
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [
					WidgetQuicksettingsListComponent
				],
				imports: [],
				providers: [
					{ provide: VantageShellService, useValue: shellServiveSpy },
					{ provide: CommonService, useValue: commonServiceMock},
					{ provide: GamingAllCapabilitiesService, useValue: GamingAllCapabilitiesServiceMock},
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy},
					{ provide: AudioService, useValue: audioServiceMock},
					{ provide: PowerService, useValue: powerServiceSpy},
					{ provide: DialogService, useValue: dialogServiceSpy},
					{ provide: GuardService, useValue: guardSpy},
					{ provide: Router, useValue: routerSpy}
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

		it('ngOnInit not support dolby', () => {
			dolbyAudioToggleCache.available = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			fixture.detectChanges();
			spyOn(component, 'registerDolbyChangeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettings[3].isVisible).toBe(false, `component.quickSettings[3].isVisible should be false`);
			expect(component.quickSettings[3].isChecked).toBe(false, `component.quickSettings[3].isVisible should be false`);
			expect(component.registerDolbyChangeEvent).toHaveBeenCalledTimes(0);

		});

		it('initialiseDolbyCache', () => {
			dolbyAudioToggleCache.available = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			fixture.detectChanges();
			spyOn(component, 'registerDolbyChangeEvent').and.callThrough();
			component.ngOnInit();
			expect(component.quickSettings[3].isVisible).toBe(true, `component.quickSettings[3].isVisible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(false, `component.quickSettings[3].isVisible should be false`);
			expect(component.registerDolbyChangeEvent).toHaveBeenCalledTimes(1);

			dolbyAudioToggleCache.available = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			fixture.detectChanges();
			component.ngOnInit();
			expect(component.quickSettings[3].isVisible).toBe(true, `component.quickSettings[3].isVisible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `component.quickSettings[3].isVisible should be true`);
			expect(component.registerDolbyChangeEvent).toHaveBeenCalledTimes(2);
		});

		xit('getDolbySettings', fakeAsync(() => {
			dolbyAudioToggleCache.available = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			dolbyAudioToggle.available = false
			dolbyAudioToggle.isAudioProfileEnabled = false;
			fixture.detectChanges();
			component.getDolbySettings();
			tick();
			expect(component.quickSettings[3].isVisible).toBe(false, `1 component.quickSettings[3].isVisible should be false`);
			expect(component.quickSettings[3].isChecked).toBe(false, `1 component.quickSettings[3].isVisible should be false`);
			expect(dolbyAudioToggleCache.available).toBe(false, `1 dolbyAudioToggleCache.available should be false`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `1 dolbyAudioToggleCache.isAudioProfileEnabled should be false`);

			tick();
			dolbyAudioToggle.available = true;
			dolbyAudioToggle.isAudioProfileEnabled = false;
			fixture.detectChanges();
			component.getDolbySettings();
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `2 component.quickSettings[3].isVisible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(false, `2 component.quickSettings[3].isVisible should be false`);
			expect(dolbyAudioToggleCache.available).toBe(true, `2 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `2 dolbyAudioToggleCache.isAudioProfileEnabled should be false`);

			// tick();
			// dolbyAudioToggle.available = true;
			// dolbyAudioToggle.isAudioProfileEnabled = true;
			// fixture.detectChanges();
			// component.getDolbySettings();
			// tick();
			// expect(component.quickSettings[3].isVisible).toBe(true, `3 component.quickSettings[3].isVisible should be true`);
			// expect(component.quickSettings[3].isChecked).toBe(true, `3 component.quickSettings[3].isVisible should be true`);
			// expect(dolbyAudioToggleCache.available).toBe(true, `3 dolbyAudioToggleCache.available should be true`);
			// expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `3 dolbyAudioToggleCache.isAudioProfileEnabled should be true`);
		}));

		it('setDolbySettings', fakeAsync(() => {
			dolbyAudioToggleCache.available = true;
			dolbyAudioToggle.available = true;
			component.quickSettings[3].isVisible = true;
			setReturnValue = true;
			fixture.detectChanges();
			dolbyAudioToggle.isAudioProfileEnabled = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			component.setDolbySettings(false);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `1 component.quickSettings[3].isVisible should be false`);
			expect(component.quickSettings[3].isChecked).toBe(false, `1 component.quickSettings[3].isChecked should be false`);
			expect(dolbyAudioToggle.available).toBe(true, `1 dolbyAudioToggleCache.available should be false`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(false, `1 dolbyAudioToggleCache.isAudioProfileEnabled should be false`);
			expect(dolbyAudioToggleCache.available).toBe(true, `1 dolbyAudioToggleCache.available should be false`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `1 dolbyAudioToggleCache.isAudioProfileEnabled should be false`);

			tick();
			dolbyAudioToggle.isAudioProfileEnabled = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			component.setDolbySettings(true);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `2 component.quickSettings[3].isVisible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `2 component.quickSettings[3].isChecked should be true`);
			expect(dolbyAudioToggle.available).toBe(true, `2 dolbyAudioToggleCache.available should be false`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(true, `2 dolbyAudioToggleCache.isAudioProfileEnabled should be true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `2 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `2 dolbyAudioToggleCache.isAudioProfileEnabled should be true`);

			tick();
			setReturnValue = false;
			fixture.detectChanges();
			dolbyAudioToggle.isAudioProfileEnabled = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			component.setDolbySettings(false);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `3 component.quickSettings[3].isVisible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `3 component.quickSettings[3].isChecked should keep true`);
			expect(dolbyAudioToggle.available).toBe(true, `3 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(true, `3 dolbyAudioToggleCache.isAudioProfileEnabled should keep true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `3 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `3 dolbyAudioToggleCache.isAudioProfileEnabled should keep true`);

			tick();
			dolbyAudioToggle.isAudioProfileEnabled = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			component.setDolbySettings(true);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `4 component.quickSettings[3].isVisible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(false, `4 component.quickSettings[3].isChecked should keep false`);
			expect(dolbyAudioToggle.available).toBe(true, `4 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(false, `4 dolbyAudioToggleCache.isAudioProfileEnabled should keep false`);
			expect(dolbyAudioToggleCache.available).toBe(true, `4 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `4 dolbyAudioToggleCache.isAudioProfileEnabled should keep false`);
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
			fixture.detectChanges();
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `1 component.quickSettings[3].isVisible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(false, `1 component.quickSettings[3].isChecked should be false`);
			expect(dolbyAudioToggle.available).toBe(true, `1 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(false, `1 dolbyAudioToggleCache.isAudioProfileEnabled should be true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `1 dolbyAudioToggleCache.available should be false`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `1 dolbyAudioToggleCache.isAudioProfileEnabled should be false`);
			tick();
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `2 component.quickSettings[3].isVisible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `2 component.quickSettings[3].isChecked should be true`);
			expect(dolbyAudioToggle.available).toBe(true, `2 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(true, `2 dolbyAudioToggleCache.isAudioProfileEnabled should be true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `2 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `2 dolbyAudioToggleCache.isAudioProfileEnabled should be true`);

			tick();
			setReturnValue = false;
			dolbyAudioToggle.isAudioProfileEnabled = true;
			dolbyAudioToggleCache.isAudioProfileEnabled = true;
			event.target.value = 'false';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `3 component.quickSettings[3].isVisible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(true, `3 component.quickSettings[3].isChecked should keep true`);
			expect(dolbyAudioToggle.available).toBe(true, `3 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(true, `3 dolbyAudioToggleCache.isAudioProfileEnabled should keep true`);
			expect(dolbyAudioToggleCache.available).toBe(true, `3 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(true, `3 dolbyAudioToggleCache.isAudioProfileEnabled should keep true`);
			tick();
			dolbyAudioToggle.isAudioProfileEnabled = false;
			dolbyAudioToggleCache.isAudioProfileEnabled = false;
			event.target.value = 'true';
			component.onToggleStateChanged(event);
			tick();
			expect(component.quickSettings[3].isVisible).toBe(true, `4 component.quickSettings[3].isVisible should be true`);
			expect(component.quickSettings[3].isChecked).toBe(false, `4 component.quickSettings[3].isChecked should keep false`);
			expect(dolbyAudioToggle.available).toBe(true, `4 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggle.isAudioProfileEnabled).toBe(false, `4 dolbyAudioToggleCache.isAudioProfileEnabled should keep false`);
			expect(dolbyAudioToggleCache.available).toBe(true, `4 dolbyAudioToggleCache.available should be true`);
			expect(dolbyAudioToggleCache.isAudioProfileEnabled).toBe(false, `4 dolbyAudioToggleCache.isAudioProfileEnabled should keep false`);
		}));
		
		
	});
})

// import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { WidgetQuicksettingsListComponent } from './widget-quicksettings-list.component';
// import { Pipe } from '@angular/core';
// import { HttpClient, HttpHandler } from '@angular/common/http';
// // tslint:disable-next-line: no-duplicate-imports
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { AudioService } from 'src/app/services/audio/audio.service';
// import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Router } from '@angular/router';
// import { DevService } from 'src/app/services/dev/dev.service';
// import { TranslateService, TranslateStore } from '@ngx-translate/core';
// import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
// import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
// import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
// import { DialogService } from 'src/app/services/dialog/dialog.service';
// import { UserService } from 'src/app/services/user/user.service';
// import { CookieService } from 'ngx-cookie-service';


// const audioServiceMock = jasmine.createSpyObj('AudioService', ['isShellAvailable', 'getDolbyFeatureStatus', 'setDolbyOnOff']);
// const gamingThermalModeServiceMock = jasmine.createSpyObj('GamingThermalModeService', ['isShellAvailable', 'getThermalModeStatus', 'setThermalModeStatus', 'regThermalModeEvent']);
// const  gamingDialogServiceMock = jasmine.createSpyObj('DialogService', ['isShellAvailable']);
// const  gamingUserServiceMock = jasmine.createSpyObj('UserService', ['isShellAvailable']);
// const  gamingTranslateServiceMock = jasmine.createSpyObj('TranslateService', ['isShellAvailable']);

// const gamingAllCapabilitiesService = jasmine.createSpyObj('GamingAllCapabilitiesService', [
// 	'getCapabilityFromCache'
// ]);
// xdescribe("WidgetQuicksettingsListComponent", function () {
// 	let component: WidgetQuicksettingsListComponent;
// 	let fixture: ComponentFixture<WidgetQuicksettingsListComponent>;
// 	let router: Router;
// 	let gamingSettings: any = {};
// 	let isQuickSettingsVisible = true;
// 	let originalTimeout;
// 	gamingThermalModeServiceMock.isShellAvailable.and.returnValue(true);
// 	gamingDialogServiceMock.isShellAvailable.and.returnValue(true);
// 	gamingUserServiceMock.isShellAvailable.and.returnValue(true);
// 	gamingTranslateServiceMock.isShellAvailable.and.returnValue(true);

// 	describe("thermalmode", function () {

// 	})

// 	describe("repidcharge", function () {

// 	})

// 	describe("wifisecurity", function () {

// 	})

// 	describe("dolby", function () {

// 	})

// 	beforeEach(function () {
// 		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
// 		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
// 		TestBed.configureTestingModule({
// 			declarations: [WidgetQuicksettingsListComponent,
// 				mockPipe({ name: 'translate' })],
// 			schemas: [NO_ERRORS_SCHEMA],
// 			imports: [
// 				RouterTestingModule.withRoutes([]),
// 			],
// 			providers: [
// 				{ provide: HttpClient },
// 				{ provide: HttpHandler},
// 				{ provide: VantageShellService},
// 				{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock },
// 				{ provide: AudioService, useValue: audioServiceMock },
// 				{ provide: DevService },
// 				{ provide: DialogService, useValue: gamingDialogServiceMock },
// 				{ provide: UserService, useValue: gamingUserServiceMock },
// 				{ provide: CookieService },
// 				{ provide: TranslateService, useValue: gamingTranslateServiceMock },
// 				{ provide: TranslateStore },
// 				{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesService },
// 				{ provide: HypothesisService }
// 			]
// 		}).compileComponents();
// 		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
// 		component = fixture.debugElement.componentInstance;
// 		router = TestBed.get(Router);
// 		//	fixture.detectChanges();
// 	});

// 	it("should create", function (done) {
// 		setTimeout(function () {
// 			done();
// 		}, 9000);
// 		expect(component).toBeTruthy();
// 	});

// 	afterEach(function () {
// 		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
// 	});

// 	// it('should have default value Balance for thermal mode if localstorage not set', () => {
// 	// 	fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
// 	// 	component = fixture.debugElement.componentInstance;
// 	// 	fixture.detectChanges();
// 	// 	//Expected Default Behaviour
// 	// 	expect(component.drop.curSelected).toEqual(2);
// 	// });

// 	xit('should update the thermal mode value on service and in Local storage', fakeAsync((done: any) => {
// 		let thermalModePromisedData: number;
// 		const uiThermalModeValue = component.drop.curSelected;
// 		const cacheThermalModeValue = component.GetThermalModeCacheStatus();
// 		gamingThermalModeServiceMock.getThermalModeStatus.and.returnValue(Promise.resolve(uiThermalModeValue));
// 		gamingThermalModeServiceMock.getThermalModeStatus().then((response: any) => {
// 			thermalModePromisedData = response;
// 		});
// 		component.renderThermalModeStatus();
// 		tick(10);
// 		fixture.detectChanges();
// 		expect(component).toBeTruthy();
// 		//	expect(uiThermalModeValue).toEqual(cacheThermalModeValue);
// 		// expect(uiThermalModeValue).toEqual(thermalModePromisedData);
// 		// expect(cacheThermalModeValue).toEqual(thermalModePromisedData);
// 	}));

// 	// it('Should not have same value in current and previous local storage', fakeAsync(() => {
// 	// 	const cacheThermalModeValue = component.GetThermalModeCacheStatus();
// 	// 	const PreCacheThermalModeValue = component.GetThermalModePrevCacheStatus();
// 	// 	tick(10);
// 	// 	fixture.detectChanges();
// 	// 	if (PreCacheThermalModeValue){
// 	// 	expect(cacheThermalModeValue).toEqual(PreCacheThermalModeValue); }
// 	// }));

// 	xit('should give ischecked true after calling set dolby', fakeAsync(() => {
// 		component.setDolbySettings(true);
// 		expect(component.quickSettings[3].isChecked).toEqual(false);
// 	}));


// 	xit('should have default isCheckedBoxVisible legionUpdate object false for Thermal mode & True for all', () => {
// 		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
// 		component = fixture.debugElement.componentInstance;
// 		fixture.detectChanges();
// 		// Expected Default Behaviour
// 		expect(component.quickSettings[0].isCheckBoxVisible).toEqual(false);
// 		expect(component.quickSettings[1].isCheckBoxVisible).toEqual(true);
// 		expect(component.quickSettings[2].isCheckBoxVisible).toEqual(true);
// 		expect(component.quickSettings[3].isCheckBoxVisible).toEqual(true);
// 	});

// 	it('should have default isSwitchVisible quickSettings object false for Thermal mode & True for all', () => {
// 		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
// 		component = fixture.debugElement.componentInstance;
// 		fixture.detectChanges();
// 		// Expected Default Behaviour
// 		expect(component.quickSettings[0].isSwitchVisible).toEqual(false);
// 	});

// 	xit('should have default isCollapsible legionUpdate object true for CPU OverClock & false for all', () => {
// 		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
// 		component = fixture.debugElement.componentInstance;
// 		fixture.detectChanges();
// 		// Expected Default Behaviour
// 		expect(component.quickSettings[0].isCollapsible).toEqual(true);
// 	});

// 	it('handleError', fakeAsync(() => {
// 		component.handleError(true);
// 		expect(component).toBeTruthy();
// 	}));

// 	it('onRegThermalModeEvent', fakeAsync(() => {
// 		component.onRegThermalModeEvent(true);
// 		expect(component).toBeTruthy();
// 	}));


// 	xit('registerThermalModeEvent', fakeAsync(() => {
// 		component.registerThermalModeEvent();
// 		expect(component).toBeTruthy();
// 	}));

// 	xit('onOptionSelected', fakeAsync(() => {
// 		tick(10);
// 		fixture.detectChanges();
// 		let envent1 = {
// 			target: {
// 				option: {value: 1},
// 				name: 'gaming.dashboard.device.quickSettings.title'
// 			}
// 		};
// 		try {
// 			component.setThermalModeStatus = undefined ;
// 			component.onOptionSelected(envent1);


// 		} catch (e) {

// 		}

// 		expect(component).toBeTruthy();

// 	}));



// 	xit('onToggleStateChanged', fakeAsync(() => {
// 		tick(10);
// 		fixture.detectChanges();
// 		let event: Event;
// 		let envent1 = {
// 			target: {
// 				value: true,
// 				name: 'gaming.dashboard.device.quickSettings.dolby'
// 			}
// 		};
// 		try {
// 			component.onToggleStateChanged(envent1);

// 			envent1 = {
// 				target: {
// 					value: false,
// 					name: 'gaming.dashboard.device.quickSettings.rapidCharge'
// 				}
// 			};
// 			component.onToggleStateChanged(envent1);

// 			envent1 = {
// 				target: {
// 					value: false,
// 					name: 'gaming.dashboard.device.quickSettings.wifiSecurity'
// 				}
// 			};
// 			component.onToggleStateChanged(envent1);
// 		} catch (e) {

// 		}
// 		expect(component).toBeTruthy();

// 	}));


// 	it('GetThermalModePrevCacheStatus', fakeAsync(() => {
// 		component.GetThermalModePrevCacheStatus();
// 		expect(component).toBeTruthy();
// 	}));



// 	it('onFocus', fakeAsync(() => {
// 		component.onFocus();
// 		expect(component).toBeTruthy();
// 	}));


// 	it('updateWifiSecurityState', fakeAsync(() => {
// 		component.updateWifiSecurityState(true);
// 		component.updateWifiSecurityState(false);
// 		expect(component).toBeTruthy();
// 	}));

// });


// /**
//  * @param options pipeName which has to be mock
//  * @description To mock the pipe.
//  * @summary This has to move to one utils file.
//  */
// export function mockPipe(options: Pipe): Pipe {
// 	const metadata: Pipe = {
// 		name: options.name
// 	};
// 	return <any>Pipe(metadata)(class MockPipe {
// 		public transform(query: string, ...args: any[]): any {
// 			return query;
// 		}
// 	});
// }
