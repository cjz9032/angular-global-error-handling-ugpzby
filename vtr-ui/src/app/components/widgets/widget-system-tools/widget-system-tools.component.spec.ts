import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { WidgetSystemToolsComponent } from './widget-system-tools.component';
import { Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// tslint:disable-next-line: no-duplicate-imports
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { HardwareScanService } from 'src/app/beta/hardware-scan/services/hardware-scan/hardware-scan.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
const hardwareScanServiceMock = jasmine.createSpyObj('HardwareScanService', ['isShellAvailable']);
const gamingAllCapabilitiesServiceMock = jasmine.createSpyObj('GamingAllCapabilitiesService', [
	'gamingAllCapabilities',
	'isShellAvailable',
	'getCapabilityFromCache'
]);
fdescribe('WidgetSystemToolsComponent', () => {
	let component: WidgetSystemToolsComponent;
	let fixture: ComponentFixture<WidgetSystemToolsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule.withRoutes([])],
			declarations: [WidgetSystemToolsComponent, mockPipe({ name: 'translate' })],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: HardwareScanService, useValue: hardwareScanServiceMock },
				{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesServiceMock }

			]
		}).compileComponents();
		fixture = TestBed.createComponent(WidgetSystemToolsComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
	}));

	// Checking path for system update title link.
	it('should have path /device/system-updates for System Update title link', async () => {
		const systemUpdate = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
		const systemUpdateValue = systemUpdate.findIndex(su => {
			return su.properties.href === '/device/system-updates';
		});
		expect(systemUpdateValue).toBeGreaterThan(-1);
	});

	// Checking path for Macro Key title link.
	it('should have path /gaming/macrokey for Macro Key title link', async () => {
		const macrokey = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
		const macrokeyValue = macrokey.findIndex(mc => {
			return mc.properties.href === '/gaming/macrokey';
		});
		expect(macrokeyValue).toBeGreaterThan(-2);
	});

	// Checking path for Power title link.
	it('should have path /device/device-settings/power for Power title link', async () => {
		const power = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
		const powerValue = power.findIndex(p => {
			return p.properties.href === '/device/device-settings/power';
		});
		expect(powerValue).toBeGreaterThan(-1);
	});

	// Checking path for Media title link.
	it('should have path /device/device-settings/display-camera for Media title link', async () => {
		const camera = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
		const cameraValue = camera.findIndex(c => {
			return c.properties.href === '/device/device-settings/display-camera';
		});
		expect(cameraValue).toBeGreaterThan(-1);
	});

	it('should have title System Updates', async () => {
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('#systemtools_systemupdates').textContent).toEqual(' gaming.dashboard.device.systemTools.systemUpdate ');
	});

	it('should have title Power', async () => {
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('#systemtools_power').textContent).toEqual(' gaming.dashboard.device.systemTools.power');
	});

	it('should have title Media', async () => {
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('#systemtools_displaycamera').textContent).toEqual(' gaming.dashboard.device.systemTools.media');
	});

	it('should create one', async () => {
		expect(component).toBeTruthy();
	});

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
	})
}
