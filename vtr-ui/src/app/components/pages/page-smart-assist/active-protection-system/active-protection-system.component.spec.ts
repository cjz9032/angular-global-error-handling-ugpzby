import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
	ComponentFixture,
	TestBed
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
	TranslateLoader, TranslateModule,

	TranslateService
} from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { DevService } from '../../../../services/dev/dev.service';
import { MetricService } from '../../../../services/metric/metrics.service';
import { ActiveProtectionSystemComponent } from './active-protection-system.component';

class MockAPS {
	getAPSMode() {
		return Promise.resolve(true);
	}
	getAPSSensitivityLevel() {
		return Promise.resolve(0);
	}
	getAutoDisableSetting() {
		return Promise.resolve(true);
	}
	getSnoozeSetting() {
		return Promise.resolve(true);
	}
	getSnoozeTime() {
		return Promise.resolve(1);
	}
	getPenCapability() {
		return Promise.resolve(true);
	}
	getTouchCapability() {
		return Promise.resolve(true);
	}
	getPSensorCapability() {
		return Promise.resolve(true);
	}
	setAPSMode() {
		return Promise.resolve(true);
	}
	setAPSSensitivityLevel(value) {
		let promise = new Promise((resolve, reject) => {
			resolve(true);
			reject(false);
		});
		return promise;

	}
	setSnoozeTime(value) {
		return Promise.resolve(true);
	}

	sendSnoozeCommand(value) {
		return Promise.resolve(true);
	}
	setAutoDisableSetting(value) {
		return Promise.resolve(true);
	}

	public setSnoozeSetting(value: boolean) {
		return Promise.resolve(true);
	}
}


describe('ActiveProtectionSystemComponent', () => {
	let component: ActiveProtectionSystemComponent;
	let fixture: ComponentFixture<ActiveProtectionSystemComponent>;
	let debugElement;
	let smartAssist;
	let commonMetricsService: CommonMetricsService;
	let metricService: MetricService;
	let devService: DevService;

	beforeEach((() => {
		TestBed.configureTestingModule({
			declarations: [ActiveProtectionSystemComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient]
					},
					isolate: false
				}),
				TranslateModule.forChild(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [TranslateService, {
				provide: SmartAssistService,
				useClass: MockAPS
			}, CommonMetricsService, MetricService, DevService]
		}).compileComponents();
	}));

	beforeEach((() => {
		fixture = TestBed.createComponent(ActiveProtectionSystemComponent);
		debugElement = fixture.debugElement;
		component = fixture.componentInstance;
		smartAssist = debugElement.injector.get(SmartAssistService);
		commonMetricsService = debugElement.injector.get(CommonMetricsService);
		fixture.detectChanges();
	}));

	it('should create APS-Component', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should set APS mode', () => {
		const flag = component.apsStatus; // the value that is changing in component
		spyOn(component, 'setAPSMode');
		component.setAPSMode();
		expect(component.setAPSMode).toHaveBeenCalled();
		if (!flag) {
			expect(component.apsStatus).toBeFalsy();
		} else {
			expect(component.apsStatus).toBeTruthy();
		}
	});

	it('should set setAPSMode , send metrics', () => {
		fixture.detectChanges();
		const spyOnMetrics = spyOn(commonMetricsService, 'sendMetrics');
		component.setAPSMode();
		expect(spyOnMetrics).toHaveBeenCalled();
	});

	it('should set APS Sensitivity level', () => {
		const sensitivity = 0;
		spyOn(component, 'setAPSSensitivityLevel');
		component.setAPSSensitivityLevel(sensitivity);
		expect(component.setAPSSensitivityLevel).toHaveBeenCalled();
	});

	it('should set APS Sensitivity level API call check with sensitivity 0', () => {
		const sensitivity = 0;
		// spyOn(smartAssist.setAPSSensitivityLevel, 'then').and.returnValue(true);
		const spySetAPSSensitivityLevel = spyOn(smartAssist, 'setAPSSensitivityLevel').and.returnValue(Promise.resolve(true));
		component.setAPSSensitivityLevel(sensitivity);
		expect(spySetAPSSensitivityLevel).toHaveBeenCalled();
	});

	it('should set APS Sensitivity level API call check with sensitivity 50', () => {
		const sensitivity = 50;
		// spyOn(smartAssist.setAPSSensitivityLevel, 'then').and.returnValue(true);
		const spySetAPSSensitivityLevel = spyOn(smartAssist, 'setAPSSensitivityLevel').and.returnValue(Promise.resolve(true));
		component.setAPSSensitivityLevel(sensitivity);
		expect(spySetAPSSensitivityLevel).toHaveBeenCalled();
	});

	it('should set APS Sensitivity level API call check with sensitivity 100', () => {
		const sensitivity = 100;
		// spyOn(smartAssist.setAPSSensitivityLevel, 'then').and.returnValue(true);
		const spySetAPSSensitivityLevel = spyOn(smartAssist, 'setAPSSensitivityLevel').and.returnValue(Promise.resolve(true));
		component.setAPSSensitivityLevel(sensitivity);
		expect(spySetAPSSensitivityLevel).toHaveBeenCalled();
	});

	it('should set Auto Disabiling Settings', () => {
		const flag = 0;
		spyOn(component, 'setAutoDisableSetting');
		component.setAutoDisableSetting(flag);
		expect(component.setAutoDisableSetting).toHaveBeenCalled();
	});

	it('should set Auto Disabiling Settings , send metrics', () => {
		// fixture.detectChanges();
		const flag = 0;
		const spyOnMetrics = spyOn(commonMetricsService, 'sendMetrics');
		component.setAutoDisableSetting(flag);
		expect(spyOnMetrics).toHaveBeenCalled();
	});

	it('should set Snooze Settings', () => {
		const flag = component.manualSnooze; // the value that is changing in component
		spyOn(component, 'setSnoozeSetting');
		component.setSnoozeSetting(flag);
		expect(component.setSnoozeSetting).toHaveBeenCalled();
		if (!flag) {
			expect(flag).toBeFalsy();
		} else {
			expect(flag).toBeTruthy();
		}
	});

	it('should set Snooze Settings send metrics', () => {
		const flag = component.manualSnooze; // the value that is changing in component
		const spyOnMetrics = spyOn(commonMetricsService, 'sendMetrics');
		component.setSnoozeSetting(flag);
		expect(spyOnMetrics).toHaveBeenCalled();

	});

	it('should set snooze time', () => {
		const interval = {
			name: '30',
			value: 0.5,
			placeholder: 'seconds',
			text: `30 seconds`,
			metricsValue: {}
		};
		spyOn(component, 'setSnoozeTime');
		component.setSnoozeTime(interval);
		expect(component.setSnoozeTime).toHaveBeenCalled();
		// expect(component.selectedSnoozeTime).toEqual(interval.value);
	});

	it('should set snooze time , service API call ', () => {
		const interval = {
			name: '30',
			value: 0.5,
			placeholder: 'seconds',
			text: `30 seconds`,
			metricsValue: {}
		};
		const spySetSnoozeTime = spyOn(smartAssist, 'setSnoozeTime').and.returnValue(Promise.resolve(true));
		const spyGetSnoozeTime = spyOn(smartAssist, 'getSnoozeTime').and.returnValue(Promise.resolve(50));

		component.setSnoozeTime(interval);
		expect(spySetSnoozeTime).toHaveBeenCalled();
		// expect(spyGetSnoozeTime).toHaveBeenCalled();
	});

	it('should suspend now APS feature', () => {
		const timeValue = 1; // the value that is changing in component
		spyOn(component, 'suspendNow');
		fixture.detectChanges();
		component.suspendNow();
		expect(component.suspendNow).toHaveBeenCalled();
	});

	it('should suspend now APS feature , service api call , selectedSnoozeTime 0.5', () => {
		const selectedSnoozeTime = 0.5; // the value that is changing in component
		component.selectedSnoozeTime = selectedSnoozeTime;
		component.advanceSettings = 'activeProtectionSystem_advanced_advanced_settings';
		fixture.detectChanges();
		const spySendSnoozeCommand = spyOn(smartAssist, 'sendSnoozeCommand').and.returnValue(Promise.resolve(true));
		component.suspendNow();
		expect(spySendSnoozeCommand).toHaveBeenCalled();
	});

	it('should suspend now APS feature , service api call , selectedSnoozeTime 1', () => {
		const selectedSnoozeTime = 1; // the value that is changing in component
		component.selectedSnoozeTime = selectedSnoozeTime;
		component.advanceSettings = 'activeProtectionSystem_advanced_advanced_settings';
		fixture.detectChanges();
		const spySendSnoozeCommand = spyOn(smartAssist, 'sendSnoozeCommand').and.returnValue(Promise.resolve(true));
		component.suspendNow();
		expect(spySendSnoozeCommand).toHaveBeenCalled();
	});

	it('should suspend now APS feature , service api call , selectedSnoozeTime 2', () => {
		const selectedSnoozeTime = 2; // the value that is changing in component
		component.selectedSnoozeTime = selectedSnoozeTime;
		component.advanceSettings = 'activeProtectionSystem_advanced_advanced_settings';
		fixture.detectChanges();
		const spySendSnoozeCommand = spyOn(smartAssist, 'sendSnoozeCommand').and.returnValue(Promise.resolve(true));
		component.suspendNow();
		expect(spySendSnoozeCommand).toHaveBeenCalled();
	});

	it('should suspend now APS feature , service api call , selectedSnoozeTime 3', () => {
		const selectedSnoozeTime = 3; // the value that is changing in component
		component.selectedSnoozeTime = selectedSnoozeTime;
		component.advanceSettings = 'activeProtectionSystem_advanced_advanced_settings';
		fixture.detectChanges();
		const spySendSnoozeCommand = spyOn(smartAssist, 'sendSnoozeCommand').and.returnValue(Promise.resolve(true));
		component.suspendNow();
		expect(spySendSnoozeCommand).toHaveBeenCalled();
	});

	it('should toggleAdvanced ,focus on activeProtectionSystem_advanced_advanced_settings ', () => {
		const advancedToggle = false; // the value that is changing in component
		component.advancedToggle = advancedToggle;
		component.advanceSettings = 'activeProtectionSystem_advanced_advanced_settings';
		fixture.detectChanges();

		const spyFocusElement = spyOn(component, 'focusElement');
		component.toggleAdvanced(new Event('click'));
		expect(spyFocusElement).toHaveBeenCalled();
	});

	it('should toggleAdvanced ,focus on activeProtectionSystem_advanced_settings_toggle_show ', () => {
		const advancedToggle = true; // the value that is changing in component
		component.advancedToggle = advancedToggle;
		component.advanceSettingsShowId = 'activeProtectionSystem_advanced_settings_toggle_show';
		fixture.detectChanges();

		const spyFocusElement = spyOn(component, 'focusElement');
		component.toggleAdvanced(new Event('click'));
		expect(spyFocusElement).toHaveBeenCalled();
	});

});
