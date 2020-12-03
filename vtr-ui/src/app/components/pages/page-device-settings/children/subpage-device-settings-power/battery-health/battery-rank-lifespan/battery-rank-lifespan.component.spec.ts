import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BatteryRankLifespanComponent } from './battery-rank-lifespan.component';
import { BatteryHealthService } from '../battery-health.service';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import { Observable, of, from } from 'rxjs';
import { BatteryHealthResponse } from '../battery-health.interface';
import {
	BatteryHealthLevel,
	BatteryHealthTip,
	BatteryLifeSpan,
	BatteryTemperatureStatus,
} from '../battery-health.enum';

describe('BatteryRankLifespanComponent', () => {
	let component: BatteryRankLifespanComponent;
	let fixture: ComponentFixture<BatteryRankLifespanComponent>;
	let batteryHealthService: BatteryHealthService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [BatteryRankLifespanComponent],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore, BatteryHealthService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryRankLifespanComponent);
		component = fixture.componentInstance;
		batteryHealthService = fixture.debugElement.injector.get(BatteryHealthService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should getBatteryDetails haveBeenCalled', () => {
		const battery = {
			fullChargeCapacity: 23.84,
			designCapacity: 0,
			temperature: 32 as BatteryTemperatureStatus,
			isSupportSmartBatteryV2: true,
			batteryHealthLevel: 6 as BatteryHealthLevel,
			batteryHealthTip: 3 as BatteryHealthTip,
			predictedLifeSpan: 3 as BatteryLifeSpan,
			lifePercent: 80,
		} as BatteryHealthResponse;
		spyOn(component, 'getBatteryDetails');
		// spyOn(batteryHealthService, 'requestBatteryInfo').and.returnValue(of(battery));
		component.ngOnInit();
		// component.getBatteryDetails();
		// fixture.detectChanges();
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		expect(component.getBatteryDetails).toHaveBeenCalled;
	});

	it('should get the battery getLeftSpanStr', () => {
		let lifSpan = 1;
		expect(component.getLifeSpanStr(lifSpan)).toEqual('<6');

		lifSpan = 2;
		expect(component.getLifeSpanStr(lifSpan)).toEqual('>6');

		lifSpan = 3;
		expect(component.getLifeSpanStr(lifSpan)).toEqual('>12');

		lifSpan = 4;
		expect(component.getLifeSpanStr(lifSpan)).toEqual('>18');

		lifSpan = 5;
		expect(component.getLifeSpanStr(lifSpan)).toEqual('>24');

		lifSpan = 6;
		expect(component.getLifeSpanStr(lifSpan)).toEqual('>30');

		lifSpan = 7;
		expect(component.getLifeSpanStr(lifSpan)).toEqual('>36');

		lifSpan = -1;
		expect(component.getLifeSpanStr(lifSpan)).toEqual('');
	});
});
