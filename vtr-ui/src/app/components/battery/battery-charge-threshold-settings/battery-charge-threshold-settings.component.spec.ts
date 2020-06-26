import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BatteryChargeThresholdSettingsComponent } from './battery-charge-threshold-settings.component';
import { CommonService } from 'src/app/services/common/common.service';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { DevService } from '../../../services/dev/dev.service';
import { MetricService } from '../../../services/metric/metrics.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

const bctInfo: any = {
	batteryNum: 1,
	isCapable: false,
	isEnabled: false,
	startValue: 40,
	stopValue: 45,
	checkboxValue: false
}

describe('BatteryChargeThresholdSettingsComponent', () => {
	let component: BatteryChargeThresholdSettingsComponent;
	let fixture: ComponentFixture<BatteryChargeThresholdSettingsComponent>;
	let commonService: CommonService;
	let commonMetricsService: CommonMetricsService;
	let metricService: MetricService;
	let devService: DevService;
	let dropdown: any = {
		isOpen: () => { return false },
		close: () => { return null }
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [BatteryChargeThresholdSettingsComponent, NgbDropdown],
			imports: [HttpClientTestingModule, TranslateModule.forRoot(), NgbModule, RouterTestingModule],
			providers: [CommonService, CommonMetricsService, MetricService, DevService]
		});
	}));

	it('should create Battery Charge Threshold component', (() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		component.bctInfo = { ...bctInfo }
		fixture.detectChanges()
		expect(component).toBeTruthy()
	}));

	it('should call onStartValueChange', (() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.inject(CommonService)
		const startVal = 35
		const button = document.createElement('button')

		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfo)
		component.onStartValueChange(startVal, dropdown, button)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onStartValueChange - else case', (() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const startVal = 35
		const button = document.createElement('button')
		const bctInfoo: any = { ...bctInfo, startVal: 35 }
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfoo)
		component.onStartValueChange(startVal, dropdown, button)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onStopValueChange', (() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const stopVal = 35
		const button = document.createElement('button')
		const bctInfoo: any = { ...bctInfo, checkboxValue: true }
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfoo)
		component.onStopValueChange(stopVal, dropdown, button)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onStopValueChange - inner else case', (() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.inject(CommonService)
		const stopVal = 35
		const button = document.createElement('button')
		const bctInfoo: any = { ...bctInfo, checkboxValue: false }
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfoo)
		component.onStopValueChange(stopVal, dropdown, button)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onStopValueChange - outer else case', (() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const stopVal = 35
		const button = document.createElement('button')
		const bctInfoo: any = { ...bctInfo, stopValue: 35 }
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfoo)
		component.onStopValueChange(stopVal, dropdown, button)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call toggleAutoChargeSettings', (() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const event = true
		component.bctInfo = { ...bctInfo }
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfo)
		component.toggleAutoChargeSettings(event)
		expect(spy).toHaveBeenCalled()
	}));
	it('should call showHideMenuOfItem', (() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const event = true
		component.showHideMenuOfItem(event, dropdown)
	}));

	it('should call toggleAutoChargeSettings - else case', (() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const event = undefined
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfo)
		component.toggleAutoChargeSettings(event)
		expect(spy).toHaveBeenCalled()
	}));
});
