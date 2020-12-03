import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PageDeviceGamingComponent } from './page-device-gaming.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { FeedbackFormComponent } from '../../feedback-form/feedback-form/feedback-form.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateStore } from '@ngx-translate/core';
import { DevService } from 'src/app/services/dev/dev.service';
import { CookieService } from 'ngx-cookie-service';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';
import { CommsService } from 'src/app/services/comms/comms.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { DialogService } from 'src/app/services/dialog/dialog.service';
const cmsMock = {
	Results: [
		{
			Id: 'e64d43892d8448d088f3e6037e385122',
			Title: 'Header Image DCC',
			ShortTitle: '',
			Description: '',
			FeatureImage:
				'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/DCC_top_image.jpg?v=5cf8a0151ea84c4ca43e906339c3c3b2',
			Action: '',
			ActionType: null,
			ActionLink: null,
			BrandName: 'brandname',
			BrandImage: '',
			Priority: 'P1',
			Page: null,
			Template: 'header',
			Position: null,
			ExpirationDate: null,
			Filters: {
				'DeviceTag.Value': { key: 'System.DccGroup', operator: '==', value: 'true' },
			},
		},
		{
			Id: '8516ba14dba5412ca954c3ccfdcbff90',
			Title: 'Default Header Image',
			ShortTitle: '',
			Description: '',
			FeatureImage:
				'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/Header-Image-Default.jpg?v=5d0bf7fd0065478c977ed284fecac45d',
			Action: '',
			ActionType: null,
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P2',
			Page: null,
			Template: 'header',
			Position: null,
			ExpirationDate: null,
			Filters: null,
		},
	],
	Metadata: { Count: 2 },
};
const cmsServiceMock = {
	fetchCMSContent: (params) => of(cmsMock),
	getOneCMSContent: (res, template, position) => (res = cmsMock.Results),
};
const dashboardServiceMock = jasmine.createSpyObj('DashboardService', [
	'onlineCardContent',
	'offlineCardContent',
	'setDefaultCMSContent',
	'translateString',
]);
const dialogServiceMock = jasmine.createSpyObj('DialogService', [
	'onlineCardContent',
	'offlineCardContent',
]);
const gamingAllCapabilitiesServiceMock = jasmine.createSpyObj('GamingAllCapabilitiesService', [
	'openLenovoIdDialog',
]);
describe('PageDeviceGamingComponent', () => {
	let component: PageDeviceGamingComponent;
	let fixture: ComponentFixture<PageDeviceGamingComponent>;
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				PageDeviceGamingComponent,
				SvgInlinePipe,
				FeedbackFormComponent,
				mockPipe({ name: 'sanitize' }),
			],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule, NgbModule],
			providers: [
				TranslateStore,
				GamingAllCapabilitiesService,
				DialogService,
				DevService,
				CommsService,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDeviceGamingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('#PageDeviceGamingComponent :should create', () => {
		expect(component).toBeTruthy();
	});

	it('#PageDeviceGamingComponent : ngDoCheck protocolAction lenovoid', () => {
		let route: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
		let snapshot: ActivatedRouteSnapshot = route.snapshot;
		snapshot.queryParams = { action: 'lenovoid' };
		spyOn(component, 'ngDoCheck').and.callThrough();
		component.ngDoCheck();
		expect(component['ngDoCheck']).toHaveBeenCalled();
	});

	it('#PageDeviceGamingComponent : ngDoCheck protocolAction modernpreload', () => {
		let route: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
		let snapshot: ActivatedRouteSnapshot = route.snapshot;
		snapshot.queryParams = { action: 'modernpreload' };
		spyOn(component, 'ngDoCheck').and.callThrough();
		component.ngDoCheck();
		expect(component['ngDoCheck']).toHaveBeenCalled();
		const modalService = fixture.debugElement.injector.get(NgbModal);
		modalService.hasOpenModals();
		modalService.dismissAll();
	});

	it('#PageDeviceGamingComponent : onNotification network status online ', () => {
		// const onlineCardContent = fixture.debugElement.injector.get(onlineCardContent);
		dashboardServiceMock.onlineCardContent.positionD = true;
		const onNotificationSpy = spyOn<any>(component, 'onNotification')
			.withArgs(mockNetworkStatusOnline)
			.and.callThrough();
		onNotificationSpy.call(component, mockNetworkStatusOnline);
		expect(component['onNotification']).toHaveBeenCalled();
	});

	it('#PageDeviceGamingComponent : onNotification network status offline ', () => {
		const offNotificationSpy = spyOn<any>(component, 'onNotification')
			.withArgs(mockNetworkStatusOffline)
			.and.callThrough();
		offNotificationSpy.call(component, mockNetworkStatusOffline);
		expect(component['onNotification']).toHaveBeenCalled();
	});

	it('#PageDeviceGamingComponent : onConnectivityClick', () => {
		component.onConnectivityClick({});
		expect(component.onConnectivityClick({})).toBeUndefined();
	});

	// afterEach(() => {
	// 	const modalService = fixture.debugElement.injector.get(NgbModal);
	// 	modalService.hasOpenModals();
	// 	modalService.dismissAll();

	// });
});

const mockNetworkStatusOffline = {
	type: '[NetworkStatus] Offline',
	payload: {
		isOnline: false,
	},
};

const mockNetworkStatusOnline = {
	type: '[NetworkStatus] Online',
	payload: {
		isOnline: true,
	},
};

let mockSystemStatus = {
	memory: {
		total: 8261181440,
		used: 7720923136,
	},
	disk: {
		total: 256060514304,
		used: 93606965248,
	},
	warranty: {
		expired: '2017-10-16T00:00:00.000Z',
		status: 1,
	},
	systemupdate: {
		lastupdate: '2019-10-25T17:27:51',
		status: 1,
	},
};
const mockSecurityStatus = {
	antiVirus: {
		status: 0,
		id: 'anti-virus',
		title: 'Anti-Virus',
		detail: 'Enabled',
		path: 'security/anti-virus',
		type: 'security',
	},
	wifiSecurity: {
		status: 0,
		id: 'firewall',
		title: 'Firewall',
		detail: 'Disabled',
		path: 'security/anti-virus',
		type: 'security',
	},
	passwordManager: {
		status: 2,
		id: 'pwdmgr',
		title: 'Password Manager',
		detail: 'Installed',
		path: 'security/password-protection',
		type: 'security',
	},
	VPN: {
		status: 2,
		id: 'vpn',
		title: 'VPN',
		detail: 'Installed',
		path: 'security/internet-protection',
		type: 'security',
	},
	windowsHello: {
		status: 0,
		id: 'windows-hello',
		title: 'Windows Hello',
		detail: 'disabled',
		path: 'security/windows-hello',
		type: 'security',
	},
};
export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name,
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}
