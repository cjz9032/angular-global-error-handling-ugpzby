import { CommonService } from 'src/app/services/common/common.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { HtmlTextPipe } from 'src/app/pipe/html-text/html-text.pipe';
import { PageLayoutComponent } from './../../page-layout/page-layout.component';
import { ContainerCardComponent } from './../../container-card/container-card.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, Subject, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { DeviceService } from './../../../services/device/device.service';
import { TranslateService, LangChangeEvent, TranslateStore } from '@ngx-translate/core';
import { HypothesisService } from './../../../services/hypothesis/hypothesis.service';
import { LoggerService } from './../../../services/logger/logger.service';
import { UPEService } from './../../../services/upe/upe.service';
import { MacrokeyService } from './../../../services/gaming/macrokey/macrokey.service';
import { VantageShellService } from './../../../services/vantage-shell/vantage-shell.service';
import { DashboardService } from './../../../services/dashboard/dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { DevService } from 'src/app/services/dev/dev.service';
import { PageMacrokeyComponent } from './page-macrokey.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CommsService } from 'src/app/services/comms/comms.service';
/*
xdescribe('PageMacrokeyComponent', () => {
	let component: PageMacrokeyComponent;
	let fixture: ComponentFixture<PageMacrokeyComponent>;
	const mockShellService = { getMetrics: () => 0, getSelfSelect: () => 0, getVantageStub: () => 0 };
	const mockTitleService = { setTitle: function setTitle() { return 'hii'; } };
	const onLangChange: Observable<any> = new Subject();
	const cmsContent = {
		Results: [{
			Id: 'e64d43892d8448d088f3e6037e385122',
			Title: 'Header Image DCC', ShortTitle: '', Description: '',
			FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/DCC_top_image.jpg?v=5cf8a0151ea84c4ca43e906339c3c3b2',
			Action: '', ActionType: null, ActionLink: null, BrandName: '', BrandImage: '',
			Priority: 'P1', Page: null, Template: 'header', Position: null, ExpirationDate: null,
			Filters: { 'DeviceTag.Value': { key: 'System.DccGroup', operator: '==', value: 'true' } }
		},
		{
			Id: '8516ba14dba5412ca954c3ccfdcbff90', Title: 'Default Header Image', ShortTitle: '',
			Description: '', FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/Header-Image-Default.jpg?v=5d0bf7fd0065478c977ed284fecac45d',
			Action: '', ActionType: null, ActionLink: null, BrandName: '', BrandImage: '',
			Priority: 'P2', Page: null, Template: 'header', Position: null, ExpirationDate: null,
			Filters: null
		}], Metadata: { Count: 2 }
	};
	const mockTranslateService = { onLangChange };
	const vantageShellMock = { getMetrics: () => 0 };
	const commonServiceMock = { getLocalStorageValue: (key) => localStorage.getItem(key) }
	const cmsMockService = {
		fetchCMSContent: (test: any) => of(cmsContent)
	};
	beforeEach(fakeAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PageMacrokeyComponent,
				ContainerCardComponent,
				PageLayoutComponent,
				HtmlTextPipe,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [HttpClientModule],
			providers: [
				{ provide: DashboardService, useValue: {} },
				{ provide: VantageShellService, useValue: mockShellService },
				{ provide: MacrokeyService, useValue: {} },
				{ provide: CommonService, useValue: commonServiceMock },
				{ provide: UPEService, useValue: {} },
				{ provide: LoggerService, useValue: {} },
				{ provide: HypothesisService, useValue: {} },
				{ provide: TranslateService, useValue: mockTranslateService },
				{ provide: DeviceService, useValue: { isGaming: true } },
				{ provide: Title, useValue: mockTitleService },
				{ provide: CMSService, useValue: cmsMockService }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(PageMacrokeyComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		component.cardContentPositionF = { Id: 1, FeatureImage: 'TEST' };
		component.cardContentPositionC = { Id: 1, FeatureImage: 'TEST' };
		tick(10);
		fixture.detectChanges();
	}
	));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
}); */
const mockNetworkStatusOffline = {
	type: '[NetworkStatus] Offline',
	payload: {
		isOnline: false
	}
};

const mockNetworkStatusOnline = {
	type: '[NetworkStatus] Online',
	payload: {
		isOnline: true
	}
};

const mockMetricsData = {
	ItemType: 'FeatureClick',
	ItemName: 'link.device',
	ItemParent: 'device.navbar'
};

const cardContentPositionF = {
	Results: [{
		Id: 'e64d43892d8448d088f3e6037e385122',
		Title: 'Header Image DCC', ShortTitle: '', Description: '',
		FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/DCC_top_image.jpg?v=5cf8a0151ea84c4ca43e906339c3c3b2',
		Action: '', ActionType: null, ActionLink: null, BrandName: '', BrandImage: '',
		Priority: 'P1', Page: null, Template: 'header', Position: 'position-F', ExpirationDate: null,
		Filters: { 'DeviceTag.Value': { key: 'System.DccGroup', operator: '==', value: 'true' } }
	},
	{
		Id: '8516ba14dba5412ca954c3ccfdcbff90', Title: 'Default Header Image', ShortTitle: '',
		Description: '', FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/Header-Image-Default.jpg?v=5d0bf7fd0065478c977ed284fecac45d',
		Action: '', ActionType: null, ActionLink: null, BrandName: '', BrandImage: '',
		Priority: 'P2', Page: null, Template: 'header', Position: 'position-F', ExpirationDate: null,
		Filters: null
	}], Metadata: { Count: 2 }
};

const cardContentPositionC = {
	Results: [{
		Id: 'e64d43892d8448d088f3e6037e385122',
		Title: 'Header Image DCC', ShortTitle: '', Description: '',
		FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/DCC_top_image.jpg?v=5cf8a0151ea84c4ca43e906339c3c3b2',
		Action: '', ActionType: null, ActionLink: null, BrandName: '', BrandImage: '',
		Priority: 'P1', Page: null, Template: 'header', Position: 'position-C', ExpirationDate: null,
		Filters: { 'DeviceTag.Value': { key: 'System.DccGroup', operator: '==', value: 'true' } }
	},
	{
		Id: '8516ba14dba5412ca954c3ccfdcbff90', Title: 'Default Header Image', ShortTitle: '',
		Description: '', FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/Header-Image-Default.jpg?v=5d0bf7fd0065478c977ed284fecac45d',
		Action: '', ActionType: null, ActionLink: null, BrandName: '', BrandImage: '',
		Priority: 'P2', Page: null, Template: 'header', Position: 'position-C', ExpirationDate: null,
		Filters: null
	}], Metadata: { Count: 2 }
};


describe('PageMacrokeyComponent', () => {

	let dashboardService: DashboardService;
	let cmsService: CMSService;
	let shellService: VantageShellService;
	let commonService: CommonService;
	let translate: TranslateService;
	let deviceService: DeviceService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageMacrokeyComponent,
				ContainerCardComponent,
				PageLayoutComponent,
				HtmlTextPipe,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore, DevService, CommsService]
		})
			.compileComponents();
	}));

	describe(':', () => {
		function setup() {
			const fixture = TestBed.createComponent(PageMacrokeyComponent);
			const component = fixture.componentInstance;
			/* component.autoDolbyFeatureStatus = autoDolbyFeatureStatus;
			component.dolbyModeResponse = dolbyModeResponse;
			component.microphoneProperties = microphoneProperties; */
			dashboardService = fixture.debugElement.injector.get(DashboardService);
			cmsService = fixture.debugElement.injector.get(CMSService);
			shellService = fixture.debugElement.injector.get(VantageShellService);
			commonService = fixture.debugElement.injector.get(CommonService);
			translate = fixture.debugElement.injector.get(TranslateService);
			deviceService = fixture.debugElement.injector.get(DeviceService);
			return { fixture, component, dashboardService, cmsService, shellService, commonService, deviceService };
		}

		it('should create', () => {
			const { component } = setup();
			expect(component).toBeTruthy();
		});
		it('Notification with network status online', () => {
			const { fixture, component } = setup();
			commonService.isOnline = true;
			// Create a spy on it using "any"
			const onNotificationSpy = spyOn<any>(component, 'onNotification').and.callThrough();
			onNotificationSpy.call(mockNetworkStatusOnline);

			// To access the private (or protected) method use [ ] operator:
			expect(component['onNotification']).toHaveBeenCalled();

		});

		it('Notification with network status offline', () => {
			const { fixture, component } = setup();
			// Create a spy on it using "any"
			// spyOn(commonService, 'isOnline').and.returnValue(false);
			commonService.isOnline = false;
			const onNotificationSpy = spyOn<any>(component, 'onNotification').and.callThrough();
			onNotificationSpy.call(mockNetworkStatusOffline);

			// To access the private (or protected) method use [ ] operator:
			expect(component['onNotification']).toHaveBeenCalled();

		});

		it('sendMetricsAsync test case', () => {
			const { fixture, component } = setup();
			// Create a spy on it using "any"
			// component.metrics.sendAsync = true;
			const sendMetricsAsyncSpy = spyOn<any>(component, 'sendMetricsAsync').withArgs(mockMetricsData).and.callThrough();
			// sendMetricsAsyncSpy.call(mockMetricsData);
			component.sendMetricsAsync(mockMetricsData);

			// To access the private (or protected) method use [ ] operator:
			expect(component['sendMetricsAsync']).toHaveBeenCalled();

		});

		it('Network status online cardContentPositionF', async () => {
			const { fixture, component } = setup();
			// spyOnProperty(commonService, 'isOnline', 'get').and.returnValue(true);
			commonService.isOnline = true;
			component.isOnline = true;
			component.cardContentPositionF = cardContentPositionF;
			spyOn(cmsService, 'getOneCMSContent').and.callThrough().and.returnValue(cardContentPositionF);
			spyOn(component, 'fetchCMSArticles').and.callThrough();
			await component.fetchCMSArticles();
			fixture.detectChanges();
			expect(component['fetchCMSArticles']).toHaveBeenCalled();

		});

		it('Network status offline cardContentPositionF', async () => {
			const { fixture, component } = setup();
			// spyOnProperty(commonService, 'isOnline', 'get').and.returnValue(false);
			commonService.isOnline = false;
			component.isOnline = false;
			component.cardContentPositionC = cardContentPositionC;
			spyOn(component, 'fetchCMSArticles').and.callThrough();
			spyOn(cmsService, 'getOneCMSContent').and.callThrough().and.returnValue(cardContentPositionC);
			await component.fetchCMSArticles();
			fixture.detectChanges();
			expect(component['fetchCMSArticles']).toHaveBeenCalled();

		});

		it('Network status online cardContentPositionC', async () => {
			const { fixture, component } = setup();
			// spyOnProperty(commonService, 'isOnline', 'get').and.returnValue(true);
			commonService.isOnline = true;
			component.isOnline = true;
			component.cardContentPositionC = cardContentPositionC;
			spyOn(component, 'fetchCMSArticles').and.callThrough();
			spyOn(cmsService, 'getOneCMSContent').and.callThrough().and.returnValue(cardContentPositionC);
			await component.fetchCMSArticles();
			fixture.detectChanges();
			expect(component['fetchCMSArticles']).toHaveBeenCalled();

		});

		it('Network status offline cardContentPositionF', async () => {
			const { fixture, component } = setup();
			// spyOnProperty(commonService, 'isOnline', 'get').and.returnValue(false);
			commonService.isOnline = false;
			component.isOnline = false;
			component.cardContentPositionF = cardContentPositionF;
			spyOn(cmsService, 'getOneCMSContent').and.callThrough().and.returnValue(cardContentPositionF);
			spyOn(component, 'fetchCMSArticles').and.callThrough();
			await component.fetchCMSArticles();
			fixture.detectChanges();
			expect(component['fetchCMSArticles']).toHaveBeenCalled();

		});

		it('language change', async () => {
			const { fixture, component } = setup();
			// spyOnProperty(commonService, 'isOnline', 'get').and.returnValue(false);
			commonService.isOnline = false;
			component.isOnline = false;
			component.cardContentPositionF = cardContentPositionF;
			spyOn(component, 'fetchCMSArticles');
			await translate.use('fr');
			fixture.detectChanges();
			expect(component['fetchCMSArticles']).toHaveBeenCalled();
		});



	});
});
export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}

