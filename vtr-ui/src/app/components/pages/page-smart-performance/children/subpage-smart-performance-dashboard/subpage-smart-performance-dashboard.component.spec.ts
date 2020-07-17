import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChanges, SimpleChange } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SubpageSmartPerformanceDashboardComponent } from './subpage-smart-performance-dashboard.component';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { MetricsTranslateService } from 'src/app/services/mertics-traslate/metrics-translate.service';
import { DevService } from 'src/app/services/dev/dev.service';

import { TranslateModule } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell-mock.service';
import { enumSmartPerformance } from 'src/app/enums/smart-performance.enum';

describe('SubpageSmartPerformanceDashboardComponent', () => {
	let component: SubpageSmartPerformanceDashboardComponent;
	let fixture: ComponentFixture<SubpageSmartPerformanceDashboardComponent>;
	let smartPerformanceService: SmartPerformanceService;
	let commonService: CommonService;
	let modalService: NgbModal;
	let metricsService: MetricService;
	let metricTranslateService: MetricsTranslateService;
	let devService: DevService;
	let shellServices: VantageShellService;
	let logger: LoggerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageSmartPerformanceDashboardComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [
				SmartPerformanceService,
				CommonService,
				LoggerService,
				NgbModal,
				MetricService,
				DevService,
				VantageShellService
			]
		});
		fixture = TestBed.createComponent(SubpageSmartPerformanceDashboardComponent);
		component = fixture.componentInstance;
	});

	it('should create SubpageSmartPerformanceDashboardComponent', async(() => {
		commonService = TestBed.get(CommonService);
		smartPerformanceService = TestBed.get(SmartPerformanceService)
		shellServices = TestBed.get(VantageShellService)
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(undefined)
		spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(false));
		smartPerformanceService.isShellAvailable = true
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should delete record from task-scheduler', async(() => {
		const scantype = enumSmartPerformance.SCHEDULESCAN
		commonService = TestBed.get(CommonService);
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(true)
		const spy = spyOn(component, 'unregisterScheduleScan')
		fixture.detectChanges();
		expect(spy).toHaveBeenCalledWith(scantype)
	}));

	it('should check readiness for scan - else case', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService)
		spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(true));
		component.checkReadiness()
		fixture.detectChanges();
		expect(component.isScanning).toEqual(false)
	}));

	it('should check readiness for scan - reject', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		logger = TestBed.get(LoggerService)
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.reject('error'));
		component.checkReadiness()
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should call changeScanStatus', async(() => {	
		const event = {
			boost: 60,
			rating: 8,
			secure: 5,
			tune: 75,
		}
		component.changeScanStatus(event);
		fixture.detectChanges();
		expect(component.isScanningCompleted).toBe(true)
	}));

	it('should call updateSubItemsList - if case', async(() => {
		const subitem = { items: ['abc', 'hello'] }
		component.updateSubItemsList(subitem);
		fixture.detectChanges();
		expect(component.subItems.length).not.toEqual(0)
	}));

	it('should call updateSubItemsList - else case', async(() => {
		const subitem = {}
		component.updateSubItemsList(subitem);
		fixture.detectChanges();
		expect(component.subItems.length).toEqual(0)
	}));

	it('should scan from summary page - when getReadiness is true', async(() => {
		commonService = TestBed.get(CommonService)
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(true)
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(true));
		component.changeScanEvent();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should scan from summary page - when getReadiness is true and not subscribed', async(() => {
		commonService = TestBed.get(CommonService)
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(false)
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(true));
		component.changeScanEvent();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should scan from summary page - when getReadiness is false', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(false));
		component.changeScanEvent();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should scan from summary page - when getReadiness returns error', async(() => {
		commonService = TestBed.get(CommonService)
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(true)
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.reject('error'));
		component.changeScanEvent();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should update schedule scan status', async(() => {
		const event: any = {
			type: 1,
			percentage: 0,
			errorcode: 0,
			errordesc: null,
			payload: {
				status: { category: 100, subcategory: 103, final: "Running" },
				result: { tune: 0, boost: 0, secure: 0 },
				rating: 0,
				percentage: 10,
			},
			state: true,
		};
		component.updateScheduleScanStatus(event);
		fixture.detectChanges();
		expect(component.scheduleScanObj).toBe(event)
	}));

	it('should update schedule scan status - else case', async(() => {
		const event: any = {};
		component.updateScheduleScanStatus(event);
		fixture.detectChanges();
		expect(component.scheduleScanObj).toBe(null)
	}));

	it('should open subscription modal', async(() => {
		modalService = TestBed.get(NgbModal);
		const spy = spyOn(modalService, 'open');
		component.openSubscribeModal();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should open feedback form modal', async(() => {
		modalService = TestBed.get(NgbModal);
		const spy = spyOn(modalService, 'open');
		component.onclickFeedback();
		expect(spy).toHaveBeenCalled()
	}));

	it('should cancel scanning', async(() => {
		component.cancelScanfromScanning();
		fixture.detectChanges();
		expect(component.isScanning).toBe(false)
	}));

	it('should change Manage Subsciption', async(() => {
		commonService = TestBed.get(CommonService);
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(true)
		const event = {eventname: 'changeSubcription'};
		component.changeManageSubscription(event);
		fixture.detectChanges();
		expect(component.isSubscribed).toBe(true)
	}));

	it('should change to Summary Home', async(() => {
		component.changeSummaryToHome();
		expect(component.isScanning).toBe(false)
	}));

	it('should start scanning - getReadiness returns true', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(true));
		component.scanNow();
		fixture.detectChanges();
		expect(component.isScheduleScanRunning).toBe(false)
	}));

	it('should start scanning - getReadiness returns false', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(false));
		component.scanNow();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should start scanning - getReadiness returns false when shell not available', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = false;
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(false));
		component.scanNow();
		fixture.detectChanges();
		expect(spy).not.toHaveBeenCalled()
	}));

	it('should start scanning - getReadiness throw error', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.reject('error'));
		component.scanNow();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should get smart performance schedule scan status', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		commonService = TestBed.get(CommonService);
		const res = {scanStatus: 'scanning'};
		smartPerformanceService.isShellAvailable = true;
		spyOn(smartPerformanceService, 'getScheduleScanStatus').and.returnValue(Promise.resolve(res));
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(true);
		spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(true));
		component.getSmartPerformanceScheduleScanStatus();
		fixture.detectChanges();
		expect(component.showSubscribersummary).toBe(false)
	}));

	it('should get smart performance schedule scan status - when spSubscribeCancelModel is false', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		commonService = TestBed.get(CommonService);
		const res = {scanStatus: 'scanning', result: { tune: 0, boost: 0, secure: 0, }, percentage: 100, rating: 9};
		smartPerformanceService.isShellAvailable = true;
		const spy = spyOn(smartPerformanceService, 'getScheduleScanStatus').and.returnValue(Promise.resolve(res));
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(false);
		spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(true));
		component.getSmartPerformanceScheduleScanStatus();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should detect changes in ngOnChanges', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(false))
		component.isScanningStarted = 0;
		component.ngOnChanges({
			isScanningStarted: new SimpleChange(null, component.isScanningStarted, false)
		});
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should detect changes in ngOnChanges else case', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(false))
		component.isScanningStarted = 0;
		component.ngOnChanges({
			isScanningStarted: new SimpleChange(null, component.isScanningStarted, true)
		});
		fixture.detectChanges();
		expect(spy).not.toHaveBeenCalled()
	}));

	it('should call scanAndFixInformation with res.state true', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		commonService = TestBed.get(CommonService);
		const res = {scanStatus: 'scanning', result: { tune: 0, boost: 0, secure: 0, }, percentage: 100, rating: 9, state: true};
		smartPerformanceService.isShellAvailable = true;
		component.isSubscribed = true;
		spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(true));
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(true);
		const spy = spyOn(smartPerformanceService, 'launchScanAndFix').and.returnValue(Promise.resolve(res));
		component.scanAndFixInformation();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should call scanAndFixInformation with res.state true and when spSubscribeCancelModel is false', async(() => {
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		commonService = TestBed.get(CommonService);
		const res = {scanStatus: 'scanning', result: { tune: 0, boost: 0, secure: 0, }, percentage: 100, rating: 9, state: true};
		smartPerformanceService.isShellAvailable = true;
		component.isSubscribed = true;
		spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(true));
		spyOn(commonService, 'getLocalStorageValue').and.returnValues(true, false);
		const spy = spyOn(smartPerformanceService, 'launchScanAndFix').and.returnValue(Promise.resolve(res));
		component.scanAndFixInformation();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should call cancelScan', async(() => {
		component.cancelScan();
		fixture.detectChanges();
		expect(component.isScanning).toBe(false)
	}));

	it('should call schedule scan', async(() => {
		const scantype = enumSmartPerformance.SCHEDULESCANANDFIX;
		const frequency = 'onceaweek';
		const day = 'Thursday';
		const time = "2019-03-15T12:00:00";
		const date = [];
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		const spy = spyOn(smartPerformanceService, 'setScanSchedule');
		component.scheduleScan(scantype, frequency, day, time, date);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call schedule scan throw error', async(() => {
		const scantype = enumSmartPerformance.SCHEDULESCANANDFIX;
		const frequency = 'onceaweek';
		const day = 'Thursday';
		const time = "2019-03-15T12:00:00";
		const date = [];
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		const spy = spyOn(smartPerformanceService, 'setScanSchedule').and.returnValue(Promise.reject('error'));
		component.scheduleScan(scantype, frequency, day, time, date);
		expect(spy).toHaveBeenCalled()
	}));
});
