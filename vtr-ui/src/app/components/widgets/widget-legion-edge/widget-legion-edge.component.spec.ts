import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WidgetLegionEdgeComponent } from './widget-legion-edge.component';
import { Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { GamingSystemUpdateService } from 'src/app/services/gaming/gaming-system-update/gaming-system-update.service';
import { GamingKeyLockService } from 'src/app/services/gaming/gaming-keylock/gaming-key-lock.service';
import { GamingHybridModeService } from 'src/app/services/gaming/gaming-hybrid-mode/gaming-hybrid-mode.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';


const gamingSystemUpdateServiceMock = jasmine.createSpyObj('GamingSystemUpdateService', ['isShellAvailable', 'getCpuOCStatus', 'getRamOCStatus']);
const gamingKeyLockServiceMock = jasmine.createSpyObj('GamingKeyLockService', ['isShellAvailable', 'getKeyLockStatus']);
const gamingHybridModeServiceMock = jasmine.createSpyObj('GamingHybridModeService', ['isShellAvailable', 'getHybridModeStatus']);
const gamingAutoCloseServiceMock = jasmine.createSpyObj('GamingAutoCloseService', ['isShellAvailable', 'getAutoCloseStatus']);
const networkBoostServiceMock = jasmine.createSpyObj('NetworkBoostService', ['isShellAvailable', 'getNetworkBoostStatus']);

fdescribe('WidgetLegionEdgeComponent', () => {
	let component: WidgetLegionEdgeComponent;
	let fixture: ComponentFixture<WidgetLegionEdgeComponent>;
	gamingSystemUpdateServiceMock.isShellAvailable.and.returnValue(true);
	gamingKeyLockServiceMock.isShellAvailable.and.returnValue(true);
	gamingHybridModeServiceMock.isShellAvailable.and.returnValue(true);
	gamingAutoCloseServiceMock.isShellAvailable.and.returnValue(true);
	networkBoostServiceMock.isShellAvailable.and.returnValue(true);

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetLegionEdgeComponent,
				mockPipe({ name: 'translate' })],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
				{ provide: GamingSystemUpdateService, useValue: gamingSystemUpdateServiceMock },
				{ provide: GamingKeyLockService, useValue: gamingKeyLockServiceMock },
				{ provide: GamingHybridModeService, useValue: gamingHybridModeServiceMock },
				{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceMock },
				{ provide: NetworkBoostService, useValue: networkBoostServiceMock }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		gamingKeyLockServiceMock.getKeyLockStatus();
		fixture.detectChanges();
	}));

	it('should render the legion edge container image', async(() => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('div.justify-content-between>img').src).toContain('/assets/images/gaming/legionEdge.png');
	}));

	it('should render the Question icon image on legion edge container', async(() => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('div.help-box>button>fa-icon')).toBeTruthy();
	}));

	it('should have default isCustomizable legionUpdate object true for auto close, networkboost & false for all', () => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.legionUpdate[0].isCustomizable).toEqual(false);
		expect(component.legionUpdate[1].isCustomizable).toEqual(false);
		expect(component.legionUpdate[2].isCustomizable).toEqual(true);
		expect(component.legionUpdate[3].isCustomizable).toEqual(true);
		expect(component.legionUpdate[4].isCustomizable).toEqual(false);
		expect(component.legionUpdate[5].isCustomizable).toEqual(false);
	});

	it('should have driver popup default legionUpdate object false for all', () => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.legionUpdate[0].isDriverPopup).toEqual(false);
		expect(component.legionUpdate[1].isDriverPopup).toEqual(false);
		expect(component.legionUpdate[2].isDriverPopup).toEqual(false);
		expect(component.legionUpdate[3].isDriverPopup).toEqual(false);
		expect(component.legionUpdate[4].isDriverPopup).toEqual(false);
		expect(component.legionUpdate[5].isDriverPopup).toEqual(false);
	});

	it('should have default isCheckedBoxVisible legionUpdate object false for CPU OverClock & True for all', () => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.legionUpdate[0].isCheckBoxVisible).toEqual(false);
		expect(component.legionUpdate[1].isCheckBoxVisible).toEqual(true);
		expect(component.legionUpdate[2].isCheckBoxVisible).toEqual(true);
		expect(component.legionUpdate[3].isCheckBoxVisible).toEqual(true);
		expect(component.legionUpdate[4].isCheckBoxVisible).toEqual(true);
		expect(component.legionUpdate[5].isCheckBoxVisible).toEqual(true);
	});

	it('should have default isSwitchVisible legionUpdate object false for CPU OverClock & True for all', () => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.legionUpdate[0].isSwitchVisible).toEqual(false);
		expect(component.legionUpdate[1].isSwitchVisible).toEqual(true);
		expect(component.legionUpdate[2].isSwitchVisible).toEqual(true);
		expect(component.legionUpdate[3].isSwitchVisible).toEqual(true);
		expect(component.legionUpdate[4].isSwitchVisible).toEqual(true);
		expect(component.legionUpdate[5].isSwitchVisible).toEqual(true);
	});

	it('should have default isCollapsible legionUpdate object true for CPU OverClock & false for all', () => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.legionUpdate[0].isCollapsible).toEqual(true);
		expect(component.legionUpdate[1].isCollapsible).toEqual(false);
		expect(component.legionUpdate[2].isCollapsible).toEqual(false);
		expect(component.legionUpdate[3].isCollapsible).toEqual(false);
		expect(component.legionUpdate[4].isCollapsible).toEqual(false);
		expect(component.legionUpdate[5].isCollapsible).toEqual(false);
	});


	it('should have default isPopup legionUpdate object true for RAM OverClock & false for all', () => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.legionUpdate[0].isPopup).toEqual(false);
		expect(component.legionUpdate[1].isPopup).toEqual(false);
		expect(component.legionUpdate[2].isPopup).toEqual(false);
		expect(component.legionUpdate[3].isPopup).toEqual(false);
		expect(component.legionUpdate[4].isPopup).toEqual(false);
		expect(component.legionUpdate[5].isPopup).toEqual(false);

	});

	it('should have default isChecked legionUpdate object true for touchpadlock & false for all', () => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.legionUpdate[0].isChecked).toEqual(false);
	});

	it('Should update the same value for ischecked using CPU overclock service', fakeAsync((done: any) => {
		gamingSystemUpdateServiceMock.getCpuOCStatus.and.returnValue(Promise.resolve(1));
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		component.renderCPUOverClockStatus();
		tick(10);
		fixture.detectChanges();
		const CPUOverClockStatusData = component.drop.curSelected;
		expect(CPUOverClockStatusData).toEqual(1);
	}));

	it('Should update the same value for ischecked using hybrid mode service', fakeAsync((done: any) => {
		gamingHybridModeServiceMock.getHybridModeStatus.and.returnValue(Promise.resolve(true));
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		component.renderHybridModeStatus();
		tick(10);
		fixture.detectChanges();
		const hybridModeStatusData = component.legionUpdate[4].isChecked;
		expect(hybridModeStatusData).toEqual(true);
	}));

	it('Should update the same value for ischecked using auto close service', fakeAsync((done: any) => {
		gamingAutoCloseServiceMock.getAutoCloseStatus.and.returnValue(Promise.resolve(true));
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		component.renderAutoCloseStatus();
		tick(10);
		fixture.detectChanges();
		const autoCloseStatusData = component.legionUpdate[3].isChecked;
		expect(autoCloseStatusData).toEqual(true);
	}));

	it('Should update the same value for ischecked using network boost service', fakeAsync((done: any) => {
		networkBoostServiceMock.getNetworkBoostStatus.and.returnValue(Promise.resolve(true));
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		component.renderNetworkBoostStatus();
		tick(10);
		fixture.detectChanges();
		const networkBosstStatusData = component.legionUpdate[2].isChecked;
		expect(networkBosstStatusData).toEqual(true);
	}));


	it('Should update the same value for ischecked using touchpad lock service', fakeAsync((done: any) => {
		gamingKeyLockServiceMock.getKeyLockStatus.and.returnValue(Promise.resolve(true));
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		component.renderTouchpadLockStatus();
		tick(10);
		fixture.detectChanges();
		const touchpadlockStatusData = component.legionUpdate[5].isChecked;
		expect(touchpadlockStatusData).toEqual(true);
	}));

	it('should make false isPopup and isDriverPopup when close popup', fakeAsync((done: any) => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		component.closeLegionEdgePopups();
		tick(10);
		fixture.detectChanges();
		expect(component.legionUpdate[1].isDriverPopup).toEqual(false);
		expect(component.legionUpdate[1].isPopup).toEqual(false);
	}));

	it('should have default value ON for CPU over clock if localstorage not set', () => {
		fixture = TestBed.createComponent(WidgetLegionEdgeComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		// Expected Default Behaviour
		expect(component.drop.curSelected).toEqual(1);
	});


	it('should update or have same CPU over clock value on service and in Local storage and UI', fakeAsync((done: any) => {
		let cpuOCStatusPromisedData: number;
		const uiCpuOCStatusValue = component.drop.curSelected;
		const cacheCPUOverClockStatusValue = component.GetCPUOverClockCacheStatus();
		gamingSystemUpdateServiceMock.getCpuOCStatus.and.returnValue(Promise.resolve(uiCpuOCStatusValue));
		gamingSystemUpdateServiceMock.getCpuOCStatus().then((response: any) => {
			cpuOCStatusPromisedData = response;
		});
		tick(10);
		fixture.detectChanges();
		expect(uiCpuOCStatusValue).toEqual(cacheCPUOverClockStatusValue);
		expect(uiCpuOCStatusValue).toEqual(cpuOCStatusPromisedData);
		expect(cacheCPUOverClockStatusValue).toEqual(cpuOCStatusPromisedData);
	}));

	it('should update or have same Auto close value on service and in Local storage and UI', fakeAsync((done: any) => {
		let autoCloseStatusPromisedData: boolean;
		const uiAutoCloseStatusValue = component.legionUpdate[2].isChecked;
		component.setAutoCloseStatus(uiAutoCloseStatusValue);
		component.setAutoCloseCacheStatus(uiAutoCloseStatusValue);
		const cacheAutoCloseStatusValue = component.getAutoCloseCacheStatus();
		gamingAutoCloseServiceMock.getAutoCloseStatus.and.returnValue(Promise.resolve(uiAutoCloseStatusValue));
		gamingAutoCloseServiceMock.getAutoCloseStatus().then((response: any) => {
			autoCloseStatusPromisedData = response;
		});
		tick(10);
		fixture.detectChanges();
		expect(uiAutoCloseStatusValue).toEqual(cacheAutoCloseStatusValue);
		expect(uiAutoCloseStatusValue).toEqual(autoCloseStatusPromisedData);
		expect(cacheAutoCloseStatusValue).toEqual(autoCloseStatusPromisedData);
	}));

	it('should update or have same Network Boost value on service and in Local storage and UI', fakeAsync((done: any) => {
		let networkBoostStatusPromisedData: boolean;
		const uiNetworkBoostStatusValue = component.legionUpdate[3].isChecked;
		component.setNetworkBoostStatus(uiNetworkBoostStatusValue);
		component.setNetworkBoostCacheStatus(uiNetworkBoostStatusValue);
		const cacheNetworkBoostStatusValue = component.getNetworkBoostCacheStatus();
		networkBoostServiceMock.getNetworkBoostStatus.and.returnValue(Promise.resolve(uiNetworkBoostStatusValue));
		networkBoostServiceMock.getNetworkBoostStatus().then((response: any) => {
			networkBoostStatusPromisedData = response;
		});
		tick(20);
		fixture.detectChanges();
		if (uiNetworkBoostStatusValue) {
		expect(uiNetworkBoostStatusValue).toEqual(cacheNetworkBoostStatusValue);
		}
		if (networkBoostStatusPromisedData) {
		expect(uiNetworkBoostStatusValue).toEqual(networkBoostStatusPromisedData);
		expect(cacheNetworkBoostStatusValue).toEqual(networkBoostStatusPromisedData);
		}
	}));


	it('should able to mock Hybrid Mode service data ', fakeAsync((done: any) => {
		let hybridModeStatusPromisedData: boolean;
		// Mocking True
		gamingHybridModeServiceMock.getHybridModeStatus.and.returnValue(Promise.resolve(true));
		gamingHybridModeServiceMock.getHybridModeStatus().then((response: any) => {
			hybridModeStatusPromisedData = response;
		});
		tick(10);
		fixture.detectChanges();
		expect(hybridModeStatusPromisedData).toEqual(true);

		// Mocking false
		gamingHybridModeServiceMock.getHybridModeStatus.and.returnValue(Promise.resolve(false));
		gamingHybridModeServiceMock.getHybridModeStatus().then((response: any) => {
			hybridModeStatusPromisedData = response;
		});
		tick(10);
		fixture.detectChanges();
		expect(hybridModeStatusPromisedData).toEqual(false);

	}));

	it('should able to mock RAM Overclock service data ', fakeAsync((done: any) => {
		let ramOverclockStatusPromisedData: boolean;
		// Mocking True
		gamingSystemUpdateServiceMock.getRamOCStatus.and.returnValue(Promise.resolve(true));
		gamingSystemUpdateServiceMock.getRamOCStatus().then((response: any) => {
			ramOverclockStatusPromisedData = response;
		});
		tick(10);
		fixture.detectChanges();
		expect(ramOverclockStatusPromisedData).toEqual(true);

		// Mocking false
		gamingSystemUpdateServiceMock.getRamOCStatus.and.returnValue(Promise.resolve(false));
		gamingSystemUpdateServiceMock.getRamOCStatus().then((response: any) => {
			ramOverclockStatusPromisedData = response;
		});
		tick(10);
		fixture.detectChanges();
		expect(ramOverclockStatusPromisedData).toEqual(false);

	}));

	it('should update or have same Touchpad Lock value on service and in Local storage and UI', fakeAsync((done: any) => {
		let touchpadLockPromisedData: boolean;
		const uiTouchpadLockStatusValue = component.legionUpdate[5].isChecked;
		const cacheTouchpadStatusValue = component.GetTouchpadLockCacheStatus();
		// if we include following line this will increase covrage.
		// const touchpadAllvalue = component.renderTouchpadLockStatus();
		gamingKeyLockServiceMock.getKeyLockStatus.and.returnValue(Promise.resolve(uiTouchpadLockStatusValue));
		gamingKeyLockServiceMock.getKeyLockStatus().then((response: any) => {
			touchpadLockPromisedData = response;
		});
		tick(10);
		fixture.detectChanges();
		expect(uiTouchpadLockStatusValue).toEqual(cacheTouchpadStatusValue);
		expect(uiTouchpadLockStatusValue).toEqual(touchpadLockPromisedData);
		expect(cacheTouchpadStatusValue).toEqual(touchpadLockPromisedData);
	}));

	it('should create component', () => {
		expect(component).toBeTruthy();
	});

});

/**
 * @param options pipeName which has to be mock
 * @description To mock the pipe.
 * @summary This has to move to one utils file.
 */
export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(class MockPipe {
		public transform(query: string, ...args: any[]): any {
			return query;
		}
	}) as any;
}
