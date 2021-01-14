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
					return ramSizeCache;
				case LocalStorageKey.ramUsed:
					return ramUsedCache;
				case LocalStorageKey.ramUsage:
					return ramUsageCache;
				case LocalStorageKey.disksList:
					return hdsCache
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
					break
			}
		},
	};

	const gamingHwInfoSpy = jasmine.createSpyObj('HwInfoService', [
		'getMachineInfomation',
		'getDynamicInformation'
	]);

	describe('machine info', () => {
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
					{ provide: LoggerService },
					{ provide: HttpHandler },
					{ provide: HwInfoService, useValue: gamingHwInfoSpy },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
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

		it('ngOnInit', () => {
			spyOn(component, 'getMachineInfo').and.callThrough();
			spyOn(component, 'getRealTimeUsageInfo').and.callThrough();
			expect(component).toBeDefined();
			expect(component.cpuModuleName).toBe('CPU Test 1', 'cpuModuleName shoulde be CPU Test 1');
			expect(component.cpuBaseFrequency).toBe('1.0GHz', 'cpuBaseFrequency shoulde be 1.0GHz');
			expect(component.gpuModuleName).toBe('GPU Test 1', 'GpuModuleName shoulde be GPU Test 1');
			expect(component.gpuMemorySize).toBe('4GB', 'gpuMemorySize shoulde be 4GB');
			expect(component.ramModuleName).toBe('RAM Test 1', 'ramModuleName shoulde be RAM Test 1');
			expect(component.ramSize).toBe('7GB', 'ramSize shoulde be 7GB');
		});
		it('getMachineInfo', fakeAsync(() => {
			const machineInfo = {
				cpuModuleName: 'CPU Test 2',
				cpuBaseFrequence: '2.0GHz',
				gpuModuleName: 'GPU Test 2',
				gpuMemorySize: '8GB',
				memoryModuleName: 'RAM Test 2',
				memorySize: '14GB',
			}
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
		}));
	})
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
					{ provide: LoggerService },
					{ provide: HttpHandler },
					{ provide: HwInfoService, useValue: gamingHwInfoSpy },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
				]
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
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

		it('ngOnInit', () => {
			spyOn(component, 'getMachineInfo').and.callThrough();
			spyOn(component, 'getRealTimeUsageInfo').and.callThrough();
			expect(component).toBeDefined();
			expect(component.cpuCurrentFrequency).toBe('2', 'cpuCurrentFrequency shoulde be 2');
			expect(component.cpuUsage).toBe(0.03, 'cpuUsage shoulde be 0.03');
			expect(component.gpuUsedMemory).toBe('5', 'gpuUsedMemory shoulde be 5');
			expect(component.gpuUsage).toBe(6, 'gpuUsage shoulde be 6');
			expect(component.ramUsed).toBe('8', 'ramUsed shoulde be 8');
			expect(component.ramUsage).toBe(9, 'ramUsage shoulde be 9');
			expect(component.hds.length).toBe(1, 'hds.length shoulde be 1');
			expect(component.hds[0].capacity).toBe(10, 'hds.capacity shoulde be 10');
			expect(component.hds[0].diskUsage).toBe('11', 'hds.diskUsage shoulde be 11');
			expect(component.hds[0].hddName).toBe('Hdd Test 1', 'hds.hddName shoulde be Hdd Test 1');
			expect(component.hds[0].isSystemDisk).toBe(true, 'hds.isSystemDisk shoulde be true');
			expect(component.hds[0].type).toBe('SSD', 'hds.type shoulde be SSD');
			expect(component.hds[0].usedDisk).toBe(12, 'hds.usedDisk shoulde be 12');
		});

		it('getRealTimeUsageInfo', fakeAsync(() => {
			let dynamicInfo = {
				cpuUseFrequency: null,
				cpuUsage: null,
				gpuUsedMemory: null,
				gpuUsage: null,
				memoryUsed: null,
				memoryUsage: null,
				diskList: null
			}
			gamingHwInfoSpy.getDynamicInformation.and.resolveTo(dynamicInfo);
			component.getRealTimeUsageInfo();
			tick();
			expect(component.cpuCurrentFrequency).toBe('2', 'cpuCurrentFrequency shoulde be 2');
			expect(component.cpuUsage).toBe(0.03, 'cpuUsage shoulde be 0.03');
			expect(component.gpuUsedMemory).toBe('5', 'gpuUsedMemory shoulde be 5');
			expect(component.gpuUsage).toBe(6, 'gpuUsage shoulde be 6');
			expect(component.ramUsed).toBe('8', 'ramUsed shoulde be 8');
			expect(component.ramUsage).toBe(9, 'ramUsage shoulde be 9');
			expect(component.hds.length).toBe(1, 'hds.length shoulde be 1');
			expect(component.hds[0].capacity).toBe(10, 'hds.capacity shoulde be 10');
			expect(component.hds[0].diskUsage).toBe('11', 'hds.diskUsage shoulde be 11');
			expect(component.hds[0].hddName).toBe('Hdd Test 1', 'hds.hddName shoulde be Hdd Test 1');
			expect(component.hds[0].isSystemDisk).toBe(true, 'hds.isSystemDisk shoulde be true');
			expect(component.hds[0].type).toBe('SSD', 'hds.type shoulde be SSD');
			expect(component.hds[0].usedDisk).toBe(12, 'hds.usedDisk shoulde be 12');

			dynamicInfo = {
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
			}
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
		}));
	})
});
