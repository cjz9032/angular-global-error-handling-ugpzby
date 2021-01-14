import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Pipe, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { WidgetSystemToolsComponent } from './widget-system-tools.component';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';
import { GamingThirdPartyAppService } from 'src/app/services/gaming/gaming-thirdparty-app/gaming-third-party-app.service';
import { GAMING_DATA } from 'src/testing/gaming-data';


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
	let nahimicFeatureCache = false;

	const commonServiceMock = {
		getCapabalitiesNotification: () => {
			const res = {
				type: '[Gaming] GamingCapabilities',
				payload: {
					macroKeyFeature: macroKeyFeatureCache,
				},
			};
			return of(res);
		},
	};
	const localCacheServiceMock = {
		getLocalCacheValue: (key: any, defaultValue?: any) => {
			switch (key) {
				case '[LocalStorageKey] HardwareScanFeature':
					return hardwareScanFeatureCache;
				case '[LocalStorageKey] AccessoryFeature':
					return accessoryFeatureCache;
				case '[LocalStorageKey] Nahicim':
					return nahimicFeatureCache;
			}
		},
		setLocalCacheValue: (key: any, value: any) => {
			switch (key) {
				case '[LocalStorageKey] HardwareScanFeature':
					hardwareScanFeatureCache = value;
					break;
				case '[LocalStorageKey] AccessoryFeature':
					accessoryFeatureCache = value;
					break;
				case '[LocalStorageKey] Nahicim':
					nahimicFeatureCache = value;
					break;
			}
		},
	};
	const gamingAllCapabilitiesServiceMock = {
		isShellAvailable: true,
		getCapabilityFromCache: (key: any) => {
			switch (key) {
				case '[LocalStorageKey] MacroKeyFeature':
					return macroKeyFeatureCache;
			}
		},
	};

	const hardwareScanServiceSpy = jasmine.createSpyObj('HardwareScanService', ['isAvailable']);
	const gamingThirdPartyAppServiceSpy = jasmine.createSpyObj('GamingThirdPartyAppService', [
		'isLACSupportUriProtocol',
		'launchThirdPartyApp',
	]);

	hardwareScanServiceSpy.isAvailable.and.returnValue(Promise.resolve(false));
	gamingThirdPartyAppServiceSpy.isLACSupportUriProtocol.and.returnValue(Promise.resolve(false));

	describe('macroKey', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [RouterTestingModule.withRoutes([])],
				declarations: [WidgetSystemToolsComponent, GAMING_DATA.mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: gamingAllCapabilitiesServiceMock,
					},
					{ provide: HardwareScanService, useValue: hardwareScanServiceSpy },
					{ provide: GamingThirdPartyAppService, useValue: gamingThirdPartyAppServiceSpy },
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
			const macrokeyValue = macrokey.findIndex((mc) => mc.properties.href === '/gaming/macrokey');
			expect(macrokeyValue).toBe(1);
		});
	});

	describe('hardwareScan', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [RouterTestingModule.withRoutes([])],
				declarations: [WidgetSystemToolsComponent, GAMING_DATA.mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: gamingAllCapabilitiesServiceMock,
					},
					{ provide: HardwareScanService, useValue: hardwareScanServiceSpy },
					{ provide: GamingThirdPartyAppService, useValue: gamingThirdPartyAppServiceSpy },
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
			const hardwareScanValue = hardwareScan.findIndex((res) => res.properties.href === '/hardware-scan');
			expect(hardwareScanValue).toBe(3);
		});
	});

	describe('legionAccessory', () => {
		let modalService: any;
		beforeEach(waitForAsync(() => {
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
						useValue: gamingAllCapabilitiesServiceMock,
					},
					{ provide: HardwareScanService, useValue: hardwareScanServiceSpy },
					{ provide: GamingThirdPartyAppService, useValue: gamingThirdPartyAppServiceSpy },
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
			gamingThirdPartyAppServiceSpy.isLACSupportUriProtocol.and.returnValue(
				Promise.resolve(false)
			);
			gamingThirdPartyAppServiceSpy.launchThirdPartyApp.and.returnValue(Promise.resolve(false));
		});

		it('ngOnInit not support third party app', () => {
			expect(component.showLegionAccessory).toBe(false);
			expect(component.showNahimic).toBe(false);
			expect(component.toolLength).toBe(3);
		});

		it('ngOnInit third party app', fakeAsync(() => {
			gamingThirdPartyAppServiceSpy.isLACSupportUriProtocol.and.returnValue(
				Promise.resolve(true)
			);
			accessoryFeatureCache = false;
			nahimicFeatureCache = false;
			component.ngOnInit();
			tick();
			expect(component.showLegionAccessory).toBe(true, `showLegionAccessory should be true`);
			expect(component.showNahimic).toBe(true, `showNahimic should be true`);
			expect(component.toolLength).toBe(6, `appList length shoulde be 6`);
			expect(accessoryFeatureCache).toBe(true, `accessory cache should be true`);
			expect(nahimicFeatureCache).toBe(true, `nahimic cache should be true`);
		}));

		it('launchThirdPartyApp', fakeAsync(() => {
			gamingThirdPartyAppServiceSpy.isLACSupportUriProtocol.and.returnValue(
				Promise.resolve(true)
			);
			gamingThirdPartyAppServiceSpy.launchThirdPartyApp.and.returnValue(Promise.resolve(true));
			spyOn(component, 'openWaringModal').and.callFake(() => {});
			expect(component.openWaringModal).toHaveBeenCalledTimes(0);
			component.launchThirdPartyApp('accessory');
			tick();
			expect(component.openWaringModal).toHaveBeenCalledTimes(0);

			gamingThirdPartyAppServiceSpy.isLACSupportUriProtocol.and.returnValue(
				Promise.resolve(true)
			);
			gamingThirdPartyAppServiceSpy.launchThirdPartyApp.and.returnValue(Promise.resolve(false));
			expect(component.openWaringModal).toHaveBeenCalledTimes(0);
			component.launchThirdPartyApp('accessory');
			tick();
			expect(component.openWaringModal).toHaveBeenCalledTimes(0);

			gamingThirdPartyAppServiceSpy.isLACSupportUriProtocol.and.returnValue(
				Promise.resolve(false)
			);
			gamingThirdPartyAppServiceSpy.launchThirdPartyApp.and.returnValue(Promise.resolve(undefined));
			expect(component.openWaringModal).toHaveBeenCalledTimes(0);
			component.launchThirdPartyApp('accessory');
			tick();
			expect(component.openWaringModal).toHaveBeenCalledTimes(1);
		}));

		it('launchThirdPartyApp error', () => {
			gamingThirdPartyAppServiceSpy.isLACSupportUriProtocol.and.throwError(
				'launchThirdPartyApp error'
			);
			try {
				component.launchThirdPartyApp('accessory');
			} catch (error) {
				expect(error).toMatch('launchThirdPartyApp error');
			}
		});

		it('openWaringModal', () => {
			const modalRef = new ModalGamingPromptStubComponent();
			spyOn(modalService, 'open').and.returnValue(modalRef);
			spyOn(window, 'open').and.callFake(() => null);
			expect(modalService.open).toHaveBeenCalledTimes(0);
			expect(window.open).toHaveBeenCalledTimes(0);

			modalRef.componentInstance.emitService = of(0);
			component.openWaringModal('accessory');
			expect(modalService.open).toHaveBeenCalledTimes(1);
			expect(window.open).toHaveBeenCalledTimes(0);

			modalRef.componentInstance.emitService = of(1);
			component.openWaringModal('accessory');
			expect(modalService.open).toHaveBeenCalledTimes(2);
			expect(window.open).toHaveBeenCalledTimes(1);
		});
	});

	describe('systemUpdate & power & media', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [RouterTestingModule.withRoutes([])],
				declarations: [WidgetSystemToolsComponent, GAMING_DATA.mockPipe({ name: 'translate' })],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: HttpHandler },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: LocalCacheService, useValue: localCacheServiceMock },
					{
						provide: GamingAllCapabilitiesService,
						useValue: gamingAllCapabilitiesServiceMock,
					},
					{ provide: HardwareScanService, useValue: hardwareScanServiceSpy },
					{ provide: GamingThirdPartyAppService, useValue: gamingThirdPartyAppServiceSpy },
				],
			}).compileComponents();
			fixture = TestBed.createComponent(WidgetSystemToolsComponent);
			component = fixture.debugElement.componentInstance;
			fixture.detectChanges();
		}));

		// Checking path for system update title link.
		it('should have path /device/system-updates for System Update title link', async () => {
			const systemUpdate = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
			const systemUpdateValue = systemUpdate.findIndex((su) => su.properties.href === '/device/system-updates');
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
			const powerValue = power.findIndex((p) => p.properties.href === '/device/device-settings/power');
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
			const cameraValue = camera.findIndex((c) => c.properties.href === '/device/device-settings/display-camera');
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


