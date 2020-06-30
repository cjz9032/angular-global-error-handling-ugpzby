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

	it("should create Widget Subscriptiondetails Component", () => {
		const res = {...response}
		commonService = TestBed.get(CommonService);
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		spyOn(commonService, "getLocalStorageValue").and.returnValues(true, true);
		spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(res));
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it("should create Widget Subscriptiondetails Component - data is empty array  spFirstRunStatus is false", () => {
		const res = {...response, data: []}
		commonService = TestBed.get(CommonService);
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		spyOn(commonService, "getLocalStorageValue").and.returnValues(true, true);
		const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(res));
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	});

	it("should create Widget Subscriptiondetails Component - spFirstRunStatus is false", () => {
		const res = {...response, data: []}
		commonService = TestBed.get(CommonService);
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		spyOn(commonService, "getLocalStorageValue").and.returnValues(false, true, {startDate: '2019/06/20', endDate: '2020/06/19'}, {
			initiatedTime: "08:30",
			isOpened: true,
		});
		const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(res));
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	});

	it("should create Widget Subscriptiondetails Component - settimeout", fakeAsync(() => {
		const res = {}
		commonService = TestBed.get(CommonService);
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		// spyOn(commonService, "getLocalStorageValue").and.returnValues(false, true, {startDate: '2019/06/20', endDate: '2020/06/19'}, {
		// 	initiatedTime: "08:30",
		// 	isOpened: true,
		// });
		const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(res));
		fixture.detectChanges();
		tick(30000)
		expect(spy).toHaveBeenCalled()
	}));

	it("should create Widget Subscriptiondetails Component - spFirstRunStatus is false, non-subscriber", () => {
		commonService = TestBed.get(CommonService);
		smartPerformanceService = TestBed.get(SmartPerformanceService);
		spyOn(commonService, "getLocalStorageValue").and.returnValues(false, false, {startDate: '2019/06/20', endDate: '2020/06/19'}, {
			initiatedTime: "10:30",
			isOpened: false,
		});
		fixture.detectChanges();
		expect(component.strStatus).toBe('INACTIVE')
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
		// component.isSubscribed = false;
		// 	component.modalStatus = {
		// 	initiatedTime: moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
		// 	isOpened: true,
		// }
		const spy = spyOn(commonService, "getLocalStorageValue").and.returnValues(false, false, {startDate: '2019/06/20', endDate: '2020/06/19'}, {
			initiatedTime: "10:30",
			isOpened: false,
		});
		const event = {};
		component.enableFullFeature(event);
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	// it("should get subscription details", () => {
    //     commonService = TestBed.get(CommonService);
    //     smartPerformanceService = TestBed.get(SmartPerformanceService)
	// 	spyOn(commonService, "getLocalStorageValue").and.returnValue({
	// 		initiatedTime: "08:30",
	// 		isOpened: true,
    //     });
    //     const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(response));
    //     component.getSubscriptionDetails();
    //     fixture.detectChanges();
    //     expect(spy).toHaveBeenCalled();
	// });
	
	// it("should get subscription details - when no response", () => {
	// 	component.spFrstRunStatus = true
	// 	commonService = TestBed.get(CommonService);
    //     smartPerformanceService = TestBed.get(SmartPerformanceService)
	// 	spyOn(commonService, "getLocalStorageValue").and.returnValue({
	// 		initiatedTime: "08:30",
	// 		isOpened: true,
    //     });
    //     const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve({}));
    //     component.getSubscriptionDetails();
    //     fixture.detectChanges();
    //     expect(spy).toHaveBeenCalled();
    // });
	
	
	// it("should get subscription details - when no response and spFirstRunStatus is false", () => {
	// 	component.spFrstRunStatus = false
	// 	commonService = TestBed.get(CommonService);
    //     smartPerformanceService = TestBed.get(SmartPerformanceService)
	// 	// spyOn(commonService, "getLocalStorageValue").and.returnValue({
	// 	// 	initiatedTime: "08:30",
	// 	// 	isOpened: true,
    //     // });
    //     const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve());
    //     component.getSubscriptionDetails();
    //     fixture.detectChanges();
    //     expect(spy).toHaveBeenCalled();
	// });
	
    // it("should get subscription details - settimeout else case", fakeAsync(() => {
    // 	// component.intervalTime = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
	// 	const res = {...response, data: []};
	// 	component.modalStatus = {
	// 		initiatedTime: moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
	// 		isOpened: true,
	// 	}
    //     commonService = TestBed.get(CommonService);
	// 	smartPerformanceService = TestBed.get(SmartPerformanceService);
	// 	spyOn(commonService, "getLocalStorageValue").and.returnValues(false, true, {startDate: '2019/06/20', endDate: '2020/06/19'});
		
    //     spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(res));
    //     // component.getSubscriptionDetails();
    //     fixture.detectChanges();
    //     tick(30000);
    //     expect(spy).toHaveBeenCalled();
	// }));
});
