import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageScanningComponent } from './subpage-scanning.component';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SPCategory, SPSubCategory } from 'src/app/enums/smart-performance.enum';

import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';

import { NgbModal, NgbModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

const responseData = {
	type: 1,
	percentage: 0,
	errorcode: 0,
	errordesc: null,
	payload: {
		status: { category: 100, subcategory: 101, final: 'Running' },
		result: { tune: 0, boost: 0, secure: 0 },
		rating: 0,
		percentage: 100
	},
	state: true
};

describe('SubpageScanningComponent', () => {
	let component: SubpageScanningComponent;
	let fixture: ComponentFixture<SubpageScanningComponent>;
	let shellService: VantageShellService;
	let modalService: NgbModal;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [SubpageScanningComponent],
			providers: [
				TranslateStore,
				SmartPerformanceService,
				VantageShellService,
				LoggerService,
				NgbModal
			],
			imports: [TranslationModule, NgbModule]
		});
		fixture = TestBed.createComponent(SubpageScanningComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		shellService = TestBed.inject(VantageShellService);
		spyOn(component, 'GetCurrentScanninRollingTexts');
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should call updateScanResponse -category - 100 & subcategory -101', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 100;
		event.payload.status.subcategory = 101;
		component.updateScanResponse(event);
		expect(component.activegroup).toEqual('Tune up performance');
	});

	it('should call updateScanResponse -category - 100 & subcategory -102', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 100;
		event.payload.status.subcategory = 102;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 100 & subcategory -103', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 100;
		event.payload.status.subcategory = 103;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 100 & subcategory -104', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 100;
		event.payload.status.subcategory = 104;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 100 & subcategory -105', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 100;
		event.payload.status.subcategory = 105;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 200 & subcategory - 201', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 200;
		event.payload.status.subcategory = 201;
		component.updateScanResponse(event);
		expect(component.activegroup).toEqual('Internet performance');
	});

	it('should call updateScanResponse -category - 200 & subcategory - 202', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 200;
		event.payload.status.subcategory = 202;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 200 & subcategory - 203', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 200;
		event.payload.status.subcategory = 203;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 200 & subcategory - 204', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 200;
		event.payload.status.subcategory = 204;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 200 & subcategory - 205', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 200;
		event.payload.status.subcategory = 205;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 300 -& subcategory - 301', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 300;
		event.payload.status.subcategory = 301;
		component.updateScanResponse(event);
		expect(component.activegroup).toEqual('Malware & Security');
	});

	it('should call updateScanResponse -category - 300 & subcategory - 302', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 300;
		event.payload.status.subcategory = 302;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 300 & subcategory - 303', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 300;
		event.payload.status.subcategory = 303;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 300 & subcategory - 304', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 300;
		event.payload.status.subcategory = 304;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 300 & subcategory - 305', () => {
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		const spy = spyOn(component, 'GetCurrentScanninRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 300;
		event.payload.status.subcategory = 305;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call GetCurrentScanninRollingTexts when passing value', () => {
		component.activegroup = 'Tune up performance';
		component.GetCurrentScanninRollingTexts('Look for junk in 85 locations');
		const spyToggle = spyOn(component, 'toggle');
		const spyGetCurrentScanninRollingTexts = spyOn(component, 'GetCurrentScanninRollingTexts');
		fixture.detectChanges();
		expect(spyGetCurrentScanninRollingTexts).toHaveBeenCalled();
	});

	it('should open feedback form', () => {
		modalService = TestBed.inject(NgbModal);
		const spy = spyOn(modalService, 'open');
		component.onclickFeedback();
		expect(spy).toHaveBeenCalled();
	});

	it('should open cancel scan modal', () => {
		modalService = TestBed.inject(NgbModal);
		const spy = spyOn(modalService, 'open');
		component.openCancelScanModel();
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateResponse in ngOnChanges', () => {
		component.scheduleScanData = { ...responseData };
		const spy = spyOn(component, 'updateScanResponse');
		component.ngOnChanges({
			isScanningStarted: new SimpleChange(null, null, false)
		});
		expect(spy).toHaveBeenCalled();
	});

	it('should check scanData percentage', () => {
		component.scanData = { ...responseData.payload };
		component.spSubCategoryenum = SPSubCategory;
		component.spCategoryenum = SPCategory;
		spyOn(component, 'toggle');
		spyOn(component, 'GetCurrentScanninRollingTexts');
		component.updateScanResponse(responseData);
		expect(component.isLoading).toBe(false);
	});

});
