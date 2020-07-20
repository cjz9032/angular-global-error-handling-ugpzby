import { DialogService } from "./dialog.service";
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonService } from '../common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { UserService } from '../user/user.service';
import { DeviceService } from '../device/device.service';
import { NetworkRequestService } from '../network-request/network-request.service';
import { of } from 'rxjs';

class ModalMockService {
	hasOpenModals() {
	}

	open() {
	}
}

class CommonMockService {
	getSessionStorageValue() {
	}
}

class UserMockService {
}

class DeviceMockService {
}

xdescribe('Dialog Service', () => {
	let service: DialogService;
	const routeSpy = jasmine.createSpyObj('Router', ['parseUrl']);
	beforeEach(() => {
		TestBed.resetTestEnvironment();
		TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
		TestBed.configureTestingModule({
			providers: [
				{
					provide: CommonService,
					useClass: CommonMockService
				},
				{
					provide: NgbModal,
					useClass: ModalMockService
				},
				{
					provide: Router,
					useValue: routeSpy
				},
				{
					provide: UserService,
					useClass: UserMockService
				},
				{
					provide: DeviceService,
					useClass: DeviceMockService
				},
				{
					provide: NetworkRequestService
				},
				DialogService
			]
		})
		service = TestBed.get(DialogService);
	});

	it('should be created', () => {
		const service: DialogService = TestBed.get(DialogService);
		expect(service).toBeTruthy();
	});

	it('errorMessageModal.close shoule be called when call homeSecurityOfflineDialog given subscribe to the network are available', () => {
		const dialogService: DialogService = TestBed.get(DialogService);
		const modalMockService: NgbModal = TestBed.get(NgbModal);
		const commonMockService: CommonService = TestBed.get(CommonService);
		const networkRequestService: NetworkRequestService = TestBed.get(NetworkRequestService);
		const errorMessageModal = {
			componentInstance: {
				header: undefined,
				description: undefined,
				closeButtonId: undefined,
				cancelButtonId: undefined
			},
			result: Promise.resolve(),
			close() {
			}
		};
		spyOn(modalMockService, 'hasOpenModals').and.returnValue(false);
		spyOn(commonMockService, 'getSessionStorageValue').and.returnValue('HomeProtectionInCHSPage value');
		spyOn<any>(modalMockService, 'open').and.returnValue(errorMessageModal);
		spyOn(networkRequestService, 'networkStatus').and.returnValue(of([true]));
		spyOn(errorMessageModal, 'close');
		dialogService.homeSecurityOfflineDialog();
		expect(modalMockService.hasOpenModals).toHaveBeenCalled();
		expect(modalMockService.open).toHaveBeenCalled();
		expect(networkRequestService.networkStatus).toHaveBeenCalled();
		expect(errorMessageModal.close).toHaveBeenCalled();
	});

	it('errorMessageModal.close shoule not be called when call homeSecurityOfflineDialog given subscribe to the network are unavailable', () => {
		const dialogService: DialogService = TestBed.get(DialogService);
		const modalMockService: NgbModal = TestBed.get(NgbModal);
		const commonMockService: CommonService = TestBed.get(CommonService);
		const networkRequestService: NetworkRequestService = TestBed.get(NetworkRequestService);
		const errorMessageModal = {
			componentInstance: {
				header: undefined,
				description: undefined,
				closeButtonId: undefined,
				cancelButtonId: undefined
			},
			result: Promise.resolve(),
			close() {
			}
		};
		spyOn(modalMockService, 'hasOpenModals').and.returnValue(false);
		spyOn(commonMockService, 'getSessionStorageValue').and.returnValue('HomeProtectionInCHSPage value');
		spyOn<any>(modalMockService, 'open').and.returnValue(errorMessageModal);
		spyOn(networkRequestService, 'networkStatus').and.returnValue(of([false]));
		spyOn(errorMessageModal, 'close');
		dialogService.homeSecurityOfflineDialog();
		expect(modalMockService.hasOpenModals).toHaveBeenCalled();
		expect(modalMockService.open).toHaveBeenCalled();
		expect(networkRequestService.networkStatus).toHaveBeenCalled();
		expect(errorMessageModal.close).not.toHaveBeenCalled();
	});
});
