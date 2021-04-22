import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { WidgetSystemMonitorComponent } from './widget-system-monitor.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HwInfoService } from 'src/app/services/gaming/gaming-hwinfo/hw-info.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { GAMING_DATA } from './../../../../testing/gaming-data';
import { of } from 'rxjs';
import { Gaming } from './../../../enums/gaming.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingOCService } from 'src/app/services/gaming/gaming-OC/gaming-oc.service';

describe('WidgetSystemMonitorComponent', () => {
	let component: WidgetSystemMonitorComponent;
	let fixture: ComponentFixture<WidgetSystemMonitorComponent>;

	let cpuModuleNameCache = 'CPU Test 1';
	let cpuBaseFrequencyCache = '1.0GHz';
	let cpuCurrentFrequencyCache = '2';
	let cpuUsageCache = 3;
	let gpuModuleNameCache = 'GPU Test 1';
	let gpuMemorySizeCache = '4GB';
	let gpuUsedMemoryCache = '5';
	let gpuUsageCache = 6;
	let ramModuleNameCache = 'RAM Test 1';
	let ramSizeCache = '7GB';
	let ramUsedCache = '8';
	let ramUsageCache = 9;
	let cpuInfoVersion = 1;
	let gpuInfoVersion = 1;
	let hdsCache: any = [
		{
			capacity: 10,
			diskUsage: '11',
			hddName: 'Hdd Test 1',
			isSystemDisk: true,
			type: 'SSD',
			usedDisk: 12,
		}
	];
	const payloadInfo = {
		accessoryFeature: true,
		advanceCPUOCFeature: false,
		advanceGPUOCFeature: true,
		cpuInfoFeature: true,
		cpuInfoVersion: 1,
		cpuOCFeature: true,
		desktopType: false,
		diskInfoVersion: 1,
		fbnetFilter: true,
		gpuCoreOCFeature: true,
		gpuInfoFeature: true,
		gpuInfoVersion: 1,
		gpuOCFeature: true,
		gpuVramOCFeature: true,
		hddInfoFeature: true,
		hybridModeFeature: true,
		ledDriver: true,
		ledLayoutVersion: 2,
		ledSetFeature: true,
		ledSwitchButtonFeature: true,
		liteGaming: false,
		macroKeyFeature: true,
		memOCFeature: false,
		memoryInfoFeature: true,
		networkBoostFeature: true,
		nvDriver: true,
		optimizationFeature: true,
		overDriveFeature: true,
		smartFanFeature: true,
		supporttedThermalMode: {},
		thermalModeVersion: 4,
		touchpadLockFeature: true,
		winKeyLockFeature: true,
		xtuService: true,
	};
	const hardwareInformation = {
		cpuMaxFrequency: 4.45,
		cpuModuleName: 'AMD Ryzen 7 5800H with Radeon Graphics',
		gpuCoreMaxFrequency: 2.145,
		gpuModuleName: 'NVDIA GeForce RTX 3070 Laptop GPU',
		gpuVramMaxFrequency: 7.201,
	};
	const commonServiceMock = {
		getCapabalitiesNotification: () => of({ type: Gaming.GamingCapabilities, payload: payloadInfo}),
	};
	let cacheFlag = true;

	const localCacheServiceMock = {
		getLocalCacheValue: (key, defaultValue) => {
			switch (key) {
				case LocalStorageKey.cpuModuleName:
					return cpuModuleNameCache;
				case LocalStorageKey.cpuBaseFrequency:
					return cpuBaseFrequencyCache;
				case LocalStorageKey.cpuCurrentFrequency:
					return cpuCurrentFrequencyCache;
				case LocalStorageKey.cpuUsage:
					return cpuUsageCache;
				case LocalStorageKey.gpuModuleName:
					return gpuModuleNameCache;
				case LocalStorageKey.gpuMemorySize:
					return gpuMemorySizeCache;
				case LocalStorageKey.gpuUsedMemory:
					return gpuUsedMemoryCache;
				case LocalStorageKey.gpuUsage:
					return gpuUsageCache;
				case LocalStorageKey.ramModuleName:
					return ramModuleNameCache;
				case LocalStorageKey.ramSize:
					return cacheFlag ? ramSizeCache : null;
				case LocalStorageKey.ramUsed:
					return ramUsedCache;
				case LocalStorageKey.ramUsage:
					return ramUsageCache;
				case LocalStorageKey.disksList:
					return hdsCache;
				case LocalStorageKey.cpuInfoVersion:
					return cpuInfoVersion;
				case LocalStorageKey.gpuInfoVersion:
					return gpuInfoVersion;
			}
		},
		setLocalCacheValue: (key: any, value: any) => {
			switch (key) {
				case LocalStorageKey.cpuModuleName:
					cpuModuleNameCache = value;
					break;
				case LocalStorageKey.cpuBaseFrequency:
					cpuBaseFrequencyCache = value;
					break;
				case LocalStorageKey.cpuCurrentFrequency:
					cpuCurrentFrequencyCache = value;
					break;
				case LocalStorageKey.cpuUsage:
					cpuUsageCache = value;
					break;
				case LocalStorageKey.gpuModuleName:
					gpuModuleNameCache = value;
					break;
				case LocalStorageKey.gpuMemorySize:
					gpuMemorySizeCache = value;
					break;
				case LocalStorageKey.gpuUsedMemory:
					gpuUsedMemoryCache = value;
					break;
				case LocalStorageKey.gpuUsage:
					gpuUsageCache = value;
					break;
				case LocalStorageKey.ramModuleName:
					ramModuleNameCache = value;
					break;
				case LocalStorageKey.ramSize:
					ramSizeCache = value;
					break;
				case LocalStorageKey.ramUsed:
					ramUsedCache = value;
					break;
				case LocalStorageKey.ramUsage:
					ramUsageCache = value;
					break;
				case LocalStorageKey.disksList:
					hdsCache = value;
					break;
				case LocalStorageKey.cpuInfoVersion:
					cpuInfoVersion = value;
					break;
				case LocalStorageKey.gpuInfoVersion:
					gpuInfoVersion = value;
					break;
			}
		},
	};

	const gamingHwInfoSpy = jasmine.createSpyObj('HwInfoService', [
		'getMachineInfomation',
		'getDynamicInformation',
		'getHardwareInformation',
		'getDynamicHardwareUsageInfo'
	]);

	const gamingOCServiceMock = jasmine.createSpyObj('GamingOCService', [
		'getHwOverClockState',
		'regOCRealStatusChangeEvent'
	]);

	const vantageShellServiceMock = jasmine.createSpyObj('VantageShellService', [
		'registerEvent',
		'getLogger',
		'unRegisterEvent'
	]);

	const loggerServiceMock = jasmine.createSpyObj('LoggerService', [
		'error',
		'info'
	]);
	let timerCallback;

	describe('setInterval', () => {
		beforeEach(() => {
			timerCallback = jasmine. createSpy('setInterval');
			jasmine.clock().install();

			vantageShellServiceMock.getLogger.and.returnValue(Promise.resolve());
			loggerServiceMock.error.and.returnValue(Promise.resolve());
			loggerServiceMock.info.and.returnValue(Promise.resolve());
			TestBed.configureTestingModule({
				declarations: [
					WidgetSystemMonitorComponent,
					GAMING_DATA.mockPipe({ name: 'translate' })
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: VantageShellService , useValue: vantageShellServiceMock},
					{ provide: LoggerService, useValue: loggerServiceMock },
					{ provide: HttpHandler },
					{ provide: HwInfoService, useValue: gamingHwInfoSpy },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: GamingOCService, useValue: gamingOCServiceMock }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
			cacheFlag = false;
			component = fixture.componentInstance;
			fixture.detectChanges();
		});
		afterEach(() => {
			jasmine.clock().uninstall();
		});
		it('component should create', (done) => {
			jasmine.clock().tick(5500);
			done();
			expect(component.loop).toBeDefined();

			expect(component).toBeTruthy();
		});
	});

	describe('machine info', () => {
		beforeEach(() => {
			vantageShellServiceMock.getLogger.and.returnValue(Promise.resolve());
			loggerServiceMock.error.and.returnValue(Promise.resolve());
			loggerServiceMock.info.and.returnValue(Promise.resolve());
			TestBed.configureTestingModule({
				declarations: [
					WidgetSystemMonitorComponent,
					GAMING_DATA.mockPipe({ name: 'translate' })
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: VantageShellService , useValue: vantageShellServiceMock},
					{ provide: LoggerService, useValue: loggerServiceMock },
					{ provide: HttpHandler },
					{ provide: HwInfoService, useValue: gamingHwInfoSpy },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: GamingOCService, useValue: gamingOCServiceMock }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
			cacheFlag = true;
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});
		afterEach(() => {
			cpuModuleNameCache = 'CPU Test 1';
			cpuBaseFrequencyCache = '1.0GHz';
			cpuCurrentFrequencyCache = '2';
			cpuUsageCache = 3;
			gpuModuleNameCache = 'GPU Test 1';
			gpuMemorySizeCache = '4GB';
			gpuUsedMemoryCache = '5';
			gpuUsageCache = 6;
			ramModuleNameCache = 'RAM Test 1';
			ramSizeCache = '7GB';
			ramUsedCache = '8';
			ramUsageCache = 9;
			hdsCache = [{
				capacity: 10,
				diskUsage: '11',
				hddName: 'Hdd Test 1',
				isSystemDisk: true,
				type: 'SSD',
				usedDisk: 12,
			}];
		});
		it('getMachineInfo', fakeAsync(() => {
			component.hwVersionInfo = 0;
			const machineInfo = {
				cpuModuleName: 'CPU Test 2',
				cpuBaseFrequence: '2.0GHz',
				gpuModuleName: 'GPU Test 2',
				gpuMemorySize: '8GB',
				memoryModuleName: 'RAM Test 2',
				memorySize: '14GB',
			};
			gamingHwInfoSpy.getMachineInfomation.and.resolveTo(machineInfo);
			component.getMachineInfo();
			tick();
			expect(component.cpuModuleName).toBe('CPU Test 2', 'cpuModuleName shoulde be CPU Test 2');
			expect(cpuModuleNameCache).toBe('CPU Test 2', 'cpuModuleNameCache shoulde be CPU Test 2');
			expect(component.cpuBaseFrequency).toBe('2.0GHz', 'cpuBaseFrequency shoulde be 2.0GHz');
			expect(cpuBaseFrequencyCache).toBe('2.0GHz', 'cpuBaseFrequencyCache shoulde be 2.0GHz');
			expect(component.gpuModuleName).toBe('GPU Test 2', 'GpuModuleName shoulde be GPU Test 2');
			expect(gpuModuleNameCache).toBe('GPU Test 2', 'gpuModuleNameCache shoulde be GPU Test 2');
			expect(component.gpuMemorySize).toBe('8GB', 'gpuMemorySize shoulde be 8GB');
			expect(gpuMemorySizeCache).toBe('8GB', 'gpuMemorySizeCache shoulde be 8GB');
			expect(component.ramModuleName).toBe('RAM Test 2', 'ramModuleName shoulde be RAM Test 2');
			expect(ramModuleNameCache).toBe('RAM Test 2', 'ramModuleNameCache shoulde be RAM Test 2');
			expect(component.ramSize).toBe('14GB', 'ramSize shoulde be 14GB');
			expect(ramSizeCache).toBe('14GB', 'ramSizeCache shoulde be 14GB');

			component.getMachineInfo();

			gamingHwInfoSpy.getMachineInfomation.and.returnValue(null);
			component.getMachineInfo();
		}));
		it('onRegisterOverClockStateChangeEvent', fakeAsync(() => {
			const res = { cpuOCState: false, gpuOCState: true };
			component.hwVersionInfo = 1;
			gamingHwInfoSpy.getHardwareInformation.and.returnValue(Promise.resolve(hardwareInformation));
			component.onRegisterOverClockStateChangeEvent(res);
			expect(component.onRegisterOverClockStateChangeEvent(res)).toBeUndefined();
			gamingHwInfoSpy.getHardwareInformation.and.returnValue(Promise.resolve(null));
			component.onRegisterOverClockStateChangeEvent(res);
			expect(component.onRegisterOverClockStateChangeEvent(res)).toBeUndefined();

			const ocState = {cpuOCStateValue: true, gpuOCStateValue: false};
			component.hwVersionInfo = 0;
			component.onRegisterOverClockStateChangeEvent(ocState);
			tick(100);
			expect(component.hwOCInfo.cpuOverClockInfo.isOverClocking).toBe(false);
			expect(component.hwOCInfo.gpuOverClockInfo.isOverClocking).toBe(true);
			expect(component.hwOCInfo.vramOverClockInfo.isOverClocking).toBe(true);

			component.hwVersionInfo = 1;
			component.onRegisterOverClockStateChangeEvent('');
			tick(100);
			expect(component.hwOCInfo.cpuOverClockInfo.isOverClocking).toBe(false);

			component.onRegisterOverClockStateChangeEvent(null);
			tick(100);
			expect(component.hwOCInfo.cpuOverClockInfo.isOverClocking).toBe(false);

			vantageShellServiceMock.registerEvent = null;
			component.registerOverClockStateChangeEvent();
		}));
        it('initHWOverClockInfo ', fakeAsync(() => {
			component.hwVersionInfo = 0;
			component.initHWOverClockInfo();
			expect(component.initHWOverClockInfo()).toBeUndefined();
		}));
		it('getDynamicHardwareUsageInfo', fakeAsync(() => {
			const hwInfo = {
				cpuCurrentFrequency: 2.068,
				cpuUtilization: 20,
				diskList: [
					{
						capacity: 476,
						diskUsage: 20,
						hddName: 'SAMSUNG MZVLB512HBJQ-000L2',
						isSystemDisk: true,
						type: 'SSD',
						usedDisk: 95
					},
					{
						capacity: 476,
						diskUsage: 1,
						hddName: 'SAMSUNG MZVLB512HBJQ-000L2',
						isSystemDisk: false,
						type: 'SSD',
						usedDisk: 6
					}
				],
				gpuCoreCurrentFrequency: 1.56,
				gpuVramCurrentFrequency: 7.2
			};
			gamingHwInfoSpy.getDynamicHardwareUsageInfo.and.returnValue(Promise.resolve(hwInfo));
			component.getDynamicHardwareUsageInfo();
			tick(100);
			expect(component.cpuUsage).toBe(0.03);
			gamingHwInfoSpy.getHardwareInformation.and.returnValue(Promise.resolve(hardwareInformation));
			component.getHardwareInformation();
			component.getDynamicHardwareUsageInfo();
			tick(100);
			expect(component.cpuUsage).toBe(0.46);
			tick(200);

			gamingHwInfoSpy.getHardwareInformation.and.returnValue(Promise.resolve(null));
			component.getHardwareInformation();
			component.getDynamicHardwareUsageInfo();
			expect(component.cpuUsage).toBe(0.46);
			tick(200);

			gamingHwInfoSpy.getDynamicHardwareUsageInfo.and.returnValue(Promise.resolve(null));
			component.getDynamicHardwareUsageInfo();
			tick(100);
			expect(component.cpuCurrentFrequency).toBe('2.07');
			expect(component.hds[0].type).toBe('SSD');
		}));
		it('getDynamicHardwareUsageInfo error', fakeAsync(() => {
			const hwInfo = {
				cpuCurrentFrequency: '',
				cpuUtilization: '',
				diskList: null,
				gpuCoreCurrentFrequency: '',
				gpuVramCurrentFrequency: ''
			};
			gamingHwInfoSpy.getHardwareInformation.and.returnValue(Promise.resolve(hardwareInformation));
			gamingHwInfoSpy.getDynamicHardwareUsageInfo.and.returnValue(Promise.resolve(hwInfo));
			component.getHardwareInformation();
			component.getDynamicHardwareUsageInfo();
			tick(100);
			expect(component.cpuCurrentFrequency).toBe('2');
			expect(component.gpuUsedMemory).toBe('5');
			expect(component.ramUsed).toBe('8');

			const hardwareInformationempty = {
				cpuMaxFrequency: '',
				cpuModuleName: 'AMD Ryzen 7 5800H with Radeon Graphics',
				gpuCoreMaxFrequency: '',
				gpuModuleName: 'NVDIA GeForce RTX 3070 Laptop GPU',
				gpuVramMaxFrequency: '',
			};
			gamingHwInfoSpy.getHardwareInformation.and.returnValue(Promise.resolve(hardwareInformationempty));
			component.getHardwareInformation();
			tick(100);
			expect(component.cpuBaseFrequency ).toBe('4.45GHz');
			expect(component.gpuMemorySize ).toBe('2.15GHz');
			expect(component.ramSize ).toBe('7.20GHz');
		}));
		it('toggleHDs', fakeAsync(() => {
			component.toggleHDs(true);
			expect(component.showAllHDs).toBe(false);
			component.hds = [1,2,3];
			component.showAllHDs = true;
			component.toggleHDs(false);
			expect(component.showAllHDs ).toBe(false);

			component.hds = [1];
			component.toggleHDs(false);
			expect(component.showAllHDs ).toBe(false);
		}));
		it('getHDSize', fakeAsync(() => {
			component.getHDSize(1200);
			expect(component.getHDSize(1200)).toBe('1.20TB');
		}));
		it('getRightDeg', fakeAsync(() => {
			component.getRightDeg(2);
			expect(component.getRightDeg(2)).toBe(360);
			component.getRightDeg(-2);
			expect(component.getRightDeg(-2)).toBe(0);
		}));
		it('getLeftDeg', fakeAsync(() => {
			component.getLeftDeg(1.5);
			expect(component.getLeftDeg(1.5)).toBe(180);
			component.getLeftDeg(0);
			expect(component.getLeftDeg(0)).toBe(0);
		}));

		it('getHwOverClockState', fakeAsync(() => {
			gamingOCServiceMock.getHwOverClockState.and.returnValue(Promise.resolve({cpuOCState: true, gpuOCState: false}));
			component.getHwOverClockState();
			tick(100);
			expect(component.hwOCInfo.cpuOverClockInfo.isOverClocking).toBe(true);
			expect(component.hwOCInfo.gpuOverClockInfo.isOverClocking).toBe(false);
			expect(component.hwOCInfo.vramOverClockInfo.isOverClocking).toBe(false);

			const ocState = {cpuOCStateValue: true, gpuOCStateValue: false};
			gamingOCServiceMock.getHwOverClockState.and.returnValue(Promise.resolve(ocState));
			component.getHwOverClockState();
			tick(100);
			expect(component.hwOCInfo.cpuOverClockInfo.isOverClocking).toBe(true);
			expect(component.hwOCInfo.gpuOverClockInfo.isOverClocking).toBe(false);
			expect(component.hwOCInfo.vramOverClockInfo.isOverClocking).toBe(false);

			gamingOCServiceMock.getHwOverClockState.and.returnValue(Promise.resolve(''));
			component.getHwOverClockState();
			tick(100);
			expect(component.hwOCInfo.cpuOverClockInfo.isOverClocking).toBe(true);

			gamingOCServiceMock.getHwOverClockState.and.returnValue(Promise.resolve(null));
			component.getHwOverClockState();
			tick(100);
			expect(component.hwOCInfo.cpuOverClockInfo.isOverClocking).toBe(true);

			gamingOCServiceMock.getHwOverClockState.and.returnValue(Promise.reject('getHwOverClockState error'));
			component.getHwOverClockState();
			tick(100);
			expect(component.hwOCInfo.cpuOverClockInfo.isOverClocking).toBe(true);
		}));
	});
	describe('dynamic info', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [
					WidgetSystemMonitorComponent,
					GAMING_DATA.mockPipe({ name: 'translate' })
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: VantageShellService },
					{ provide: LoggerService, useValue: loggerServiceMock },
					{ provide: HttpHandler },
					{ provide: HwInfoService, useValue: gamingHwInfoSpy },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
			cacheFlag = true;
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		afterEach(() => {
			cpuModuleNameCache = 'CPU Test 1';
			cpuBaseFrequencyCache = '1.0GHz';
			cpuCurrentFrequencyCache = '2';
			cpuUsageCache = 3;
			gpuModuleNameCache = 'GPU Test 1';
			gpuMemorySizeCache = '4GB';
			gpuUsedMemoryCache = '5';
			gpuUsageCache = 6;
			ramModuleNameCache = 'RAM Test 1';
			ramSizeCache = '7GB';
			ramUsedCache = '8';
			ramUsageCache = 9;
			hdsCache = [{
				capacity: 10,
				diskUsage: '11',
				hddName: 'Hdd Test 1',
				isSystemDisk: true,
				type: 'SSD',
				usedDisk: 12,
			}];
		});
		it('getRealTimeUsageInfo', fakeAsync(() => {
			component.hwVersionInfo = 0;
			let dynamicInfo = {
				cpuUseFrequency: '4GHz',
				cpuUsage: 6,
				gpuUsedMemory: '10GB',
				gpuUsage: 12,
				memoryUsed: '16GB',
				memoryUsage: 18,
				diskList: [{
					capacity: 20,
					diskUsage: 22,
					hddName: 'Hdd Test 2',
					isSystemDisk: false,
					type: 'HDD',
					usedDisk: 24,
				},{
					capacity: 26,
					diskUsage: 28,
					hddName: 'Hdd Test 3',
					isSystemDisk: true,
					type: 'SSD',
					usedDisk: 30,
				}],
			};
			gamingHwInfoSpy.getDynamicInformation.and.resolveTo(dynamicInfo);
			component.getRealTimeUsageInfo();
			tick();
			expect(component.cpuCurrentFrequency).toBe('4', 'cpuCurrentFrequency shoulde be 4');
			expect(component.cpuUsage).toBe(0.06, 'cpuUsage shoulde be 0.06');
			expect(component.gpuUsedMemory).toBe('10', 'gpuUsedMemory shoulde be 10');
			expect(component.gpuUsage).toBe(12, 'gpuUsage shoulde be 12');
			expect(component.ramUsed).toBe('16', 'ramUsed shoulde be 16');
			expect(component.ramUsage).toBe(18, 'ramUsage shoulde be 18');
			expect(component.hds.length).toBe(2, 'hds.length shoulde be 2');
			expect(component.hds[0].capacity).toBe(20, 'hds[0].capacity shoulde be 10');
			expect(component.hds[0].diskUsage).toBe(22, 'hds[0].diskUsage shoulde be 22');
			expect(component.hds[0].hddName).toBe('Hdd Test 2', 'hds[0].hddName shoulde be Hdd Test 2');
			expect(component.hds[0].isSystemDisk).toBe(false, 'hds[0].isSystemDisk shoulde be false');
			expect(component.hds[0].type).toBe('HDD', 'hds[0].type shoulde be HDD');
			expect(component.hds[0].usedDisk).toBe(24, 'hds[0].usedDisk shoulde be 24');
			expect(component.hds[1].capacity).toBe(26, 'hds[1].capacity shoulde be 26');
			expect(component.hds[1].diskUsage).toBe(28, 'hds[1].diskUsage shoulde be 28');
			expect(component.hds[1].hddName).toBe('Hdd Test 3', 'hds[1].hddName shoulde be Hdd Test 3');
			expect(component.hds[1].isSystemDisk).toBe(true, 'hds[1].isSystemDisk shoulde be true');
			expect(component.hds[1].type).toBe('SSD', 'hds[1].type shoulde be SSD');
			expect(component.hds[1].usedDisk).toBe(30, 'hds[1].usedDisk shoulde be 30');
			dynamicInfo = {
				cpuUseFrequency: null,
				cpuUsage: null,
				gpuUsedMemory: null,
				gpuUsage: null,
				memoryUsed: null,
				memoryUsage: null,
				diskList: null
			};
			gamingHwInfoSpy.getDynamicInformation.and.resolveTo(dynamicInfo);
			component.getRealTimeUsageInfo();
			tick();
			expect(component.cpuCurrentFrequency).toBe('4', 'cpuCurrentFrequency shoulde be 4');
			expect(component.cpuUsage).toBe(0.06, 'cpuUsage shoulde be 0.06');
			expect(component.gpuUsedMemory).toBe('10', 'gpuUsedMemory shoulde be 10');
			expect(component.gpuUsage).toBe(12, 'gpuUsage shoulde be 12');
			expect(component.ramUsed).toBe('16', 'ramUsed shoulde be 16');
			expect(component.ramUsage).toBe(18, 'ramUsage shoulde be 18');
			expect(component.hds.length).toBe(2, 'hds.length shoulde be 2');
			expect(component.hds[0].capacity).toBe(20, 'hds.capacity shoulde be 20');
			expect(component.hds[0].diskUsage).toBe(22, 'hds.diskUsage shoulde be 22');
			expect(component.hds[0].hddName).toBe('Hdd Test 2', 'hds.hddName shoulde be Hdd Test 2');
			expect(component.hds[0].isSystemDisk).toBe(false, 'hds.isSystemDisk shoulde be false');
			expect(component.hds[0].type).toBe('HDD', 'hds.type shoulde be HDD');
			expect(component.hds[0].usedDisk).toBe(24, 'hds.usedDisk shoulde be 24');

			gamingHwInfoSpy.getDynamicInformation.and.returnValue(null);
			component.getRealTimeUsageInfo();
			tick();
			expect(component.cpuCurrentFrequency).toBe('4', 'cpuCurrentFrequency shoulde be 4');
			expect(component.cpuUsage).toBe(0.06, 'cpuUsage shoulde be 0.06');
			expect(component.gpuUsedMemory).toBe('10', 'gpuUsedMemory shoulde be 10');
			expect(component.gpuUsage).toBe(12, 'gpuUsage shoulde be 12');
		}));
	});
});
