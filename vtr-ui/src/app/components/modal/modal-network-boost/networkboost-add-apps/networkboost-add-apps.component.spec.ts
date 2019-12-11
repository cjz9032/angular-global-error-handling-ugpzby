import { CommonService } from 'src/app/services/common/common.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DevService } from './../../../../services/dev/dev.service';
import { CommsService } from 'src/app/services/comms/comms.service';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NetworkboostAddAppsComponent } from './networkboost-add-apps.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { of } from 'rxjs';
const gamingNetworkBoostMock = jasmine.createSpyObj('NetworkBoostService', ['isShellAvailable', 'setNetworkBoostStatus', 'getNetUsingProcesses', 'addProcessToNetworkBoost', 'deleteProcessInNetBoost']);
const cmsServiceMock = jasmine.createSpyObj('CMSService', ['fetchCMSContent', 'getOneCMSContent']);
const commonServiceMock = jasmine.createSpyObj('CommonService', ['isShellAvailable', 'notification']);
const sampleRunningAppList = {
	processList: [
		{ processDescription: 'E046963F.LenovoCompanion', iconName: 'ms-appdata:///local/icon/31b3d9d7dea8e073.png' },
		{ processDescription: 'Microsoft Store', iconName: 'ms-appdata:///local/icon/24381e8e2df0ab73.png' },
		{
			processDescription: 'Microsoft.Windows.ShellExperienceHost',
			iconName: 'ms-appdata:///local/icon/3862fc8e419fa507.png'
		},
		{ processDescription: 'Shell Input Application', iconName: 'ms-appdata:///local/icon/ea2b14e5811d195d.png' },
		{ processDescription: 'Skype for Business', iconName: 'ms-appdata:///local/icon/29fd475c909f7486.png' },
		{ processDescription: 'Windows Calculator', iconName: 'ms-appdata:///local/icon/ddfff48c74049c74.png' },
		{
			processDescription: 'microsoft.windowscommunicationsapps',
			iconName: 'ms-appdata:///local/icon/7b2ca07c9a67cc86.png'
		},
		{
			processDescription: 'windows.immersivecontrolpanel',
			iconName: 'ms-appdata:///local/icon/4a4341b5d5250f32.png'
		}
	]
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

const sampleNetworkBoostList = {
	processList: [
		{ processDescription: 'Google Chrome', iconName: 'ms-appdata:///local/icon/83a48b2b3d643451.png', processPath: 'c:\\chrome\\chrome.exe' },
		{ processDescription: 'Slack', iconName: 'ms-appdata:///local/icon/256509debf91d991.png', processPath: 'c:\\chrome\\xxx.exe' },
		{ processDescription: 'Visual Studio Code', iconName: 'ms-appdata:///local/icon/e817dc2039be4789.png', processPath: 'c:\\chrome\\xxx.exe' }
	]
};

describe('NetworkboostAddAppsComponent', () => {
	let component: NetworkboostAddAppsComponent;
	let fixture: ComponentFixture<NetworkboostAddAppsComponent>;
	gamingNetworkBoostMock.isShellAvailable.and.returnValue(true);

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NetworkboostAddAppsComponent,
				mockPipe({ name: 'translate' }), mockPipe({ name: 'sanitize' })
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: NetworkBoostService, useValue: gamingNetworkBoostMock },
				{ provide: CommsService },
				{ provide: DevService },
				{ provide: CMSService, useValue: cmsServiceMock },
				{ provide: CommonService, useValue: commonServiceMock }
			]
		})
			.compileComponents();
		fixture = TestBed.createComponent(NetworkboostAddAppsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));


	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it(
		'should get networkboost apps list',
		fakeAsync(() => {
			gamingNetworkBoostMock.getNetUsingProcesses.and.returnValue(Promise.resolve(sampleNetworkBoostList));
			component.refreshNetworkBoostList();
			tick(20);
			expect(component.runningList).toBeDefined();
			expect(component.runningList.length).toBeGreaterThan(0);
		})
	);

	it(
		'Networkboost added apps list',
		fakeAsync(() => {
			const addedApps = 'google chrome';
			gamingNetworkBoostMock.addProcessToNetworkBoost.and.returnValue(Promise.resolve(addedApps));
			component.addAppToList(addedApps);
			tick(20);
			expect(component.addedApps).toBeDefined();
			expect(component.addedApps).toBeGreaterThan(0);
		})
	);

	it(
		'Networkboost remove  apps list',
		fakeAsync(() => {
			const addedApps = 'google chrome';
			gamingNetworkBoostMock.deleteProcessInNetBoost.and.returnValue(Promise.resolve(addedApps));
			component.removeApp(addedApps);
			tick(20);
			expect(component.addedApps).toBeDefined();
			expect(component.addedApps).not.toEqual(0);
		})
	);


	it('closed model', fakeAsync(() => {
		const result = component.closeModal(false);
		expect(result).toBe(undefined);
	})
	);


	it('runappKeyup', fakeAsync(() => {
		const result = component.runappKeyup(true, 1);
		expect(result).toBe(undefined);
	})
	);


	it('checkApps', fakeAsync(() => {
		const result = component.checkApps(1);
		expect(result).toBe(false);
	})
	);


	it('checkFocus', fakeAsync(() => {
		const result = component.checkFocus(true);
		expect(result).toBe(undefined);
	})
	);



	it('onValueChange', fakeAsync(() => {
		const result = component.onValueChange({target: {value: true}}, 1);
		// expect(result).toBe(undefined);
	})
	);


	it('ngOnChanges', () => {
		let changeval: any;
		const resp = component.ngOnChanges(changeval);
		expect(resp).toBe();
	});


	it('focusClose', done => {
		const p = new Promise((resolve, reject) =>
			setTimeout(() => resolve(''), 2)
		);
		p.then(result => {
			fakeAsync(() => {
				const results = component.focusClose();
				expect(results).toBe(undefined);
			});
			done();
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
