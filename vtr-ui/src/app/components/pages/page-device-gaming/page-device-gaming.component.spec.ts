// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { PageDeviceGamingComponent } from './page-device-gaming.component';
// import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
// import { FeedbackFormComponent } from '../../feedback-form/feedback-form/feedback-form.component';
// import { TranslationModule } from 'src/app/modules/translation.module';
// import { HttpClientModule } from '@angular/common/http';
// import { RouterTestingModule } from '@angular/router/testing';
// import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { TranslateStore } from '@ngx-translate/core';
// import { DevService } from 'src/app/services/dev/dev.service';
// import { CookieService } from 'ngx-cookie-service';
// import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';
// import { CommsService } from 'src/app/services/comms/comms.service';
// import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
// import { ModalModernPreloadComponent } from '../../modal/modal-modern-preload/modal-modern-preload.component';


// describe('PageDeviceGamingComponent', () => {
// 	let component: PageDeviceGamingComponent;
// 	let fixture: ComponentFixture<PageDeviceGamingComponent>;

// 	beforeEach(async(() => {
// 		TestBed.configureTestingModule({
// 			declarations: [PageDeviceGamingComponent, SvgInlinePipe, FeedbackFormComponent, ModalModernPreloadComponent,
// 				mockPipe({ name: 'sanitize' })],
// 			schemas: [NO_ERRORS_SCHEMA],
// 			imports: [TranslationModule, HttpClientModule, RouterTestingModule, NgbModule],
// 			providers: [TranslateStore, DevService, CommsService, CookieService, DashboardService]
// 		}).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [FeedbackFormComponent, ModalModernPreloadComponent] } })
// 			.compileComponents();

// 	}));

// 	beforeEach(() => {
// 		fixture = TestBed.createComponent(PageDeviceGamingComponent);
// 		component = fixture.componentInstance;
// 		fixture.detectChanges();
// 	});

// 	it('#PageDeviceGamingComponent :should create', () => {
// 		expect(component).toBeTruthy();
// 	});

// 	it('#PageDeviceGamingComponent : ngDoCheck protocolAction lenovoid', () => {

// 		// fixture.debugElement.injector.get('protocolAction');
// 		// spyOnProperty<any>(component, 'protocolAction', 'get').and.returnValue('lenovoid');
// 		/* const spy = spyOnProperty<any>(component, 'protocolAction', 'get').and.callFake(function () {
// 			// Perform some operations needed for this specific test
// 			return 'lenovoid';
// 		}); */

// 		let route: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
// 		let snapshot: ActivatedRouteSnapshot = route.snapshot;
// 		snapshot.queryParams = { action: 'lenovoid' };

// 		// spyOnProperty<any>(snapshot.queryParams, 'action', 'get').and.returnValue('lenovoid');
// 		//Observable.of({id: 123}
// 		// spyOnProperty<any>(snapshot, 'activatedRoute', 'get').and.returnValue()
// 		spyOn(component, 'ngDoCheck').and.callThrough();
// 		component.ngDoCheck();
// 		fixture.detectChanges();
// 		expect(component['ngDoCheck']).toHaveBeenCalled();

// 	});

// 	it('#PageDeviceGamingComponent : ngDoCheck protocolAction modernpreload', () => {
// 		let route: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
// 		let snapshot: ActivatedRouteSnapshot = route.snapshot;
// 		snapshot.queryParams = { action: 'modernpreload' };
// 		spyOn(component, 'ngDoCheck').and.callThrough();
// 		component.ngDoCheck();
// 		fixture.detectChanges();
// 		expect(component['ngDoCheck']).toHaveBeenCalled();
// 		const modalService = fixture.debugElement.injector.get(NgbModal);
// 		modalService.hasOpenModals();
// 		modalService.dismissAll();

// 	});

// 	it('#PageDeviceGamingComponent : onNotification network status offline ', () => {
// 		//spyOn(component.dashboardService, 'getSystemInfo').and.returnValue(Promise.resolve());
// 		const onNotificationSpy = spyOn<any>(component, 'onNotification').withArgs(mockNetworkStatusOffline).and.callThrough();
// 		onNotificationSpy.call(component, mockNetworkStatusOffline);
// 		fixture.detectChanges();
// 		expect(component['onNotification']).toHaveBeenCalled();

// 	});

// 	it('#PageDeviceGamingComponent : onNotification network status online ', () => {
// 		//spyOn(component.dashboardService, 'getSystemInfo').and.returnValue(Promise.resolve());
// 		const onNotificationSpy = spyOn<any>(component, 'onNotification').withArgs(mockNetworkStatusOnline).and.callThrough();
// 		// spyOnProperty<any>(component, 'isOnline', 'get').and.returnValue(false);
// 		onNotificationSpy.call(component, mockNetworkStatusOnline);
// 		fixture.detectChanges();
// 		expect(component['onNotification']).toHaveBeenCalled();

// 	});

// 	/* it('#PageDeviceGamingComponent : fetchCmsContents protocolAction isOnline', () => {
// 		let route: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
// 		let snapshot: ActivatedRouteSnapshot = route.snapshot;
// 		snapshot.queryParams = { action: 'modernpreload' };
// 		spyOn(component, 'ngDoCheck').and.callThrough();
// 		component.ngDoCheck();
// 		fixture.detectChanges();
// 		expect(component['ngDoCheck']).toHaveBeenCalled();

// 	}); */

// 	it('#PageDeviceGamingComponent : Dashboard getSystemInfo - Memory status 0 ', () => {
// 		//let clonedSystemStatus = Object.create(systemStatus);
// 		let clonedSystemStatus = JSON.parse(JSON.stringify(mockSystemStatus));
// 		clonedSystemStatus.memory.used = (clonedSystemStatus.memory.total * 0.2);
// 		spyOn(component.dashboardService, 'getSystemInfo').and.returnValue(Promise.resolve(clonedSystemStatus));
// 		const getSecurityStatusSpy = spyOn<any>(component, 'getSystemInfo').and.callThrough();
// 		getSecurityStatusSpy.call(component, null);
// 		fixture.detectChanges();
// 		expect(component['getSystemInfo']).toHaveBeenCalled();

// 	});



// 	it('#PageDeviceGamingComponent : Dashboard getSystemInfo - Memory status 1 ', () => {
// 		//let clonedSystemStatus = Object.create(systemStatus);
// 		let clonedSystemStatus = JSON.parse(JSON.stringify(mockSystemStatus));
// 		clonedSystemStatus.memory.used = (clonedSystemStatus.memory.total * 0.71);
// 		spyOn(component.dashboardService, 'getSystemInfo').and.returnValue(Promise.resolve(clonedSystemStatus));
// 		const getSecurityStatusSpy = spyOn<any>(component, 'getSystemInfo').and.callThrough();
// 		getSecurityStatusSpy.call(component, null);
// 		fixture.detectChanges();
// 		expect(component['getSystemInfo']).toHaveBeenCalled();

// 	});

// 	it('#PageDeviceGamingComponent : Dashboard getSystemInfo - DiskSpace status 0 ', () => {
// 		//let clonedSystemStatus = Object.create(systemStatus);
// 		let clonedSystemStatus = JSON.parse(JSON.stringify(mockSystemStatus));
// 		clonedSystemStatus.disk.used = (clonedSystemStatus.disk.total * 0.09);
// 		spyOn(component.dashboardService, 'getSystemInfo').and.returnValue(Promise.resolve(clonedSystemStatus));
// 		const getSecurityStatusSpy = spyOn<any>(component, 'getSystemInfo').and.callThrough();
// 		getSecurityStatusSpy.call(component, null);
// 		fixture.detectChanges();
// 		expect(component['getSystemInfo']).toHaveBeenCalled();

// 	});

// 	it('#PageDeviceGamingComponent : Dashboard getSystemInfo - DiskSpace status 1 ', () => {
// 		//let clonedSystemStatus = Object.create(systemStatus);
// 		let clonedSystemStatus = JSON.parse(JSON.stringify(mockSystemStatus));
// 		clonedSystemStatus.disk.used = (clonedSystemStatus.disk.total * 0.91);
// 		spyOn(component.dashboardService, 'getSystemInfo').and.returnValue(Promise.resolve(clonedSystemStatus));
// 		const getSecurityStatusSpy = spyOn<any>(component, 'getSystemInfo').and.callThrough();
// 		getSecurityStatusSpy.call(component, null);
// 		fixture.detectChanges();
// 		expect(component['getSystemInfo']).toHaveBeenCalled();

// 	});

// 	it('#PageDeviceGamingComponent : Dashboard getSystemInfo - warranty status 0 ', () => {
// 		//let clonedSystemStatus = Object.create(systemStatus);
// 		let clonedSystemStatus = JSON.parse(JSON.stringify(mockSystemStatus));
// 		clonedSystemStatus.warranty.status = 0;
// 		spyOn(component.dashboardService, 'getSystemInfo').and.returnValue(Promise.resolve(clonedSystemStatus));
// 		const getSecurityStatusSpy = spyOn<any>(component, 'getSystemInfo').and.callThrough();
// 		getSecurityStatusSpy.call(component, null);
// 		fixture.detectChanges();
// 		expect(component['getSystemInfo']).toHaveBeenCalled();

// 	});

// 	it('#PageDeviceGamingComponent : Dashboard getSystemInfo - warranty status  not in 0,1 ', () => {
// 		//let clonedSystemStatus = Object.create(systemStatus);
// 		let clonedSystemStatus = JSON.parse(JSON.stringify(mockSystemStatus));
// 		clonedSystemStatus.warranty.status = -1;
// 		spyOn(component.dashboardService, 'getSystemInfo').and.returnValue(Promise.resolve(clonedSystemStatus));
// 		const getSecurityStatusSpy = spyOn<any>(component, 'getSystemInfo').and.callThrough();
// 		getSecurityStatusSpy.call(component, null);
// 		fixture.detectChanges();
// 		expect(component['getSystemInfo']).toHaveBeenCalled();

// 	});


// 	it('#PageDeviceGamingComponent : getSecurityStatus', () => {

// 		const getSecurityStatusSpy = spyOn<any>(component, 'getSecurityStatus').and.callThrough();
// 		getSecurityStatusSpy.and.returnValue(mockSecurityStatus);
// 		getSecurityStatusSpy.call(null, null);
// 		fixture.detectChanges();
// 		expect(component['getSecurityStatus']).toHaveBeenCalled();

// 	});

// 	it('#PageDeviceGamingComponent : Dashboard getSecurityStatus - antivirus 1 , wifi 1 ,passwordManager installed ,VPN  installed , windowsHello 1', () => {

// 		let clonedSecurityStatus = JSON.parse(JSON.stringify(mockSecurityStatus));
// 		clonedSecurityStatus.antiVirus.status = 1;
// 		// clonedSecurityStatus.wiFi.status = 1;
// 		clonedSecurityStatus.wifiSecurity.status = 1;
// 		clonedSecurityStatus.passwordManager.installed = 1;
// 		clonedSecurityStatus.VPN.installed = 1;
// 		clonedSecurityStatus.windowsHello.status = 1;


// 		spyOn(component.dashboardService, 'getSecurityStatus').and.returnValue(Promise.resolve(clonedSecurityStatus));
// 		const getSecurityStatusSpy = spyOn<any>(component, 'getSecurityStatus').and.callThrough();
// 		getSecurityStatusSpy.call(component, null);
// 		fixture.detectChanges();
// 		expect(component['getSecurityStatus']).toHaveBeenCalled();

// 	});

// 	it('#PageDeviceGamingComponent : Dashboard getSecurityStatus', () => {
// 		spyOn(component.dashboardService, 'getSecurityStatus').and.returnValue(Promise.resolve(mockSecurityStatus));
// 		const getSecurityStatusSpy = spyOn<any>(component, 'getSecurityStatus').and.callThrough();
// 		getSecurityStatusSpy.call(component, null);
// 		fixture.detectChanges();
// 		expect(component['getSecurityStatus']).toHaveBeenCalled();

// 	});

// 	it('#PageDeviceGamingComponent :onFeedbackModal', () => {
// 		const modalService = fixture.debugElement.injector.get(NgbModal);
// 		spyOn(component, 'onFeedbackModal').and.callThrough();
// 		fixture.detectChanges();
// 		component.onFeedbackModal();
// 		expect(component['onFeedbackModal']).toHaveBeenCalled();
// 		modalService.hasOpenModals();
// 		modalService.dismissAll();

// 	});

// 	afterEach(() => {
// 		// fixture.destroy();
// 		const modalService = fixture.debugElement.injector.get(NgbModal);
// 		modalService.hasOpenModals();
// 		modalService.dismissAll();

// 	});


// });

// const mockNetworkStatusOffline = {
// 	type: '[NetworkStatus] Offline',
// 	payload: {
// 		isOnline: false
// 	}
// };

// const mockNetworkStatusOnline = {
// 	type: '[NetworkStatus] Online',
// 	payload: {
// 		isOnline: true
// 	}
// };

// let mockSystemStatus = {
// 	memory: {
// 		total: 8261181440,
// 		used: 7720923136
// 	},
// 	disk: {
// 		total: 256060514304,
// 		used: 93606965248
// 	},
// 	warranty: {
// 		expired: '2017-10-16T00:00:00.000Z',
// 		status: 1
// 	},
// 	systemupdate: {
// 		lastupdate: '2019-10-25T17:27:51',
// 		status: 1
// 	}
// };
// const mockSecurityStatus = {

// 	antiVirus: {
// 		status: 0,
// 		id: 'anti-virus',
// 		title: 'Anti-Virus',
// 		detail: 'Enabled',
// 		path: 'security/anti-virus',
// 		type: 'security'
// 	},
// 	wifiSecurity: {
// 		status: 0,
// 		id: 'firewall',
// 		title: 'Firewall',
// 		detail: 'Disabled',
// 		path: 'security/anti-virus',
// 		type: 'security'
// 	},
// 	passwordManager: {
// 		status: 2,
// 		id: 'pwdmgr',
// 		title: 'Password Manager',
// 		detail: 'Installed',
// 		path: 'security/password-protection',
// 		type: 'security'
// 	},
// 	VPN: {
// 		status: 2,
// 		id: 'vpn',
// 		title: 'VPN',
// 		detail: 'Installed',
// 		path: 'security/internet-protection',
// 		type: 'security'
// 	},
// 	windowsHello: {
// 		status: 0,
// 		id: 'windows-hello',
// 		title: 'Windows Hello',
// 		detail: 'disabled',
// 		path: 'security/windows-hello',
// 		type: 'security'
// 	}
// };
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
