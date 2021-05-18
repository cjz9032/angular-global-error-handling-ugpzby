import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PageDeviceGamingComponent } from './page-device-gaming.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { MatDialog, MatDialogModule } from '@lenovo/material/dialog';
import { TranslateStore } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DevService } from 'src/app/services/dev/dev.service';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';
import { CommsService } from 'src/app/services/comms/comms.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { GAMING_DATA } from './../../../../testing/gaming-data';

const cmsServiceMock = {
	fetchCMSContent: (params) => of(GAMING_DATA.cmsMock),
	getOneCMSContent: (res, template, position) => (res = GAMING_DATA.cmsMock.Results),
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
	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					PageDeviceGamingComponent,
					SvgInlinePipe,
					GAMING_DATA.mockPipe({ name: 'sanitize' }),
				],
				schemas: [NO_ERRORS_SCHEMA],
				imports: [
					TranslationModule,
					HttpClientModule,
					RouterTestingModule,
					MatDialogModule,
				],
				providers: [
					TranslateStore,
					GamingAllCapabilitiesService,
					DialogService,
					DevService,
					CommsService,
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDeviceGamingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('#PageDeviceGamingComponent :should create', () => {
		expect(component).toBeTruthy();
	});

	it('#PageDeviceGamingComponent : ngDoCheck protocolAction lenovoid', () => {
		const route: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
		const snapshot: ActivatedRouteSnapshot = route.snapshot;
		snapshot.queryParams = { action: 'lenovoid' };
		spyOn(component, 'ngDoCheck').and.callThrough();
		component.ngDoCheck();
		expect(component.ngDoCheck).toHaveBeenCalled();
	});

	it('#PageDeviceGamingComponent : ngDoCheck protocolAction modernpreload', () => {
		const route: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
		const snapshot: ActivatedRouteSnapshot = route.snapshot;
		snapshot.queryParams = { action: 'modernpreload' };
		spyOn(component, 'ngDoCheck').and.callThrough();
		component.ngDoCheck();
		expect(component.ngDoCheck).toHaveBeenCalled();
		const modalService = fixture.debugElement.injector.get(MatDialog);
		modalService.closeAll();
	});

	it('#PageDeviceGamingComponent : onNotification network status online ', () => {
		dashboardServiceMock.onlineCardContent.positionD = true;
		const onNotificationSpy = spyOn<any>(component, 'onNotification')
			.withArgs(mockNetworkStatusOnline)
			.and.callThrough();
		onNotificationSpy.call(component, mockNetworkStatusOnline);
		expect(component.onNotification).toHaveBeenCalled();
	});

	it('#PageDeviceGamingComponent : onNotification network status offline ', () => {
		const offNotificationSpy = spyOn<any>(component, 'onNotification')
			.withArgs(mockNetworkStatusOffline)
			.and.callThrough();
		offNotificationSpy.call(component, mockNetworkStatusOffline);
		expect(component.onNotification).toHaveBeenCalled();
	});

	it('#PageDeviceGamingComponent : onConnectivityClick', () => {
		component.onConnectivityClick({});
		expect(component.onConnectivityClick({})).toBeUndefined();
	});
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

const mockSystemStatus = {
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
