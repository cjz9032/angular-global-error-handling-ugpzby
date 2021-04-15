import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA, Input, EventEmitter } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateStore } from '@ngx-translate/core';
import { of, BehaviorSubject } from 'rxjs';

import { CMSService } from 'src/app/services/cms/cms.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { GamingQuickSettingToolbarService } from 'src/app/services/gaming/gaming-quick-setting-toolbar/gaming-quick-setting-toolbar.service';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PageNetworkboostComponent } from './page-networkboost.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { CommonService } from 'src/app/services/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { GAMING_DATA } from './../../../../testing/gaming-data';

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
		emitService: new EventEmitter(),
		setAppList: (arg1, arg2) => undefined,
	};
	result = Promise.resolve(true);
}

describe('PageNetworkboostComponent', () => {
	let component: PageNetworkboostComponent;
	let fixture: ComponentFixture<PageNetworkboostComponent>;
	let shellServices: any;
	let gamingQuickSettingToolbarService: any;
	let appnotification: AppNotification;
	let modalService: any;

	describe('quick setting toolbar & toast event', () => {
		const cmsServiceMock = {
			fetchCMSContent: (params) => of(GAMING_DATA.cmsMock),
			getOneCMSContent: (res, template, position) => (res = GAMING_DATA.cmsMock.Results),
		};
		const commonServiceSpy = {
			isOnline: true,
			notification: new BehaviorSubject<AppNotification>(new AppNotification('init')),
			getShellVersion: () => '1.1.1.1',
			compareVersion: (version1, version2) => 1,
			sendNotification: (action, payload) => {},
		};
		const localCacheServiceSpy = {
			getLocalCacheValue: (key, defaultValue) => undefined,
			setLocalCacheValue: (key, vaule) => {
				Promise.resolve();
			},
		};
		const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['error', 'info']);
		const vantageShellServiceSpy = jasmine.createSpyObj('VantageShellService', [
			'unRegisterEvent',
			'registerEvent',
		]);
		const networkBoostServiceSpy = jasmine.createSpyObj('NetworkBoostService', [
			'isShellAvailable',
			'getNeedToAsk',
			'getNetworkBoostStatus',
			'setNetworkBoostStatus',
		]);
		const gamingQuickSettingToolbarServiceSpy = jasmine.createSpyObj(
			'GamingQuickSettingToolbarService',
			['registerEvent', 'unregisterEvent']
		);

		beforeEach(
			waitForAsync(() => {
				TestBed.configureTestingModule({
					declarations: [
						PageNetworkboostComponent,
						UiToggleStubComponent,
						ModalGamingPromptMockComponent,
					],
					imports: [TranslationModule, HttpClientModule],
					schemas: [NO_ERRORS_SCHEMA],
					providers: [
						{ provide: HttpClient },
						{ provide: TranslateStore },
						{ provide: CommonService, useValue: commonServiceSpy },
						{ provide: LocalCacheService, useValue: localCacheServiceSpy },
						{ provide: LoggerService, useValue: loggerServiceSpy },
						{ provide: CMSService, useValue: cmsServiceMock },
						{ provide: VantageShellService, useValue: vantageShellServiceSpy },
						{ provide: NetworkBoostService, useValue: networkBoostServiceSpy },
						{
							provide: GamingQuickSettingToolbarService,
							useValue: gamingQuickSettingToolbarServiceSpy,
						},
					],
				}).compileComponents();
				shellServices = TestBed.inject(VantageShellService);
				gamingQuickSettingToolbarService = TestBed.inject(GamingQuickSettingToolbarService);
				fixture = TestBed.createComponent(PageNetworkboostComponent);
				component = fixture.componentInstance;
				modalService = TestBed.inject(NgbModal);
				fixture.detectChanges();
			})
		);

		describe('PageNetworkBoostComponent init and destory', () => {
			it('ngOnInit', () => {
				spyOn(component, 'networkBoostRegisterEvent').and.callThrough();
				expect(component.networkBoostRegisterEvent).toHaveBeenCalledTimes(0);

				component.ngOnInit();
				expect(component.networkBoostRegisterEvent).toHaveBeenCalledTimes(1);

				component.networkBoostRegisterEvent();
				expect(gamingQuickSettingToolbarService.registerEvent).toHaveBeenCalled();
				expect(shellServices.registerEvent).toHaveBeenCalled();
			});

			it('onGamingQuickSettingsNetworkBoostStatusChangedEvent', () => {
				component.onGamingQuickSettingsNetworkBoostStatusChangedEvent(1);
				expect(component.toggleStatus).toBe(true);

				component.onGamingQuickSettingsNetworkBoostStatusChangedEvent(0);
				expect(component.toggleStatus).toBe(false);
			});

			it('ngOnDestroy', () => {
				spyOn(component, 'networkBoostUnRegisterEvent').and.callThrough();
				expect(component.networkBoostUnRegisterEvent).toHaveBeenCalledTimes(0);

				component.ngOnDestroy();
				expect(component.networkBoostUnRegisterEvent).toHaveBeenCalledTimes(1);

				component.networkBoostUnRegisterEvent();
				expect(gamingQuickSettingToolbarService.unregisterEvent).toHaveBeenCalled();
				expect(shellServices.unRegisterEvent).toHaveBeenCalled();
			});
		});

		describe('openTargetModal Modal actions', () => {
			it('openTargetModal', fakeAsync(() => {
				component.isModalShowing = false;
				networkBoostServiceSpy.getNeedToAsk = () => true;
				component.openTargetModal();
				tick(50);
				expect(component.needToAsk).toBe(true);

				component.openTargetModal();
				tick(50);
				expect(component.isModalShowing).toBe(true);

				component.isModalShowing = false;
				networkBoostServiceSpy.getNeedToAsk = () => false;
				component.toggleStatus = false;
				component.openTargetModal();
				tick(50);
				expect(component.needToAsk).toBe(false);

				component.isModalShowing = false;
				networkBoostServiceSpy.getNeedToAsk = () => 'undefined';
				component.openTargetModal();
				tick(50);
				expect(component.needToAsk).toBe(false);

				component.isModalShowing = false;
				networkBoostServiceSpy.getNeedToAsk = () => undefined;
				component.openTargetModal();
				tick(50);
				expect(component.needToAsk).toBe(false);
			}));

			it('setNetworkBoostStatus', fakeAsync(async () => {
				localCacheServiceSpy.getLocalCacheValue = (key, defaulvalue) => 2;
				let event = { switchValue: false };
				await component.setNetworkBoostStatus(event);
				expect(component.toggleStatus).toBe(false);

				localCacheServiceSpy.getLocalCacheValue = (key, defaulvalue) => 1;
				await component.setNetworkBoostStatus(event);
				expect(component.toggleStatus).toBe(false);

				event.switchValue = true;
				await component.setNetworkBoostStatus(event);
				event = null;
				await component.setNetworkBoostStatus(event);
				expect(component.toggleStatus).toBe(true);
			}));

			it('getNetworkBoostStatus', fakeAsync(async () => {
				networkBoostServiceSpy.getNetworkBoostStatus = () => {
					throw new Error('getnetworkbooststatus error');
				};
				await component.getNetworkBoostStatus();
				expect(component.toggleStatus).toBe(undefined);
			}));
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
					const modalGamingPromptMock = new ModalGamingPromptMockComponent();
					spyOn(modalService, 'open').and.returnValue(modalGamingPromptMock);
					component.showTurnOn();
					setTimeout(() => {
						modalGamingPromptMock.componentInstance.emitService.next(true);
					}, 20);
					tick(100);

					setTimeout(() => {
						modalGamingPromptMock.componentInstance.emitService.next(false);
					}, 20);
					tick(100);

					setTimeout(() => {
						modalGamingPromptMock.componentInstance.emitService.next(1);
					}, 20);
					tick(100);

					setTimeout(() => {
						modalGamingPromptMock.componentInstance.emitService.next(2);
					}, 20);
					tick(100);
					expect(component.isModalShowing).toBe(false);
				} catch (error) {}
			}));

			it('setNotAskAgain', fakeAsync(() => {
				const throwError = () => {
					throw new Error('error from setnotaskagain');
				};
				networkBoostServiceSpy.setNeedToAskStatusCache = throwError;
				component.setNotAskAgain(true);
				expect(component.isModalShowing).toBe(false);
			}));
		});
	});
});
