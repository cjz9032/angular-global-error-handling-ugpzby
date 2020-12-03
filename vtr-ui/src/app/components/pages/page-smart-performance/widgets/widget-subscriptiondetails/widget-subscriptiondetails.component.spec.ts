import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { CommonService } from 'src/app/services/common/common.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { SupportService } from 'src/app/services/support/support.service';
import { WidgetSubscriptionDetailsComponent } from './widget-subscriptiondetails.component';

const response = {
	code: 0,
	costMillis: 49,
	msg: {
		desc: 'Success',
		value: null,
	},
	data: [
		{
			cartId: '0144989263',
			orderNumber: 'COMPUS20200625100024831180836',
			serialNumber: 'PF11B18D',
			paymentMethod: 'CARD',
			payPrice: '64.49',
			currency: 'USD',
			releaseDate: '2020-06-25T10:07:33.068+0000',
			createTime: '2020-06-25T10:00:26.275+0000',
			status: 'COMPLETED',
			products: [
				{
					productCode: '5WS0X58672',
					productName: '3Y Lenovo Smart Performance SW',
					productType: 'SmartPerformance',
					unitTerm: 36,
				},
			],
		},
	],
};

describe('WidgetSubscriptionDetailsComponent', () => {
	let component: WidgetSubscriptionDetailsComponent;
	let fixture: ComponentFixture<WidgetSubscriptionDetailsComponent>;
	let modalService: NgbModal;
	let commonService: CommonService;
	let localCacheService: LocalCacheService;
	let smartPerformanceService: SmartPerformanceService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [WidgetSubscriptionDetailsComponent],
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

		fixture = TestBed.createComponent(WidgetSubscriptionDetailsComponent);
		component = fixture.componentInstance;
	}));

	it('should create Widget Subscriptiondetails Component', () => {
		const res = { ...response };
		commonService = TestBed.inject(CommonService);
		smartPerformanceService = TestBed.inject(SmartPerformanceService);
		spyOn(commonService, 'getLocalStorageValue').and.returnValues(true, true);
		spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(res));
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should call initSubscripionDetails when spFirstRunStatus is false', async () => {
		localCacheService = TestBed.inject(LocalCacheService);
		spyOn(localCacheService, 'getLocalCacheValue').and.returnValues(
			Promise.resolve(true),
			Promise.resolve(false),
			Promise.resolve({ startDate: '2019/06/20', endDate: '2020/06/19' }),
			Promise.resolve({ initiatedTime: '08:30', isOpened: true })
		);
		smartPerformanceService.isSubscribed = true;
		await component.initSubscripionDetails();
		fixture.detectChanges();
		expect(component.strStatus).toEqual('PROCESSING');
	});

	it('should create Widget Subscriptiondetails Component - settimeout', fakeAsync(() => {
		const res = {};
		commonService = TestBed.inject(CommonService);
		smartPerformanceService = TestBed.inject(SmartPerformanceService);
		const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(
			Promise.resolve(res)
		);
		fixture.detectChanges();
		tick(30000);
		expect(spy).toHaveBeenCalled();
	}));

	it('should open subcription modal', () => {
		modalService = TestBed.inject(NgbModal);
		const modalCancel: any = {
			componentInstance: {
				cancelPaymentRequest: new Observable<any>(),
			},
		};
		const spy = spyOn(modalService, 'open').and.returnValue(modalCancel);
		component.openSubscribeModal();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it('should enable full feature', () => {
		commonService = TestBed.inject(CommonService);
		smartPerformanceService.isSubscribed = false;
		const spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(false);
		const event = {};
		component.enableFullFeature(event);
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it('should get subscription details', async () => {
		localCacheService = TestBed.inject(LocalCacheService);
		smartPerformanceService = TestBed.inject(SmartPerformanceService);
		const spy = spyOn(localCacheService, 'getLocalCacheValue').and.resolveTo({
			initiatedTime: '08:30',
			isOpened: true,
		});
		// const spy = spyOn(smartPerformanceService, 'getPaymentDetails').and.returnValue(Promise.resolve(response));
		await component.getSubscriptionDetails();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it('should get subscription details - settimeout else case', (done) => {
		component.spFrstRunStatus = true;
		component.setTimeOutCallForSubDetails();
		fixture.detectChanges();
		expect(component.isLoading).toBe(false);
		done();
	});

	it('should call subscriptionDataProcess', async () => {
		commonService = TestBed.inject(CommonService);
		smartPerformanceService = TestBed.inject(SmartPerformanceService);
		component.spProcessStatus = true;
		const subscriptionData = [...response.data];
		await component.subscriptionDataProcess(subscriptionData);
		fixture.detectChanges();
		expect(component.strStatus).toEqual('ACTIVE');
	});
});
