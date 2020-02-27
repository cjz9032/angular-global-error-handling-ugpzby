import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { BatteryChargeThresholdSettingsComponent } from "./battery-charge-threshold-settings.component";
import { CommonService } from 'src/app/services/common/common.service';

import { TranslateModule } from "@ngx-translate/core";

const bctInfo: any = {
	batteryNum: 1,
	isCapable: false,
	isEnabled: false,
	startValue: 40,
	stopValue: 45,
	checkboxValue: false
}

describe("BatteryChargeThresholdSettingsComponent", () => {
	let component: BatteryChargeThresholdSettingsComponent;
	let fixture: ComponentFixture<BatteryChargeThresholdSettingsComponent>;
	let commonService: CommonService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [BatteryChargeThresholdSettingsComponent],
			imports: [HttpClientTestingModule, TranslateModule.forRoot()],
			providers: [CommonService]
		});
	}));

	it('should create Battery Charge Threshold component', async(() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		component.bctInfo= {...bctInfo}
		fixture.detectChanges()
		expect(component).toBeTruthy()
	}));

	it('should call onStartValueChange', async(() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const startVal = 35
		const button = document.createElement('button')
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfo)
		component.onStartValueChange(startVal, button)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onStartValueChange - else case', async(() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const startVal = 35
		const button = document.createElement('button')
		const bctInfoo: any = {...bctInfo, startVal:35}
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfoo)
		component.onStartValueChange(startVal, button)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onStopValueChange', async(() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const stopVal = 35
		const button = document.createElement('button')
		const bctInfoo: any = {...bctInfo, checkboxValue: true}
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfoo)
		component.onStopValueChange(stopVal, button)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onStopValueChange - inner else case', async(() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const stopVal = 35
		const button = document.createElement('button')
		const bctInfoo: any = {...bctInfo, checkboxValue: false}
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfoo)
		component.onStopValueChange(stopVal, button)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onStopValueChange - outer else case', async(() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const stopVal = 35
		const button = document.createElement('button')
		const bctInfoo: any = {...bctInfo, stopValue: 35}
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfoo)
		component.onStopValueChange(stopVal, button)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call toggleAutoChargeSettings', async(() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const event = true
		component.bctInfo = {...bctInfo}
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfo)
		component.toggleAutoChargeSettings(event)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call toggleAutoChargeSettings - else case', async(() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent)
		component = fixture.componentInstance
		commonService = TestBed.get(CommonService)
		const event = undefined
		const spy = spyOn(commonService, 'cloneObj').and.returnValue(bctInfo)
		component.toggleAutoChargeSettings(event)
		expect(spy).toHaveBeenCalled()
	}));
});