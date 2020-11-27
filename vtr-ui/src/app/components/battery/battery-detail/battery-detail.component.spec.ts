import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import BatteryIndicator from 'src/app/data-models/battery/battery-indicator.model';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { BatteryDetailComponent } from './battery-detail.component';

const dataInfo: BatteryDetail[] = [
	{
		heading: '',
		chargeStatusString:
			'device.deviceSettings.batteryGauge.details.chargeStatusString.charging',
		remainingTimeText: 'device.deviceSettings.batteryGauge.details.chargeCompletionTime',
		barCode: 'X2XP899J0N0',
		batteryCondition: ['Normal'],
		batteryHealth: 0,
		chargeStatus: 2,
		cycleCount: 138,
		designCapacity: 45.28,
		designVoltage: 11.1,
		deviceChemistry: 'Li-Polymer',
		firmwareVersion: '0005-0234-0100-0005',
		firstUseDate: new Date('12/21/2018'),
		fruPart: '01AV464',
		fullChargeCapacity: 46.74,
		manufactureDate: new Date('12/21/2018'),
		manufacturer: 'SMP',
		remainingCapacity: 11.74,
		remainingPercent: 25,
		remainingTime: 67,
		temperature: 34,
		voltage: 10.843,
		wattage: 9,
		isTemporaryChargeMode: false,
		isDlsPiCapable: false,
	},
];

const dataIndicator: BatteryIndicator = {
	percent: 14,
	charging: false,
	batteryNotDetected: false,
	expressCharging: false,
	hours: 0,
	minutes: 31,
	timeText: 'timeRemaining',
	isAirplaneMode: false,
	isChargeThresholdOn: false,
	convertMin: (totalMin: number) => {},
};

const dataConditionsGood: BatteryConditionModel[] = [
	{
		condition: 0,
		conditionStatus: 0,

		getBatteryConditionTip(condition: number): string {
			return 'device.deviceSettings.batteryGauge.condition.Good';
		},
	},
];

describe('Battery Details Component:', () => {
	let component: BatteryDetailComponent;
	let fixture: ComponentFixture<BatteryDetailComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			imports: [HttpClientTestingModule, TranslateModule.forRoot(), NgbModule],
			declarations: [BatteryDetailComponent],
			providers: [CommonService, VantageShellService, LoggerService],
		});
	}));

	it('should create component', waitForAsync(() => {
		fixture = TestBed.createComponent(BatteryDetailComponent);
		component = fixture.componentInstance;
		component.dataInfo = [...dataInfo];
		component.dataConditions = [...dataConditionsGood];
		component.dataIndicator = dataIndicator;
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should call preProcessBatteryDetailResponse with no deviceChemistry', waitForAsync(() => {
		fixture = TestBed.createComponent(BatteryDetailComponent);
		component = fixture.componentInstance;
		component.dataInfo = [...dataInfo];
		component.dataInfo[0].deviceChemistry = '';
		component.dataConditions = [...dataConditionsGood];
		component.dataIndicator = dataIndicator;
		component.dataIndicator.timeText = 'timeCompletion';
		const response = {
			detail: component.dataInfo,
			indicator: component.dataIndicator,
			conditions: component.dataConditions,
		};
		component.preProcessBatteryDetailResponse(response);
		expect(component.dataSource).toEqual(response.detail);
	}));

	it('should call onFccIconClick', () => {
		fixture = TestBed.createComponent(BatteryDetailComponent);
		component = fixture.componentInstance;
		const tooltip = {
			isOpen() {
				return true;
			},
			close() {
				return false;
			},
		};
		const canOpen = false;
		const spy = spyOn(tooltip, 'close');
		component.onFccIconClick(tooltip, canOpen);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onFccIconClick canOpen is true', () => {
		fixture = TestBed.createComponent(BatteryDetailComponent);
		component = fixture.componentInstance;
		const tooltip = {
			isOpen() {
				return false;
			},
			close() {
				return false;
			},
			open() {
				return true;
			},
		};
		const canOpen = true;
		const spy = spyOn(tooltip, 'open');
		component.onFccIconClick(tooltip, canOpen);
		expect(spy).toHaveBeenCalled();
	});

	it('should call isValid with val equal to null', () => {
		fixture = TestBed.createComponent(BatteryDetailComponent);
		component = fixture.componentInstance;
		const val = null;
		const res = component.isValid(val);
		expect(res).toEqual(false);
	});
});
