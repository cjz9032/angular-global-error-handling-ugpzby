import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BacklightComponent } from './backlight.component';
import { BacklightService } from './backlight.service';
import { MetricService } from '../../../../../../services/metric/metric.service';
import { EMPTY, NEVER, Observable, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RemoveSpacePipe } from '../../../../../../pipe/remove-space/remove-space.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
import { HttpClientModule } from '@angular/common/http';
import { BacklightLevelEnum, BacklightStatusEnum } from './backlight.enum';
import { BacklightMode, GetBacklightResponse } from './backlight.interface';
import { delay } from 'rxjs/operators';

class MockMetricService {
	sendMetrics() {
		return;
	}
}

describe('Backlight', () => {
	let component: BacklightComponent;
	let fixture: ComponentFixture<BacklightComponent>;
	let backlightService: BacklightService;
	let backlightServiceSpy;

	beforeEach(() => {
		const stubValue = [
			{
				key: 'KeyboardBacklightLevel',
				value: 'OneLevel',
				enabled: 0,
				errorCode: 0
			},
			{
				key: 'KeyboardBacklightStatus',
				value: 'Level_1',
				enabled: 0,
				errorCode: 0
			}
		];
		backlightServiceSpy = jasmine.createSpyObj('BacklightService', [
			'backlight',
			'setBacklight',
			'getBacklightOnSystemChange',
			'clearCache',
			'forceReload'
		]);
		backlightServiceSpy.backlight.and.returnValue(of(stubValue));
		backlightServiceSpy.clearCache.and.callThrough();

		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [BacklightComponent, RemoveSpacePipe],
			imports: [
				TranslateModule.forRoot(),
				HttpClientModule
			],
			providers: [
				BacklightService,
				{provide: MetricService, useClass: MockMetricService},
				VantageShellService
			]
		});
		// backlightService = fixture.debugElement.injector.get(BacklightService);
		backlightService = TestBed.inject(BacklightService);
	});

	it('should create Backlight Component', async(() => {
		// backlightServiceSpy.backlight.and.returnValue(of(stubValue));
		fixture = TestBed.createComponent(BacklightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		expect(component).toBeTruthy();
		fixture.destroy();
	}));

	it('should call onToggleOnOff - when switchValue is true', async(() => {
		fixture = TestBed.createComponent(BacklightComponent);
		component = fixture.componentInstance;
		const event = {
			switchValue: true
		};
		const spy = spyOn(component.update$, 'next');
		component.onToggleOnOff(event);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onToggleOnOff - when no switchValue', async(() => {
		fixture = TestBed.createComponent(BacklightComponent);
		component = fixture.componentInstance;
		const event = {};
		component.onToggleOnOff(event);
		const spy = spyOn(component.update$, 'next');
		component.onToggleOnOff(event);
		expect(spy).toHaveBeenCalled();
	}));

	it('should check isSwitchChecked for one level subscription - when backlight status is off', () => {

		const stubValue = [
			{
				key: 'KeyboardBacklightLevel',
				value: 'OneLevel',
				enabled: 0,
				errorCode: 0
			},
			{
				key: 'KeyboardBacklightStatus',
				value: 'Level_1',
				enabled: 0,
				errorCode: 0
			}
		];
		const spy = spyOnProperty(backlightService, 'backlight');
		spy.and.returnValue(of(stubValue));
		fixture = TestBed.createComponent(BacklightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		expect(spy.calls.any()).toBe(true, 'getBacklight called');
		expect(component.isSwitchChecked).toBe(true);
		fixture.destroy();
	});

	it('should check off mode when backlight status is disabledOff - TWO_LEVELS_AUTO', async(() => {
		const stubValue = [
			{
				key: 'KeyboardBacklightLevel',
				value: BacklightLevelEnum.TWO_LEVELS_AUTO,
				enabled: 0,
				errorCode: 0
			},
			{
				key: 'KeyboardBacklightStatus',
				value: BacklightStatusEnum.DISABLED_OFF,
				enabled: 0,
				errorCode: 0
			}
		];
		const spy = spyOnProperty(backlightService, 'backlight');
		spy.and.returnValue(of(stubValue));
		fixture = TestBed.createComponent(BacklightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		expect(component.modes[3].checked).toBe(true)
		fixture.destroy();
	}));

	it('should check off mode when backlight status is disabledOff - TWO_LEVELS', async(() => {
		const stubValue = [
			{
				key: 'KeyboardBacklightLevel',
				value: BacklightLevelEnum.TWO_LEVELS,
				enabled: 0,
				errorCode: 0
			},
			{
				key: 'KeyboardBacklightStatus',
				value: BacklightStatusEnum.DISABLED_OFF,
				enabled: 0,
				errorCode: 0
			}
		];
		const spy = spyOnProperty(backlightService, 'backlight');
		spy.and.returnValue(of(stubValue));
		fixture = TestBed.createComponent(BacklightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		expect(component.modes[2].checked).toBe(true)
		fixture.destroy();
	}));

	it('should check off mode when backlight status is disabledOff - TWO_LEVELS_AUTO onSystemChange', async(() => {
		const stubValue = [
			{
				key: 'KeyboardBacklightLevel',
				value: BacklightLevelEnum.TWO_LEVELS_AUTO,
				enabled: 0,
				errorCode: 0
			},
			{
				key: 'KeyboardBacklightStatus',
				value: BacklightStatusEnum.LEVEL_1,
				enabled: 0,
				errorCode: 0
			}
		];
		const stubOnChangeValue = [
			{
				key: 'KeyboardBacklightLevel',
				value: BacklightLevelEnum.TWO_LEVELS_AUTO,
				enabled: 0,
				errorCode: 0
			},
			{
				key: 'KeyboardBacklightStatus',
				value: BacklightStatusEnum.DISABLED_OFF,
				enabled: 0,
				errorCode: 0
			}
		];
		const backlightSpy = spyOnProperty(backlightService, 'backlight');
		backlightSpy.and.returnValue(of(stubValue));
		const spy = spyOn(backlightService, 'getBacklightOnSystemChange');
		let count = 0;
		spy.and.callFake(() => {
			if (count > 2) {
				return new Observable(observer => {
					observer.error('stop');
				})
			}
			count++;
			return of({
				settingList: {
					setting: stubOnChangeValue
				}
			} as GetBacklightResponse)
		});
		fixture = TestBed.createComponent(BacklightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		expect(component.modes[3].checked).toBe(true);
		fixture.destroy();
	}));

	it('should check level_one', async(() => {
		const stubValue = [
			{
				key: 'KeyboardBacklightLevel',
				value: BacklightLevelEnum.TWO_LEVELS,
				enabled: 0,
				errorCode: 0
			},
			{
				key: 'KeyboardBacklightStatus',
				value: BacklightStatusEnum.LEVEL_1,
				enabled: 0,
				errorCode: 0
			}
		];
		const spy = spyOnProperty(backlightService, 'backlight');
		spy.and.returnValue(of(stubValue));
		fixture = TestBed.createComponent(BacklightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.update$.next(component.modes[0]);
		expect(component.modes[0].checked).toBe(true);
		fixture.destroy();
	}));

	it('should check level_one', async(() => {
		const stubValue = [
			{
				key: 'KeyboardBacklightLevel',
				value: BacklightLevelEnum.TWO_LEVELS,
				enabled: 0,
				errorCode: 0
			},
			{
				key: 'KeyboardBacklightStatus',
				value: BacklightStatusEnum.LEVEL_1,
				enabled: 0,
				errorCode: 0
			}
		];
		const spy = spyOnProperty(backlightService, 'backlight');
		spy.and.returnValue(of(stubValue));
		const setSpy = spyOn(backlightService, 'setBacklight');
		const forceReoladSpy = spyOn(backlightService, 'forceReload');
		setSpy.and.callFake(() => {
			return new Observable(observer => {
				observer.error('fail');
			})
		})
		fixture = TestBed.createComponent(BacklightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.update$.next(component.modes[0]);
		expect(forceReoladSpy).toHaveBeenCalled();
		fixture.destroy();
	}));
});
