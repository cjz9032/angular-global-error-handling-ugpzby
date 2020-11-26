import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA, Input, EventEmitter, Output, Pipe } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateStore } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { CMSService } from 'src/app/services/cms/cms.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { GamingQuickSettingToolbarService } from 'src/app/services/gaming/gaming-quick-setting-toolbar/gaming-quick-setting-toolbar.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PageAutocloseComponent } from './page-autoclose.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { CommonService } from 'src/app/services/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';

@Component({ selector: 'vtr-ui-toggle', template: '' })
export class UiToggleStubComponent {
	@Input() onOffSwitchId: string;
}

@Component({ selector: 'vtr-modal-gaming-prompt', template: '' })
export class ModalGamingPromptMockComponent {
	componentInstance = {
		title: undefined,
		description: undefined,
		comfirmButton: undefined,
		comfirmButtonAriaLabel: undefined,
		cancelButton: undefined,
		cancelButtonAriaLabel: undefined,
		checkboxTitle: undefined,
		dontAskNarrator: undefined,
		confirmMetricEnabled: true,
		confirmMetricsItemId: undefined,
		cancelMetricEnabled: false,
		cancelMetricsItemId: undefined,
		id: undefined,
		//emitService: of(1),
		emitService: new EventEmitter(),
		setAppList: (arg1, arg2) => {
			return undefined;
		},
	};
	result = Promise.resolve(true);
}

describe('PageAutocloseComponent', () => {
	let component: PageAutocloseComponent;
	let fixture: ComponentFixture<PageAutocloseComponent>;
	let shellServices: any;
	let gamingQuickSettingToolbarService: any;
	let appnotification: AppNotification;
	let modalService: any; // let modalService: NgbModal will throw error when spyon functions of modalService

	// beforeEach(function() {
	//     jasmine.clock().install();
	// });

	// afterEach(function() {
	//     jasmine.clock().uninstall();
	// });

	describe('quick setting toolbar & toast event', () => {
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
						'DeviceTag.Value': {
							key: 'System.DccGroup',
							operator: '==',
							value: 'true',
						},
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

		const appDataList = {
			processList: [
				{
					isHovered: false,
					iconName: 'name1',
					processDescription: 'description1',
				},
				{
					isHovered: false,
					iconName: 'name2',
					processDescription: 'description2',
				},
				{
					isHovered: false,
					iconName: 'name3',
					processDescription: 'description3',
				},
			],
		};

		const cmsServiceMock = {
			fetchCMSContent: (params) => of(cmsMock),
			getOneCMSContent: (res, template, position) => (res = cmsMock.Results),
		};
		const commonServiceSpy = {
			isOnline: true,
			notification: new BehaviorSubject<AppNotification>(new AppNotification('init')),
		};
		const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['error', 'info']);
		const vantageShellServiceSpy = jasmine.createSpyObj('VantageShellService', [
			'unRegisterEvent',
			'registerEvent',
			'getGamingAutoClose',
		]);
		const gamingQuickSettingToolbarServiceSpy = jasmine.createSpyObj(
			'GamingQuickSettingToolbarService',
			['registerEvent', 'unregisterEvent']
		);
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
			'getAppsAutoCloseRunningList',
			'addAppsAutoCloseList',
			'getAutoCloseStatus',
		]);
		const modalGamingPromptComponentServiceSpy = {
			open: (arg1, arg2) => {
				return modalGamingPromptCompoentMock;
			},
		};
		const modalGamingPromptCompoentMock = {
			componentInstance: {
				info: null,
			},
			emitService: new EventEmitter(),
			result: () => {
				return Promise.resolve();
			},
		};

		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [
					PageAutocloseComponent,
					UiToggleStubComponent,
					ModalGamingPromptMockComponent,
					mockPipe({ name: 'translate' }),
				],
				imports: [TranslationModule, HttpClientModule],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: TranslateStore },
					{ provide: CommonService, useValue: commonServiceSpy },
					{ provide: LoggerService, useValue: loggerServiceSpy },
					{ provide: CMSService, useValue: cmsServiceMock },
					{ provide: VantageShellService, useValue: vantageShellServiceSpy },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceSpy },
					{
						provide: GamingQuickSettingToolbarService,
						useValue: gamingQuickSettingToolbarServiceSpy,
					},
				],
			}).compileComponents();
			shellServices = TestBed.inject(VantageShellService);
			gamingQuickSettingToolbarService = TestBed.inject(GamingQuickSettingToolbarService);
			fixture = TestBed.createComponent(PageAutocloseComponent);
			component = fixture.componentInstance;
			modalService = TestBed.inject(NgbModal);
			fixture.detectChanges();
		}));

		describe('PageAutoCloseComponent init and destory', () => {
			it('ngOnInit', () => {
				spyOn(component, 'autoCloseRegisterEvent').and.callThrough();
				expect(component.autoCloseRegisterEvent).toHaveBeenCalledTimes(0);

				component.ngOnInit();
				expect(component.autoCloseRegisterEvent).toHaveBeenCalledTimes(1);

				component.autoCloseRegisterEvent();
				expect(gamingQuickSettingToolbarService.registerEvent).toHaveBeenCalled();
				expect(shellServices.registerEvent).toHaveBeenCalled();
			});

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
			});
		});

		describe('openTargetModal Modal actions', () => {
			it('openTargetModal', fakeAsync(() => {
				gamingAutoCloseServiceSpy.setNeedToAskStatusCache = () => {
					return Promise.resolve(true);
				};
				component.isModalShowing = false;
				component.openTargetModal();
				tick(50);
				expect(component.needToAsk).toBe(false);

				component.openTargetModal();
				tick(50);
				expect(component.isModalShowing).toBe(true);

				component.isModalShowing = false;
				gamingAutoCloseServiceSpy.getNeedToAskStatusCache = () => {
					return true;
				};
				component.toggleStatus = true;
				component.openTargetModal();
				tick(50);
				expect(component.needToAsk).toBe(true);

				component.isModalShowing = false;
				gamingAutoCloseServiceSpy.getNeedToAskStatusCache = () => {
					return false;
				};
				component.toggleStatus = false;
				component.openTargetModal();
				tick(50);
				expect(component.needToAsk).toBe(false);

				component.isModalShowing = false;
				gamingAutoCloseServiceSpy.getNeedToAskStatusCache = () => {
					return 'undefined';
				};
				component.openTargetModal();
				tick(50);
				expect(component.needToAsk).toBe(false);

				component.isModalShowing = false;
				gamingAutoCloseServiceSpy.getNeedToAskStatusCache = () => {
					return undefined;
				};
				component.openTargetModal();
				tick(50);
				expect(component.needToAsk).toBe(false);
				//expect(component.openTargetModal).toHaveBeenCalled;
				//expect().nothing();
			}));

			it('toggleAutoClose', fakeAsync(() => {
				gamingAutoCloseServiceSpy.setAutoCloseStatus.and.returnValue(
					Promise.resolve(false)
				);

				const event = { switchValue: false };
				component.toggleAutoClose(event);
				tick(50);
				expect(component.toggleStatus).toBeUndefined;

				gamingAutoCloseServiceSpy.setAutoCloseStatus.and.returnValue(Promise.resolve(true));
				component.toggleAutoClose(event);
				tick(50);
				expect(component.toggleStatus).toBe(false);
			}));

			it('getautoclosestatus', async () => {
				gamingAutoCloseServiceSpy.getAutoCloseStatus.and.returnValue(
					Promise.reject('reject test')
				);
				await component.getAutoCloseStatus();
				expect(component.toggleStatus).toBeUndefined;

				gamingAutoCloseServiceSpy.getAutoCloseStatus.and.returnValue(Promise.resolve(true));
				await component.getAutoCloseStatus();
				expect(component.toggleStatus).toBe(true);
			});
		});

		describe('Notification/fetchCMSArticles AppNotification', () => {
			it('onnotification', fakeAsync(() => {
				appnotification = { type: '[NetworkStatus] Offline', payload: 'null' };
				commonServiceSpy.isOnline = undefined;
				setTimeout(() => {
					commonServiceSpy.notification.next(appnotification);
				}, 20);
				tick(100);
				expect(component.isOnline).toBe(true);
			}));

			it('onnotification and fetchCMSArticles', fakeAsync(() => {
				appnotification = { type: '[NetworkStatus] Offline', payload: 'null' };
				commonServiceSpy.isOnline = false;
				setTimeout(() => {
					commonServiceSpy.notification.next(appnotification);
					component.fetchCMSArticles();
				}, 20);
				tick(100);
				expect(component.cardContentPositionC.FeatureImage).toEqual(
					'assets/cms-cache/GamingPosC.jpg'
				);
			}));
		});

		describe('showTurnOn showAddApps', () => {
			it('showTurnOn--showAddApps', fakeAsync(() => {
				try {
					let modalGamingPromptMock = new ModalGamingPromptMockComponent();
					//modalService.open = modalGamingPromptMock;
					spyOn(modalService, 'open').and.returnValue(modalGamingPromptMock);
					//let modalGamingRunningAppListMock = new ModalGamingRunningAppListMockComponent();
					//spyOn(modalService, 'open').and.returnValue(modalGamingRunningAppListMock);
					component.showTurnOn();
					setTimeout(() => {
						modalGamingPromptMock.componentInstance.emitService.next(true);
					}, 20);
					tick(100);
					expect(component.needToAsk).toBe(true);

					setTimeout(() => {
						modalGamingPromptMock.componentInstance.emitService.next(false);
					}, 20);
					tick(100);
					expect(component.needToAsk).toBe(false);

					setTimeout(() => {
						modalGamingPromptMock.componentInstance.emitService.next(1);
					}, 20);
					tick(100);
					expect(component.needToAsk).toBe(false);

					setTimeout(() => {
						modalGamingPromptMock.componentInstance.emitService.next(2);
					}, 20);
					tick(100);
					expect(component.needToAsk).toBe(false);
					expect(component.isModalShowing).toBe(false);
				} catch (error) {}
			}));

			it('setNotAskAgain', fakeAsync(() => {
				const throwError = () => {
					throw new Error('error from setnotaskagain');
				};
				gamingAutoCloseServiceSpy.setNeedToAskStatusCache = throwError;
				component.setNotAskAgain(true);
				expect(component.isModalShowing).toBe(false);
			}));
		});
	});
});

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
	) as any;
}
