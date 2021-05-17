import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

import { CMSService } from 'src/app/services/cms/cms.service';
import { CommsService } from 'src/app/services/comms/comms.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

import { ModalGamingRunningAppListComponent } from './modal-gaming-running-app-list.component';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { GAMING_DATA } from './../../../../testing/gaming-data';

const autoCloseServiceMock = jasmine.createSpyObj('GamingAutoCloseService', [
	'isShellAvailable',
	'gamingAutoClose',
	'getAppsAutoCloseRunningList',
	'addAppsAutoCloseList',
	'delAppsAutoCloseList',
]);
const networkBoostServiceMock = jasmine.createSpyObj('NetworkBoostService', [
	'isShellAvailable',
	'setNetworkBoostStatus',
	'getNetUsingProcesses',
	'addProcessToNetworkBoost',
	'deleteProcessInNetBoost',
]);

const cmsServiceMock = jasmine.createSpyObj('CMSService', ['fetchCMSContent', 'getOneCMSContent']);
const commonServiceMock = jasmine.createSpyObj('CommonService', [
	'isShellAvailable',
	'notification',
	'getShellVersion',
	'compareVersion',
]);

const autoCloseAppList = {
	processList: [
		{
			processDescription: 'E046963F.LenovoCompanion',
			iconName: 'ms-appdata:///local/icon/31b3d9d7dea8e073.png',
		},
		{
			processDescription: 'Microsoft Store',
			iconName: 'ms-appdata:///local/icon/24381e8e2df0ab73.png',
		},
		{
			processDescription: 'Microsoft.Windows.ShellExperienceHost',
			iconName: 'ms-appdata:///local/icon/3862fc8e419fa507.png',
		},
		{
			processDescription: 'Shell Input Application',
			iconName: 'ms-appdata:///local/icon/ea2b14e5811d195d.png',
		},
		{
			processDescription: 'Skype for Business',
			iconName: 'ms-appdata:///local/icon/29fd475c909f7486.png',
		},
		{
			processDescription: 'Windows Calculator',
			iconName: 'ms-appdata:///local/icon/ddfff48c74049c74.png',
		},
		{
			processDescription: 'microsoft.windowscommunicationsapps',
			iconName: 'ms-appdata:///local/icon/7b2ca07c9a67cc86.png',
		},
		{
			processDescription: 'windows.immersivecontrolpanel',
			iconName: 'ms-appdata:///local/icon/4a4341b5d5250f32.png',
		},
	],
};

const networkBoostAppList = {
	processList: [
		{
			processDescription: 'Google Chrome',
			iconName: 'ms-appdata:///local/icon/83a48b2b3d643451.png',
			processPath: 'c:\\chrome\\chrome.exe',
		},
		{
			processDescription: 'Slack',
			iconName: 'ms-appdata:///local/icon/256509debf91d991.png',
			processPath: 'c:\\chrome\\xxx.exe',
		},
		{
			processDescription: 'Visual Studio Code',
			iconName: 'ms-appdata:///local/icon/e817dc2039be4789.png',
			processPath: 'c:\\chrome\\xxx.exe',
		},
	],
};

const emptyAppList = { processList: [] };

describe('ModalGamingRunningAppListComponent', () => {
	let component: ModalGamingRunningAppListComponent;
	let fixture: ComponentFixture<ModalGamingRunningAppListComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					ModalGamingRunningAppListComponent,
					GAMING_DATA.mockPipe({ name: 'translate' }),
					GAMING_DATA.mockPipe({ name: 'sanitize' }),
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: GamingAutoCloseService, useValue: autoCloseServiceMock },
					{ provide: NetworkBoostService, useValue: networkBoostServiceMock },
					{ provide: CommsService },
					{ provide: DevService },
					{ provide: LoggerService },
					{ provide: VantageShellService },
					{ provide: HttpHandler },
					{ provide: CMSService, useValue: cmsServiceMock },
					{ provide: CommonService, useValue: commonServiceMock },
					{ provide: MatDialogRef },
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalGamingRunningAppListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		commonServiceMock.getShellVersion.and.returnValue('10.2020.9');
		commonServiceMock.compareVersion.and.returnValue(10);
		autoCloseServiceMock.isShellAvailable.and.returnValue(true);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should setAppList isNetworkBoost=false and emptylist', () => {
		autoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
			Promise.resolve(emptyAppList)
		);
		component.setAppList(false, 0);
		expect(component.isNetworkBoost).toBeFalse();
		expect(component.addedApps).toEqual(0);
	});

	it('should setAppList isNetworkBoost=false and autoCloseAppList', () => {
		autoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
			Promise.resolve(autoCloseAppList)
		);
		component.setAppList(false, 0);
		expect(component.isNetworkBoost).toBeFalse();
		expect(component.addedApps).toEqual(0);
	});

	it('should setAppList isNetworkBoost=false and failed', () => {
		autoCloseServiceMock.getAppsAutoCloseRunningList.and.throwError('aaa');
		component.setAppList(false, 0);
		expect(component.isNetworkBoost).toBeFalse();
		expect(component.addedApps).toEqual(0);
	});

	it('should setAppList isNetworkBoost=true and emptylist', () => {
		autoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
			Promise.resolve(emptyAppList)
		);
		component.setAppList(true, 1);
		expect(component.isNetworkBoost).toBeTrue();
		expect(component.addedApps).toEqual(1);
	});

	it('should setAppList isNetworkBoost=true and networkBoostAppList', () => {
		autoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
			Promise.resolve(networkBoostAppList)
		);
		component.setAppList(true, 3);
		expect(component.isNetworkBoost).toBeTrue();
		expect(component.addedApps).toEqual(3);
	});

	it('should isLastCheckedApp using last item', () => {
		autoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
			Promise.resolve(autoCloseAppList)
		);
		component.setAppList(false, 0);
		const result = component.isLastCheckedApp(autoCloseAppList.processList.length - 1);
		expect(result).toBe(true);
	});

	it('should isLastCheckedApp using first item', fakeAsync(() => {
		autoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
			Promise.resolve(autoCloseAppList)
		);
		component.setAppList(false, 0);
		tick(20);
		component.isChecked[3] = true;
		const result = component.isLastCheckedApp(0);
		expect(result).toBe(false);
	}));

	it('should isLastCheckedApp using correct item', fakeAsync(() => {
		autoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
			Promise.resolve(autoCloseAppList)
		);
		component.setAppList(false, 0);
		tick(20);
		component.isChecked[3] = true;
		const result = component.isLastCheckedApp(3);
		expect(result).toBe(true);
	}));

	it('should ngOnChanges', () => {
		const change = {};
		const result = component.ngOnChanges(change);
		expect(result).toBe(undefined);
	});

	it('should closeModal', () => {
		const result = component.closeModal();
		expect(result).toBe(undefined);
	});

	it('should focusCloseButton', async () => {
		const dummyElement = document.createElement('button');
		document.getElementsByClassName = jasmine
			.createSpy('HTML Element')
			.and.returnValue([dummyElement]);
		await component.focusCloseButton();
		expect(dummyElement).not.toBeNull();
	});

	it('should runappKeyup', () => {
		component.runningList = autoCloseAppList.processList;
		component.addedApps = 5;
		component.runappKeyup({ which: 9, shiftKey: false }, 7);
		expect(component).toBeTruthy();
	});

	it('should runappKeyup of key=10', () => {
		component.runningList = autoCloseAppList.processList;
		component.addedApps = 5;
		component.runappKeyup({ which: 10, shiftKey: false }, 7);
		expect(component).toBeTruthy();
	});

	it('should runappKeyup of addedApps=1', () => {
		component.runningList = autoCloseAppList.processList;
		component.addedApps = 1;
		component.runappKeyup({ which: 9, shiftKey: false }, 7);
		expect(component).toBeTruthy();
	});

	it('should isLastCheckedApp', async () => {
		autoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
			Promise.resolve(autoCloseAppList)
		);
		component.runningList = autoCloseAppList.processList;
		const result = component.isLastCheckedApp(7);
		expect(result).toBeTrue();
	});

	it('should addApp, isNetworkBoost=true and return true', async () => {
		component.isNetworkBoost = true;
		component.addedApps = 1;
		const item = { isChecked: true };
		networkBoostServiceMock.addProcessToNetworkBoost.and.returnValue(true);
		await component.addApp({}, item);
		expect(item.isChecked).toBeTrue();
		expect(component.addedApps).toBe(1);
	});

	it('should addApp, isNetworkBoost=true and return false', async () => {
		component.isNetworkBoost = true;
		component.addedApps = 1;
		const item = { isChecked: true };
		networkBoostServiceMock.addProcessToNetworkBoost.and.returnValue(false);
		await component.addApp({}, item);
		expect(item.isChecked).toBeFalse();
		expect(component.addedApps).toBe(0);
	});

	it('should addApp, isNetworkBoost=false and return true', async () => {
		component.isNetworkBoost = false;
		component.addedApps = 1;
		const item = { isChecked: true };
		autoCloseServiceMock.addAppsAutoCloseList.and.returnValue(true);
		await component.addApp({}, item);
		expect(item.isChecked).toBeTrue();
	});

	it('should addApp, isNetworkBoost=false and return false', async () => {
		component.isNetworkBoost = false;
		component.addedApps = 1;
		const item = { isChecked: true };
		autoCloseServiceMock.addAppsAutoCloseList.and.returnValue(false);
		await component.addApp({}, item);
		expect(item.isChecked).toBeFalse();
	});

	it('should removeApp, isNetworkBoost=true and return true', async () => {
		component.isNetworkBoost = true;
		component.addedApps = 1;
		const item = { isChecked: false };
		networkBoostServiceMock.deleteProcessInNetBoost.and.returnValue(true);
		await component.removeApp({}, item);
		expect(item.isChecked).toBeFalse();
		expect(component.addedApps).toBe(1);
	});

	it('should removeApp, isNetworkBoost=true and return false', async () => {
		component.isNetworkBoost = true;
		component.addedApps = 1;
		const item = { isChecked: false };
		networkBoostServiceMock.deleteProcessInNetBoost.and.returnValue(false);
		await component.removeApp({}, item);
		expect(item.isChecked).toBeTrue();
		expect(component.addedApps).toBe(2);
	});

	it('should removeApp, isNetworkBoost=false and return true', async () => {
		component.isNetworkBoost = false;
		component.addedApps = 1;
		const item = { isChecked: false };
		autoCloseServiceMock.delAppsAutoCloseList.and.returnValue(true);
		await component.removeApp({}, item);
		expect(item.isChecked).toBeFalse();
	});

	it('should removeApp, isNetworkBoost=false and return false', async () => {
		component.isNetworkBoost = false;
		component.addedApps = 1;
		const item = { isChecked: false };
		autoCloseServiceMock.delAppsAutoCloseList.and.returnValue(false);
		await component.removeApp({}, item);
		expect(item.isChecked).toBeTrue();
	});

	it('should onValueChange, isNetworkBoost=true and checked from false to true', async () => {
		component.isNetworkBoost = true;
		component.addedApps = 1;
		component.isChecked = [false];
		const item = { isChecked: false };
		networkBoostServiceMock.addProcessToNetworkBoost.and.returnValue(true);
		await component.onValueChange({ target: { value: 'chrome.exe' } }, 0, item);
		expect(component.isChecked[0]).toBeTrue();
		expect(item.isChecked).toBeTrue();
		expect(component.addedApps).toBe(2);
	});

	it('should onValueChange, isNetworkBoost=true and checked from true to false', async () => {
		component.isNetworkBoost = true;
		component.addedApps = 1;
		component.isChecked = [true];
		const item = { isChecked: true };
		networkBoostServiceMock.deleteProcessInNetBoost.and.returnValue(true);
		await component.onValueChange({ target: { value: 'chrome.exe' } }, 0, item);
		expect(component.isChecked[0]).toBeFalse();
		expect(item.isChecked).toBeFalse();
		expect(component.addedApps).toBe(0);
	});

	it('should onValueChange, isNetworkBoost=false and checked from false to true', async () => {
		component.isNetworkBoost = false;
		component.addedApps = 1;
		component.isChecked = [false];
		const item = { isChecked: false };
		autoCloseServiceMock.addAppsAutoCloseList.and.returnValue(true);
		await component.onValueChange({ target: { value: 'chrome.exe' } }, 0, item);
		expect(component.isChecked[0]).toBeTrue();
		expect(item.isChecked).toBeTrue();
	});

	it('should onValueChange, isNetworkBoost=false and checked from true to false', async () => {
		component.isNetworkBoost = false;
		component.addedApps = 1;
		component.isChecked = [true];
		const item = { isChecked: true };
		autoCloseServiceMock.delAppsAutoCloseList.and.returnValue(true);
		await component.onValueChange({ target: { value: 'chrome.exe' } }, 0, item);
		expect(component.isChecked[0]).toBeFalse();
		expect(item.isChecked).toBeFalse();
	});
});
