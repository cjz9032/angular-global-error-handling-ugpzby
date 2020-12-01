import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Pipe, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateStore } from '@ngx-translate/core';

// eslint-disable-next-line no-duplicate-imports
import { TranslationModule } from 'src/app/modules/translation.module';
import { WidgetSystemToolsComponent } from './widget-system-tools.component';

import { CommonService } from 'src/app/services/common/common.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';
import { GamingAccessoryService } from 'src/app/services/gaming/gaming-accessory/gaming-accessory.service';

@Component({ selector: 'vtr-modal-gaming-prompt', template: '' })
export class ModalGamingPromptStubComponent {
	componentInstance = {
		title: undefined,
		description: undefined,
		description2: undefined,
		description3: undefined,
		comfirmButton: undefined,
		cancelButton: undefined,
		emitService: of(1),
	};
}

describe('WidgetSystemToolsComponent', () => {
	let component: WidgetSystemToolsComponent;
	let fixture: ComponentFixture<WidgetSystemToolsComponent>;

	let macroKeyFeatureCache = false;
	let hardwareScanFeatureCache = false;
	let accessoryFeatureCache = false;

	let commonServiceMock = {
		getCapabalitiesNotification() {
			let res = {
				type: '[Gaming] GamingCapabilities',
				payload: {
					macroKeyFeature: macroKeyFeatureCache,
				},
			};
			return of(res);
		},
	};
	let localCacheServiceMock = {
		getLocalCacheValue(key: any, defaultValue?: any) {
			switch (key) {
				case '[LocalStorageKey] HardwareScanFeature':
					return hardwareScanFeatureCache;
				case '[LocalStorageKey] AccessoryFeature':
					return accessoryFeatureCache;
			}
		},
		setLocalCacheValue(key: any, value: any) {
			switch (key) {
				case '[LocalStorageKey] HardwareScanFeature':
					hardwareScanFeatureCache = value;
					break;
				case '[LocalStorageKey] AccessoryFeature':
					accessoryFeatureCache = value;
					break;
			}
		},
	};
	let GamingAllCapabilitiesServiceMock = {
		isShellAvailable: true,
		getCapabilityFromCache(key: any) {
			switch (key) {
				case '[LocalStorageKey] MacroKeyFeature':
					return macroKeyFeatureCache;
			}
		},
	};

	let hardwareScanServiceSpy = jasmine.createSpyObj('HardwareScanService', ['isAvailable']);
	let gamingAccessoryServiceSpy = jasmine.createSpyObj('GamingAccessoryService', [
		'isLACSupportUriProtocol',
		'launchAccessory',
	]);

	hardwareScanServiceSpy.isAvailable.and.returnValue(Promise.resolve(false));
	gamingAccessoryServiceSpy.isLACSupportUriProtocol.and.returnValue(Promise.resolve(false));

	describe('macroKey', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [RouterTestingModule.withRoutes([])],
				declarations: [WidgetSystemToolsComponent, mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: GamingAllCapabilitiesServiceMock,
					},
					{ provide: HardwareScanService, useValue: hardwareScanServiceSpy },
					{ provide: GamingAccessoryService, useValue: gamingAccessoryServiceSpy },
				],
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetSystemToolsComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			macroKeyFeatureCache = false;
			hardwareScanFeatureCache = false;
			accessoryFeatureCache = false;
		});

		it('ngOnInit not support macroKey', () => {
			expect(component.gamingProperties.macroKeyFeature).toBe(
				false,
				`not support macrokey, component.gamingProperties.macroKeyFeature should keep false`
			);
			expect(component.toolLength).toBe(
				3,
				`not support macrokey, component.toolLength should keep 3`
			);
		});

		it('ngOnInit macroKey', () => {
			macroKeyFeatureCache = true;
			component.ngOnInit();
			expect(component.gamingProperties.macroKeyFeature).toBe(
				true,
				`macroKey supported, component.gamingProperties.macroKeyFeature should be true`
			);
			expect(component.toolLength).toBe(
				4,
				`macrokey supported, component.toolLength should be 4`
			);
		});

		// Checking path for Macro Key title link.
		it('should have path /gaming/macrokey for Macro Key title link', () => {
			macroKeyFeatureCache = true;
			component.ngOnInit();
			fixture.detectChanges();
			const macrokey = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
			const macrokeyValue = macrokey.findIndex((mc) => {
				return mc.properties.href === '/gaming/macrokey';
			});
			expect(macrokeyValue).toBe(1);
		});
	});

	describe('hardwareScan', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [RouterTestingModule.withRoutes([])],
				declarations: [WidgetSystemToolsComponent, mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: GamingAllCapabilitiesServiceMock,
					},
					{ provide: HardwareScanService, useValue: hardwareScanServiceSpy },
					{ provide: GamingAccessoryService, useValue: gamingAccessoryServiceSpy },
				],
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetSystemToolsComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			macroKeyFeatureCache = false;
			hardwareScanFeatureCache = false;
			accessoryFeatureCache = false;
			hardwareScanServiceSpy.isAvailable.and.returnValue(Promise.resolve(false));
		});

		it('ngOnInit not support hardwareScan', () => {
			expect(component.showHWScanMenu).toBe(false);
			expect(component.toolLength).toBe(3);
		});

		it('ngOnInit hardwareScan', fakeAsync(() => {
			hardwareScanServiceSpy.isAvailable.and.returnValue(Promise.resolve(true));
			hardwareScanFeatureCache = false;
			component.ngOnInit();
			tick();
			expect(component.showHWScanMenu).toBe(true);
			expect(component.toolLength).toBe(4);
			expect(hardwareScanFeatureCache).toBe(true);
		}));

		it('ngOnInit hardwareScan error', fakeAsync(() => {
			hardwareScanServiceSpy.isAvailable.and.returnValue(
				Promise.reject('hardwareScan error')
			);
			component.showHWScanMenu = true;
			expect(component.showHWScanMenu).toBe(true);
			component.ngOnInit();
			tick();
			expect(component.showHWScanMenu).toBe(false);
		}));

		// Checking path for hardwareScan title link.
		it('should have path /hardware-scan for hardwareScan title link', () => {
			hardwareScanFeatureCache = true;
			component.ngOnInit();
			fixture.detectChanges();
			const hardwareScan = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
			const hardwareScanValue = hardwareScan.findIndex((res) => {
				return res.properties.href === '/hardware-scan';
			});
			expect(hardwareScanValue).toBe(3);
		});
	});

	describe('legionAccessory', () => {
		let modalService: any;
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [TranslationModule, RouterTestingModule.withRoutes([])],
				declarations: [WidgetSystemToolsComponent, ModalGamingPromptStubComponent],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					NgbModal,
					TranslateStore,
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: GamingAllCapabilitiesServiceMock,
					},
					{ provide: HardwareScanService, useValue: hardwareScanServiceSpy },
					{ provide: GamingAccessoryService, useValue: gamingAccessoryServiceSpy },
				],
			}).compileComponents();
			modalService = TestBed.inject(NgbModal);
			fixture = TestBed.createComponent(WidgetSystemToolsComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		afterEach(() => {
			macroKeyFeatureCache = false;
			hardwareScanFeatureCache = false;
			accessoryFeatureCache = false;
			gamingAccessoryServiceSpy.isLACSupportUriProtocol.and.returnValue(
				Promise.resolve(false)
			);
			gamingAccessoryServiceSpy.launchAccessory.and.returnValue(Promise.resolve(false));
		});

		it('ngOnInit not support legionAccessory', () => {
			expect(component.showLegionAccessory).toBe(false);
			expect(component.toolLength).toBe(3);
		});

		it('ngOnInit legionAccessory', fakeAsync(() => {
			gamingAccessoryServiceSpy.isLACSupportUriProtocol.and.returnValue(
				Promise.resolve(true)
			);
			accessoryFeatureCache = false;
			component.ngOnInit();
			tick();
			expect(component.showLegionAccessory).toBe(true);
			expect(component.toolLength).toBe(4);
			expect(accessoryFeatureCache).toBe(true);
		}));

		it('launchAccessory', fakeAsync(() => {
			gamingAccessoryServiceSpy.isLACSupportUriProtocol.and.returnValue(
				Promise.resolve(true)
			);
			gamingAccessoryServiceSpy.launchAccessory.and.returnValue(Promise.resolve(true));
			spyOn(component, 'openWaringModal').and.callFake(() => {});
			expect(component.openWaringModal).toHaveBeenCalledTimes(0);
			component.launchAccessory();
			tick();
			expect(component.openWaringModal).toHaveBeenCalledTimes(0);

			gamingAccessoryServiceSpy.isLACSupportUriProtocol.and.returnValue(
				Promise.resolve(true)
			);
			gamingAccessoryServiceSpy.launchAccessory.and.returnValue(Promise.resolve(false));
			expect(component.openWaringModal).toHaveBeenCalledTimes(0);
			component.launchAccessory();
			tick();
			expect(component.openWaringModal).toHaveBeenCalledTimes(0);

			gamingAccessoryServiceSpy.isLACSupportUriProtocol.and.returnValue(
				Promise.resolve(false)
			);
			gamingAccessoryServiceSpy.launchAccessory.and.returnValue(Promise.resolve(undefined));
			expect(component.openWaringModal).toHaveBeenCalledTimes(0);
			component.launchAccessory();
			tick();
			expect(component.openWaringModal).toHaveBeenCalledTimes(1);
		}));

		it('launchAccessory error', () => {
			gamingAccessoryServiceSpy.isLACSupportUriProtocol.and.throwError(
				'launchAccessory error'
			);
			try {
				component.launchAccessory();
			} catch (error) {
				expect(error).toMatch('launchAccessory error');
			}
		});

		it('openWaringModal', () => {
			let modalRef = new ModalGamingPromptStubComponent();
			spyOn(modalService, 'open').and.returnValue(modalRef);
			spyOn(window, 'open').and.callFake(() => {
				return null;
			});
			expect(modalService.open).toHaveBeenCalledTimes(0);
			expect(window.open).toHaveBeenCalledTimes(0);

			modalRef.componentInstance.emitService = of(0);
			component.openWaringModal();
			expect(modalService.open).toHaveBeenCalledTimes(1);
			expect(window.open).toHaveBeenCalledTimes(0);

			modalRef.componentInstance.emitService = of(1);
			component.openWaringModal();
			expect(modalService.open).toHaveBeenCalledTimes(2);
			expect(window.open).toHaveBeenCalledTimes(1);
		});
	});

	describe('systemUpdate & power & media', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [RouterTestingModule.withRoutes([])],
				declarations: [WidgetSystemToolsComponent, mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: GamingAllCapabilitiesServiceMock,
					},
					{ provide: HardwareScanService, useValue: hardwareScanServiceSpy },
					{ provide: GamingAccessoryService, useValue: gamingAccessoryServiceSpy },
				],
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetSystemToolsComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		// Checking path for system update title link.
		it('should have path /device/system-updates for System Update title link', async () => {
			const systemUpdate = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
			const systemUpdateValue = systemUpdate.findIndex((su) => {
				return su.properties.href === '/device/system-updates';
			});
			expect(systemUpdateValue).toBeGreaterThan(-1);
		});

		it('should have title System Updates', async () => {
			fixture.detectChanges();
			const compiled = fixture.debugElement.nativeElement;
			expect(
				compiled.querySelector('#gaming_dashboard_systemtools_systemupdates').textContent
			).toEqual(' gaming.dashboard.device.systemTools.systemUpdate ');
		});

		// Checking path for Power title link.
		it('should have path /device/device-settings/power for Power title link', async () => {
			const power = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
			const powerValue = power.findIndex((p) => {
				return p.properties.href === '/device/device-settings/power';
			});
			expect(powerValue).toBeGreaterThan(-1);
		});

		it('should have title Power', async () => {
			fixture.detectChanges();
			const compiled = fixture.debugElement.nativeElement;
			expect(
				compiled.querySelector('#gaming_dashboard_systemtools_power').textContent
			).toEqual(' gaming.dashboard.device.systemTools.power');
		});

		// Checking path for Media title link.
		it('should have path /device/device-settings/display-camera for Media title link', async () => {
			const camera = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
			const cameraValue = camera.findIndex((c) => {
				return c.properties.href === '/device/device-settings/display-camera';
			});
			expect(cameraValue).toBeGreaterThan(-1);
		});

		it('should have title Media', async () => {
			fixture.detectChanges();
			const compiled = fixture.debugElement.nativeElement;
			expect(
				compiled.querySelector('#gaming_dashboard_systemtools_displaycamera').textContent
			).toEqual(' gaming.dashboard.device.systemTools.media');
		});
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
	return <any>Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}
