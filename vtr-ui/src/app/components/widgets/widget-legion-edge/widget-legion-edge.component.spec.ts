import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { WidgetLegionEdgeComponent } from './widget-legion-edge.component';

import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { GamingOCService } from 'src/app/services/gaming/gaming-OC/gaming-oc.service';
import { GamingSystemUpdateService } from 'src/app/services/gaming/gaming-system-update/gaming-system-update.service';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { GamingHybridModeService } from 'src/app/services/gaming/gaming-hybrid-mode/gaming-hybrid-mode.service';
import { GamingOverDriveService } from 'src/app/services/gaming/gaming-over-drive/gaming-over-drive.service';
import { GamingKeyLockService } from 'src/app/services/gaming/gaming-keylock/gaming-key-lock.service';

import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { GamingThermal2 } from 'src/app/enums/gaming-thermal2.enum';
import { AutomationId } from 'src/app/enums/automation-id.enum';

describe('WidgetLegionEdgeComponent', () => {
	let component: WidgetLegionEdgeComponent;
	let fixture: ComponentFixture<WidgetLegionEdgeComponent>;

	let liteGamingCache = false;
	let desktopTypeCahce = false;
	let smartFanFeatureCache = false;
	let thermalModeVersionCache = 1;
	let cpuOCFeatureCache = false;
	let gpuOCFeatureCache = false;
	let xtuServiceCache = false;
	let nvDriverCache = false;
	let memOCFeatureCache = false;
	let networkBoostFeatureCache = false;
	let networkBoosNeedToAskPopup = 1;
	let fbnetFilterCache = false;
	let optimizationFeatureCache = false;
	let hybridModeFeatureCache = false;
	let overDriveFeatureCache = false;
	let touchpadLockFeatureCache = false;
	let winKeyLockFeatureCache = false;

	let thermalModeRealStatusCache = 2;
	let cpuOCStatusCache = 3;
	let gpuOCStatusCache = 3;
	let memOCStatusCache = false;
	let networkBoostStatusCache = false
	let autoCloseStatusCache = false;
	let hybridModeStatusCache = false;
	let overDriveStatusCache = true;
	let touchpadLockStatusCache = false;

	let setReturnValue = true;

	let commonServiceMock = {
		getLocalStorageValue(key: any, defaultValue?: any) {
			let returnValue: any;
			switch (key) {
				case '[LocalStorageKey] RealThermalModeStatus':
					returnValue = thermalModeRealStatusCache;
					break;
				case '[LocalStorageKey] CpuOCStatus':
					returnValue = cpuOCStatusCache;
					break;
				case '[LocalStorageKey] GpuOCStatus':
					returnValue = gpuOCStatusCache;
					break;
				case '[LocalStorageKey] MemOCFeatureStatus':
					returnValue = memOCStatusCache;
					break;
				case '[LocalStorageKey] NetworkBoostStatus':
					returnValue = networkBoostStatusCache;
					break;
				case '[LocalStorageKey] NetworkBoosNeedToAskPopup':
					returnValue = networkBoosNeedToAskPopup;
					break;
				case '[LocalStorageKey] AutoCloseStatus':
					returnValue = autoCloseStatusCache;
					break;
				case '[LocalStorageKey] HybridModeFeatureStatus':
					returnValue = hybridModeStatusCache;
					break;
				case '[LocalStorageKey] OverDriveStatus':
					returnValue = overDriveStatusCache;
					break;
				case '[LocalStorageKey] TouchpadLockStatus':
					returnValue = touchpadLockStatusCache;
					break;
			}
			if (returnValue === undefined && arguments.length === 2) {
				return defaultValue;
			} else {
				return returnValue;
			}
		},
		setLocalStorageValue(key: any, value: any) {
			switch (key) {
				case '[LocalStorageKey] RealThermalModeStatus':
					thermalModeRealStatusCache = value;
					break;
				case '[LocalStorageKey] CpuOCStatus':
					cpuOCStatusCache = value;
					break;
				case '[LocalStorageKey] GpuOCStatus':
					gpuOCStatusCache = value;
					break;
				case '[LocalStorageKey] MemOCFeatureStatus':
					memOCStatusCache = value;
					break;
				case '[LocalStorageKey] NetworkBoostStatus':
					networkBoostStatusCache = value;
					break;
				case '[LocalStorageKey] NetworkBoosNeedToAskPopup':
					networkBoosNeedToAskPopup = value;
					break;
				case '[LocalStorageKey] AutoCloseStatus':
					autoCloseStatusCache = value;
					break;
				case '[LocalStorageKey] HybridModeFeatureStatus':
					hybridModeStatusCache = value;
					break;
				case '[LocalStorageKey] OverDriveStatus':
					overDriveStatusCache = value;
					break;
				case '[LocalStorageKey] TouchpadLockStatus':
					touchpadLockStatusCache = value;
					break;
			}
		},
		getCapabalitiesNotification() {
			let res = {
				type: '',
				payload: {
				}
			}
			return of(res);
		},
	};

	let gamingAllCapabilitiesServiceMock = {
		isShellAvailable: true,
		getCapabilityFromCache(key: any) {
			switch (key) {
				case '[LocalStorageKey] LiteGaming':
					return liteGamingCache;
				case '[LocalStorageKey] DesktopType':
					return desktopTypeCahce;
				case '[LocalStorageKey] SmartFanFeature':
					return smartFanFeatureCache;
				case '[LocalStorageKey] ThermalModeVersion':
					return thermalModeVersionCache;
				case '[LocalStorageKey] CpuOCFeature':
					return cpuOCFeatureCache;
				case '[LocalStorageKey] GpuOCFeature':
					return gpuOCFeatureCache;
				case '[LocalStorageKey] XtuService':
					return xtuServiceCache;
				case '[LocalStorageKey] NvDriver':
					return nvDriverCache;
				case '[LocalStorageKey] MemOCFeature':
					return memOCFeatureCache;
				case '[LocalStorageKey] NetworkBoostFeature':
					return networkBoostFeatureCache;
				case '[LocalStorageKey] FbNetFilter':
					return fbnetFilterCache;
				case '[LocalStorageKey] OptimizationFeature':
					return optimizationFeatureCache;
				case '[LocalStorageKey] HybridModeFeature':
					return hybridModeFeatureCache;
				case '[LocalStorageKey] OverDriveFeature':
					return overDriveFeatureCache;
				case '[LocalStorageKey] TouchpadLockFeature':
					return touchpadLockFeatureCache;
				case '[LocalStorageKey] TouchpadLockStatus':
					return touchpadLockStatusCache;
				case '[LocalStorageKey] WinKeyLockFeature':
					return winKeyLockFeatureCache;
			}
		}
	};

	const gamingThermalModeServiceSpy = jasmine.createSpyObj('GamingThermalModeService', ['getThermalModeRealStatus', 'regThermalModeRealStatusChangeEvent']);
	const gamingOCServiceSpy = jasmine.createSpyObj('GamingOCService', ['getPerformanceOCSetting']);
	const gamingSystemUpdateServiceSpy = jasmine.createSpyObj('GamingSystemUpdateService', ['getCpuOCStatus', 'getRamOCStatus', 'setCpuOCStatus', 'setRamOCStatus']);
	const networkBoostServiceSpy = jasmine.createSpyObj('NetworkBoostService', ['getNetworkBoostStatus', 'setNetworkBoostStatus']);
	const gamingAutoCloseServiceSpy = jasmine.createSpyObj('GamingAutoCloseService', ['getAutoCloseStatus', 'setAutoCloseStatus', 'getAppsAutoCloseList', 'getAppsAutoCloseRunningList', 'addAppsAutoCloseList', 'delAppsAutoCloseList', 'getNeedToAsk', 'setNeedToAsk', 'setAutoCloseStatusCache', 'getAutoCloseStatusCache', 'setNeedToAskStatusCache', 'getNeedToAskStatusCache', 'setAutoCloseListCache', 'getAutoCloseListCache']);
	const gamingHybridModeServiceSpy = jasmine.createSpyObj('GamingHybridModeService', ['getHybridModeStatus', 'setHybridModeStatus']);
	const gamingOverDriveServiceSpy = jasmine.createSpyObj('GamingOverDriveService', ['getOverDriveStatus', 'setOverDriveStatus']);
	const gamingKeyLockServiceSpy = jasmine.createSpyObj('GamingKeyLockService', ['getKeyLockStatus', 'setKeyLockStatus']);
	const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['getMessage', 'debug', 'error', 'info', 'exception']);

	gamingThermalModeServiceSpy.getThermalModeRealStatus.and.returnValue(Promise.resolve(2));
	gamingOCServiceSpy.getPerformanceOCSetting.and.returnValue(Promise.resolve(false));
	gamingSystemUpdateServiceSpy.getRamOCStatus.and.returnValue(Promise.resolve(false));
	networkBoostServiceSpy.getNetworkBoostStatus.and.returnValue(Promise.resolve(false));
	gamingAutoCloseServiceSpy.getAutoCloseStatus.and.returnValue(Promise.resolve(false));
	gamingHybridModeServiceSpy.getHybridModeStatus.and.returnValue(Promise.resolve(true));
	gamingOverDriveServiceSpy.getOverDriveStatus.and.returnValue(Promise.resolve(true));
	gamingKeyLockServiceSpy.getKeyLockStatus.and.returnValue(Promise.resolve(false));

	describe('thermal mode 2 & performanceOC', () => {
		let thermalModeRealStatus = 2;
		let performanceOCStatus = false;
		let gamingThermalModeServiceMock = {
			getThermalModeRealStatus() {
				return new Promise(resolve => {
					resolve(thermalModeRealStatus)
				})
			},
			regThermalModeRealStatusChangeEvent() {
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			}
		}
		let gamingOCServiceMoke = {
			getPerformanceOCSetting() {
				return new Promise(resolve => {
					resolve(performanceOCStatus);
				})
			}
		}

		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetLegionEdgeComponent, SvgInlinePipe,
					mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: VantageShellService },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock },
					{ provide: GamingOCService, useValue: gamingOCServiceMoke },
					{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceSpy },
					{ provide: NetworkBoostService, useValue: networkBoostServiceSpy },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceSpy },
					{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceSpy },
					{ provide: GamingOverDriveService, useValue: gamingOverDriveServiceSpy },
					{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceSpy },
					{ provide: NgbModal, useValue: { open: () => 0 } },
					{ provide: LoggerService, useValue: loggerServiceSpy }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			liteGamingCache = false;
			desktopTypeCahce = false;
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			cpuOCFeatureCache = false;
			gpuOCFeatureCache = false;
			xtuServiceCache = false;
			nvDriverCache = false;
			memOCFeatureCache = false;
			networkBoostFeatureCache = false;
			networkBoosNeedToAskPopup = 1;
			fbnetFilterCache = false;
			optimizationFeatureCache = false;
			hybridModeFeatureCache = false;
			overDriveFeatureCache = false;
			touchpadLockFeatureCache = false;
			winKeyLockFeatureCache = false;
		});

		it('ngOnInit not support thermalMode', () => {
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			thermalModeRealStatusCache = 1;
			component.thermalModeRealStatus = 2;
			component.ngOnInit()
			expect(component.thermalModeRealStatus).toBe(2, 'component.thermalModeRealStatus should keep 2');
		});

		it('ngOnInit only support thermalMode 1', () => {
			smartFanFeatureCache = true;
			thermalModeVersionCache = 1;
			thermalModeRealStatusCache = 1;
			component.thermalModeRealStatus = 2;
			component.ngOnInit()
			expect(component.thermalModeRealStatus).toBe(2, 'component.thermalModeRealStatus should keep 2');
		});

		it('ngOnInit support thermalMode 2', fakeAsync(() => {
			spyOn(component, 'renderThermalMode2RealStatus').and.callThrough();
			spyOn(component, 'registerThermalModeRealStatusChangeEvent').and.callThrough();
			smartFanFeatureCache = true;
			thermalModeVersionCache = 2;
			thermalModeRealStatusCache = undefined;
			component.thermalModeRealStatus = 2;
			component.ngOnInit();
			expect(component.thermalModeRealStatus).toBe(2, `thermalModeRealStatusCache is undefined, component.thermalModeRealStatus should keep 2`);
			tick();
			thermalModeRealStatusCache = 1;
			component.ngOnInit();
			expect(component.thermalModeRealStatus).toBe(1, `thermalModeRealStatusCache is 1, component.thermalModeRealStatus should be 1`);
			thermalModeRealStatusCache = 2;
			component.ngOnInit();
			expect(component.thermalModeRealStatus).toBe(2, `thermalModeRealStatusCache is 2, component.thermalModeRealStatus should be 2`);
			thermalModeRealStatusCache = 3;
			component.ngOnInit();
			expect(component.thermalModeRealStatus).toBe(3, `thermalModeRealStatusCache is 3, component.thermalModeRealStatus should be 3`);
			expect(component.legionUpdate[0].isVisible).toBe(false, 'cpuOverclock.isVisible should be false');
		}));

		it('renderThermalMode2RealStatus', fakeAsync(() => {
			thermalModeRealStatus = undefined;
			thermalModeRealStatusCache = 2;
			component.thermalModeRealStatus = 2;
			component.renderThermalMode2RealStatus();
			tick();
			expect(component.thermalModeRealStatus).toBe(2, `thermalModeRealStatus is undefined, component.thermalModeRealStatus should keep 2`);
			expect(thermalModeRealStatusCache).toBe(2, `thermalModeRealStatus is undefined, thermalModeRealStatusCache should keep 2`);
			for (let i = 1; i < 4; i++) {
				tick();
				thermalModeRealStatus = i;
				component.renderThermalMode2RealStatus();
				tick();
				expect(component.thermalModeRealStatus).toBe(i, `thermalModeRealStatus is ${i}, component.thermalModeRealStatus should be ${i}`);
				expect(thermalModeRealStatusCache).toBe(i, `thermalModeRealStatus is ${i}, thermalModeRealStatusCache should be ${i}`);
			}
		}));

		it('registerThermalModeRealStatusChangeEvent', () => {
			spyOn(gamingThermalModeServiceMock, 'regThermalModeRealStatusChangeEvent');
			component.gamingCapabilities.smartFanFeature = false
			component.registerThermalModeRealStatusChangeEvent();
			expect(gamingThermalModeServiceMock.regThermalModeRealStatusChangeEvent).toHaveBeenCalledTimes(0);
			component.gamingCapabilities.smartFanFeature = true;
			component.registerThermalModeRealStatusChangeEvent();
			expect(gamingThermalModeServiceMock.regThermalModeRealStatusChangeEvent).toHaveBeenCalledTimes(1);
		});

		it('onRegThermalModeRealStatusChangeEvent', () => {
			component.thermalModeRealStatus = 2;
			thermalModeRealStatusCache = 2;
			component.onRegThermalModeRealStatusChangeEvent(undefined)
			expect(component.thermalModeRealStatus).toBe(2, `currentRealStatus is undefined, component.thermalModeRealStatus should keep 2`);
			expect(thermalModeRealStatusCache).toBe(2, `currentRealStatus is undefined, thermalModeRealStatusCache should keep 2`);
			for (let i = 1; i < 4; i++) {
				component.onRegThermalModeRealStatusChangeEvent(i)
				expect(component.thermalModeRealStatus).toBe(i, `thermalModeRealStatus is ${i}, component.thermalModeRealStatus should be ${i}`);
				expect(thermalModeRealStatusCache).toBe(i, `thermalModeRealStatus is ${i}, thermalModeRealStatusCache should be ${i}`);
			}
		});

		it('ngOnInit not support OC', () => {
			spyOn(component, 'renderThermalMode2OCSettings').and.callThrough();
			smartFanFeatureCache = true;
			thermalModeVersionCache = 2;
			cpuOCFeatureCache = false;
			cpuOCStatusCache = 1;
			gpuOCFeatureCache = false
			gpuOCStatusCache = 1;
			component.performanceOCSettings = false;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(false, 'component.performanceOCSettings should keep false');
		});

		it('ngOnInit cpu&gpu OC', () => {
			spyOn(component, 'renderThermalMode2OCSettings').and.callThrough();
			smartFanFeatureCache = true;
			thermalModeVersionCache = 2;
			cpuOCFeatureCache = true;
			cpuOCStatusCache = 3;
			gpuOCFeatureCache = true;
			gpuOCStatusCache = 3;
			xtuServiceCache = true;
			nvDriverCache = true;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(false, 'component.performanceOCSettings should be false');

			cpuOCStatusCache = 1;
			gpuOCStatusCache = 1;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(true, 'component.performanceOCSettings should be true');

			xtuServiceCache = true;
			nvDriverCache = false;
			component.performanceOCSettings = false;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(false, 'nvDriverCache lack, component.performanceOCSettings should keep false');

			xtuServiceCache = false;
			nvDriverCache = true;
			component.performanceOCSettings = false;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(false, 'xtuServiceCache lack, component.performanceOCSettings should keep false');
		});

		it('ngOnInit cpu OC', () => {
			spyOn(component, 'renderThermalMode2OCSettings').and.callThrough();
			smartFanFeatureCache = true;
			thermalModeVersionCache = 2;
			cpuOCFeatureCache = true;
			cpuOCStatusCache = 3;
			gpuOCFeatureCache = false;
			xtuServiceCache = true;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(false, 'component.performanceOCSettings should be false');

			cpuOCStatusCache = 1;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(true, 'component.performanceOCSettings should be true');

			xtuServiceCache = false;
			component.performanceOCSettings = false;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(false, 'xtuServiceCache lack, component.performanceOCSettings should keep false');
		});

		it('ngOnInit gpu OC', () => {
			spyOn(component, 'renderThermalMode2OCSettings').and.callThrough();
			smartFanFeatureCache = true;
			thermalModeVersionCache = 2;
			cpuOCFeatureCache = false;
			gpuOCFeatureCache = true;
			gpuOCStatusCache = 3;
			nvDriverCache = true;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(false, 'component.performanceOCSettings should be false');

			gpuOCStatusCache = 1;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(true, 'component.performanceOCSettings should be true');

			nvDriverCache = false;
			component.performanceOCSettings = false;
			component.ngOnInit()
			expect(component.performanceOCSettings).toBe(false, 'nvDriverCache lack, component.performanceOCSettings should keep false');
		});

		it('renderThermalMode2OCSettings cpu&gpu', fakeAsync(() => {
			component.gamingCapabilities.cpuOCFeature = true;
			component.gamingCapabilities.gpuOCFeature = true;
			component.gamingCapabilities.xtuService = true;
			component.gamingCapabilities.nvDriver = true;
			performanceOCStatus = false;
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(false, `component.performanceOCSettings should be false`);
			expect(cpuOCStatusCache).toBe(3, `cpuOCStatusCache should be 3 (false)`);
			expect(gpuOCStatusCache).toBe(3, `gpuOCStatusCache should be 3 (false)`);

			performanceOCStatus = true;
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(true, `component.performanceOCSettings should be true`);
			expect(cpuOCStatusCache).toBe(1, `cpuOCStatusCache should be 1 (true)`);
			expect(gpuOCStatusCache).toBe(1, `gpuOCStatusCache should be 1 (true)`);

			component.gamingCapabilities.xtuService = false;
			component.gamingCapabilities.nvDriver = true;
			performanceOCStatus = true;
			cpuOCStatusCache = 3;
			gpuOCStatusCache = 3;
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(false, `xtuService lack, component.performanceOCSettings should keep false`);
			expect(cpuOCStatusCache).toBe(3, `xtuService lack, cpuOCStatusCache should keep 3 (false)`);
			expect(gpuOCStatusCache).toBe(3, `xtuService lack, gpuOCStatusCache should keep 3 (false)`);

			component.gamingCapabilities.xtuService = true;
			component.gamingCapabilities.nvDriver = false;
			performanceOCStatus = true;
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(false, `nvDriver lack, component.performanceOCSettings should keep false`);
			expect(cpuOCStatusCache).toBe(3, `nvDriver lack, cpuOCStatusCache should keep 3 (false)`);
			expect(gpuOCStatusCache).toBe(3, `nvDriver lack, gpuOCStatusCache should keep 3 (false)`);
		}));

		it('renderThermalMode2OCSettings cpu', fakeAsync(() => {
			component.gamingCapabilities.cpuOCFeature = true;
			component.gamingCapabilities.gpuOCFeature = false;
			component.gamingCapabilities.xtuService = true;
			component.gamingCapabilities.nvDriver = false;
			performanceOCStatus = false;
			gpuOCStatusCache = 3;
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(false, `component.performanceOCSettings should be false`);
			expect(cpuOCStatusCache).toBe(3, `cpuOCStatusCache should be 3 (false)`);
			expect(gpuOCStatusCache).toBe(3, `gpuOCStatusCache should be keep (false)`);

			performanceOCStatus = true;
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(true, `component.performanceOCSettings should be true`);
			expect(cpuOCStatusCache).toBe(1, `cpuOCStatusCache should be 1 (true)`);
			expect(gpuOCStatusCache).toBe(3, `gpuOCStatusCache should keep 3 (false)`);

			component.gamingCapabilities.xtuService = false;
			performanceOCStatus = true;
			cpuOCStatusCache = 3;
			gpuOCStatusCache = 3;
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(false, `xtuService lack, component.performanceOCSettings should keep false`);
			expect(cpuOCStatusCache).toBe(3, `xtuService lack, cpuOCStatusCache should keep 3 (false)`);
			expect(gpuOCStatusCache).toBe(3, `xtuService lack, gpuOCStatusCache should keep 3 (false)`);
		}));

		it('renderThermalMode2OCSettings gpu', fakeAsync(() => {
			component.gamingCapabilities.cpuOCFeature = false;
			component.gamingCapabilities.gpuOCFeature = true;
			component.gamingCapabilities.xtuService = false;
			component.gamingCapabilities.nvDriver = true;
			performanceOCStatus = false;
			cpuOCStatusCache = 3
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(false, `component.performanceOCSettings should be false`);
			expect(cpuOCStatusCache).toBe(3, `cpuOCStatusCache should keep 3 (false)`);
			expect(gpuOCStatusCache).toBe(3, `gpuOCStatusCache should be 3 (false)`);

			performanceOCStatus = true;
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(true, `component.performanceOCSettings should be true`);
			expect(cpuOCStatusCache).toBe(3, `cpuOCStatusCache should keep 1 (false)`);
			expect(gpuOCStatusCache).toBe(1, `gpuOCStatusCache should be 1 (true)`);

			component.gamingCapabilities.nvDriver = false;
			performanceOCStatus = true;
			cpuOCStatusCache = 3;
			gpuOCStatusCache = 3;
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(false, `nvDriver lack, component.performanceOCSettings should keep false`);
			expect(cpuOCStatusCache).toBe(3, `nvDriver lack, cpuOCStatusCache should keep 3 (false)`);
			expect(gpuOCStatusCache).toBe(3, `nvDriver lack, gpuOCStatusCache should keep 3 (false)`);
		}));

		it('renderThermalMode2OCSettings not oc supported', fakeAsync(() => {
			component.gamingCapabilities.cpuOCFeature = false;
			component.gamingCapabilities.gpuOCFeature = false;
			performanceOCStatus = true;
			component.renderThermalMode2OCSettings();
			tick();
			expect(component.performanceOCSettings).toBe(false, `component.performanceOCSettings should be false`);
		}));


		it('openModal', fakeAsync(() => {
			spyOn(component, 'openModal').and.callThrough();
			const result = component.openModal();
			expect(component.openModal).toHaveBeenCalled();
		}));

		it('get thermal_mode_performance as automationId', fakeAsync(() => {
			component.thermalModeRealStatus = GamingThermal2.performance;
			const res =	component.getThermalModeAutomationId();
			fixture.detectChanges();
			expect(res).toBe(AutomationId.Performance);
		}));

		it('get thermal_mode_performance_overclock_on as automationId', fakeAsync(() => {
			component.performanceOCSettings = true;
			component.thermalModeRealStatus = GamingThermal2.performance;
			const res =	component.getThermalModeAutomationId();
			fixture.detectChanges();
			expect(res).toBe(AutomationId.PerformanceOverclockOn);
		}));

		it('get thermal_mode_balance as automationId', fakeAsync(() => {
			component.thermalModeRealStatus = GamingThermal2.balance;
			const res =	component.getThermalModeAutomationId();
			fixture.detectChanges();
			expect(res).toBe(AutomationId.Balance);
		}));

		it('get thermal_mode_quiet as automationId', fakeAsync(() => {
			component.thermalModeRealStatus = GamingThermal2.quiet;
			const res =	component.getThermalModeAutomationId();
			fixture.detectChanges();
			expect(res).toBe(AutomationId.Quiet);
		}));
	});

	describe('cpu over clock', () => {
		let cpuOCStatus = 3;
		let gamingSystemUpdateServiceMock = {
			getCpuOCStatus() {
				return new Promise(resolve => {
					resolve(cpuOCStatus)
				})
			},
			setCpuOCStatus(value: number) {
				if (setReturnValue) {
					cpuOCStatus = value;
				}
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			},
			getRamOCStatus() {
				return new Promise(resolve => {
					resolve(false);
				})
			},
		}
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetLegionEdgeComponent, SvgInlinePipe,
					mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: VantageShellService },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: GamingOCService, useValue: gamingOCServiceSpy },
					{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceMock },
					{ provide: NetworkBoostService, useValue: networkBoostServiceSpy },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceSpy },
					{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceSpy },
					{ provide: GamingOverDriveService, useValue: gamingOverDriveServiceSpy },
					{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceSpy },
					{ provide: NgbModal, useValue: { open: () => 0 } },
					{ provide: LoggerService, useValue: loggerServiceSpy }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			liteGamingCache = false;
			desktopTypeCahce = false;
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			cpuOCFeatureCache = false;
			gpuOCFeatureCache = false;
			xtuServiceCache = false;
			nvDriverCache = false;
			memOCFeatureCache = false;
			networkBoostFeatureCache = false;
			networkBoosNeedToAskPopup = 1;
			fbnetFilterCache = false;
			optimizationFeatureCache = false;
			hybridModeFeatureCache = false;
			overDriveFeatureCache = false;
			touchpadLockFeatureCache = false;
			winKeyLockFeatureCache = false;
		});

		it('not support cpu over clock', () => {
			cpuOCFeatureCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[0].isVisible).toBe(false, 'component.legionUpdate[0].isVisible should be false');
		});

		it('ngOnInit cpu over click', () => {
			spyOn(component, 'renderCPUOverClockStatus').and.callThrough();
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			cpuOCFeatureCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[0].isVisible).toBe(false, 'component.legionUpdate[0].isVisible should be false');

			cpuOCFeatureCache = true;
			for (let i = 1; i < 4; i++) {
				cpuOCStatusCache = i;
				component.ngOnInit();
				expect(component.legionUpdate[0].isVisible).toBe(true, 'component.legionUpdate[0].isVisible should be true');
				expect(component.drop.curSelected).toBe(i, `i is ${i}, component.drop.curSelected should be ${i}`);
			}
		});

		it('renderCPUOverClockStatus', fakeAsync(() => {
			cpuOCStatusCache = 3;
			cpuOCStatus = undefined;
			component.drop.curSelected = 3;
			component.renderCPUOverClockStatus();
			tick();
			expect(component.drop.curSelected).toBe(3, `cpuOCStatus is undefined, component.drop.curSelected should keep 3 (false)`);

			for (let i = 1; i < 4; i++) {
				cpuOCStatus = i;
				component.renderCPUOverClockStatus();
				tick();
				expect(component.drop.curSelected).toBe(i, `cpuOCStatus is ${i}, component.drop.curSelected should be ${i}`);
				expect(cpuOCStatusCache).toBe(i, `cpuOCStatus is ${i}, cpuOCStatusCache should be ${i}`);
			}
		}));

		it('onShowDropdown', () => {
			let event = {
				type: 'gaming.dashboard.device.legionEdge.title'
			};
			component.drop.hideDropDown = false;
			component.legionUpdate[0].isDriverPopup = false;
			component.onShowDropdown(event);
			expect(component.legionUpdate[0].isDriverPopup).toBe(false, `component.drop.hideDropDown is false, component.legionUpdate[0].isDriverPopup should keep false`);

			component.drop.hideDropDown = true;
			component.legionUpdate[0].isDriverPopup = false;
			component.onShowDropdown(event);
			expect(component.legionUpdate[0].isDriverPopup).toBe(true, `component.drop.hideDropDown is true, component.legionUpdate[0].isDriverPopup should be false`);
		});

		it('onOptionSelected', fakeAsync(() => {
			let event = {
				target: {
					name: 'gaming.dashboard.device.legionEdge.wrongTitle'
				},
				option: {
					value: 1
				}
			};

			setReturnValue = true;
			component.drop.curSelected = 3;
			component.onOptionSelected(event);
			tick();
			expect(component.drop.curSelected).toBe(3, `wrong title, this.drop.curSelected shoulde keep 3`);

			event.target.name = 'gaming.dashboard.device.legionEdge.title'
			for (let i = 1; i < 4; i++) {
				event.option.value = i;
				component.onOptionSelected(event);
				tick();
				expect(component.drop.curSelected).toBe(i, `setReturnValue is ${setReturnValue}, i is ${i}, this.drop.curSelected shoulde be ${i}`);
			}

			setReturnValue = false;
			cpuOCStatusCache = 3;
			for (let i = 1; i < 4; i++) {
				event.option.value = i;
				component.onOptionSelected(event);
				tick();
				expect(component.drop.curSelected).toBe(3, `setReturnValue is ${setReturnValue}, i is ${i}, this.drop.curSelected shoulde keep 3`);
			}
		}));
	})

	describe('RAM over clock', () => {
		let ramOCStatus = false;
		let gamingSystemUpdateServiceMock = {
			getRamOCStatus() {
				return new Promise(resolve => {
					resolve(ramOCStatus)
				})
			},
			setRamOCStatus(value: boolean) {
				if (setReturnValue) {
					ramOCStatus = value;
				}
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			}
		};
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetLegionEdgeComponent, SvgInlinePipe,
					mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: VantageShellService },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: GamingOCService, useValue: gamingOCServiceSpy },
					{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceMock },
					{ provide: NetworkBoostService, useValue: networkBoostServiceSpy },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceSpy },
					{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceSpy },
					{ provide: GamingOverDriveService, useValue: gamingOverDriveServiceSpy },
					{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceSpy },
					{ provide: NgbModal, useValue: { open: () => 0 } },
					{ provide: LoggerService, useValue: loggerServiceSpy }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			liteGamingCache = false;
			desktopTypeCahce = false;
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			cpuOCFeatureCache = false;
			gpuOCFeatureCache = false;
			xtuServiceCache = false;
			nvDriverCache = false;
			memOCFeatureCache = false;
			networkBoostFeatureCache = false;
			networkBoosNeedToAskPopup = 1;
			fbnetFilterCache = false;
			optimizationFeatureCache = false;
			hybridModeFeatureCache = false;
			overDriveFeatureCache = false;
			touchpadLockFeatureCache = false;
			winKeyLockFeatureCache = false;
		});

		it('not support ram', () => {
			memOCFeatureCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[1].isVisible).toBe(false, `component.legionUpdate[1].isVisible should be false`);
		});

		it('ngOnInit ram over clock', () => {
			spyOn(component, 'renderRamOverClockStatus').and.callThrough();
			memOCFeatureCache = true;
			memOCStatusCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[1].isVisible).toBe(true, `component.legionUpdate[1].isVisible should be true`);
			expect(component.legionUpdate[1].isChecked).toBe(false, `component.legionUpdate[1].isChecked should be false`);

			memOCFeatureCache = true;
			memOCStatusCache = true;
			component.ngOnInit();
			expect(component.legionUpdate[1].isVisible).toBe(true, `component.legionUpdate[1].isVisible should be true`);
			expect(component.legionUpdate[1].isChecked).toBe(true, `component.legionUpdate[1].isChecked should be true`);
		});

		it('renderRamOverClockStatus', fakeAsync(() => {
			memOCFeatureCache = true;
			memOCStatusCache = false;
			component.legionUpdate[1].isChecked = false;
			xtuServiceCache = false;

			ramOCStatus = true;
			component.renderRamOverClockStatus();
			tick();
			expect(component.legionUpdate[1].isChecked).toBe(false, `xtuServiceCache is false, component.legionUpdate[1].isChecked should keep false`);
			expect(memOCStatusCache).toBe(false, `xtuServiceCache is false, memOCStatusCache should keep false`);

			xtuServiceCache = true;
			ramOCStatus = undefined;
			component.ngOnInit();
			component.renderRamOverClockStatus();
			tick();
			expect(component.legionUpdate[1].isChecked).toBe(false, `xtuServiceCache is true,ramOCStatus is undefined, component.legionUpdate[1].isChecked should keep false`);
			expect(memOCStatusCache).toBe(false, `xtuServiceCache is true, ramOCStatus is undefined, memOCStatusCache should keep false`);

			ramOCStatus = true;
			component.renderRamOverClockStatus();
			tick();
			expect(component.legionUpdate[1].isChecked).toBe(true, `xtuServiceCache is true, component.legionUpdate[1].isChecked should be true`);
			expect(memOCStatusCache).toBe(true, `xtuServiceCache is true, memOCStatusCache should be true`);

			ramOCStatus = false;
			component.renderRamOverClockStatus();
			tick();
			expect(component.legionUpdate[1].isChecked).toBe(false, `xtuServiceCache is true, component.legionUpdate[1].isChecked should be false`);
			expect(memOCStatusCache).toBe(false, `xtuServiceCache is true, memOCStatusCache should be false`);
		}));

		it('toggleOnOffStatus of ram over clock', fakeAsync(() => {
			// spyOn(component, 'closeLegionEdgePopups').and.callThrough();
			setReturnValue = true;
			memOCFeatureCache = true;
			xtuServiceCache = false;
			memOCStatusCache = false;
			ramOCStatus = false
			component.legionUpdate[1].isChecked = false;
			component.legionUpdate[1].isPopup = false;
			component.legionUpdate[1].isDriverPopup = false;
			component.toggleOnOffStatus({ target: { value: true, name: 'gaming.dashboard.device.legionEdge.ramOverlock' } });
			tick();
			expect(ramOCStatus).toBe(false, `xtuService is false, ramOCStatus should keep false`);
			expect(memOCStatusCache).toBe(false, `xtuService is false, memOCStatusCache should keep false`);
			expect(component.legionUpdate[1].isChecked).toBe(false, `xtuService is false, component.legionUpdate[1].isChecked should keep false`)
			expect(component.legionUpdate[1].isPopup).toBe(false, `xtuService is false, component.legionUpdate[1].isPopup should keep false`);
			expect(component.legionUpdate[1].isDriverPopup).toBe(true, `xtuService is false, component.legionUpdate[1].isDriverPopup should be true`);

			component.gamingCapabilities.xtuService = true;
			memOCStatusCache = true;
			ramOCStatus = true;
			component.legionUpdate[1].isChecked = true;
			component.legionUpdate[1].isPopup = false;
			component.toggleOnOffStatus({ target: { value: true, name: 'gaming.dashboard.device.legionEdge.ramOverlock' } });
			tick();
			expect(ramOCStatus).toBe(false, `xtuService is true, ramOCStatus should be false`);
			expect(memOCStatusCache).toBe(true, `xtuService is true, memOCStatusCache should keep true before restart`);
			expect(component.legionUpdate[1].isChecked).toBe(true, `xtuService is true, component.legionUpdate[1].isChecked should keep true before restart`);
			expect(component.legionUpdate[1].isPopup).toBe(true, `xtuService is true, component.legionUpdate[1].isPopup is true`);

			memOCStatusCache = false;
			ramOCStatus = false;
			component.legionUpdate[1].isChecked = false;
			component.legionUpdate[1].isPopup = false;
			component.toggleOnOffStatus({ target: { value: false, name: 'gaming.dashboard.device.legionEdge.ramOverlock' } });
			tick();
			expect(ramOCStatus).toBe(true, `xtuService is true, ramOCStatus should be true`);
			expect(memOCStatusCache).toBe(false, `xtuService is true, memOCStatusCache should keep false before restart`);
			expect(component.legionUpdate[1].isChecked).toBe(false, `xtuService is true, component.legionUpdate[1].isChecked should keep false before restart`);
			expect(component.legionUpdate[1].isPopup).toBe(true, `xtuService is true, component.legionUpdate[1].isPopup is true`);
		}));
	})

	describe('network boost', () => {
		let networkBoostModeStatus = false;
		let networkBoostServiceMoke = {
			getNetworkBoostStatus() {
				return new Promise(resolve => {
					resolve(networkBoostModeStatus)
				})
			},
			setNetworkBoostStatus(value: boolean) {
				if (setReturnValue) {
					networkBoostModeStatus = value;
				}
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			}
		}
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetLegionEdgeComponent, SvgInlinePipe,
					mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: VantageShellService },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: GamingOCService, useValue: gamingOCServiceSpy },
					{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceSpy },
					{ provide: NetworkBoostService, useValue: networkBoostServiceMoke },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceSpy },
					{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceSpy },
					{ provide: GamingOverDriveService, useValue: gamingOverDriveServiceSpy },
					{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceSpy },
					{ provide: NgbModal, useValue: { open: () => 0 } },
					{ provide: LoggerService, useValue: loggerServiceSpy }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			liteGamingCache = false;
			desktopTypeCahce = false;
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			cpuOCFeatureCache = false;
			gpuOCFeatureCache = false;
			xtuServiceCache = false;
			nvDriverCache = false;
			memOCFeatureCache = false;
			networkBoostFeatureCache = false;
			networkBoosNeedToAskPopup = 1;
			fbnetFilterCache = false;
			optimizationFeatureCache = false;
			hybridModeFeatureCache = false;
			overDriveFeatureCache = false;
			touchpadLockFeatureCache = false;
			winKeyLockFeatureCache = false;
		});

		it('not support network boost', () => {
			networkBoostFeatureCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[2].isVisible).toBe(false, `component.legionUpdate[2].isVisible should be false`);
		});

		it('ngOnInit network boost', () => {
			spyOn(component, 'renderNetworkBoostStatus').and.callThrough();
			networkBoostFeatureCache = true;
			networkBoostStatusCache = true;
			component.ngOnInit();
			expect(component.legionUpdate[2].isVisible).toEqual(true, `component.legionUpdate[2].isVisible should be true`);
			expect(component.legionUpdate[2].isChecked).toEqual(true, `component.legionUpdate[2].isChecked should be true`);

			networkBoostFeatureCache = true;
			networkBoostStatusCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[2].isVisible).toEqual(true, `component.legionUpdate[2].isVisible should be true`);
			expect(component.legionUpdate[2].isChecked).toEqual(false, `component.legionUpdate[2].isChecked should be false`);
		});

		it('renderNetworkBoostStatus', fakeAsync((done: any) => {
			networkBoostFeatureCache = true;
			networkBoostStatusCache = false;
			networkBoosNeedToAskPopup = 1;
			component.legionUpdate[2].isChecked = false;
			networkBoostModeStatus = undefined;

			component.renderNetworkBoostStatus();
			tick();
			expect(networkBoostStatusCache).toBe(false, `networkBoostModeStatus is undefined, networkBoostStatusCache should keep false`);
			expect(networkBoosNeedToAskPopup).toBe(1, `networkBoostModeStatus is undefined, networkBoosNeedToAskPopup should keep 1`);
			expect(component.legionUpdate[2].isChecked).toBe(false, `networkBoostModeStatus is undefined, component.legionUpdate[2].isChecked should keep false`);

			networkBoostModeStatus = true;
			networkBoosNeedToAskPopup = 2;
			component.renderNetworkBoostStatus();
			tick();
			expect(networkBoostStatusCache).toBe(true, `networkBoostModeStatus is undefined, networkBoostStatusCache should be true`);
			expect(networkBoosNeedToAskPopup).toBe(2, `networkBoostModeStatus is undefined, networkBoosNeedToAskPopup should keep 2`);
			expect(component.legionUpdate[2].isChecked).toBe(true, `networkBoostModeStatus is undefined, component.legionUpdate[2].isChecked should be true`);

			networkBoostModeStatus = false;
			component.renderNetworkBoostStatus();
			tick();
			expect(networkBoostStatusCache).toBe(false, `networkBoostModeStatus is undefined, networkBoostStatusCache should be false`);
			expect(networkBoosNeedToAskPopup).toBe(1, `networkBoostModeStatus is undefined, networkBoosNeedToAskPopup should be 1`);
			expect(component.legionUpdate[2].isChecked).toBe(false, `networkBoostModeStatus is undefined, component.legionUpdate[2].isChecked should be false`);
		}));

		it('toggleOnOffRamOCStatus of netWork boost', fakeAsync(() => {
			// spyOn(component, 'closeLegionEdgePopups').and.callThrough();
			fbnetFilterCache = false;
			setReturnValue = true;

			networkBoostModeStatus = false;
			networkBoostStatusCache = false;
			component.legionUpdate[2].isChecked = false;
			component.legionUpdate[2].isDriverPopup = false;
			component.toggleOnOffStatus({ target: { value: false, name: 'gaming.dashboard.device.legionEdge.networkBoost' } });
			tick();
			expect(networkBoostModeStatus).toBe(false, `setReturn is true, fbnetFilterCache is false, networkBoostModeStatus should keep false`);
			expect(networkBoostStatusCache).toBe(false, `setReturn is true, fbnetFilterCache is false, networkBoostStatusCache should keep false`);
			expect(component.legionUpdate[2].isChecked).toBe(false, `setReturn is true, fbnetFilterCache is false, component.legionUpdate[2].isChecked should keep false`);
			expect(component.legionUpdate[2].isDriverPopup).toBe(true, `setReturn is true, fbnetFilterCache is false, component.legionUpdate[2].isDriverPopup should be true`);

			fbnetFilterCache = true;
			component.legionUpdate[2].isDriverPopup = false;
			component.ngOnInit();
			component.toggleOnOffStatus({ target: { value: false, name: 'gaming.dashboard.device.legionEdge.networkBoost' } });
			tick();
			expect(networkBoostModeStatus).toBe(false, `setReturn is true, fbnetFilterCache is true, networkBoostModeStatus should be false`);
			expect(networkBoostStatusCache).toBe(false, `setReturn is true, fbnetFilterCache is true, networkBoostStatusCache should be false`);
			expect(component.legionUpdate[2].isChecked).toBe(false, `setReturn is true, fbnetFilterCache is true, component.legionUpdate[2].isChecked should be false`);
			expect(component.legionUpdate[2].isDriverPopup).toBe(false, `setReturn is true, fbnetFilterCache is true, component.legionUpdate[2].isDriverPopup should keep false`);

			component.toggleOnOffStatus({ target: { value: true, name: 'gaming.dashboard.device.legionEdge.networkBoost' } });
			tick();
			expect(networkBoostModeStatus).toBe(true, `setReturn is true, fbnetFilterCache is true, networkBoostModeStatus should be true`);
			expect(networkBoostStatusCache).toBe(true, `setReturn is true, fbnetFilterCache is true, networkBoostStatusCache should be true`);
			expect(component.legionUpdate[2].isChecked).toBe(true, `setReturn is true, fbnetFilterCache is true, component.legionUpdate[2].isChecked should be true`);
			expect(component.legionUpdate[2].isDriverPopup).toBe(false, `setReturn is true, fbnetFilterCache is true, component.legionUpdate[2].isDriverPopup should keep false`);

			setReturnValue = false;
			component.toggleOnOffStatus({ target: { value: false, name: 'gaming.dashboard.device.legionEdge.networkBoost' } });
			tick();
			expect(networkBoostModeStatus).toBe(true, `setReturn is false, fbnetFilterCache is false, networkBoostModeStatus should keep true`);
			expect(networkBoostStatusCache).toBe(true, `setReturn is false, fbnetFilterCache is false, networkBoostStatusCache should keep true`);
			expect(component.legionUpdate[2].isChecked).toBe(true, `setReturn is false, fbnetFilterCache is false, component.legionUpdate[2].isChecked should keep true`);
			expect(component.legionUpdate[2].isDriverPopup).toBe(false, `setReturn is false, fbnetFilterCache is false, component.legionUpdate[2].isDriverPopup should keep false`);
		}));
	})

	describe('auto close', () => {
		let autoCloseModeStatus = false;
		let gamingAutoCloseServiceMock = {
			getAutoCloseStatus() {
				return new Promise(resolve => {
					resolve(autoCloseModeStatus)
				})
			},
			setAutoCloseStatus(value: boolean) {
				if (setReturnValue) {
					autoCloseModeStatus = value;
				}
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			}
		}
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetLegionEdgeComponent, SvgInlinePipe,
					mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: VantageShellService },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: GamingOCService, useValue: gamingOCServiceSpy },
					{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceSpy },
					{ provide: NetworkBoostService, useValue: networkBoostServiceSpy },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceMock },
					{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceSpy },
					{ provide: GamingOverDriveService, useValue: gamingOverDriveServiceSpy },
					{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceSpy },
					{ provide: NgbModal, useValue: { open: () => 0 } },
					{ provide: LoggerService, useValue: loggerServiceSpy }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			liteGamingCache = false;
			desktopTypeCahce = false;
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			cpuOCFeatureCache = false;
			gpuOCFeatureCache = false;
			xtuServiceCache = false;
			nvDriverCache = false;
			memOCFeatureCache = false;
			networkBoostFeatureCache = false;
			networkBoosNeedToAskPopup = 1;
			fbnetFilterCache = false;
			optimizationFeatureCache = false;
			hybridModeFeatureCache = false;
			overDriveFeatureCache = false;
			touchpadLockFeatureCache = false;
			winKeyLockFeatureCache = false;
		});

		it('not support auto close', () => {
			optimizationFeatureCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[3].isVisible).toBe(false, `component.legionUpdate[2].isVisible should be false`);
		});

		it('ngOnInit auto close', () => {
			spyOn(component, 'renderAutoCloseStatus').and.callThrough();
			optimizationFeatureCache = true;
			autoCloseStatusCache = true;
			component.ngOnInit();
			expect(component.legionUpdate[3].isVisible).toEqual(true, `component.legionUpdate[3].isVisible should be true`);
			expect(component.legionUpdate[3].isChecked).toEqual(true, `component.legionUpdate[3].isChecked should be true`);

			optimizationFeatureCache = true;
			autoCloseStatusCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[3].isVisible).toEqual(true, `component.legionUpdate[3].isVisible should be true`);
			expect(component.legionUpdate[3].isChecked).toEqual(false, `component.legionUpdate[3].isChecked should be false`);
		});

		it('renderAutoCloseStatus', fakeAsync((done: any) => {
			optimizationFeatureCache = true;
			autoCloseStatusCache = false;
			component.legionUpdate[3].isChecked = false;
			autoCloseModeStatus = undefined;

			component.renderAutoCloseStatus();
			tick();
			expect(autoCloseStatusCache).toBe(false, `autoCloseModeStatus is undefined, autoCloseStatusCache should keep false`);
			expect(component.legionUpdate[3].isChecked).toBe(false, `autoCloseModeStatus is undefined, component.legionUpdate[3].isChecked should keep false`);

			autoCloseModeStatus = true;
			component.renderAutoCloseStatus();
			tick();
			expect(autoCloseStatusCache).toBe(true, `autoCloseModeStatus is true, autoCloseStatusCache should be true`);
			expect(component.legionUpdate[3].isChecked).toBe(true, `autoCloseModeStatus is true, component.legionUpdate[3].isChecked should be true`);

			autoCloseModeStatus = false;
			component.renderAutoCloseStatus();
			tick();
			expect(autoCloseStatusCache).toBe(false, `autoCloseModeStatus is false, autoCloseStatusCache should be false`);
			expect(component.legionUpdate[3].isChecked).toBe(false, `autoCloseModeStatus is false, component.legionUpdate[3].isChecked should be false`);
		}));

		it('toggleOnOffRamOCStatus of auto close', fakeAsync(() => {
			// spyOn(component, 'closeLegionEdgePopups').and.callThrough();
			setReturnValue = true;

			autoCloseModeStatus = false;
			autoCloseStatusCache = false;
			component.legionUpdate[3].isChecked = false;
			component.toggleOnOffStatus({ target: { value: true, name: 'gaming.dashboard.device.legionEdge.autoClose' } });
			tick();
			expect(autoCloseModeStatus).toBe(true, `setReturn is true, autoCloseModeStatus should be true`);
			expect(autoCloseStatusCache).toBe(true, `setReturn is true, autoCloseStatusCache should be true`);
			// expect(component.legionUpdate[3].isChecked).toBe(true, `setReturn is true, component.legionUpdate[3].isChecked should be true`);

			component.toggleOnOffStatus({ target: { value: false, name: 'gaming.dashboard.device.legionEdge.autoClose' } });
			tick();
			expect(autoCloseModeStatus).toBe(false, `setReturn is true, autoCloseModeStatus should be false`);
			expect(autoCloseStatusCache).toBe(false, `setReturn is true, autoCloseStatusCache should be false`);
			// expect(component.legionUpdate[3].isChecked).toBe(false, `setReturn is true, component.legionUpdate[3].isChecked should be false`);

			setReturnValue = false;
			component.toggleOnOffStatus({ target: { value: true, name: 'gaming.dashboard.device.legionEdge.autoClose' } });
			tick();
			expect(autoCloseModeStatus).toBe(false, `setReturn is false, autoCloseModeStatus should keep false`);
			expect(autoCloseStatusCache).toBe(false, `setReturn is false, autoCloseStatusCache should keep false`);
			// expect(component.legionUpdate[3].isChecked).toBe(false, `setReturn is false, component.legionUpdate[3].isChecked should keep false`);
		}));
	})

	describe('hybrid mode', () => {
		let hybridModeStatus = false;
		let gamingHybridModeServiceMock = {
			getHybridModeStatus() {
				return new Promise(resolve => {
					resolve(hybridModeStatus)
				})
			},
			setHybridModeStatus(value: boolean) {
				if (setReturnValue) {
					hybridModeStatus = value;
				}
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			}
		};
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetLegionEdgeComponent, SvgInlinePipe,
					mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: VantageShellService },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: GamingOCService, useValue: gamingOCServiceSpy },
					{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceSpy },
					{ provide: NetworkBoostService, useValue: networkBoostServiceSpy },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceSpy },
					{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceMock },
					{ provide: GamingOverDriveService, useValue: gamingOverDriveServiceSpy },
					{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceSpy },
					{ provide: NgbModal, useValue: { open: () => 0 } },
					{ provide: LoggerService, useValue: loggerServiceSpy }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			liteGamingCache = false;
			desktopTypeCahce = false;
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			cpuOCFeatureCache = false;
			gpuOCFeatureCache = false;
			xtuServiceCache = false;
			nvDriverCache = false;
			memOCFeatureCache = false;
			networkBoostFeatureCache = false;
			networkBoosNeedToAskPopup = 1;
			fbnetFilterCache = false;
			optimizationFeatureCache = false;
			hybridModeFeatureCache = false;
			overDriveFeatureCache = false;
			touchpadLockFeatureCache = false;
			winKeyLockFeatureCache = false;
		});

		it('not support hybrid mode', () => {
			hybridModeFeatureCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[4].isVisible).toBe(false, `component.legionUpdate[4].isVisible should be false`);
		});

		it('ngOnInit hybird mode', () => {
			spyOn(component, 'renderHybridModeStatus').and.callThrough();
			hybridModeFeatureCache = true;
			hybridModeStatusCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[4].isVisible).toBe(true, `component.legionUpdate[4].isVisible should be true`);
			expect(component.legionUpdate[4].isChecked).toBe(false, `component.legionUpdate[4].isChecked should be false`);

			hybridModeFeatureCache = true;
			hybridModeStatusCache = true;
			component.ngOnInit();
			expect(component.legionUpdate[4].isVisible).toBe(true, `component.legionUpdate[4].isVisible should be true`);
			expect(component.legionUpdate[4].isChecked).toBe(true, `component.legionUpdate[4].isChecked should be true`);
		});

		it('renderHybridModeStatus', fakeAsync(() => {
			hybridModeFeatureCache = true;
			hybridModeStatusCache = false;
			component.legionUpdate[4].isChecked = false;

			hybridModeStatus = undefined;
			component.renderHybridModeStatus();
			tick();
			expect(component.legionUpdate[4].isChecked).toBe(false, `hybridModeStatus is undefined, component.legionUpdate[4].isChecked should keep false`);
			expect(hybridModeStatusCache).toBe(false, `hybridModeStatus is undefined, hybridModeStatusCache should keep false`);

			hybridModeStatus = true;
			component.renderHybridModeStatus();
			tick();
			expect(component.legionUpdate[4].isChecked).toBe(true, `hybridModeStatus is true, component.legionUpdate[4].isChecked should be true`);
			expect(hybridModeStatusCache).toBe(true, `hybridModeStatus is true, hybridModeStatusCache should be true`);

			hybridModeStatus = false;
			component.renderHybridModeStatus();
			tick();
			expect(component.legionUpdate[4].isChecked).toBe(false, `hybridModeStatus is false, component.legionUpdate[4].isChecked should be false`);
			expect(hybridModeStatusCache).toBe(false, `hybridModeStatus is false, hybridModeStatusCache should be false`);
		}));

		it('toggleOnOffRamOCStatus of hybrid mode', fakeAsync(() => {
			// spyOn(component, 'closeLegionEdgePopups').and.callThrough();
			hybridModeFeatureCache = true;
			hybridModeStatusCache = false;
			setReturnValue = true;
			component.legionUpdate[4].isChecked = false;
			component.legionUpdate[4].isPopup = false;
			component.toggleOnOffStatus({ target: { value: false, name: 'gaming.dashboard.device.legionEdge.hybridMode' } });
			tick();
			expect(hybridModeStatus).toBe(true, `hybridModeStatus should be true`);
			expect(hybridModeStatusCache).toBe(false, `hybridModeStatusCache should keep false before restart`);
			expect(component.legionUpdate[4].isChecked).toBe(false, `component.legionUpdate[4].isChecked should keep false before restart`);
			expect(component.legionUpdate[4].isPopup).toBe(true, `component.legionUpdate[4].isPopup should be true`);


			hybridModeStatusCache = true;
			component.legionUpdate[4].isChecked = true;
			component.legionUpdate[4].isPopup = false;
			component.toggleOnOffStatus({ target: { value: true, name: 'gaming.dashboard.device.legionEdge.hybridMode' } });
			tick();
			expect(hybridModeStatus).toBe(false, `hybridModeStatus should be false`);
			expect(hybridModeStatusCache).toBe(true, `hybridModeStatusCache should keep true before restart`);
			expect(component.legionUpdate[4].isChecked).toBe(true, `component.legionUpdate[4].isChecked should keep true before restart`);
			expect(component.legionUpdate[4].isPopup).toBe(true, `component.legionUpdate[4].isPopup should be true`);
		}));
	})

	describe('over drive', () => {
		let overDriveStatus = true;
		let gamingOverDriveServiceMock = {
			getOverDriveStatus() {
				return new Promise(resolve => {
					resolve(overDriveStatus)
				})
			},
			setOverDriveStatus(value: boolean) {
				if (setReturnValue) {
					overDriveStatus = value;
				}
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			}
		}
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetLegionEdgeComponent, SvgInlinePipe,
					mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: VantageShellService },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: GamingOCService, useValue: gamingOCServiceSpy },
					{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceSpy },
					{ provide: NetworkBoostService, useValue: networkBoostServiceSpy },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceSpy },
					{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceSpy },
					{ provide: GamingOverDriveService, useValue: gamingOverDriveServiceMock },
					{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceSpy },
					{ provide: NgbModal, useValue: { open: () => 0 } },
					{ provide: LoggerService, useValue: loggerServiceSpy }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			liteGamingCache = false;
			desktopTypeCahce = false;
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			cpuOCFeatureCache = false;
			gpuOCFeatureCache = false;
			xtuServiceCache = false;
			nvDriverCache = false;
			memOCFeatureCache = false;
			networkBoostFeatureCache = false;
			networkBoosNeedToAskPopup = 1;
			fbnetFilterCache = false;
			optimizationFeatureCache = false;
			hybridModeFeatureCache = false;
			overDriveFeatureCache = false;
			touchpadLockFeatureCache = false;
			winKeyLockFeatureCache = false;
		});

		it('not support over drive', () => {
			overDriveFeatureCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[5].isVisible).toBe(false, `component.legionUpdate[5].isVisible should be false`);
		});

		it('ngOnInit over drive', () => {
			spyOn(component, 'legionEdgeInit').and.callThrough();
			overDriveFeatureCache = true;
			overDriveStatusCache = true;
			component.ngOnInit();
			expect(component.legionUpdate[5].isVisible).toEqual(true, `component.legionUpdate[5].isVisible should be true`);
			expect(component.legionUpdate[5].isChecked).toEqual(true, `component.legionUpdate[5].isChecked should be true`);

			overDriveFeatureCache = true;
			overDriveStatusCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[5].isVisible).toEqual(true, `component.legionUpdate[5].isVisible should be true`);
			expect(component.legionUpdate[5].isChecked).toEqual(false, `component.legionUpdate[5].isChecked should be false`);
		});

		it('legionEdgeInit of over drive', fakeAsync(() => {
			overDriveFeatureCache = true;
			component.gamingCapabilities.overDriveFeature = true;
			overDriveStatusCache = false;
			component.legionUpdate[5].isChecked = false;

			overDriveStatus = undefined;
			component.legionEdgeInit();
			tick();
			expect(overDriveStatusCache).toBe(false, `overDriveStatus is undefined, overDriveStatusCache should keep false`);
			expect(component.legionUpdate[5].isChecked).toBe(false, `overDriveStatus is undefined, component.legionUpdate[5].isChecked should keep false`);

			overDriveStatus = true;
			component.legionEdgeInit();
			tick();
			expect(overDriveStatusCache).toBe(true, `overDriveStatus is true, overDriveStatusCache should be true`);
			expect(component.legionUpdate[5].isChecked).toBe(true, `overDriveStatus is true, component.legionUpdate[5].isChecked should be true`);

			overDriveStatus = false;
			component.legionEdgeInit();
			tick();
			expect(overDriveStatusCache).toBe(false, `overDriveStatus is false, overDriveStatusCache should be false`);
			expect(component.legionUpdate[5].isChecked).toBe(false, `overDriveStatus is false, component.legionUpdate[5].isChecked should be false`);
		}));

		it('toggleOnOffRamOCStatus of over drive', fakeAsync(() => {
			// spyOn(component, 'closeLegionEdgePopups').and.callThrough();
			setReturnValue = true;

			overDriveStatus = false;
			overDriveStatusCache = false;
			component.legionUpdate[5].isChecked = false;
			component.toggleOnOffStatus({ target: { value: true, name: 'gaming.dashboard.device.legionEdge.overDrive' } });
			tick();
			expect(overDriveStatus).toBe(true, `setReturn is true, overDriveStatus should be true`);
			expect(overDriveStatusCache).toBe(true, `setReturn is true, overDriveStatusCache should be true`);
			expect(component.legionUpdate[5].isChecked).toBe(true, `setReturn is true, component.legionUpdate[5].isChecked should be true`);

			component.toggleOnOffStatus({ target: { value: false, name: 'gaming.dashboard.device.legionEdge.overDrive' } });
			tick();
			expect(overDriveStatus).toBe(false, `setReturn is true, overDriveStatus should be false`);
			expect(overDriveStatusCache).toBe(false, `setReturn is true, overDriveStatusCache should be false`);
			expect(component.legionUpdate[5].isChecked).toBe(false, `setReturn is true, component.legionUpdate[5].isChecked should be false`);

			setReturnValue = false;
			component.toggleOnOffStatus({ target: { value: true, name: 'gaming.dashboard.device.legionEdge.overDrive' } });
			tick();
			expect(overDriveStatus).toBe(false, `setReturn is false, overDriveStatus should keep false`);
			expect(overDriveStatusCache).toBe(false, `setReturn is false, overDriveStatusCache should keep false`);
			expect(component.legionUpdate[5].isChecked).toBe(false, `setReturn is false, component.legionUpdate[5].isChecked should keep false`);
		}));
	})

	describe('touchpad lock', () => {
		let touchpadLockStatus = false;
		let gamingKeyLockServiceMock = {
			getKeyLockStatus() {
				return new Promise(resolve => {
					resolve(touchpadLockStatus)
				})
			},
			setKeyLockStatus(value: boolean) {
				if (setReturnValue) {
					touchpadLockStatus = value;
				}
				return new Promise(resolve => {
					resolve(setReturnValue);
				})
			}
		}
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetLegionEdgeComponent, SvgInlinePipe,
					mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: VantageShellService },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: GamingOCService, useValue: gamingOCServiceSpy },
					{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceSpy },
					{ provide: NetworkBoostService, useValue: networkBoostServiceSpy },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceSpy },
					{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceSpy },
					{ provide: GamingOverDriveService, useValue: gamingOverDriveServiceSpy },
					{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceMock },
					{ provide: NgbModal, useValue: { open: () => 0 } },
					{ provide: LoggerService, useValue: loggerServiceSpy }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			liteGamingCache = false;
			desktopTypeCahce = false;
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			cpuOCFeatureCache = false;
			gpuOCFeatureCache = false;
			xtuServiceCache = false;
			nvDriverCache = false;
			memOCFeatureCache = false;
			networkBoostFeatureCache = false;
			networkBoosNeedToAskPopup = 1;
			fbnetFilterCache = false;
			optimizationFeatureCache = false;
			hybridModeFeatureCache = false;
			overDriveFeatureCache = false;
			touchpadLockFeatureCache = false;
			winKeyLockFeatureCache = false;
		});

		it('not support touchpad lock', () => {
			touchpadLockFeatureCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[6].isVisible).toBe(false, `component.legionUpdate[6].isVisible should be false`);
		});

		it('ngOnInit touckpad lock', () => {
			spyOn(component, 'renderTouchpadLockStatus').and.callThrough();
			touchpadLockFeatureCache = true;
			winKeyLockFeatureCache = true;
			touchpadLockStatusCache = true;
			component.ngOnInit();
			expect(component.legionUpdate[6].isVisible).toEqual(true, `component.legionUpdate[6].isVisible should be true`);
			expect(component.legionUpdate[6].isChecked).toEqual(true, `component.legionUpdate[6].isChecked should be true`);

			touchpadLockFeatureCache = true;
			touchpadLockStatusCache = false;
			component.ngOnInit();
			expect(component.legionUpdate[6].isVisible).toEqual(true, `component.legionUpdate[6].isVisible should be true`);
			expect(component.legionUpdate[6].isChecked).toEqual(false, `component.legionUpdate[6].isChecked should be false`);
		});

		it('renderTouchpadLockStatus', fakeAsync((done: any) => {
			touchpadLockFeatureCache = true;
			winKeyLockFeatureCache = true;

			touchpadLockStatusCache = false;
			component.legionUpdate[6].isChecked = false;
			touchpadLockStatus = undefined;
			component.renderTouchpadLockStatus();
			tick();
			expect(touchpadLockStatusCache).toBe(false, `touchpadLockStatus is undefined, touchpadLockStatusCache should keep false`);
			expect(component.legionUpdate[6].isChecked).toBe(false, `touchpadLockStatus is undefined, component.legionUpdate[6].isChecked should keep false`);

			touchpadLockStatusCache = true;
			component.legionUpdate[6].isChecked = true;
			touchpadLockStatus = false;
			component.renderTouchpadLockStatus();
			tick();
			expect(touchpadLockStatusCache).toBe(false, `touchpadLockStatus is false, touchpadLockStatusCache should be false`);
			expect(component.legionUpdate[6].isChecked).toBe(false, `touchpadLockStatus is false, component.legionUpdate[6].isChecked should be false`);

			touchpadLockStatusCache = false;
			component.legionUpdate[6].isChecked = false;
			touchpadLockStatus = true;
			component.renderTouchpadLockStatus();
			tick();
			expect(touchpadLockStatusCache).toBe(true, `touchpadLockStatus is true, touchpadLockStatusCache should be true`);
			expect(component.legionUpdate[6].isChecked).toBe(true, `touchpadLockStatus is true, component.legionUpdate[6].isChecked should be true`);
		}));

		it('toggleOnOffStatus of touchpad lock', fakeAsync(() => {
			// spyOn(component, 'closeLegionEdgePopups').and.callThrough();
			setReturnValue = true;

			touchpadLockStatus = false;
			touchpadLockStatusCache = false;
			component.legionUpdate[6].isChecked = false;
			component.toggleOnOffStatus({ target: { value: true, name: 'gaming.dashboard.device.legionEdge.touchpadLock' } });
			tick();
			expect(touchpadLockStatus).toBe(true, `setReturn is true, touchpadLockStatus should be true`);
			expect(touchpadLockStatusCache).toBe(true, `setReturn is true, touchpadLockStatusCache should be true`);
			expect(component.legionUpdate[6].isChecked).toBe(true, `setReturn is true, component.legionUpdate[6].isChecked should be true`);

			component.toggleOnOffStatus({ target: { value: false, name: 'gaming.dashboard.device.legionEdge.touchpadLock' } });
			tick();
			expect(touchpadLockStatus).toBe(false, `setReturn is true, touchpadLockStatus should be false`);
			expect(touchpadLockStatusCache).toBe(false, `setReturn is true, touchpadLockStatusCache should be false`);
			expect(component.legionUpdate[6].isChecked).toBe(false, `setReturn is true, component.legionUpdate[6].isChecked should be false`);

			setReturnValue = false;
			component.toggleOnOffStatus({ target: { value: true, name: 'gaming.dashboard.device.legionEdge.touchpadLock' } });
			tick();
			expect(touchpadLockStatus).toBe(false, `setReturn is false, touchpadLockStatus should keep false`);
			expect(touchpadLockStatusCache).toBe(false, `setReturn is false, touchpadLockStatusCache should keep false`);
			expect(component.legionUpdate[6].isChecked).toBe(false, `setReturn is false, component.legionUpdate[6].isChecked should keep false`);
		}));
	})

	describe('catch error', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetLegionEdgeComponent, SvgInlinePipe,
					mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: VantageShellService },
					{ provide: HttpHandler },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
					{ provide: GamingOverDriveService, useValue: gamingOverDriveServiceSpy },
					{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
					{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceSpy },
					{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceSpy },
					{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceSpy },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceSpy },
					{ provide: NetworkBoostService, useValue: networkBoostServiceSpy },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: GamingOCService, useValue: gamingOCServiceSpy },
					{ provide: LoggerService, useValue: loggerServiceSpy },
					{ provide: NgbModal, useValue: { open: () => 0 } },
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			liteGamingCache = false;
			desktopTypeCahce = false;
			smartFanFeatureCache = false;
			thermalModeVersionCache = 1;
			cpuOCFeatureCache = false;
			gpuOCFeatureCache = false;
			xtuServiceCache = false;
			nvDriverCache = false;
			memOCFeatureCache = false;
			networkBoostFeatureCache = false;
			networkBoosNeedToAskPopup = 1;
			fbnetFilterCache = false;
			optimizationFeatureCache = false;
			hybridModeFeatureCache = false;
			overDriveFeatureCache = false;
			touchpadLockFeatureCache = false;
			winKeyLockFeatureCache = false;
		});

		it('renderThermalMode2RealStatus catch error', () => {
			gamingThermalModeServiceSpy.getThermalModeRealStatus.and.throwError('getThermalModeRealStatus error');
			component.thermalModeRealStatus = 2;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.renderThermalMode2RealStatus();
			expect(component.thermalModeRealStatus).toBe(2, `component.thermalModeRealStatus should keep 2`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('registerThermalModeRealStatusChangeEvent catch error', () => {
			gamingThermalModeServiceSpy.regThermalModeRealStatusChangeEvent.and.throwError('regThermalModeRealStatusChangeEvent error');
			component.gamingCapabilities.smartFanFeature = true;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.registerThermalModeRealStatusChangeEvent();
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('renderThermalMode2OCSettings catch error', () => {
			gamingOCServiceSpy.getPerformanceOCSetting.and.throwError('getPerformanceOCSetting error');
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.renderThermalMode2OCSettings();
			expect(component.performanceOCSettings).toBe(false);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('renderCPUOverClockStatus catch error', () => {
			gamingSystemUpdateServiceSpy.getCpuOCStatus.and.throwError('getCpuOCStatus error');
			component.drop.curSelected = 1;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.renderCPUOverClockStatus();
			expect(component.drop.curSelected).toBe(1, `component.drop.curSelected should keep 1`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('onOptionSelected catch error', () => {
			gamingSystemUpdateServiceSpy.setCpuOCStatus.and.throwError('setCpuOCStatus error');
			let event = {
				target: {
					name: 'gaming.dashboard.device.legionEdge.title'
				},
				option: {
					value: 2
				}
			};
			cpuOCFeatureCache = undefined
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.onOptionSelected(event);
			expect(component.drop.curSelected).toBe(1, `component.drop.curSelected should keep 1`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('renderRamOverClockStatus catch error', () => {
			gamingSystemUpdateServiceSpy.getRamOCStatus.and.throwError('getRamOCStatus error');
			component.gamingCapabilities.xtuService = true;
			component.legionUpdate[1].isChecked = false;
			memOCStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.renderRamOverClockStatus();
			expect(component.legionUpdate[1].isChecked).toBe(false, `component.legionUpdate[1].isChecked should keeo false`);
			expect(memOCStatusCache).toBe(false, `memOCStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('setRamOverClockStatus catch error', () => {
			gamingSystemUpdateServiceSpy.setRamOCStatus.and.throwError('setRamOCStatus error');
			component.legionUpdate[1].isChecked = false;
			memOCStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.setRamOverClockStatus(true);
			expect(component.legionUpdate[1].isChecked).toBe(false, `component.legionUpdate[1].isChecked should keeo false`);
			expect(memOCStatusCache).toBe(false, `memOCStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('renderNetworkBoostStatus catch error', () => {
			networkBoostServiceSpy.getNetworkBoostStatus.and.throwError('getNetworkBoostStatus error');
			component.legionUpdate[2].isChecked = false;
			networkBoostStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.renderNetworkBoostStatus();
			expect(component.legionUpdate[2].isChecked).toBe(false, `component.legionUpdate[2].isChecked should keeo false`);
			expect(networkBoostStatusCache).toBe(false, `networkBoostStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('setNetworkBoostStatus catch error', () => {
			networkBoostServiceSpy.setNetworkBoostStatus.and.throwError('setNetworkBoostStatus error');
			component.legionUpdate[2].isChecked = false;
			networkBoostStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.setNetworkBoostStatus(true);
			expect(component.legionUpdate[2].isChecked).toBe(false, `component.legionUpdate[2].isChecked should keeo false`);
			expect(networkBoostStatusCache).toBe(false, `networkBoostStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('renderAutoCloseStatus catch error', () => {
			gamingAutoCloseServiceSpy.getAutoCloseStatus.and.throwError('getAutoCloseStatus error');
			component.legionUpdate[3].isChecked = false;
			autoCloseStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.renderAutoCloseStatus();
			expect(component.legionUpdate[3].isChecked).toBe(false, `component.legionUpdate[3].isChecked should keeo false`);
			expect(autoCloseStatusCache).toBe(false, `autoCloseStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('setAutoCloseStatus catch error', () => {
			gamingAutoCloseServiceSpy.setAutoCloseStatus.and.throwError('setAutoCloseStatus error');
			component.legionUpdate[3].isChecked = false;
			autoCloseStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.setAutoCloseStatus(true);
			expect(component.legionUpdate[3].isChecked).toBe(false, `component.legionUpdate[3].isChecked should keeo false`);
			expect(autoCloseStatusCache).toBe(false, `autoCloseStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('renderHybridModeStatus catch error', () => {
			gamingHybridModeServiceSpy.getHybridModeStatus.and.throwError('getHybridModeStatus error');
			component.legionUpdate[4].isChecked = false;
			hybridModeStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.renderHybridModeStatus();
			expect(component.legionUpdate[4].isChecked).toBe(false, `component.legionUpdate[4].isChecked should keeo false`);
			expect(hybridModeStatusCache).toBe(false, `hybridModeStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('setHybridModeStatus catch error', () => {
			gamingHybridModeServiceSpy.setHybridModeStatus.and.throwError('setHybridModeStatus error');
			component.legionUpdate[4].isChecked = false;
			hybridModeStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.setHybridModeStatus(true);
			expect(component.legionUpdate[4].isChecked).toBe(false, `component.legionUpdate[4].isChecked should keeo false`);
			expect(hybridModeStatusCache).toBe(false, `hybridModeStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('renderOverDriveStatus catch error', () => {
			gamingOverDriveServiceSpy.getOverDriveStatus.and.throwError('getOverDriveStatus error');
			component.legionUpdate[5].isChecked = false;
			overDriveStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.renderOverDriveStatus();
			expect(component.legionUpdate[5].isChecked).toBe(false, `component.legionUpdate[5].isChecked should keeo false`);
			expect(overDriveStatusCache).toBe(false, `overDriveStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('setOverDriveStatus catch error', () => {
			gamingOverDriveServiceSpy.setOverDriveStatus.and.throwError('setOverDriveStatus error');
			component.legionUpdate[5].isChecked = false;
			overDriveStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.setOverDriveStatus(true);
			expect(component.legionUpdate[5].isChecked).toBe(false, `component.legionUpdate[5].isChecked should keeo false`);
			expect(overDriveStatusCache).toBe(false, `overDriveStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('renderTouchpadLockStatus catch error', () => {
			gamingKeyLockServiceSpy.getKeyLockStatus.and.throwError('getKeyLockStatus error');
			component.legionUpdate[6].isChecked = false;
			touchpadLockStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.renderTouchpadLockStatus();
			expect(component.legionUpdate[6].isChecked).toBe(false, `component.legionUpdate[6].isChecked should keeo false`);
			expect(touchpadLockStatusCache).toBe(false, `touchpadLockStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});

		it('setTouchpadLockStatus catch error', () => {
			gamingKeyLockServiceSpy.setKeyLockStatus.and.throwError('setKeyLockStatus error');
			component.legionUpdate[6].isChecked = false;
			touchpadLockStatusCache = false;
			let calledTimes = loggerServiceSpy.error.calls.count();
			component.setTouchpadLockStatus(true);
			expect(component.legionUpdate[6].isChecked).toBe(false, `component.legionUpdate[6].isChecked should keeo false`);
			expect(touchpadLockStatusCache).toBe(false, `touchpadLockStatusCache should keep false`);
			expect(loggerServiceSpy.error).toHaveBeenCalledTimes(++calledTimes);
		});
	})

	xdescribe('ITP', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [WidgetLegionEdgeComponent, SvgInlinePipe,
					mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: VantageShellService },
					{ provide: HttpHandler },
					{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
					{ provide: GamingOverDriveService, useValue: gamingOverDriveServiceSpy },
					{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
					{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceSpy },
					{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceSpy },
					{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceSpy },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceSpy },
					{ provide: NetworkBoostService, useValue: networkBoostServiceSpy },
					{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceSpy },
					{ provide: GamingOCService, useValue: gamingOCServiceSpy },
					{ provide: LoggerService, useValue: loggerServiceSpy },
					{ provide: NgbModal, useValue: { open: () => 0 } },
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		it('should render the Question icon image on legion edge container', async(() => {
			fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
			fixture.detectChanges();
			const compiled = fixture.debugElement.nativeElement;
			expect(compiled.querySelector('div.help-box>button>fa-icon')).toBeTruthy();
		}));

		// it('should make false isPopup and isDriverPopup when close popup', fakeAsync((done: any) => {
		// 	fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		// 	component = fixture.debugElement.componentInstance;
		// 	component.closeLegionEdgePopups();
		// 	tick(10);
		// 	fixture.detectChanges();
		// 	expect(component.legionUpdate[1].isDriverPopup).toEqual(false);
		// 	expect(component.legionUpdate[1].isPopup).toEqual(false);
		// }));

		it('onPopupClosed ramoverclock', fakeAsync(() => {
			const result = component.onPopupClosed({ target: { value: true }, name: 'gaming.dashboard.device.legionEdge.ramOverlock' });
			expect(component.legionUpdate[1].isPopup).toBe(false);
		}));

		it('onPopupClosed hybridMode', fakeAsync(() => {
			const result = component.onPopupClosed({ target: { value: true }, name: 'gaming.dashboard.device.legionEdge.hybridMode' });
			expect(component.legionUpdate[4].isPopup).toBe(false);
		}));

		it('onPopupClosed cpuoverclock', fakeAsync(() => {
			const result = component.onPopupClosed({ target: { value: true }, name: 'gaming.dashboard.device.legionEdge.title' });
			expect(component.legionUpdate[0].isDriverPopup).toBe(false);
		}));

		it('onPopupClosed networkBoost', fakeAsync(() => {
			const result = component.onPopupClosed({ target: { value: true }, name: 'gaming.dashboard.device.legionEdge.networkBoost' });
			expect(component.legionUpdate[2].isDriverPopup).toBe(false);
		}));
	})
});

/**
 * @param options pipeName which has to be mock
 * @description To mock the pipe.
 * @summary This has to move to one utils file.
 */
export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(class MockPipe {
		public transform(query: string, ...args: any[]): any {
			return query;
		}
	}) as any;
}
