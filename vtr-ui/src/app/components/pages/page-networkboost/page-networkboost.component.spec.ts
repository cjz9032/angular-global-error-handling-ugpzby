import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { UiToggleComponent } from './../../ui/ui-toggle/ui-toggle.component';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from 'src/app/services/common/common.service';
//import { DevService } from './../../../services/dev/dev.service';
import { CommsService } from 'src/app/services/comms/comms.service';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PageNetworkboostComponent } from './page-networkboost.component';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
//import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
const cmsServiceMock = jasmine.createSpyObj('CMSService', ['fetchCMSContent', 'getOneCMSContent', 'fetchCMSArticles', 'getTileBSource', 'getFeatureSetting']);
// const commonServiceMock = jasmine.createSpyObj('CommonService', ['isShellAvailable', 'notification', 'getLocalStorageValue', 'subscribe']);
const gamingNetworkBoostMock = jasmine.createSpyObj('NetworkBoostService', ['isShellAvailable', 'setNetworkBoostStatus', 'getNeedToAsk', 'onNotification']);
//const dashboardMock = jasmine.createSpyObj('DashboardService', ['isShellAvailable']);

const notification: Observable<AppNotification> = new BehaviorSubject<AppNotification>(
	new AppNotification('init')
);
// commonServiceMock.notification.and.returnValue(notification);
const commonServiceMock = {
	isShellAvailable: true,
	notification,
	getLocalStorageValue(id) { return localStorage.getItem(id); }
};





const cmsCardResponse = {
	Results: [
		{
			Id: '0630e91c940f4422a3deb607acb5608d',
			Title: 'Lenovo StoryHub',
			ShortTitle: '',
			Description: 'The passion, people, innovation, and dedication behind Lenovo\'s global endeavors.',
			FeatureImage:
				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/4x3-Card-StoryHub-No-Overlay.png?v=09622a20277c45bbba231663e06267fb',
			Action: '',
			ActionType: 'External',
			ActionLink: 'https://news.lenovo.com/',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-B',
			ExpirationDate: null,
			Filters: null
		},
		{
			Id: '80165a02226745b2b40ad4b8b1dfb080',
			Title: 'Accessories',
			ShortTitle: '',
			Description: 'Looking for accessories to complete your PC experience?',
			FeatureImage:
				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/4x4-Accessories-External-Link-1.jpg?v=c8257e543d764ceb89d94a6d8d261a16',
			Action: 'Explore Now',
			ActionType: 'External',
			ActionLink: 'https://www.lenovo.com/us/en/accessories-and-monitors/c/ACCESSORY',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-F',
			ExpirationDate: null,
			Filters: null
		},
		{
			Id: 'dcbbdeab0d0d4154a8f9670c040250a2',
			Title: 'Vantage',
			ShortTitle: '',
			Description: 'Welcome to the next generation of Lenovo Vantage!',
			FeatureImage:
				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/Hero-Banner-Vantage-30.jpg?v=9669be4566484a2283c380b717161806',
			Action: '',
			ActionType: null,
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'home-page-hero-banner',
			Position: 'position-A',
			ExpirationDate: null,
			Filters: null
		},
		{
			Id: 'b45a183dddf24c049b013058b0f25b65',
			Title: 'ThinkShield by Lenovo',
			ShortTitle: 'ThinkShield by Lenovo',
			Description: 'Complete end-to-end security solutions',
			FeatureImage:
				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/4x3-Card-Security-101-No-Overlay.png?v=09622a20277c45bbba231663e06267fb',
			Action: '',
			ActionType: 'External',
			ActionLink:
				'https://news.lenovo.com/pressroom/press-releases/introducing-thinkshield-by-lenovo-complete-end-to-end-security-solutions-that-keep-companies-safer.htm',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-C',
			ExpirationDate: null,
			Filters: null
		},
		{
			Id: '5958939256e54675968a7b31f398a01d',
			Title: 'Lenovo Support',
			ShortTitle: 'Lenovo Support',
			Description: 'Tech support with the Premier difference',
			FeatureImage:
				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/4x4-Card-Support.jpg?v=7878ded6d6344238a216c1961a98a9f2',
			Action: 'Read More',
			ActionType: 'External',
			ActionLink: 'https://www.lenovo.com/us/en/premier-support/',
			BrandName: '',
			BrandImage: '',
			Priority: 'P2',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-E',
			ExpirationDate: null,
			Filters: null
		},
		{
			Id: '648b75a52b8f4aad8e63439a3d69ca4a',
			Title: 'Provision your system using Lenovo Cloud Deploy',
			ShortTitle: '',
			Description: 'You will need your Lenovo Cloud Deploy Customer Key.',
			FeatureImage:
				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/4x4-Lenovo-Cloud-Deploy.jpg?v=5c3d7c6593de4d94b475f6c129c9bd32',
			Action: 'Click to Continue',
			ActionType: 'External',
			ActionLink: 'https://LenovoCloudDeploy.com/Vantage',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-top-image-title-link',
			Position: 'position-E',
			ExpirationDate: null,
			Filters: { and: [{ 'GEOs.Any': ['US'] }, { 'Segments.Any': ['Commercial', 'SMB'] }] }
		},
		{
			Id: 'ca1fa898b60946369fda234010c1da3a',
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage:
				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/8x3-Card-Gamestore.jpg?v=3f80a67da7554573a50cfa8592d51f59',
			Action: '',
			ActionType: 'External',
			ActionLink: 'https://gamestore.lenovo.com',
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'full-width-title-image-background',
			Position: 'position-D',
			ExpirationDate: null,
			Filters: null
		}
	],
	Metadata: { Count: 7 }
};
const queryOptions = {
	Page: 'dashboard',
	Lang: 'EN',
	GEO: 'US',
	OEM: 'Lenovo',
	OS: 'Windows',
	Segment: 'SMB',
	Brand: 'Lenovo'
};

const notificationObj = {
	payload: { isOnline: true },
	type: NetworkStatus.Online
};


xdescribe('PageNetworkboostComponent', () => {
	let component: PageNetworkboostComponent;
	let fixture: ComponentFixture<PageNetworkboostComponent>;
	gamingNetworkBoostMock.isShellAvailable.and.returnValue(true);
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageNetworkboostComponent, UiToggleComponent,
				mockPipe({ name: 'translate' })],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: NetworkBoostService, useValue: gamingNetworkBoostMock },
				{ provide: CommsService },
				// { provide: DevService },
				{ provide: CMSService, useValue: cmsServiceMock },
				{ provide: CommonService, useValue: commonServiceMock }
				// { provide: DashboardService, useValue: dashboardMock }
			]
		})
			.compileComponents();
		fixture = TestBed.createComponent(PageNetworkboostComponent);
		gamingNetworkBoostMock.setNetworkBoostStatus.and.returnValue(Promise.resolve(true));
		cmsServiceMock.fetchCMSContent.withArgs(queryOptions).and.returnValue(of(cmsCardResponse));
		cmsServiceMock.getOneCMSContent.and.returnValue(cmsCardResponse.Results);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.toggleStatus = false;
		component.isOnline = false;
		const debugElement = fixture.debugElement;
		const commonService = debugElement.injector.get(CommonService);
	}));


	it('should create', () => {
		expect(component).toBeTruthy();
	});


	it('toggleStatus should change  when jsbridge returns true', fakeAsync(() => {
		gamingNetworkBoostMock.setNetworkBoostStatus.and.returnValue(Promise.resolve(true));
		component.setNetworkBoostStatus(true);
		fixture.detectChanges();
		tick(10);
		const result = true;
		expect(result).toBe(true);
	}));

	it('toggleStatus should not change  when jsbridge returns false', fakeAsync(() => {
		gamingNetworkBoostMock.setNetworkBoostStatus.and.returnValue(Promise.resolve(false));
		component.setNetworkBoostStatus(false);
		fixture.detectChanges();
		tick(10);
		const result = false;
		expect(result).toBe(false);
	}));

	it('toggleStatus is true then should show NetworkBoost apps popup directly',
		fakeAsync(() => {
			gamingNetworkBoostMock.getNeedToAsk.and.returnValue(Promise.resolve(true));
			component.toggleStatus = true;
			fixture.detectChanges();
			component.openTargetModal();
			component.needToAsk = 2;
			tick(10);
			expect(component.showAppsModal).toEqual(true);
			expect(component.showTurnOnModal).toEqual(false);
		})
	);

	it('toggleStatus is false then should show turnon popup',
		fakeAsync(() => {
			gamingNetworkBoostMock.getNeedToAsk.and.returnValue(Promise.resolve(false));
			component.toggleStatus = false;
			component.needToAsk = true;
			fixture.detectChanges();
			component.openTargetModal();
			component.needToAsk = 2;
			tick(10);
			expect(component.showAppsModal).toEqual(false);
			expect(component.showTurnOnModal).toEqual(true);
		})
	);

	it('toggleStatus should set true', fakeAsync(() => {
		gamingNetworkBoostMock.getNeedToAsk.and.returnValue(Promise.resolve(true));
		component.setAksAgain(true);
		fixture.detectChanges();
		tick(10);
		const result = true;
		expect(result).toBe(true);
	}));


	it('toggleStatus should set false', fakeAsync(() => {
		gamingNetworkBoostMock.getNeedToAsk.and.returnValue(Promise.resolve(false));
		component.setAksAgain(false);
		fixture.detectChanges();
		tick(10);
		const result = false;
		expect(result).toBe(false);
	}));
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
