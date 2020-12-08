import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { WidgetSystemMonitorComponent } from './widget-system-monitor.component';
import { Pipe, NO_ERRORS_SCHEMA} from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HwInfoService } from 'src/app/services/gaming/gaming-hwinfo/hw-info.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

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
]);

describe('WidgetSystemMonitorComponent', () => {
	let component: WidgetSystemMonitorComponent;
	let fixture: ComponentFixture<WidgetSystemMonitorComponent>;
	let timerCallback;

	beforeEach(() => {
		timerCallback = jasmine.createSpy('timerCallback');
		jasmine.clock().install();
		TestBed.configureTestingModule({
			declarations: [WidgetSystemMonitorComponent, mockPipe({ name: 'translate' })],
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
		let infoLink: any = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
		infoLink = infoLink.findIndex((c) => {
			return c.properties.href === '/device';
		});
		expect(infoLink).toEqual(-1);
	});

	it('Should have title GPU, CPU, RAM', () => {
		fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
		fixture.detectChanges();
		const changedComponent = fixture.debugElement.nativeElement;
		expect(changedComponent.querySelector('div.stack-title').textContent).toEqual(' GPU ');
		expect(changedComponent.querySelector('div.cpu-title').textContent).toEqual(' CPU ');
		expect(
			changedComponent.querySelector('div.ram>div.monitor-stack>div.stack-label>div.stack-title')
				.textContent
		).toEqual(' RAM ');
	});

	it('Should mock the Hwinfoservice to get cpuMax, cpuModuleName, gpuMax, gpuModuleName, ramMax & ramOver using getMachineInfomation function', () => {
		let hwInfo = {
			cpuBaseFrequence: '2.9GHz',
			cpuModuleName: 'Intel(R) Core(TM) i7-7820HK CPU @ 2.90GHz',
			gpuMemorySize: '8GB',
			gpuModuleName: 'NVIDIA GeForce GTX 1070',
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
				gpuModuleName: 'NVIDIA GeForce GTX 1070',
				memorySize: '64.0GB',
				memoryModuleName: 'Samsung',
			})
		);
		gamingHwinfoMock.getMachineInfomation().then((hwInfoRes: any) => {
			JSON.stringify(hwInfoRes);
			hwInfo = hwInfoRes;
			component.getMachineInfoService();
			// expect(hwInfoRes.cpuBaseFrequency).toEqual('2.9');
			expect(hwInfoRes.cpuModuleName).toEqual('Intel(R) Core(TM) i7-7820HK CPU @ 2.90GHz');
			expect(hwInfoRes.gpuMemorySize).toEqual('8GB');
			expect(hwInfoRes.gpuModuleName).toEqual('NVIDIA GeForce GTX 1070');
			expect(hwInfoRes.memorySize).toEqual('64.0GB');
			expect(hwInfoRes.memoryModuleName).toEqual('Samsung');
		});
		expect(hwInfo.cpuBaseFrequence).toEqual('2.9GHz');
		expect(hwInfo.cpuModuleName).toEqual('Intel(R) Core(TM) i7-7820HK CPU @ 2.90GHz');
		expect(hwInfo.gpuMemorySize).toEqual('8GB');
		expect(hwInfo.gpuModuleName).toEqual('NVIDIA GeForce GTX 1070');
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
			component.formDynamicInformation(dynamicInfoRes);
			component.setFormDynamicInformationCache(dynamicInfoRes);
			expect(dynamicInfov.gpuUsage).toEqual(2);
			expect(dynamicInfov.cpuUsage).toEqual(18);
			expect(dynamicInfov.memoryUsage).toEqual(31);
			expect(dynamicInfov.cpuUseFrequency).toEqual('1.2');
			expect(dynamicInfov.memoryUsed).toEqual('20.2GB');
		});
		expect(dynamicInfov).toEqual(undefined);
	});
});

/**
 * @param options pipeName which has to be mock
 * @description To mock the pipe.
 * @summary This has to move to one utils file.
 */
export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name,
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	) as any;
}
