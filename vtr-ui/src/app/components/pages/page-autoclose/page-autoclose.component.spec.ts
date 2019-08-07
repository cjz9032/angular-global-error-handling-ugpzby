import { of } from 'rxjs';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { PageAutocloseComponent } from './page-autoclose.component';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Pipe } from '@angular/core';
const gamingAutoCloseServiceMock = jasmine.createSpyObj('GamingAutoCloseService', [
	'isShellAvailable',
	'gamingAutoClose',
	'getAutoCloseStatusCache',
	'setAutoCloseStatus',
	'setAutoCloseStatusCache',
	'getNeedToAskStatusCache',
	'getNeedToAsk',
	'setNeedToAskStatusCache'
]);

const cmsServiceMock = jasmine.createSpyObj('CMSService', [ 'fetchCMSContent', 'getOneCMSContent' ]);
const cmsCardResponse = {
	Results: [
		{
			Id: '0630e91c940f4422a3deb607acb5608d',
			Title: 'Lenovo StoryHub',
			ShortTitle: '',
			Description: "The passion, people, innovation, and dedication behind Lenovo's global endeavors.",
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
			Filters: { and: [ { 'GEOs.Any': [ 'US' ] }, { 'Segments.Any': [ 'Commercial', 'SMB' ] } ] }
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

describe('PageAutocloseComponent', () => {
	let component: PageAutocloseComponent;
	let fixture: ComponentFixture<PageAutocloseComponent>;
	gamingAutoCloseServiceMock.isShellAvailable.and.returnValue(true);

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ PageAutocloseComponent, mockPipe({ name: 'translate' }) ],
				schemas: [ NO_ERRORS_SCHEMA ],
				providers: [
					{ provide: HttpClient },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceMock },
					{ provide: CMSService, useValue: cmsServiceMock }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(PageAutocloseComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create component', () => {
		expect(component).toBeTruthy();
	});

	it(
		'toggleStatus should change change when jsbridge returns true',
		fakeAsync(() => {
			gamingAutoCloseServiceMock.setAutoCloseStatus.and.returnValue(Promise.resolve(true));
			gamingAutoCloseServiceMock.setAutoCloseStatusCache.and.returnValue();
			component.setAutoCloseStatus(true);
			tick(10);
			expect(component.toggleStatus).toEqual(true);
		})
	);

	it(
		'toggleStatus should not change when jsbridge returns false',
		fakeAsync(() => {
			component.toggleStatus = true;
			fixture.detectChanges();
			gamingAutoCloseServiceMock.setAutoCloseStatus.and.returnValue(Promise.resolve(false));
			component.toggleAutoClose(false);
			tick(10);
			expect(component.toggleStatus).toEqual(true);
		})
	);

	it(
		'toggleStatus is true then should show running apps popup directly',
		fakeAsync(() => {
			component.toggleStatus = true;
			fixture.detectChanges();
			gamingAutoCloseServiceMock.getNeedToAsk.and.returnValue(Promise.resolve(true));
			component.openTargetModal();
			tick(10);
			expect(component.showAppsModal).toEqual(true);
			expect(component.showTurnOnModal).toEqual(false);
		})
	);

	it(
		'toggleStatus is false and needToAsk true then should show turnon popup',
		fakeAsync(() => {
			component.toggleStatus = false;
			fixture.detectChanges();
			gamingAutoCloseServiceMock.getNeedToAsk.and.returnValue(Promise.resolve(true));
			component.openTargetModal();
			tick(10);
			expect(component.showAppsModal).toEqual(false);
			expect(component.showTurnOnModal).toEqual(true);
		})
	);

	it(
		'toggleStatus is false and needToAsk false then should show running apps popup directly',
		fakeAsync(() => {
			component.toggleStatus = false;
			fixture.detectChanges();
			gamingAutoCloseServiceMock.getNeedToAsk.and.returnValue(Promise.resolve(false));
			component.openTargetModal();
			tick(10);
			expect(component.showAppsModal).toEqual(true);
			expect(component.showTurnOnModal).toEqual(false);
		})
	);
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
