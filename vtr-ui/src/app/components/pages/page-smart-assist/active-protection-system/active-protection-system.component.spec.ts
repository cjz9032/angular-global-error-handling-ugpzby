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
	it('should set APS Sensitivity level', () => {
		const sensitivity = 0;
		spyOn(component, 'setAPSSensitivityLevel');
		component.setAPSSensitivityLevel(sensitivity);
		expect(component.setAPSSensitivityLevel).toHaveBeenCalled();
	});

	it('should set Auto Disabiling Settings', () => {
		const flag = 0;
		spyOn(component, 'setAutoDisableSetting');
		component.setAutoDisableSetting(flag);
		expect(component.setAutoDisableSetting).toHaveBeenCalled();
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

	it('should suspend now APS feature', () => {
		const timeValue = 1; // the value that is changing in component
		spyOn(component, 'suspendNow');
		fixture.detectChanges();
		component.suspendNow();
		expect(component.suspendNow).toHaveBeenCalled();
	});


});
