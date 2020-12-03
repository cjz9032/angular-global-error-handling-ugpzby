import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BatteryHealthComponent } from './battery-health.component';
import SpyObj = jasmine.SpyObj;
import { BatteryHealthService } from './battery-health.service';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('BatteryHealthComponent', () => {
	let component: BatteryHealthComponent;
	let fixture: ComponentFixture<BatteryHealthComponent>;
	let batteryHealthServiceSpy: SpyObj<BatteryHealthService>;

	beforeEach(waitForAsync(() => {
		batteryHealthServiceSpy = jasmine.createSpyObj<BatteryHealthService>(
			'BatteryHealthService',
			{},
			['batteryInfo']
		);
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [BatteryHealthComponent],
			imports: [TranslateModule.forRoot()],
			providers: [{ provide: BatteryHealthService, useValue: batteryHealthServiceSpy }],
		}).compileComponents();
		fixture = TestBed.createComponent(BatteryHealthComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get batteryHealthCapability', () => {
		const stubValue = {
			temperature: -300,
			isSupportSmartBatteryV2: true,
			lifePercent: 16,
			fullChargeCapacity: 16,
			designCapacity: 20,
		};
		(Object.getOwnPropertyDescriptor(batteryHealthServiceSpy, 'batteryInfo')
			.get as any).and.returnValue(of(stubValue));
		fixture.detectChanges();

		expect(component.batteryHealthCapability).toBe(stubValue.isSupportSmartBatteryV2);
	});
	it('should get batteryHealthCapability else', () => {
		const stubValue = {
			temperature: -300,
			isSupportSmartBatteryV2: undefined,
			lifePercent: 16,
			fullChargeCapacity: 16,
			designCapacity: 20,
		};
		(Object.getOwnPropertyDescriptor(batteryHealthServiceSpy, 'batteryInfo')
			.get as any).and.returnValue(of(stubValue));
		fixture.detectChanges();

		expect(component.batteryHealthCapability).toBeUndefined();
	});
});
