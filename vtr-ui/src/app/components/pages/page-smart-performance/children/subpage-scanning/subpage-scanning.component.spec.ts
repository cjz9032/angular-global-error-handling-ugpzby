import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateStore } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@lenovo/material/dialog';

import { SubpageScanningComponent } from './subpage-scanning.component';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

import { TranslationModule } from 'src/app/modules/translation.module';

const responseData = {
	type: 1,
	percentage: 0,
	errorcode: 0,
	errordesc: null,
	payload: {
		status: { category: 100, subcategory: 101, final: 'Running' },
		result: { tune: 0, boost: 0, secure: 0 },
		rating: 0,
		percentage: 100,
	},
	state: true,
};

describe('SubpageScanningComponent', () => {
	let component: SubpageScanningComponent;
	let fixture: ComponentFixture<SubpageScanningComponent>;
	let shellService: VantageShellService;
	let modalService: MatDialog;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				schemas: [NO_ERRORS_SCHEMA],
				declarations: [SubpageScanningComponent],
				providers: [
					TranslateStore,
					SmartPerformanceService,
					VantageShellService,
					LoggerService,
					MatDialog,
				],
				imports: [TranslationModule, MatDialogModule],
			});
			fixture = TestBed.createComponent(SubpageScanningComponent);
			component = fixture.componentInstance;
		})
	);

	it('should create', () => {
		shellService = TestBed.inject(VantageShellService);
		spyOn(component, 'GetCurrentScanningRollingTexts');
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should call updateScanResponse -category - 100 & subcategory -101', () => {
		spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 100;
		event.payload.status.subcategory = 101;
		component.updateScanResponse(event);
		expect(component.activeGroup).toEqual('Tune up performance');
	});

	it('should call updateScanResponse -category - 100 & subcategory -102', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 100;
		event.payload.status.subcategory = 102;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 100 & subcategory -103', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 100;
		event.payload.status.subcategory = 103;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 100 & subcategory -104', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 100;
		event.payload.status.subcategory = 104;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 100 & subcategory -105', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 100;
		event.payload.status.subcategory = 105;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 200 & subcategory - 201', () => {
		spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 200;
		event.payload.status.subcategory = 201;
		component.updateScanResponse(event);
		expect(component.activeGroup).toEqual('Internet performance');
	});

	it('should call updateScanResponse -category - 200 & subcategory - 202', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 200;
		event.payload.status.subcategory = 202;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 200 & subcategory - 203', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 200;
		event.payload.status.subcategory = 203;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 200 & subcategory - 204', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 200;
		event.payload.status.subcategory = 204;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 200 & subcategory - 205', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 200;
		event.payload.status.subcategory = 205;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 300 -& subcategory - 301', () => {
		spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 300;
		event.payload.status.subcategory = 301;
		component.updateScanResponse(event);
		expect(component.activeGroup).toEqual('Malware & Security');
	});

	it('should call updateScanResponse -category - 300 & subcategory - 302', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 300;
		event.payload.status.subcategory = 302;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 300 & subcategory - 303', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 300;
		event.payload.status.subcategory = 303;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 300 & subcategory - 304', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 300;
		event.payload.status.subcategory = 304;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateScanResponse -category - 300 & subcategory - 305', () => {
		const spy = spyOn(component, 'GetCurrentScanningRollingTexts');
		spyOn(component, 'toggle');
		fixture.detectChanges();
		const event = { ...responseData };
		event.payload.status.category = 300;
		event.payload.status.subcategory = 305;
		component.updateScanResponse(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call GetCurrentScanningRollingTexts when passing value', () => {
		component.activeGroup = 'Tune up performance';
		component.GetCurrentScanningRollingTexts('Look for junk in 85 locations');
		const spyToggle = spyOn(component, 'toggle');
		const spyGetCurrentScanningRollingTexts = spyOn(
			component,
			'GetCurrentScanningRollingTexts'
		);
		fixture.detectChanges();
		expect(spyGetCurrentScanningRollingTexts).toHaveBeenCalled();
	});

	it('should open cancel scan modal', () => {
		modalService = TestBed.inject(MatDialog);
		const spy = spyOn(modalService, 'open');
		component.openCancelScanModel();
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateResponse in ngOnChanges', () => {
		component.scheduleScanData = { ...responseData };
		const spy = spyOn(component, 'updateScanResponse');
		component.ngOnChanges({
			isScanningStarted: new SimpleChange(null, null, false),
		});
		expect(spy).toHaveBeenCalled();
	});

	it('should check scanData percentage', () => {
		component.scanData = { ...responseData.payload };
		spyOn(component, 'toggle');
		spyOn(component, 'GetCurrentScanningRollingTexts');
		component.updateScanResponse(responseData);
		expect(component.isLoading).toBe(false);
	});
});
