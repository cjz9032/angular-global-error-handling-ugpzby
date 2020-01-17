import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartStandbyComponent } from './smart-standby.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/services/common/common.service';
import { PowerService } from 'src/app/services/power/power.service';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

xdescribe('SmartStandbyComponent', () => {
	let component: SmartStandbyComponent;
	let fixture: ComponentFixture<SmartStandbyComponent>;
	let powerService;
	let commonService;
	let debugElement;

	const smartStandby = {
		isCapable: true,
		isEnabled: true,
		activeStartEnd: '6:00-18:00',
		daysOfWeekOff: 'mon,tue,wed,thurs,fri'
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SmartStandbyComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				},
				isolate: false
			}),
			TranslationModule.forChild(), HttpClientModule],
			providers: [CommonService, PowerService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SmartStandbyComponent);
		debugElement = fixture.debugElement;
		powerService = debugElement.injector.get(PowerService);
		commonService = debugElement.injector.get(CommonService);
		// spyOn(CommonService)
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('#showSmartStandby should initialize smart standby section', async () => {
		component.powerService.isShellAvailable = false;
		spyOn(component, 'initSmartStandby');
		spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(Promise.resolve(false));
		await component.showSmartStandby();
		//expect(component.initSmartStandby).toHaveBeenCalled();
		expect(powerService.getSmartStandbyCapability).not.toHaveBeenCalled();
	});

	it('#initSmartStandby should call initDataFromCache and splitStartEndTime', () => {
		spyOn(component, 'initDataFromCache');
		spyOn(component, 'splitStartEndTime');
		component.initSmartStandby();
		expect(component.initDataFromCache).toHaveBeenCalled();
		expect(component.splitStartEndTime).toHaveBeenCalled();
	});

	it('#splitStartEndTime should split start and end time from activeStartEnd', () => {
		component.smartStandby.activeStartEnd = '9:00-18:00';
		spyOn(component, 'isStartEndTimeValid').and.callFake(() => {
			component.showDiffNote = true;
		});

		component.splitStartEndTime();
		expect(component.smartStandbyStartTime).toEqual('9:00');
		expect(component.smartStandbyEndTime).toEqual('18:00');
		expect(component.isStartEndTimeValid).toHaveBeenCalled();
	});

	it('#splitStartEndTime should set start and end time to 00:00', () => {
		component.smartStandby.activeStartEnd = '';
		component.splitStartEndTime();
		expect(component.smartStandbyStartTime).toEqual('00:00');
		expect(component.smartStandbyEndTime).toEqual('00:00');
	});

	it('#initDataFromCache should get data from Cache and set isCapable to false', () => {
		const testSmartStandby = smartStandby;
		testSmartStandby.isCapable = false;
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(testSmartStandby);
		component.initDataFromCache();
		expect(commonService.getLocalStorageValue).toHaveBeenCalledWith(LocalStorageKey.SmartStandbyCapability, undefined);
		expect(component.smartStandby.isCapable).toBeFalsy();
	});

	it('#onSmartStandbyToggle should change value of smartStandby isEnabled', async () => {
		component.powerService.isShellAvailable = true;
		spyOn(powerService, 'setSmartStandbyEnabled').and.returnValue(Promise.resolve(0));
		spyOn(commonService, 'setLocalStorageValue').and.callFake(() => { console.log('fake function call'); });
		await component.onSmartStandbyToggle({ switchValue: true });
		expect(powerService.setSmartStandbyEnabled).toHaveBeenCalledWith(true);
		expect(component.smartStandby.isEnabled).toBeTruthy();
		expect(component.cache.isEnabled).toBeTruthy();
		expect(commonService.setLocalStorageValue).toHaveBeenCalledWith(LocalStorageKey.SmartStandbyCapability, component.cache);
	});

	it('#showSmartStandby should call initSmartStandby & set smartStandby capability to true', async () => {
		component.powerService.isShellAvailable = true;
		spyOn(component, 'initSmartStandby');
		spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(Promise.resolve(true));
		spyOn(component, 'setSmartStandbySection');
		await component.showSmartStandby();
		//expect(component.initSmartStandby).toHaveBeenCalled();
		expect(component.smartStandby.isCapable).toBeTruthy();
		expect(powerService.getSmartStandbyCapability).toHaveBeenCalled();
		expect(component.setSmartStandbySection).toHaveBeenCalled();
	});

	it('#showSmartStandby should call initSmartStandby & set smartStandby capability to false', async () => {
		component.powerService.isShellAvailable = true;
		spyOn(component, 'initSmartStandby');
		spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(Promise.resolve(false));
		spyOn(component, 'setSmartStandbySection');
		await component.showSmartStandby();
		//expect(component.initSmartStandby).toHaveBeenCalled();
		expect(component.smartStandby.isCapable).toBeFalsy();
		expect(powerService.getSmartStandbyCapability).toHaveBeenCalled();
		//expect(component.setSmartStandbySection).not.toHaveBeenCalled();
	});

	it('#onSmartStandbyToggle should call onSmartStandbyToggle & set isAutonomicCapability to true', async () => {
		component.isAutonomicCapability = true;
		let evt = true;
		component.onSmartStandbyToggle(evt);
	});

	it('#setSmartStandbySection should call getSmartStandbyEnabled and enable smart standby', async () => {
		component.powerService.isShellAvailable = true;
		spyOn(powerService, 'getSmartStandbyEnabled').and.returnValue(Promise.resolve(true));
		spyOn(powerService, 'getSmartStandbyActiveStartEnd').and.returnValue(Promise.resolve('9:00-18:00'));
		spyOn(powerService, 'getSmartStandbyDaysOfWeekOff').and.returnValue(Promise.resolve('mon'));
		await component.setSmartStandbySection();
		expect(powerService.getSmartStandbyEnabled).toHaveBeenCalled();
		expect(component.smartStandby.isEnabled).toBeTruthy();
		expect(powerService.getSmartStandbyActiveStartEnd).toHaveBeenCalled();
		expect(powerService.getSmartStandbyDaysOfWeekOff).toHaveBeenCalled();
		expect(component.smartStandby.activeStartEnd).toEqual('9:00-18:00');
		expect(component.smartStandby.daysOfWeekOff).toEqual('mon');
	});

	it('#setSmartStandbySection should call getSmartStandbyEnabled and disable smart standby', async () => {
		component.powerService.isShellAvailable = true;
		spyOn(powerService, 'getSmartStandbyEnabled').and.returnValue(Promise.resolve(false));
		await component.setSmartStandbySection();
		expect(powerService.getSmartStandbyEnabled).toHaveBeenCalled();
		expect(component.smartStandby.isEnabled).toBeFalsy();
	});

	it('#onSetActiveStartEnd should set value of activeStartEnd', async () => {
		component.powerService.isShellAvailable = true;
		component.smartStandbyEndTime = '18:00';
		spyOn(component, 'splitStartEndTime');
		spyOn(powerService, 'setSmartStandbyActiveStartEnd').and.returnValue(Promise.resolve(0));
		spyOn(commonService, 'setLocalStorageValue').and.callFake(() => { console.log('fake function call'); });
		await component.onSetActiveStartEnd('9:00', true);
		expect(powerService.setSmartStandbyActiveStartEnd).toHaveBeenCalledWith('9:00-18:00');
		expect(component.cache.activeStartEnd).toEqual('9:00-18:00');
		expect(commonService.setLocalStorageValue).toHaveBeenCalledWith(LocalStorageKey.SmartStandbyCapability, component.cache);
	});

	it('#onSetDaysOfWeekOff should set value of daysOfWeekOff', async () => {
		component.powerService.isShellAvailable = true;
		spyOn(powerService, 'setSmartStandbyDaysOfWeekOff').and.returnValue(Promise.resolve(0));
		spyOn(commonService, 'setLocalStorageValue').and.callFake(() => { console.log('fake function call'); });
		await component.onSetDaysOfWeekOff('mon');
		expect(powerService.setSmartStandbyDaysOfWeekOff).toHaveBeenCalledWith('mon');
		expect(component.cache.daysOfWeekOff).toEqual('mon');
		expect(commonService.setLocalStorageValue).toHaveBeenCalledWith(LocalStorageKey.SmartStandbyCapability, component.cache);
	});

	it('#isStartEndTimeValid should check for activeStartEnd validity and Hide difference warning note ', () => {
		component.smartStandbyStartTime = '1:00';
		component.smartStandbyEndTime = '20:00';
		component.isStartEndTimeValid();
		expect(component.showDiffNote).toBeFalsy();
	});

	it('#isStartEndTimeValid should check for activeStartEnd validity and Show difference warning note ', () => {
		component.smartStandbyStartTime = '4:00';
		component.smartStandbyEndTime = '1:00';
		component.isStartEndTimeValid();
		expect(component.showDiffNote).toBeTruthy();
	});
});
