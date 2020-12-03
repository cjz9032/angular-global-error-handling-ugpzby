import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BatteryTemperatureComponent } from './battery-temperature.component';
import SpyObj = jasmine.SpyObj;
import { BatteryHealthService } from '../battery-health.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
	BatteryHealthLevel,
	BatteryHealthTip,
	BatteryLifeSpan,
	BatteryTemperatureStatus,
} from '../battery-health.enum';
import { Observable, of } from 'rxjs';
import { Conditions } from './condition-class.enum';
import { BatteryHealthResponse } from '../battery-health.interface';

describe('BatteryTemperatureComponent', () => {
	let component: BatteryTemperatureComponent;
	let fixture: ComponentFixture<BatteryTemperatureComponent>;
	let batteryHealthServiceSpy: SpyObj<BatteryHealthService>;

	beforeEach(waitForAsync(() => {
		batteryHealthServiceSpy = jasmine.createSpyObj<BatteryHealthService>(
			'BatteryHealthService',
			{},
			['batteryInfo']
		);
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [BatteryTemperatureComponent],
			imports: [TranslateModule.forRoot()],
			providers: [{ provide: BatteryHealthService, useValue: batteryHealthServiceSpy }],
		}).compileComponents();
		fixture = TestBed.createComponent(BatteryTemperatureComponent);
		component = fixture.componentInstance;
		// fixture.detectChanges();
	}));

	it('should create and condition default value with "fine"', () => {
		expect(component).toBeTruthy();
		expect(component.condition).toBe('fine');
	});

	it('should show error status when incoming response carries wrong data', () => {
		const stubValue = {
			temperature: -300,
			isSupportSmartBatteryV2: true,
			batteryHealthLevel: BatteryHealthLevel.LEVEL_1,
			batteryHealthTip: BatteryHealthTip.TIPS_1,
			predictedLifeSpan: BatteryLifeSpan.GT_36,
			lifePercent: 16,
			fullChargeCapacity: 16,
			designCapacity: 20,
		};
		(Object.getOwnPropertyDescriptor(batteryHealthServiceSpy, 'batteryInfo')
			.get as any).and.returnValue(of({}, stubValue));

		fixture.detectChanges();

		expect(component.condition).toBe(Conditions[BatteryTemperatureStatus.ERROR]);
		expect(component.temperature).toBe(BatteryTemperatureStatus.ERROR);
	});

	it('should act normal', () => {
		const stubValue = {
			temperature: 25,
			isSupportSmartBatteryV2: true,
			batteryHealthLevel: BatteryHealthLevel.LEVEL_1,
			batteryHealthTip: BatteryHealthTip.TIPS_1,
			predictedLifeSpan: BatteryLifeSpan.GT_36,
			lifePercent: 16,
			fullChargeCapacity: 16,
			designCapacity: 20,
		};
		(Object.getOwnPropertyDescriptor(batteryHealthServiceSpy, 'batteryInfo')
			.get as any).and.returnValue(of(stubValue));

		fixture.detectChanges();

		expect(component.condition).toBe(Conditions['1']);
		expect(component.temperature).toBe(stubValue.temperature);
	});
});
