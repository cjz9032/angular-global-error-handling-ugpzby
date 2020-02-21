import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateStore } from '@ngx-translate/core';

import { BatteryGaugeResetComponent } from './battery-gauge-reset.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PowerService } from 'src/app/services/power/power.service';

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
			startTime: '28 Jan 2020'
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
			startTime: ''
		}
	];
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BatteryGaugeResetComponent],
			imports: [TranslationModule.forChild()],
			providers: [TranslateStore],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryGaugeResetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		modalService = fixture.debugElement.injector.get(NgbModal);
		powerService = fixture.debugElement.injector.get(NgbModal);

	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call onBatteryGaugeReset', () => {
		component.batteryService.gaugeResetInfo = gaugeResetInfo;
		spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve('positive'), componentInstance: {title: '', negativeResponseText: '', positiveResponseText: '', description1: '', description2: ''} });
		// spyOn(component, 'stopBatteryGaugeReset');
		spyOn(component, 'setGaugeResetSection');
		fixture.detectChanges();
		component.onBatteryGaugeReset(0);
		expect(modalService.open).toHaveBeenCalled();
		// expect()
	});

	// it('should call setGaugeResetSection and reset running', () => {
	// 	component.batteryService.gaugeResetInfo = gaugeResetInfo;
	// 	component.setGaugeResetSection();
	// 	expect(component.batteryService.isGaugeResetRunning).toBeTruthy();
	// 	// expect(component.gaugeResetBtnStatus).toEqual([false, true]);
	// });

	it('should call setGaugeResetSection and reset not running', () => {
		const tempInfo = Object.assign(gaugeResetInfo);
		tempInfo[0].isResetRunning = false;
		component.batteryService.gaugeResetInfo = tempInfo;
		component.setGaugeResetSection();
		expect(component.batteryService.isGaugeResetRunning).toBeFalsy();
		// expect(component.gaugeResetBtnStatus).toEqual([false, false]);
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
		// spyOn(powerService, 'startBatteryGaugeReset').and.returnValue(Promise.resolve(true));
		component.startBatteryGaugeReset(0);
		// expect(powerService.startBatteryGaugeReset).toHaveBeenCalled();
		// expect(component.updateGaugeResetInfo).toHaveBeenCalled();
	});

	it('should call stopBatteryGaugeReset', async () => {
		component.batteryService.gaugeResetInfo = gaugeResetInfo;
		spyOn(component, 'setGaugeResetSection');
		// spyOn(powerService, 'stopBatteryGaugeReset').and.returnValue(Promise.resolve(true));
		component.startBatteryGaugeReset(0);
		// expect(powerService.stopBatteryGaugeReset).toHaveBeenCalled();
		// expect(component.updateGaugeResetInfo).toHaveBeenCalled();
	});
});
