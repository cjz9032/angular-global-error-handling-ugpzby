import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WidgetSystemMonitorComponent } from './widget-system-monitor.component';
import { Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HwInfoService } from 'src/app/services/gaming/gaming-hwinfo/hw-info.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';


xdescribe('WidgetSystemMonitorComponent', () => {
	let component: WidgetSystemMonitorComponent;
	let fixture: ComponentFixture<WidgetSystemMonitorComponent>;
	let timerCallback;
	const gamingAllCapabilitiesServiceMock = jasmine.createSpyObj('GamingAllCapabilitiesService', ['isShellAvailable', 'getCapabilities', 'setCapabilityValuesGlobally', 'getCapabilityFromCache']);
	const gamingHwinfoMock = jasmine.createSpyObj('HwInfoService', ['isShellAvailable', 'getDynamicInformation', 'getMachineInfomation']);

	beforeEach(function () {
		timerCallback = jasmine.createSpy("timerCallback");
		jasmine.clock().install();
		TestBed.configureTestingModule({
			declarations: [WidgetSystemMonitorComponent,
				mockPipe({ name: 'translate' })],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock },
				{ provide: HwInfoService, useValue: gamingHwinfoMock }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(WidgetSystemMonitorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

	});


	afterEach(function () {
		jasmine.clock().uninstall();
	});


	it("causes a timeout to be called", function () {
		setTimeout(function () {
			timerCallback();
		}, 100);

		expect(timerCallback).not.toHaveBeenCalled();

		jasmine.clock().tick(101);

		expect(timerCallback).toHaveBeenCalled();
	});

	it('should update the lightining features for single color', fakeAsync(() => {
		component.getDynamicInfoService();
		fixture.detectChanges();
		gamingHwinfoMock.getDynamicInformation.and.returnValue(Promise.resolve());
		tick(10);
	}));

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
	return <any>Pipe(metadata)(class MockPipe {
		public transform(query: string, ...args: any[]): any {
			return query;
		}
	});
}

