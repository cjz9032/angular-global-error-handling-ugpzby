import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { UiSmartPerformanceComponent } from './ui-smart-performance.component';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

xdescribe('UiSmartPerformanceComponent', () => {
	let component: UiSmartPerformanceComponent;
	let fixture: ComponentFixture<UiSmartPerformanceComponent>;
	let smartPerformanceService: SmartPerformanceService;
	let commonService: CommonService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiSmartPerformanceComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule],
			providers: [
				TranslateStore,
				SmartPerformanceService,
				CommonService,
				LoggerService,
				NgbModal
			]
		});
	}));

	it('should create the component', async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		spyOn(commonService, 'getLocalStorageValue');
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should call changeScanStatus', async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceComponent);
		component = fixture.componentInstance;
		const event = {
			boost: 60,
			rating: 8,
			secure: 5,
			tune: 75,
		}
		component.changeScanStatus(event);
		expect(component.isScanningCompleted).toBe(true)
	}));

	it('should call updateSubItemsList - if case', async(() => {
		const subitem = { items: ['abc', 'hello'] }
		fixture = TestBed.createComponent(UiSmartPerformanceComponent);
		component = fixture.componentInstance;
		component.updateSubItemsList(subitem);
		expect(component.subItems.length).not.toEqual(0)
	}));

	it('should call updateSubItemsList - else case', async(() => {
		const subitem = {}
		fixture = TestBed.createComponent(UiSmartPerformanceComponent);
		component = fixture.componentInstance;
		component.updateSubItemsList(subitem);
		expect(component.subItems.length).toEqual(0)
	}));

	it('should call changeScanEvent', async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceComponent);
		component = fixture.componentInstance;
		component.changeScanEvent();
		expect(component.isScanning).toBe(true)
		expect(component.isScanningCompleted).toBe(false)
	}));

	it('should call ScanNow - Promise resolved', async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceComponent);
		component = fixture.componentInstance;
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(true));
		component.scanNow();
		expect(spy).toHaveBeenCalled()
	}));

	it('should call ScanNow - Promise note resolved', async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceComponent);
		component = fixture.componentInstance;
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(false));
		component.scanNow();
		expect(spy).toHaveBeenCalled()
	}));

	it('should call ScanNow - Promise rejected', async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceComponent);
		component = fixture.componentInstance;
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.reject());
		component.scanNow();
		expect(spy).toHaveBeenCalled()
	}));

	it('should call ScanNow - isShellAvailable is false', async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceComponent);
		component = fixture.componentInstance;
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = false;
		const spy = spyOn(smartPerformanceService, 'getReadiness');
		component.scanNow();
		expect(spy).not.toHaveBeenCalled()
	}));

	it('should call cancelScan', async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceComponent);
		component = fixture.componentInstance;
		component.cancelScan();
		expect(component.isScanning).toBe(false)
		expect(component.isScanningCompleted).toBe(false)
	}));
});
