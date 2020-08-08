// import { of } from 'rxjs';
// import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
// import { CMSService } from 'src/app/services/cms/cms.service';
// import { PageAutocloseComponent } from './page-autoclose.component';
// import { HttpClient } from '@angular/common/http';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { Pipe } from '@angular/core';
// import {
// 	BrowserDynamicTestingModule,
// 	platformBrowserDynamicTesting
// } from '@angular/platform-browser-dynamic/testing';

// declare const require: any;

// const gamingAutoCloseServiceMock = jasmine.createSpyObj('GamingAutoCloseService', [
// 	'isShellAvailable',
// 	'gamingAutoClose',
// 	'getAutoCloseStatusCache',
// 	'setAutoCloseStatus',
// 	'setAutoCloseStatusCache',
// 	'getNeedToAskStatusCache',
// 	'getNeedToAsk',
// 	'setNeedToAskStatusCache',
// 	'delAppsAutoCloseList',
// 	'getAppsAutoCloseList',
// 	'getAutoCloseListCache',
// 	'setAutoCloseListCache',
// 	'delAppsAutoCloseList',
// 	'getAppsAutoCloseRunningList'
// ]);

// const cmsServiceMock = jasmine.createSpyObj('CMSService', ['fetchCMSContent', 'getOneCMSContent']);

// const sampleRunningAppList = {
// 	processList: [
// 		{ processDescription: 'E046963F.LenovoCompanion', iconName: 'ms-appdata:///local/icon/31b3d9d7dea8e073.png' },
// 		{ processDescription: 'Microsoft Store', iconName: 'ms-appdata:///local/icon/24381e8e2df0ab73.png' },
// 		{
// 			processDescription: 'Microsoft.Windows.ShellExperienceHost',
// 			iconName: 'ms-appdata:///local/icon/3862fc8e419fa507.png'
// 		},
// 		{ processDescription: 'Shell Input Application', iconName: 'ms-appdata:///local/icon/ea2b14e5811d195d.png' },
// 		{ processDescription: 'Skype for Business', iconName: 'ms-appdata:///local/icon/29fd475c909f7486.png' },
// 		{ processDescription: 'Windows Calculator', iconName: 'ms-appdata:///local/icon/ddfff48c74049c74.png' },
// 		{
// 			processDescription: 'microsoft.windowscommunicationsapps',
// 			iconName: 'ms-appdata:///local/icon/7b2ca07c9a67cc86.png'
// 		},
// 		{
// 			processDescription: 'windows.immersivecontrolpanel',
// 			iconName: 'ms-appdata:///local/icon/4a4341b5d5250f32.png'
// 		}
// 	]
// };

// const sampleAutoCloseList = {
// 	processList: [
// 		{ processDescription: 'Google Chrome', iconName: 'ms-appdata:///local/icon/83a48b2b3d643451.png' },
// 		{
// 			processDescription: 'Microsoft.MicrosoftEdgeDevToolsPreview',
// 			iconName: 'ms-appdata:///local/icon/31b3d9d7dea8e073.png'
// 		},
// 		{ processDescription: 'Slack', iconName: 'ms-appdata:///local/icon/256509debf91d991.png' },
// 		{ processDescription: 'Visual Studio Code', iconName: 'ms-appdata:///local/icon/e817dc2039be4789.png' }
// 	]
// };
// const cmsCardResponse = {
// 	Results: [
// 		{
// 			Id: '0630e91c940f4422a3deb607acb5608d',
// 			Title: 'Lenovo StoryHub',
// 			ShortTitle: '',
// 			Description: "The passion, people, innovation, and dedication behind Lenovo's global endeavors.",
// 			FeatureImage:
// 				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/4x3-Card-StoryHub-No-Overlay.png?v=09622a20277c45bbba231663e06267fb',
// 			Action: '',
// 			ActionType: 'External',
// 			ActionLink: 'https://news.lenovo.com/',
// 			BrandName: '',
// 			BrandImage: '',
// 			Priority: 'P1',
// 			Page: 'dashboard',
// 			Template: 'half-width-title-description-link-image',
// 			Position: 'position-B',
// 			ExpirationDate: null,
// 			Filters: null
// 		},
// 		{
// 			Id: '80165a02226745b2b40ad4b8b1dfb080',
// 			Title: 'Accessories',
// 			ShortTitle: '',
// 			Description: 'Looking for accessories to complete your PC experience?',
// 			FeatureImage:
// 				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/4x4-Accessories-External-Link-1.jpg?v=c8257e543d764ceb89d94a6d8d261a16',
// 			Action: 'Explore Now',
// 			ActionType: 'External',
// 			ActionLink: 'https://www.lenovo.com/us/en/accessories-and-monitors/c/ACCESSORY',
// 			BrandName: '',
// 			BrandImage: '',
// 			Priority: 'P1',
// 			Page: 'dashboard',
// 			Template: 'half-width-top-image-title-link',
// 			Position: 'position-F',
// 			ExpirationDate: null,
// 			Filters: null
// 		},
// 		{
// 			Id: 'dcbbdeab0d0d4154a8f9670c040250a2',
// 			Title: 'Vantage',
// 			ShortTitle: '',
// 			Description: 'Welcome to the next generation of Lenovo Vantage!',
// 			FeatureImage:
// 				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/Hero-Banner-Vantage-30.jpg?v=9669be4566484a2283c380b717161806',
// 			Action: '',
// 			ActionType: null,
// 			ActionLink: null,
// 			BrandName: '',
// 			BrandImage: '',
// 			Priority: 'P1',
// 			Page: 'dashboard',
// 			Template: 'home-page-hero-banner',
// 			Position: 'position-A',
// 			ExpirationDate: null,
// 			Filters: null
// 		},
// 		{
// 			Id: 'b45a183dddf24c049b013058b0f25b65',
// 			Title: 'ThinkShield by Lenovo',
// 			ShortTitle: 'ThinkShield by Lenovo',
// 			Description: 'Complete end-to-end security solutions',
// 			FeatureImage:
// 				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/4x3-Card-Security-101-No-Overlay.png?v=09622a20277c45bbba231663e06267fb',
// 			Action: '',
// 			ActionType: 'External',
// 			ActionLink:
// 				'https://news.lenovo.com/pressroom/press-releases/introducing-thinkshield-by-lenovo-complete-end-to-end-security-solutions-that-keep-companies-safer.htm',
// 			BrandName: '',
// 			BrandImage: '',
// 			Priority: 'P1',
// 			Page: 'dashboard',
// 			Template: 'half-width-title-description-link-image',
// 			Position: 'position-C',
// 			ExpirationDate: null,
// 			Filters: null
// 		},
// 		{
// 			Id: '5958939256e54675968a7b31f398a01d',
// 			Title: 'Lenovo Support',
// 			ShortTitle: 'Lenovo Support',
// 			Description: 'Tech support with the Premier difference',
// 			FeatureImage:
// 				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/4x4-Card-Support.jpg?v=7878ded6d6344238a216c1961a98a9f2',
// 			Action: 'Read More',
// 			ActionType: 'External',
// 			ActionLink: 'https://www.lenovo.com/us/en/premier-support/',
// 			BrandName: '',
// 			BrandImage: '',
// 			Priority: 'P2',
// 			Page: 'dashboard',
// 			Template: 'half-width-top-image-title-link',
// 			Position: 'position-E',
// 			ExpirationDate: null,
// 			Filters: null
// 		},
// 		{
// 			Id: '648b75a52b8f4aad8e63439a3d69ca4a',
// 			Title: 'Provision your system using Lenovo Cloud Deploy',
// 			ShortTitle: '',
// 			Description: 'You will need your Lenovo Cloud Deploy Customer Key.',
// 			FeatureImage:
// 				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/4x4-Lenovo-Cloud-Deploy.jpg?v=5c3d7c6593de4d94b475f6c129c9bd32',
// 			Action: 'Click to Continue',
// 			ActionType: 'External',
// 			ActionLink: 'https://LenovoCloudDeploy.com/Vantage',
// 			BrandName: '',
// 			BrandImage: '',
// 			Priority: 'P1',
// 			Page: 'dashboard',
// 			Template: 'half-width-top-image-title-link',
// 			Position: 'position-E',
// 			ExpirationDate: null,
// 			Filters: { and: [{ 'GEOs.Any': ['US'] }, { 'Segments.Any': ['Commercial', 'SMB'] }] }
// 		},
// 		{
// 			Id: 'ca1fa898b60946369fda234010c1da3a',
// 			Title: '',
// 			ShortTitle: '',
// 			Description: '',
// 			FeatureImage:
// 				'https://cms.csw.lenovo.com/-/media/Lenovo/Vantage/Features/8x3-Card-Gamestore.jpg?v=3f80a67da7554573a50cfa8592d51f59',
// 			Action: '',
// 			ActionType: 'External',
// 			ActionLink: 'https://gamestore.lenovo.com',
// 			BrandName: '',
// 			BrandImage: '',
// 			Priority: 'P1',
// 			Page: 'dashboard',
// 			Template: 'full-width-title-image-background',
// 			Position: 'position-D',
// 			ExpirationDate: null,
// 			Filters: null
// 		}
// 	],
// 	Metadata: { Count: 7 }
// };

// const queryOptions = {
// 	Page: 'dashboard',
// 	Lang: 'EN',
// 	GEO: 'US',
// 	OEM: 'Lenovo',
// 	OS: 'Windows',
// 	Segment: 'SMB',
// 	Brand: 'Lenovo'
// };

// xdescribe('PageAutocloseComponent', () => {
// 	let component: PageAutocloseComponent;
// 	let fixture: ComponentFixture<PageAutocloseComponent>;
// 	gamingAutoCloseServiceMock.isShellAvailable.and.returnValue(true);

// 	beforeEach(
// 		async(() => {
// 			TestBed.configureTestingModule({
// 				declarations: [PageAutocloseComponent, mockPipe({ name: 'translate' })],
// 				schemas: [NO_ERRORS_SCHEMA],
// 				providers: [
// 					{ provide: HttpClient },
// 					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceMock },
// 					{ provide: CMSService, useValue: cmsServiceMock }
// 				]
// 			}).compileComponents();
// 			fixture = TestBed.createComponent(PageAutocloseComponent);
// 			cmsServiceMock.fetchCMSContent.withArgs(queryOptions).and.returnValue(of(cmsCardResponse));
// 			cmsServiceMock.getOneCMSContent.and.returnValue(cmsCardResponse.Results);
// 			component = fixture.componentInstance;
// 			fixture.detectChanges();
// 		})
// 	);

// 	it('should create component', () => {
// 		expect(component).toBeTruthy();
// 	});

// 	it(
// 		'should show app list',
// 		fakeAsync(() => {
// 			gamingAutoCloseServiceMock.getAppsAutoCloseList.and.returnValue(Promise.resolve(sampleAutoCloseList));
// 			gamingAutoCloseServiceMock.setAutoCloseListCache
// 				.withArgs(sampleAutoCloseList.processList)
// 				.and.returnValue();
// 			component.refreshAutoCloseList();
// 			tick(20);
// 			expect(component.autoCloseAppList).toBeDefined();
// 			expect(component.autoCloseAppList.length).toBeGreaterThan(0);
// 		})
// 	);

// 	it(
// 		'should remove a app',
// 		fakeAsync(() => {
// 			const responseList = sampleAutoCloseList.processList;
// 			fixture.detectChanges();
// 			gamingAutoCloseServiceMock.delAppsAutoCloseList.and.returnValue(Promise.resolve(sampleAutoCloseList));
// 			gamingAutoCloseServiceMock.setAutoCloseListCache
// 				.withArgs(responseList)
// 				.and.returnValue();
// 			component.deleteAppFromList('Google Chrome');
// 			tick(20);
// 			component.refreshAutoCloseList();
// 			expect(responseList).toBeDefined();
// 			expect(responseList.length).toEqual(4);
// 		})
// 	);

// 	it(
// 		'toggleStatus should change change when jsbridge returns true',
// 		fakeAsync(() => {
// 			gamingAutoCloseServiceMock.setAutoCloseStatus.and.returnValue(Promise.resolve(true));
// 			gamingAutoCloseServiceMock.setAutoCloseStatusCache.and.returnValue();
// 			component.setAutoCloseStatus(true);
// 			tick(10);
// 			expect(component.toggleStatus).toEqual(true);
// 		})
// 	);

// 	it(
// 		'toggleStatus should not change when jsbridge returns false',
// 		fakeAsync(() => {
// 			component.toggleStatus = true;
// 			fixture.detectChanges();
// 			gamingAutoCloseServiceMock.setAutoCloseStatus.and.returnValue(Promise.resolve(false));
// 			component.toggleAutoClose(false);
// 			tick(10);
// 			expect(component.toggleStatus).toEqual(true);
// 		})
// 	);

// 	it(
// 		'toggleStatus is true then should show running apps popup directly',
// 		fakeAsync(() => {
// 			component.toggleStatus = true;
// 			fixture.detectChanges();
// 			gamingAutoCloseServiceMock.getNeedToAskStatusCache.and.returnValue(true);
// 			component.openTargetModal();
// 			tick(10);
// 			expect(component.showAppsModal).toEqual(true);
// 			expect(component.showTurnOnModal).toEqual(false);
// 		})
// 	);

// 	it(
// 		'toggleStatus is false and needToAsk true then should show turnon popup',
// 		fakeAsync(() => {
// 			component.toggleStatus = true;
// 			component.needToAsk = true;
// 			fixture.detectChanges();
// 			component.openTargetModal();
// 			tick(10);
// 			expect(component.showAppsModal).toEqual(true);
// 			expect(component.showTurnOnModal).toEqual(false);
// 		})
// 	);

// 	it(
// 		'toggleStatus is false and needToAsk false then should show running apps popup directly',
// 		fakeAsync(() => {
// 			component.toggleStatus = true;
// 			component.needToAsk = false;
// 			fixture.detectChanges();
// 			component.openTargetModal();
// 			tick(10);
// 			expect(component.showAppsModal).toEqual(true);
// 			expect(component.showTurnOnModal).toEqual(false);
// 		})
// 	);

// 	it(
// 		'should show running app list',
// 		fakeAsync(() => {
// 			gamingAutoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
// 				Promise.resolve(sampleRunningAppList)
// 			);
// 			// TODO
// 			//component.refreshRunningList();
// 			tick(20);
// 			// TODO
// 			// expect(component.runningList).toBeDefined();
// 			// expect(component.runningList.length).toBeGreaterThan(0);
// 		})
// 	);
// });

// export function mockPipe(options: Pipe): Pipe {
// 	const metadata: Pipe = {
// 		name: options.name
// 	};
// 	return Pipe(metadata)(
// 		class MockPipe {
// 			public transform(query: string, ...args: any[]): any {
// 				return query;
// 			}
// 		}
// 	);
// }





import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA, Input } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateStore } from '@ngx-translate/core';
import { of } from 'rxjs';

import { CMSService } from 'src/app/services/cms/cms.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { GamingQuickSettingToolbarService } from 'src/app/services/gaming/gaming-quick-setting-toolbar/gaming-quick-setting-toolbar.service';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PageAutocloseComponent } from './page-autoclose.component';
import { TranslationModule } from 'src/app/modules/translation.module';

@Component({ selector: 'vtr-ui-toggle', template: '' })
export class UiToggleStubComponent {
    @Input() onOffSwitchId: string;
}

describe('PageAutocloseComponent', () => {
	let component: PageAutocloseComponent;
    let fixture: ComponentFixture<PageAutocloseComponent>;
    let shellServices:any;
    let gamingQuickSettingToolbarService:any;

    describe('quick setting toolbar & toast event', () => {
       
        const cmsMock = {
            Results: [{
                Id: 'e64d43892d8448d088f3e6037e385122', Title: 'Header Image DCC',
                ShortTitle: '', Description: '',
                FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/DCC_top_image.jpg?v=5cf8a0151ea84c4ca43e906339c3c3b2',
                Action: '', ActionType: null, ActionLink: null, BrandName: 'brandname', BrandImage: '',
                Priority: 'P1', Page: null, Template: 'header', Position: null, ExpirationDate: null,
                Filters: { 'DeviceTag.Value': { key: 'System.DccGroup', operator: '==', value: 'true' } }
            },
            {
                Id: '8516ba14dba5412ca954c3ccfdcbff90', Title: 'Default Header Image', ShortTitle: '', Description: '',
                FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/Header-Image-Default.jpg?v=5d0bf7fd0065478c977ed284fecac45d', Action: '',
                ActionType: null, ActionLink: null, BrandName: '', BrandImage: '', Priority: 'P2', Page: null,
                Template: 'header', Position: null, ExpirationDate: null, Filters: null
            }], Metadata: { Count: 2 }
        };

        const cmsServiceMock = {
            fetchCMSContent: (params) => of(cmsMock),
            getOneCMSContent: (res, template, position) => res = cmsMock.Results
        };
        const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['error', 'info']);
        const vantageShellServiceSpy = jasmine.createSpyObj('VantageShellService', ['unRegisterEvent', 'registerEvent', 'getGamingAutoClose']);
        const gamingQuickSettingToolbarServiceSpy = jasmine.createSpyObj('GamingQuickSettingToolbarService', ['registerEvent', 'unregisterEvent']);
        const gamingAutoCloseServiceSpy = jasmine.createSpyObj('GamingAutoCloseService', [
        	'isShellAvailable',
        	'gamingAutoClose',
        	'getAutoCloseStatusCache',
        	'setAutoCloseStatus',
        	'setAutoCloseStatusCache',
        	'getNeedToAskStatusCache',
        	'getNeedToAsk',
        	'setNeedToAskStatusCache',
        	'delAppsAutoCloseList',
        	'getAppsAutoCloseList',
        	'getAutoCloseListCache',
        	'setAutoCloseListCache',
        	'delAppsAutoCloseList',
        	'getAppsAutoCloseRunningList'
        ]);

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [PageAutocloseComponent, UiToggleStubComponent],
                imports: [ TranslationModule, HttpClientModule ],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    { provide: HttpClient },
                    { provide: TranslateStore },
                    // { provide: CommonService, useValue: commonServiceSpy },
                    { provide: LoggerService, useValue: loggerServiceSpy },
                    { provide: CMSService, useValue: cmsServiceMock },
                    { provide: VantageShellService, useValue: vantageShellServiceSpy },
                    { provide: NetworkBoostService, useValue: gamingAutoCloseServiceSpy },
                    { provide: GamingQuickSettingToolbarService, useValue: gamingQuickSettingToolbarServiceSpy }
                ]
            }).compileComponents();
            shellServices = TestBed.inject(VantageShellService);
            gamingQuickSettingToolbarService = TestBed.inject(GamingQuickSettingToolbarService);
            fixture = TestBed.createComponent(PageAutocloseComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }));

        it('ngOnInit', () => {
            spyOn(component, 'autoCloseRegisterEvent').and.callThrough();
            expect(component.autoCloseRegisterEvent).toHaveBeenCalledTimes(0);

            component.ngOnInit();
            expect(component.autoCloseRegisterEvent).toHaveBeenCalledTimes(1); 
            
            component.autoCloseRegisterEvent();
            expect(gamingQuickSettingToolbarService.registerEvent).toHaveBeenCalled();
            expect(shellServices.registerEvent).toHaveBeenCalled();
        })
    
        it('onGamingQuickSettingsAutoCloseStatusChangedEvent', () => {
            component.onGamingQuickSettingsAutoCloseStatusChangedEvent(1);
            expect(component.toggleStatus).toBe(true);
    
            component.onGamingQuickSettingsAutoCloseStatusChangedEvent(0);
            expect(component.toggleStatus).toBe(false);
        });
    
        it('ngOnDestroy', () => {
            spyOn(component, 'autoCloseUnRegisterEvent').and.callThrough();
            expect(component.autoCloseUnRegisterEvent).toHaveBeenCalledTimes(0);

            component.ngOnDestroy();
            expect(component.autoCloseUnRegisterEvent).toHaveBeenCalledTimes(1); 

            component.autoCloseUnRegisterEvent();
            expect(gamingQuickSettingToolbarService.unregisterEvent).toHaveBeenCalled();
            expect(shellServices.unRegisterEvent).toHaveBeenCalled();
        })
    });
});
