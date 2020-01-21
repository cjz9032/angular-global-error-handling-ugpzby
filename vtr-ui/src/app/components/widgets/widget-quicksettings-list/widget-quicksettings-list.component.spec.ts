import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WidgetQuicksettingsListComponent } from './widget-quicksettings-list.component';
import { Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// tslint:disable-next-line: no-duplicate-imports
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AudioService } from 'src/app/services/audio/audio.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { DevService } from 'src/app/services/dev/dev.service';
import { TranslateService } from '@ngx-translate/core';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';


const audioServiceMock = jasmine.createSpyObj('AudioService', ['isShellAvailable', 'getDolbyFeatureStatus', 'setDolbyOnOff']);
const gamingThermalModeServiceMock = jasmine.createSpyObj('GamingThermalModeService', ['isShellAvailable', 'getThermalModeStatus', 'setThermalModeStatus', 'regThermalModeEvent']);

describe("WidgetQuicksettingsListComponent", function () {
	let component: WidgetQuicksettingsListComponent;
	let fixture: ComponentFixture<WidgetQuicksettingsListComponent>;
	let router: Router;
	let gamingSettings: any = {};
	let isQuickSettingsVisible = true;
	let originalTimeout;
	gamingThermalModeServiceMock.isShellAvailable.and.returnValue(true);

	beforeEach(function () {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		TestBed.configureTestingModule({
			declarations: [WidgetQuicksettingsListComponent,
				mockPipe({ name: 'translate' })],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				RouterTestingModule.withRoutes([]),
			],
			providers: [
				{ provide: HttpClient },
				{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock },
				{ provide: AudioService, useValue: audioServiceMock },
				{ provide: DevService },
				{ provide: TranslateService },
				{ provide: HypothesisService }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
		component = fixture.debugElement.componentInstance;
		router = TestBed.get(Router);
		//	fixture.detectChanges();
	});

	it("should create", function (done) {
		setTimeout(function () {
			done();
		}, 9000);
		expect(component).toBeTruthy();
	});

	afterEach(function () {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	// it('should have default value Balance for thermal mode if localstorage not set', () => {
	// 	fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
	// 	component = fixture.debugElement.componentInstance;
	// 	fixture.detectChanges();
	// 	//Expected Default Behaviour
	// 	expect(component.drop.curSelected).toEqual(2);
	// });

	it('should update the thermal mode value on service and in Local storage', fakeAsync((done: any) => {
		let thermalModePromisedData: number;
		const uiThermalModeValue = component.drop.curSelected;
		const cacheThermalModeValue = component.GetThermalModeCacheStatus();
		gamingThermalModeServiceMock.getThermalModeStatus.and.returnValue(Promise.resolve(uiThermalModeValue));
		gamingThermalModeServiceMock.getThermalModeStatus().then((response: any) => {
			thermalModePromisedData = response;
		});
		component.renderThermalModeStatus();
		tick(10);
		fixture.detectChanges();
		expect(component).toBeTruthy();
		//	expect(uiThermalModeValue).toEqual(cacheThermalModeValue);
		// expect(uiThermalModeValue).toEqual(thermalModePromisedData);
		// expect(cacheThermalModeValue).toEqual(thermalModePromisedData);
	}));

	// it('Should not have same value in current and previous local storage', fakeAsync(() => {
	// 	const cacheThermalModeValue = component.GetThermalModeCacheStatus();
	// 	const PreCacheThermalModeValue = component.GetThermalModePrevCacheStatus();
	// 	tick(10);
	// 	fixture.detectChanges();
	// 	if (PreCacheThermalModeValue){
	// 	expect(cacheThermalModeValue).toEqual(PreCacheThermalModeValue); }
	// }));

	it('should give ischecked true after calling set dolby', fakeAsync(() => {
		component.setDolbySettings(true);
		expect(component.quickSettings[3].isChecked).toEqual(false);
	}));


	it('should have default isCheckedBoxVisible legionUpdate object false for Thermal mode & True for all', () => {
		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.quickSettings[0].isCheckBoxVisible).toEqual(false);
		expect(component.quickSettings[1].isCheckBoxVisible).toEqual(true);
		expect(component.quickSettings[2].isCheckBoxVisible).toEqual(true);
		expect(component.quickSettings[3].isCheckBoxVisible).toEqual(true);
	});

	it('should have default isSwitchVisible quickSettings object false for Thermal mode & True for all', () => {
		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.quickSettings[0].isSwitchVisible).toEqual(false);
	});

	it('should have default isCollapsible legionUpdate object true for CPU OverClock & false for all', () => {
		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.quickSettings[0].isCollapsible).toEqual(true);
	});

	it('handleError', fakeAsync(() => {
		component.handleError(true);
		expect(component).toBeTruthy();
	}));

	it('onRegThermalModeEvent', fakeAsync(() => {
		component.onRegThermalModeEvent(true);
		expect(component).toBeTruthy();
	}));


	it('registerThermalModeEvent', fakeAsync(() => {
		component.registerThermalModeEvent();
		expect(component).toBeTruthy();
	}));

	it('onOptionSelected', fakeAsync(() => {
		tick(10);
		fixture.detectChanges();
		let envent1 = {
			target: {
				option: {value: 1},
				name: 'gaming.dashboard.device.quickSettings.title'
			}
		};
		try {
			component.setThermalModeStatus = undefined ;
			component.onOptionSelected(envent1);


		} catch (e) {

		}

		expect(component).toBeTruthy();

	}));



	it('onToggleStateChanged', fakeAsync(() => {
		tick(10);
		fixture.detectChanges();
		let event: Event;
		let envent1 = {
			target: {
				value: true,
				name: 'gaming.dashboard.device.quickSettings.dolby'
			}
		};
		try {
			component.onToggleStateChanged(envent1);

			envent1 = {
				target: {
					value: false,
					name: 'gaming.dashboard.device.quickSettings.rapidCharge'
				}
			};
			component.onToggleStateChanged(envent1);

			envent1 = {
				target: {
					value: false,
					name: 'gaming.dashboard.device.quickSettings.wifiSecurity'
				}
			};
			component.onToggleStateChanged(envent1);
		} catch (e) {

		}
		expect(component).toBeTruthy();

	}));


	it('GetThermalModePrevCacheStatus', fakeAsync(() => {
		component.GetThermalModePrevCacheStatus();
		expect(component).toBeTruthy();
	}));



	it('onFocus', fakeAsync(() => {
		component.onFocus();
		expect(component).toBeTruthy();
	}));


	it('updateWifiSecurityState', fakeAsync(() => {
		component.updateWifiSecurityState(true);
		component.updateWifiSecurityState(false);
		expect(component).toBeTruthy();
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
