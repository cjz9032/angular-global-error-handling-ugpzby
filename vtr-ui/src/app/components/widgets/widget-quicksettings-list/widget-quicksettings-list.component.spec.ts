import { PluginMissingError } from '@lenovo/tan-client-bridge';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WidgetQuicksettingsListComponent } from './widget-quicksettings-list.component';
import { Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AudioService } from 'src/app/services/audio/audio.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceService } from 'src/app/services/device/device.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter } from 'events';


const translateServiceMock = jasmine.createSpyObj('TranslateService', ['isShellAvailable']);
const audioServiceMock = jasmine.createSpyObj('AudioService', ['isShellAvailable', 'getDolbyFeatureStatus', 'setDolbyOnOff']);
const gamingThermalModeServiceMock = jasmine.createSpyObj('GamingThermalModeService', ['isShellAvailable', 'getThermalModeStatus', 'setThermalModeStatus', 'regThermalModeEvent']);
const shellServicesMock = jasmine.createSpyObj('VantageShellService', ['isShellAvailable', 'getSecurityAdvisor', 'getGamingAllCapabilities', 'getVantageToolBar', 'unRegisterEvent', 'registerEvent', 'getSelfSelect', 'getVantageShell', 'getPowerIdeaNoteBook', 'getPowerThinkPad',
	'getPowerItsIntelligentCooling', 'getIntelligentCoolingForIdeaPad', 'macroKeyInitializeEvent', 'macroKeySetApplyStatus', 'getImcHelper', 'getActiveProtectionSystem', 'getKeyboardManagerObject', 'getAdPolicy', 'getSystemUpdate', 'getMetrics']);


const deviceServiceMock = jasmine.createSpyObj('DeviceService', ['isShellAvailable']);
fdescribe('WidgetQuicksettingsListComponent', () => {
	let component: WidgetQuicksettingsListComponent;
	let fixture: ComponentFixture<WidgetQuicksettingsListComponent>;
	gamingThermalModeServiceMock.isShellAvailable.and.returnValue(true);
	// tslint:disable-next-line: no-use-before-declare
	shellServicesMock.getSecurityAdvisor.and.returnValue({ wifiSecurity: emitter(), isLWSEnabled: true });
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetQuicksettingsListComponent,
				mockPipe({ name: 'translate' })],
			imports: [RouterTestingModule],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: GamingThermalModeService, useValue: gamingThermalModeServiceMock },
				{ provide: AudioService, useValue: audioServiceMock },
				{ provide: DeviceService, useValue: deviceServiceMock },
				{ provide: TranslateService, useValue: translateServiceMock },
				{ provide: VantageShellService, useValue: shellServicesMock }

			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetQuicksettingsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	})
	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have default value Balance for thermal mode if localstorage not set', () => {
		expect(component.drop.curSelected).toEqual(2);
	});

	it('should update the thermal mode value on service and in Local storage', fakeAsync((done: any) => {
		const thermalModePromisedData = 2;
		const uiThermalModeValue = component.drop.curSelected;
		const cacheThermalModeValue = component.GetThermalModeCacheStatus();
		gamingThermalModeServiceMock.getThermalModeStatus.and.returnValue(Promise.resolve(uiThermalModeValue));
		component.renderThermalModeStatus();
		tick(10);
		fixture.detectChanges();
		expect(uiThermalModeValue).toEqual(cacheThermalModeValue);
		expect(uiThermalModeValue).toEqual(thermalModePromisedData);
		expect(cacheThermalModeValue).toEqual(thermalModePromisedData);
	}));

	it('Should not have same value in current and previous local storage', fakeAsync(() => {
		const cacheThermalModeValue = component.GetThermalModeCacheStatus();
		const PreCacheThermalModeValue = component.GetThermalModePrevCacheStatus();
		tick(10);
		fixture.detectChanges();
		expect(cacheThermalModeValue).not.toEqual(PreCacheThermalModeValue);
	}));

	it('should give ischecked true after calling set dolby', fakeAsync(() => {
		component.setDolbySettings(true);
		expect(component.quickSettings[3].isChecked).toEqual(false);
	}));

	it('should handle the error', fakeAsync(() => {
		const result = component.handleError({});
		expect(result).toEqual(undefined);
	}));

	it('should register the thermal mode event', fakeAsync(() => {
		component.gamingCapabilities = { smartFanFeature: true };
		fixture.detectChanges();
		tick(10);
		const result = component.registerThermalModeEvent();
		expect(result).toEqual(undefined);
	}));

	it('should call the onToggleStateChanged with dolby', fakeAsync(() => {
		const event = { target: { name: 'gaming.dashboard.device.quickSettings.dolby', value: true } };
		component.onToggleStateChanged(event);
		fixture.detectChanges();
		tick(10);
		const result = component.registerThermalModeEvent();
		expect(result).toEqual(undefined);
	}));

	it('should call the onToggleStateChanged with rapid charge', fakeAsync(() => {
		const event = { target: { name: 'gaming.dashboard.device.quickSettings.rapidCharge', value: true } };
		component.onToggleStateChanged(event);
		fixture.detectChanges();
		tick(10);
		const result = component.registerThermalModeEvent();
		expect(result).toEqual(undefined);
	}));

	it('should call the onToggleStateChanged with Wifi security', fakeAsync(() => {
		const event = { target: { name: 'gaming.dashboard.device.quickSettings.wifiSecurity', value: true } };
		component.onToggleStateChanged(event);
		fixture.detectChanges();
		tick(10);
		const result = component.registerThermalModeEvent();
		expect(result).toEqual(undefined);
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
	return Pipe(metadata)(class MockPipe {
		public transform(query: string, ...args: any[]): any {
			return query;
		}
	});
}

export function emitter(enableStatus = false) {
	class CustomEmitter extends EventEmitter {
		constructor() {
			super();
			this.setMaxListeners(5);
		}
		getWifiState() {
			return Promise.resolve(1);
		}
		refresh() {
			return Promise.resolve();
		}
		getWifiSecurityState() {
			return Promise.resolve();
		}
		cancelGetWifiSecurityState() {
			return Promise.resolve();
		}
		enableWifiSecurity() {
			return Promise.resolve(true);
		}
		disableWifiSecurity() {
			return Promise.resolve(true);
		}
	}
	return new CustomEmitter();

}

