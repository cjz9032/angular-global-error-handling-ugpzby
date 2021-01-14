import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { WidgetSystemMonitorComponent } from './widget-system-monitor.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HwInfoService } from 'src/app/services/gaming/gaming-hwinfo/hw-info.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { GAMING_DATA } from './../../../../testing/gaming-data';

const gamingAllCapabilitiesServiceMock = jasmine.createSpyObj('GamingAllCapabilitiesService', [
	'isShellAvailable',
	'getCapabilities',
	'setCapabilityValuesGlobally',
	'getCapabilityFromCache',
]);

const gamingHwinfoMock = jasmine.createSpyObj('HwInfoService', [
	'isShellAvailable',
	'getDynamicInformation',
	'getMachineInfomation',
	'getMachineHwCapability',
	'getHwOverClockState'
]);

const hdsList = [
	{capacity: 119, diskUsage: 72, hddName: "HFM128GDHTNG-8310A", isSystemDisk: true,type: "SSD", usedDisk: 86},
	{capacity: 931, diskUsage: 7, hddName: "ST1000LM035-1RK172", isSystemDisk: true,type: "HDD", usedDisk: 63}
]

describe('WidgetSystemMonitorComponent', () => {
	let component: WidgetSystemMonitorComponent;
	let fixture: ComponentFixture<WidgetSystemMonitorComponent>;
	let timerCallback;

	const getTextContent = (element, filter) => element.querySelector(filter).textContent;
	const localCacheServiceSpy = {
		getLocalCacheValue: (key, defaultValue) => {
			switch (key) {
				case LocalStorageKey.cpuCurrentFrequency:
					return '2.9GHz';
				case LocalStorageKey.cpuBaseFrequency:
					return '2.9GHz';
				case LocalStorageKey.cpuUsage:
					return '10';
				case LocalStorageKey.cpuModuleName:
					return '10';
				case LocalStorageKey.gpuUsedMemory:
					return '2.9GHz';
				case LocalStorageKey.gpuMemorySize:
					return '2.9GHz';
				case LocalStorageKey.gpuUsage:
					return '10';
				case LocalStorageKey.gpuModuleName:
					return 'NVIDIA GeForce GTX 3090';
				case LocalStorageKey.ramSize:
					return '64.0GB';
				case LocalStorageKey.ramUsed:
					return '2.9GHz';
				case LocalStorageKey.ramUsage:
					return '10';
				case LocalStorageKey.ramModuleName:
					return '10';
				case LocalStorageKey.disksList:
				    return hdsList;
				// case LocalStorageKey.hddName:
				// 	return 'LENSE30512GMSP34MEAT3TA';
				// case LocalStorageKey.type:
				// 	return 'SSD';
				// case LocalStorageKey.capacity:
				// 	return 500;
				// case LocalStorageKey.usedDisk:
				// 	return 100;
				// case LocalStorageKey.diskUsage:
				// 	return '20';
				// case LocalStorageKey.isSystemDisk:
				// 	return 'true';
			}
		},
		setLocalCacheValue: (key, vaule) => {
			Promise.resolve();
		},
	};

	beforeEach(() => {
		timerCallback = jasmine.createSpy('timerCallback');
		jasmine.clock().install();
		TestBed.configureTestingModule({
			declarations: [
				WidgetSystemMonitorComponent,
				GAMING_DATA.mockPipe({ name: 'translate' }),
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: VantageShellService },
				{ provide: LoggerService },
				{ provide: HttpHandler },
				{
					provide: GamingAllCapabilitiesService,
					useValue: gamingAllCapabilitiesServiceMock,
				},
				{ provide: HwInfoService, useValue: gamingHwinfoMock },
				{ provide: LocalCacheService, useValue: localCacheServiceSpy },
			],
		}).compileComponents();
		fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		jasmine.clock().uninstall();
	});

	it('should render "INFO" as a link', () => {
		setTimeout(() => {
			timerCallback();
		}, 100);
		fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('div.link-container>a')).toBeTruthy();
		expect(timerCallback).not.toHaveBeenCalled();
		jasmine.clock().tick(101);
	});

	it('should have path /device for "INFO" link', () => {
		const infoLinkRef = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
		const infoLink = infoLinkRef.findIndex((c) => c.properties.href === '/device');
		expect(infoLink).toEqual(-1);
	});

	it('Should have title GPU, CPU, RAM', () => {
		fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
		fixture.detectChanges();
		const element = fixture.debugElement.nativeElement;
		expect(getTextContent(element, 'div.stack-title')).toEqual(' GPU ');
		expect(getTextContent(element, 'div.cpu-title')).toEqual(' CPU ');
		expect(
			getTextContent(element, 'div.ram>div.monitor-stack>div.stack-label>div.stack-title')
		).toEqual(' RAM ');
	});

	it('Should mock the Hwinfoservice to get cpuMax, cpuModuleName, gpuMax, gpuModuleName, ramMax & ramOver using getMachineInfomation function', () => {
		let hwInfo = {
			cpuBaseFrequence: '2.9GHz',
			cpuModuleName: 'Intel(R) Core(TM) i7-7820HK CPU @ 2.90GHz',
			gpuMemorySize: '8GB',
			gpuModuleName: 'NVIDIA GeForce GTX 3090',
			memorySize: '64.0GB',
			memoryModuleName: 'Samsung',
		};
		fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
		component = fixture.debugElement.componentInstance;
		gamingHwinfoMock.getMachineInfomation.and.returnValue(
			Promise.resolve({
				cpuBaseFrequence: '2.9GHz',
				cpuModuleName: 'Intel(R) Core(TM) i7-7820HK CPU @ 2.90GHz',
				gpuMemorySize: '8GB',
				gpuModuleName: 'NVIDIA GeForce GTX 3090',
				memorySize: '64.0GB',
				memoryModuleName: 'Samsung',
			})
		);
		gamingHwinfoMock.getMachineInfomation().then((hwInfoRes: any) => {
			JSON.stringify(hwInfoRes);
			hwInfo = hwInfoRes;
			component.getMachineInfo();
			// expect(hwInfoRes.cpuBaseFrequency).toEqual('2.9');
			expect(hwInfoRes.cpuModuleName).toEqual('Intel(R) Core(TM) i7-7820HK CPU @ 2.90GHz');
			expect(hwInfoRes.gpuMemorySize).toEqual('8GB');
			expect(hwInfoRes.gpuModuleName).toEqual('NVIDIA GeForce GTX 3090');
			expect(hwInfoRes.memorySize).toEqual('64.0GB');
			expect(hwInfoRes.memoryModuleName).toEqual('Samsung');
		});
		expect(hwInfo.cpuBaseFrequence).toEqual('2.9GHz');
		expect(hwInfo.cpuModuleName).toEqual('Intel(R) Core(TM) i7-7820HK CPU @ 2.90GHz');
		expect(hwInfo.gpuMemorySize).toEqual('8GB');
		expect(hwInfo.gpuModuleName).toEqual('NVIDIA GeForce GTX 3090');
		expect(hwInfo.memorySize).toEqual('64.0GB');
		expect(hwInfo.memoryModuleName).toEqual('Samsung');
	});

	it('Should mock the Hwinfoservice to get cpuUsage, gpuUsage, memoryUsage, cpuCurrent, gpuCurrent & ramCurrent using getDynamicInformation function', () => {
		let dynamicInfov;
		fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
		component = fixture.debugElement.componentInstance;
		gamingHwinfoMock.getDynamicInformation.and.returnValue(
			Promise.resolve({
				diskList: [
					{
						isSystemDisk: false,
						capacity: 1863,
						type: 'HDD',
						hddName: 'ST2000LM007-1R8174',
						usedDisk: 186,
						diskUsage: 10,
					},
					{
						isSystemDisk: true,
						capacity: 1907,
						type: 'SSD',
						hddName: 'Intel Raid 0 Volume',
						usedDisk: 380,
						diskUsage: 20,
					},
				],
				cpuUseFrequency: '1.2',
				gpuUsedMemory: '2.68GB',
				memoryUsed: '20.2GB',
				cpuUsage: 18,
				gpuUsage: 2,
				memoryUsage: 31,
			})
		);
		gamingHwinfoMock.getDynamicInformation().then((dynamicInfoRes: any) => {
			JSON.stringify(dynamicInfoRes);
			dynamicInfov = dynamicInfoRes;
			// component.formDynamicInformation(dynamicInfoRes);
			// component.setFormDynamicInformationCache(dynamicInfoRes);
			expect(dynamicInfov.gpuUsage).toEqual(2);
			expect(dynamicInfov.cpuUsage).toEqual(18);
			expect(dynamicInfov.memoryUsage).toEqual(31);
			expect(dynamicInfov.cpuUseFrequency).toEqual('1.2');
			expect(dynamicInfov.memoryUsed).toEqual('20.2GB');
		});
		expect(dynamicInfov).toEqual(undefined);
	});

	it('Should call toggleHDs', () => {
		fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
		component = fixture.debugElement.componentInstance;
		component.hds = [
			{
				isSystemDisk: false,
				capacity: 1863,
				type: 'HDD',
				hddName: 'ST2000LM007-1R8174',
				usedDisk: 186,
				diskUsage: 10,
			},
			{
				isSystemDisk: true,
				capacity: 1907,
				type: 'SSD',
				hddName: 'Intel Raid 0 Volume',
				usedDisk: 380,
				diskUsage: 20,
			},
			{
				isSystemDisk: false,
				capacity: 1907,
				type: 'SSD',
				hddName: 'Intel Raid 1 Volume',
				usedDisk: 380,
				diskUsage: 20,
			},
		];
		component.toggleHDs(true);
		expect(component.showAllHDs).toBeFalse();

		component.toggleHDs(false);
		expect(component.showAllHDs).toBeTrue();
	});

	it('Should call getLeftDeg, getRightDeg, getStackHeight &  getFloorPct', () => {
		fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
		component = fixture.debugElement.componentInstance;

		let result = component.getLeftDeg(1.1);
		expect(result).toBe(180);
		result = component.getLeftDeg(0.6);
		expect(result).toBe(36);
		result = component.getLeftDeg(0.1);
		expect(result).toBe(0);

		result = component.getRightDeg(1.1);
		expect(result).toBe(360);
		result = component.getRightDeg(-0.6);
		expect(result).toBe(0);
		result = component.getRightDeg(0.1);
		expect(result).toBe(36);
		let size = component.getHDSize(100);
		expect(size).toBe('100GB');
		size = component.getHDSize(2000);
		expect(size).toBe('2.00TB');
	});

	it('Should get machine hwcapability', () => {
		gamingHwinfoMock.getMachineHwCapability.and.returnValue(Promise.resolve({cpuInfoVersion: 1, gpuInfoVersion: 1}));
        component.getMachineHwCapability();
		expect(component.hwNewVersionInfo).toEqual(false);
	});

	it('Should get hwover clockState', () => {
		component.hwOverClockInfo = {
			'cpuOverClockInfo': {'isOverClocking': true,isSupportOCFeature: true, localCache: LocalStorageKey.cpuModuleName},
			'gpuOverClockInfo': {'isOverClocking': true,isSupportOCFeature: true, localCache: LocalStorageKey.cpuModuleName},
			'vramOverClockInfo': {'isOverClocking': true,isSupportOCFeature: true, localCache: LocalStorageKey.cpuModuleName}
		};
		gamingHwinfoMock.getHwOverClockState.and.returnValue(Promise.resolve({cpuOverClockInfo: 1, gpuOverClockInfo: 1,vramOverClockInfo:2}));
        component.getHwOverClockState();
		expect(component.hwNewVersionInfo).toEqual(false);
	})

	it('Should unregister overClock state change event', () => {
        component.unRegisterOverClockStateChangeEvent();
		expect(component.unRegisterOverClockStateChangeEvent()).toBeUndefined();
		component.ocStateEvent = {cpuOCState: true,gpuOCState: true,vramOCState: true};
		component.registerOverClockStateChangeEvent();
		expect(component.registerOverClockStateChangeEvent()).toBeUndefined();
		component.onRegisterOverClockStateChangeEvent(component.ocStateEvent);
		expect(component.hwOverClockInfo.cpuOverClockInfo.isOverClocking).toBeUndefined();
	})

});
