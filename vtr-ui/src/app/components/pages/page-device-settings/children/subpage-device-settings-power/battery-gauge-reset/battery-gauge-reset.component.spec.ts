import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@lenovo/material/dialog';

import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { BatteryGaugeResetComponent } from './battery-gauge-reset.component';

describe('BatteryGaugeResetComponent', () => {
	let component: BatteryGaugeResetComponent;
	let modalService;
	let powerService;
	let fixture: ComponentFixture<BatteryGaugeResetComponent>;

	const gaugeResetInfo = [
		{
			barCode: 'X2XP899J0N0',
			batteryNum: 1,
			FCCAfter: 0,
			FCCBefore: 0,
			isResetRunning: true,
			lastResetTime: '',
			resetErrorLog: 'ERROR_UNEXPECTED',
			stage: 1,
			stageNum: 3,
			startTime: '28 Jan 2020',
		},
		{
			barCode: 'X2XP899J0N0',
			batteryNum: 2,
			FCCAfter: 12345,
			FCCBefore: 12332,
			isResetRunning: false,
			lastResetTime: '28 Jan 2020',
			resetErrorLog: 'ERROR_SUCCESS',
			stage: 0,
			stageNum: 0,
			startTime: '',
		},
	];
	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [BatteryGaugeResetComponent],
				imports: [TranslationModule.forChild()],
				providers: [TranslateStore],
				schemas: [NO_ERRORS_SCHEMA],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryGaugeResetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		modalService = fixture.debugElement.injector.get(MatDialog);
		powerService = fixture.debugElement.injector.get(MatDialog);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call onBatteryGaugeReset', () => {
		component.batteryService.gaugeResetInfo = gaugeResetInfo;
		spyOn(modalService, 'open').and.returnValue({
			result: Promise.resolve('positive'),
			componentInstance: {
				title: '',
				negativeResponseText: '',
				positiveResponseText: '',
				description1: '',
				description2: '',
			},
		});

		const event = new MouseEvent('click');
		spyOn(component, 'setGaugeResetSection');
		fixture.detectChanges();
		component.onBatteryGaugeReset(0, event);
		expect(modalService.open).toHaveBeenCalled();
	});

	it('should call setGaugeResetSection and reset not running', () => {
		const tempInfo = Object.assign(gaugeResetInfo);
		tempInfo[0].isResetRunning = false;
		component.batteryService.gaugeResetInfo = tempInfo;
		component.setGaugeResetSection();
		expect(component.batteryService.isGaugeResetRunning).toBeFalsy();
	});

	it('should call updateGaugeResetInfo', () => {
		component.batteryService.gaugeResetInfo = gaugeResetInfo;
		spyOn(component, 'setGaugeResetSection').and.callThrough();
		component.updateGaugeResetInfo(gaugeResetInfo[0]);
		expect(component.batteryService.gaugeResetInfo[0]).toEqual(gaugeResetInfo[0]);
		expect(component.setGaugeResetSection).toHaveBeenCalled();
	});

	it('should call startBatteryGaugeReset', async () => {
		component.batteryService.gaugeResetInfo = gaugeResetInfo;
		spyOn(component, 'setGaugeResetSection');
		component.startBatteryGaugeReset(0);
	});

	it('should call stopBatteryGaugeReset', async () => {
		component.batteryService.gaugeResetInfo = gaugeResetInfo;
		spyOn(component, 'setGaugeResetSection');
		component.startBatteryGaugeReset(0);
	});
});
