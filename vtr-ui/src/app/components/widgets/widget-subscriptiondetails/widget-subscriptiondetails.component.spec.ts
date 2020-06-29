import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { WidgetSubscriptiondetailsComponent } from "./widget-subscriptiondetails.component";
import { LoggerService } from "src/app/services/logger/logger.service";
import { SupportService } from "src/app/services/support/support.service";
import { SmartPerformanceService } from "src/app/services/smart-performance/smart-performance.service";
import { CommonService } from "src/app/services/common/common.service";
import { FormatLocaleDatePipe } from "src/app/pipe/format-locale-date/format-locale-date.pipe";
import { DevService } from "src/app/services/dev/dev.service";

import { TranslateModule } from "@ngx-translate/core";
import { NgbModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import moment from 'moment';

describe("WidgetSubscriptiondetailsComponent", () => {
	let component: WidgetSubscriptiondetailsComponent;
	let fixture: ComponentFixture<WidgetSubscriptiondetailsComponent>;
	let modalService: NgbModal;
	let commonService: CommonService;
	let smartPerformanceService: SmartPerformanceService;
	let supportService: SupportService;
	let formatLocale: FormatLocaleDatePipe;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [WidgetSubscriptiondetailsComponent],
			imports: [
				TranslateModule.forRoot(),
				NgbModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				NgbModal,
				LoggerService,
				SupportService,
				SmartPerformanceService,
				CommonService,
				FormatLocaleDatePipe,
				DevService,
			],
		});

		fixture = TestBed.createComponent(WidgetSubscriptiondetailsComponent);
		component = fixture.componentInstance;
	}));

	it("should create", () => {
		commonService = TestBed.get(CommonService);
		spyOn(commonService, "getLocalStorageValue").and.returnValue(true);
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it("should set subscription status - processing", () => {
		commonService = TestBed.get(CommonService);
		spyOn(commonService, "getLocalStorageValue").and.returnValue({
			initiatedTime: "08:30",
			isOpened: true,
		});
		component.initSubscripionDetails();
		fixture.detectChanges();
		expect(component.strStatus).toEqual("PROCESSING");
	});

	it("should set subscription status - inactive", () => {
		commonService = TestBed.get(CommonService);
		spyOn(commonService, "getLocalStorageValue").and.returnValue(false);
		component.initSubscripionDetails();
		expect(component.strStatus).toEqual("INACTIVE");
	});

	it("should enable full feature", () => {
		commonService = TestBed.get(CommonService);
		component.isSubscribed = false;
		const spy = spyOn(
			commonService,
			"getLocalStorageValue"
		).and.returnValue(false);
		const event = {};
		component.enableFullFeature(event);
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
    });
    
    it("should enable full feature - when LS is true", () => {
		commonService = TestBed.get(CommonService);
		component.isSubscribed = false;
		const spy = spyOn(
			commonService,
			"getLocalStorageValue"
		).and.returnValue(true);
		const event = {};
		component.enableFullFeature(event);
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it("should open subcription modal", () => {
		modalService = TestBed.get(NgbModal);
		const modalCancel: any = {
			componentInstance: {
				cancelPaymentRequest: new Observable<any>(),
			},
		};
		const spy = spyOn(modalService, "open").and.returnValue(modalCancel);
		component.openSubscribeModal();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it("should get subscription details", () => {
		const response = {
			code: 0,
			costMillis: 49,
			msg: {
				desc: "Success",
				value: null,
			},
			data: [
				{
					cartId: "0144989263",
					orderNumber: "COMPUS20200625100024831180836",
					serialNumber: "PF11B18D",
					paymentMethod: "CARD",
					payPrice: "64.49",
					currency: "USD",
					releaseDate: "2020-06-25T10:07:33.068+0000",
					createTime: "2020-06-25T10:00:26.275+0000",
					status: "COMPLETED",
					products: [
						{
							productCode: "5WS0X58672",
							productName: "3Y Lenovo Smart Performance SW",
							productType: "SmartPerformance",
							unitTerm: 36,
						},
					],
				},
			],
		};
        commonService = TestBed.get(CommonService);
        smartPerformanceService = TestBed.get(SmartPerformanceService)
		spyOn(commonService, "getLocalStorageValue").and.returnValue({
			initiatedTime: "08:30",
			isOpened: true,
        });
        const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(response));
        component.getSubscriptionDetails();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });

    it("should get subscription details - when no response", () => {
        commonService = TestBed.get(CommonService);
        smartPerformanceService = TestBed.get(SmartPerformanceService)
		spyOn(commonService, "getLocalStorageValue").and.returnValue({
			initiatedTime: "08:30",
			isOpened: true,
        });
        const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(null));
        component.getSubscriptionDetails();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });
    
    it("should get subscription details - settimeout else case", fakeAsync(() => {
    //    component.intervalTime = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
		const response = {
			code: 0,
			costMillis: 49,
			msg: {
				desc: "Success",
				value: null,
			},
			data: null
		};
        commonService = TestBed.get(CommonService);
        smartPerformanceService = TestBed.get(SmartPerformanceService)
		spyOn(commonService, "getLocalStorageValue").and.returnValue({
			initiatedTime: "08:30",
			isOpened: true,
        });
        const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(response));
        component.getSubscriptionDetails();
        fixture.detectChanges();
        tick(30000);
        expect(spy).toHaveBeenCalled();
	}));
});
