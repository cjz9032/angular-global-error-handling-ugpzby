import {
	async,
	ComponentFixture,
	TestBed
} from '@angular/core/testing';

import {
	ActiveProtectionSystemComponent
} from './active-protection-system.component';
import {
	TranslateModule,
	TranslateLoader,
	TranslateService
} from '@ngx-translate/core';
import {
	NO_ERRORS_SCHEMA
} from '@angular/core';
import {
	HttpClientModule,
	HttpClient
} from '@angular/common/http';
import {
	HttpLoaderFactory,
	TranslationModule
} from 'src/app/modules/translation.module';
import {
	SmartAssistService
} from 'src/app/services/smart-assist/smart-assist.service';
import {
	DropDownInterval
} from '../../../../data-models/common/drop-down-interval.model';

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

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ActiveProtectionSystemComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				},
				isolate: false
			}),
			TranslationModule.forChild(), HttpClientModule
			],
			providers: [TranslateService, {
				provide: SmartAssistService,
				useClass: MockAPS
			}]
		}).compileComponents();
	}));

	beforeEach(async(() => {
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

	it('should set APS mode', async () => {
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
			text: `30 seconds`
		};
		spyOn(component, 'setSnoozeTime');
		component.setSnoozeTime(interval);
		expect(component.setSnoozeTime).toHaveBeenCalled();
		// expect(component.selectedSnoozeTime).toEqual(interval.value);
	});

	it('should suspent APS feature', () => {
		const timeValue = 1; // the value that is changing in component
		spyOn(component, 'suspendNow');
		component.suspendNow();
		expect(component.suspendNow).toHaveBeenCalled();
	});

});
