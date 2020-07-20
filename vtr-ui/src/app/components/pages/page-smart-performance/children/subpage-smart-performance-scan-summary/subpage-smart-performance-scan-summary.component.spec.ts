import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { SubpageSmartPerformanceScanSummaryComponent } from "./subpage-smart-performance-scan-summary.component";
import { CommonService } from "src/app/services/common/common.service";
import { SmartPerformanceService } from "src/app/services/smart-performance/smart-performance.service";
import { SupportService } from "src/app/services/support/support.service";
import { VantageShellService } from "src/app/services/vantage-shell/vantage-shell.service";
import { FormatLocaleDatePipe } from "src/app/pipe/format-locale-date/format-locale-date.pipe";
import { LoggerService } from "src/app/services/logger/logger.service";
import { DevService } from "src/app/services/dev/dev.service";

import { TranslateModule } from "@ngx-translate/core";
import { NgbModalModule, NgbModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import moment from "moment";
import { enumSmartPerformance } from 'src/app/enums/smart-performance.enum';

const res = {
    "Tunecount": 20,
    "Tunesize": 200,
    "Boostcount": 5,
    "Boostsize": 400,
    "Secure": 10,
    "recentscantime":"2020-01-03 22:32:00",
    "lastscanresults":[
      {"scanruntime":"2020-01-03 22:32:00","type":"MS","fixcount":7,"status":"C","Tune": 4,"Boost": 1,"Secure": 2},
      {"scanruntime":"2020-01-03 18:32:00","type":"SS","fixcount":11,"status":"C","Tune": 4,"Boost": 2,"Secure": 5},
      {"scanruntime":"2020-01-03 16:32:00","type":"MS","fixcount":7,"status":"C","Tune": 4,"Boost": 1,"Secure": 2},
      {"scanruntime":"2020-01-03 14:32:00","type":"SS","fixcount":10,"status":"C","Tune": 8,"Boost": 1,"Secure": 1}
  ]
  }

describe("SubpageSmartPerformanceScanSummaryComponent", () => {
	let component: SubpageSmartPerformanceScanSummaryComponent;
	let fixture: ComponentFixture<SubpageSmartPerformanceScanSummaryComponent>;
	let commonService: CommonService;
	let smartPerformanceService: SmartPerformanceService;
	let supportService: SupportService;
	let shellService: VantageShellService;
	let formatDatePipe: FormatLocaleDatePipe;
	let logger: LoggerService;
    let devService: DevService;
    let modalService: NgbModal

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [SubpageSmartPerformanceScanSummaryComponent],
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				TranslateModule.forRoot(),
				NgbModalModule,
				NgbModule,
			],
			providers: [
				CommonService,
				SmartPerformanceService,
				SupportService,
				VantageShellService,
				FormatLocaleDatePipe,
                DevService,
                NgbModal
                
			],
		});
		fixture = TestBed.createComponent(
			SubpageSmartPerformanceScanSummaryComponent
		);
		component = fixture.componentInstance;
	}));

	it("should create SubpageSmartPerformanceScanSummaryComponent", () => {
		commonService = TestBed.get(CommonService);
		spyOn(commonService, "getLocalStorageValue").and.returnValues(
			"ThinkPad E470",
			true
		);
		fixture.detectChanges();
		expect(component).toBeTruthy();
    });

    it("should create SubpageSmartPerformanceScanSummaryComponent - else case in ngInit", () => {
		commonService = TestBed.get(CommonService);
		spyOn(commonService, "getLocalStorageValue").and.returnValues(
			undefined,
			false
		);
		fixture.detectChanges();
		expect(component).toBeTruthy();
    });
    
    it('should retrieve last 5 scan history', () => {
        const startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        smartPerformanceService = TestBed.get(SmartPerformanceService)
        const spy = spyOn(smartPerformanceService, 'getHistory').and.returnValue(Promise.resolve(res));
        component.getHistory(startDate, endDate);
        expect(spy).toHaveBeenCalled();
    });

    it('should format memory size', () => {
        const res = component.formatMemorySize(5)
        expect(res).toEqual(5)
    });

    it('should format memory size - else case', () => {
        component.formatMemorySize(0)
        expect(component.sizeExtension).toEqual('')
    });

    it('should fetch next scan run time', () => {
        const scantype = enumSmartPerformance.SCHEDULESCANANDFIX;
        const res: any = {nextruntime: '2020-06-17T17:45:00' } 
        smartPerformanceService = TestBed.get(SmartPerformanceService);
        const spy = spyOn(smartPerformanceService, 'getNextScanRunTime').and.returnValue(Promise.resolve(res));
        component.getNextScanRunTime(scantype);
        expect(spy).toHaveBeenCalled();
    });

    it('should fetch next scan run time - else case', () => {
        const scantype = enumSmartPerformance.SCHEDULESCANANDFIX;
        const res: any = {} 
        smartPerformanceService = TestBed.get(SmartPerformanceService);
        const spy = spyOn(smartPerformanceService, 'getNextScanRunTime').and.returnValue(Promise.resolve(res));
        component.getNextScanRunTime(scantype);
        expect(spy).toHaveBeenCalled();
    });

    it('should call scanSummaryTIme when parameter value is 1', () => {
        component.scanSummaryTime(1);
        expect(component.isFromDate).toBe(true)
    });

    it('should call scanSummary - when no yearObj', () => {
        component.isLoading = false;
        const spy = spyOn(component, 'getYearObj').and.returnValue(null)
        component.scanSummaryTime(0);
        expect(spy).toHaveBeenCalled();
    });

    it('should call scanSummary - else case', () => {
        component.isLoading = true;
        const spy = spyOn(component, 'getYearObj')
        component.scanSummaryTime(0);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call customDateScanSummary', () => {
        component.selectedfromDate = {
            day: 'Monday',
            month: 5,
            year: 2020
        };
        component.selectedTodate = {
            day: 'Monday',
            month: 5,
            year: 2020
        }
        component.customDateScanSummary();
        expect(component.isDropDownOpen).toBe(false);
    });

    it('should call onDateSelected - if case', () => {
        component.selectedfromDate = {
            day: 'Monday',
            month: 5,
            year: 2020
        };
        logger = TestBed.get(LoggerService)
        component.isFromDate = true;
        const spy = spyOn(logger, 'info')
        component.onDateSelected();
        expect(spy).toHaveBeenCalled();
    });

    it('should call onDateSelected - else case', () => {
        component.selectedTodate = {
            day: 'Monday',
            month: 5,
            year: 2020
        };
        logger = TestBed.get(LoggerService)
        component.isFromDate = false;
        const spy = spyOn(logger, 'info')
        component.onDateSelected();
        expect(spy).toHaveBeenCalled();
    });

    it('should expand row - if case', () => {
        const val = 1;
        component.toggleValue = 1;
        component.expandRow(val);
        expect(component.toggleValue).toBe(null);
    });

    it('should expand row - else case', () => {
        const val = 1;
        component.toggleValue = 0;
        component.expandRow(val);
        expect(component.toggleValue).toBe(val);
    });

    it('should emit nothing', () => {
        component.isLoading = false;
        const spy = spyOn(component.backToScan, 'emit')
        component.ScanNowSummary();
        expect(spy).toHaveBeenCalled();
    });

    it('should call BackToSummary', () => {
        component.inputIsScanningCompleted = true;
        component.BackToSummary();
        expect(component.inputIsScanningCompleted).toBe(false);
    });

    it('should call changeScanSchedule', () => {
        component.scanToggleValue = true;
        component.changeScanSchedule();
        expect(component.isChangeSchedule).toBe(true)
    });

    it('should call changeNextScanDateValue - if case', () => {
        const nextScanScheduleEvent = {
            nextEnable: false,
        };
        component.changeNextScanDateValue(nextScanScheduleEvent);
        expect(component.enableNextText).toBe(false)
    });

    it('should call changeNextScanDateValue', () => {
        const nextScanScheduleEvent = {
            nextEnable: true,
            nextScanDate: '06/22',
            nextScanHour: '08',
            nextScanMin: '56',
            nextScanAMPM: 'PM',
            nextScanDateWithYear: '06/22/2020'
        };
        component.changeNextScanDateValue(nextScanScheduleEvent);
        expect(component.enableNextText).toBe(true)
    });

    it('should call annualScanSummary', () => {
        const annualYear = {
			displayName: '2019-2020',
			startDate: '2019-12-01 05:20:09',
			endDate: '2020-05-31 10:10:10'
        }
        component.anualScanSummary(annualYear);
        expect(component.tabIndex).toBe(0)
    });

    it('should call quarterlyScanSummary', () => {
        const val = {
            startDate: '2019-12-01 05:20:09',
            endDate: '2020-05-31 10:10:10'
        };
        component.quarterlyScanSummary(val);
        expect(component.isDropDownOpen).toBe(false)
    });

    it('should call openDropDown', () => {
        component.isDropDownOpen = false;
        component.openDropDown();
        expect(component.isDropDownOpen).toBe(true)
    });

    it('should call openDropDown - if case', () => {
        component.isDropDownOpen = true;
        component.oldDisplayFromDate = '01/10/2020',
        component.oldDisplayToDate = '03/10/2020'
        component.openDropDown();
        expect(component.isDropDownOpen).toBe(false)
    });

    it('should open Feedback form', () => {
        modalService = TestBed.get(NgbModal);
        const spy = spyOn(modalService, 'open');
        component.onclickFeedback();
        expect(spy).toHaveBeenCalled();
    });

    it('should open openSubscribeModal', () => {
        modalService = TestBed.get(NgbModal);
        const spy = spyOn(modalService, 'open');
        component.openSubscribeModal();
        expect(spy).toHaveBeenCalled();
    });

    it('should call backToNonSubscriberHome', () => {
        const spy = spyOn(component.backToNonSubscriber, 'emit');
        component.backToNonSubScriberHome();
        expect(spy).toHaveBeenCalled();
    });

    it('should call selectFromDate', () => {
        component.selectFromDate();
        expect(component.isFromDate).toBe(true)
    });

    it('should call selectToDate', () => {
        component.selectToDate();
        expect(component.isFromDate).toBe(false)
    });

    it('should display last scan result', () => {
        const response = {
			type: 0,
			percentage: 0,
			errorcode: 0,
			errordesc: "",
			payload: {
				scanruntime: "2020-05-08 17:48:30",
				type: "MS",
				fixcount: 78,
				status: "C",
				Tune: 77,
				Boost: 1,
				Secure: 0,
				rating: 8,
			},
        };
        smartPerformanceService = TestBed.get(SmartPerformanceService);
        component.isSubscribed = true;
        spyOn(smartPerformanceService, 'getLastScanResult').and.returnValue(Promise.resolve(response));
        component.getLastScanResult();
        expect(component.isScanning).toBe(false)
    });

    it('should clear date input fields', () => {
        component.resetCustomDateScanSummary();
        expect(component.displayFromDate).toBeNull()
    });

    it('should open schedule dropdown', () => {
        component.scheduleTab = 1;
        component.openScanScheduleDropDown(1);
        expect(component.scheduleTab).toBe('')
    });

    it('should open schedule dropdown -else case', () => {
        component.scheduleTab = 1;
        component.openScanScheduleDropDown(3);
        expect(component.scheduleTab).toBe(3)
    });

    it('should save changed scan schedule', () => {
        component.saveChangedScanSchedule();
        expect(component.isChangeSchedule).toBe(false);
    });

    it('should cancel changed scan schedule', () => {
        component.cancelChangedScanSchedule();
        expect(component.isChangeSchedule).toBe(false);
    });

    it('should toggle enable switch', () => {
        const event = {switchValue: true};
        component.setEnableScanStatus(event);
        expect(component.scanToggleValue).toBe(true);
    });

    it('should call changeScanScheduleDate', () => {
        component.changeScanScheduleDate();
        expect(component.scheduleTab).toBe('')
    });
});