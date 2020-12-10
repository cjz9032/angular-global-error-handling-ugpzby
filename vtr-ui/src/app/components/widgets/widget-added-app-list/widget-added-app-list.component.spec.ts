import { Pipe } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { WidgetAddedAppListComponent } from './widget-added-app-list.component';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { GamingAutoCloseService } from './../../../services/gaming/gaming-autoclose/gaming-autoclose.service';
import { CommonService } from 'src/app/services/common/common.service';
import { exception } from 'console';
import { GAMING_DATA } from './../../../../testing/gaming-data';

describe('WidgetAddedAppListComponent', () => {
	let component: WidgetAddedAppListComponent;
	let fixture: ComponentFixture<WidgetAddedAppListComponent>;

	const autoCloseServiceMock = jasmine.createSpyObj('GamingAutoCloseService', [
		'getAppsAutoCloseList',
		'getAutoCloseListCache',
		'setAutoCloseListCache',
		'delAppsAutoCloseList',
	]);

	const networkBoostServiceMock = jasmine.createSpyObj('NetworkBoostService', [
		'getNetworkBoostList',
		'deleteProcessInNetBoost',
	]);

	let commonService: CommonService;

	const networkBoostList = {
		processList: [
			{
				processDescription: 'Chrome',
				iconName: 'icon\\12345678.icon',
				processPath: 'c:\\chrome\\chrome.exe',
			},
			{
				processDescription: 'asdfxx',
				iconName: 'icon\\dxx.icon',
				processPath: 'c:\\chrome\\xxx.exe',
			},
		],
	};

	const autoClostList = {
		processList: [
			{
				processDescription: 'Q-Dir',
				iconName: 'icon\\12345678.icon',
				releaseTimes: '0',
			},
			{
				processDescription: 'Chrome',
				iconName: 'icon\\12345678.icon',
				releaseTimes: 'c:\\chrome\\chrome.exe',
			},
		],
	};

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					WidgetAddedAppListComponent,
					GAMING_DATA.mockPipe({ name: 'translate' }),
				],
				providers: [
					{ provide: NetworkBoostService, useValue: networkBoostServiceMock },
					{ provide: GamingAutoCloseService, useValue: autoCloseServiceMock },
					{ provide: HttpClient },
					{ provide: HttpHandler },
				],
			}).compileComponents();

			const dummyElement = document.createElement('button');
			document.getElementById = jasmine
				.createSpy('HTML Element')
				.and.returnValue(dummyElement);
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetAddedAppListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		networkBoostServiceMock.getNetworkBoostList.and.returnValue(
			Promise.resolve(networkBoostList)
		);
		networkBoostServiceMock.deleteProcessInNetBoost.and.returnValue(Promise.resolve(true));
		commonService = TestBed.inject(CommonService);
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(networkBoostList);
		spyOn(commonService, 'setLocalStorageValue').and.returnValue();

		autoCloseServiceMock.getAppsAutoCloseList.and.returnValue(Promise.resolve(autoClostList));
		autoCloseServiceMock.getAutoCloseListCache.and.returnValue(autoClostList);
		autoCloseServiceMock.setAutoCloseListCache.and.returnValue(true);
		autoCloseServiceMock.delAppsAutoCloseList.and.returnValue(Promise.resolve(true));
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should ngOnChanges, isNetworkBoost = true', async () => {
		component.isNetworkBoost = true;
		await component.ngOnChanges(null);
		expect(component.appList.length).not.toBe(0);
	});

	it('should ngOnChanges, isNetworkBoost = false', async () => {
		component.isNetworkBoost = false;
		component.refreshTrigger = -1;
		await component.ngOnChanges(null);
		expect(component.appList.length).not.toBe(0);
	});

	it('should openModal', () => {
		spyOn(component.actionModal, 'emit').and.callThrough();
		component.openModal();
		expect(component.actionModal.emit).toHaveBeenCalledTimes(1);
	});

	it('should getNetworkBoostListCache', async () => {
		await component.getNetworkBoostListCache();
		expect(component.appList.length).not.toBe(0);
	});

	it('should getAutoCloseListCache', async () => {
		await component.getAutoCloseListCache();
		expect(component.appList.length).not.toBe(0);
	});

	it('should removeApp, isNetworkBoost = true', async () => {
		component.isNetworkBoost = true;
		await component.getNetworkBoostList();
		await component.removeApp({ processPath: 'c:\\chrome\\chrome.exe' }, 0);
		expect(component.appList.length).not.toBe(0);
	});

	it('should removeApp, isNetworkBoost = false', async () => {
		component.isNetworkBoost = false;
		await component.getAutoCloseList();
		await component.removeApp({ processDescription: 'Q-Dir' }, 0);
		expect(component.appList.length).not.toBe(0);
	});

	it('should sendAddedApps', () => {
		spyOn(component.addedApps, 'emit').and.callThrough();
		component.sendAddedApps();
		expect(component.addedApps.emit).toHaveBeenCalledTimes(1);
		expect(component.appList.length).toBe(0);
	});
});
