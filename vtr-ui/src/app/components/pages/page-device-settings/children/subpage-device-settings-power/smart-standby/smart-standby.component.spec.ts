// import { async, TestBed } from "@angular/core/testing";
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { NO_ERRORS_SCHEMA } from "@angular/core";
// import { HttpClientTestingModule } from "@angular/common/http/testing";

// import { TranslateModule } from "@ngx-translate/core";
// import { SmartStandbyComponent } from './smart-standby.component'
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ModalSmartStandByComponent } from 'src/app/components/modal/modal-smart-stand-by/modal-smart-stand-by.component';
// import { SmartStandbyService } from 'src/app/services/smart-standby/smart-standby.service';
// import { LoggerService } from 'src/app/services/logger/logger.service';
// import { PowerService } from 'src/app/services/power/power.service';
// import { SmartStandby } from 'src/app/data-models/device/smart-standby.model';
// import { CommonService } from 'src/app/services/common/common.service';
// import { AppNotification } from 'src/app/data-models/common/app-notification.model';

// describe("Component: SmartStandby", () => {
// 	beforeEach(() => {
// 		TestBed.configureTestingModule({
// 			schemas: [NO_ERRORS_SCHEMA],
// 			declarations: [SmartStandbyComponent, ModalSmartStandByComponent],
// 			imports: [TranslateModule.forRoot(), HttpClientTestingModule],
// 			providers: [SmartStandbyService, LoggerService, PowerService, CommonService]
// 		}).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ModalSmartStandByComponent] } });
// 	});

// 	it('should create SmartStandby component', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		expect(smartStandbyComponent).toBeTruthy();
// 	});

// 	it('should call ngOnit method', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		fixture.detectChanges()
// 		expect(smartStandbyComponent.firstTimeLoad).toEqual(true)
// 	});

// 	it('should call showSmartStandby method - else case 1', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		powerService.isShellAvailable = false
// 		smartStandbyComponent.showSmartStandby()
// 		expect(smartStandbyComponent.smartStandby.isCapable).toEqual(false)
// 	});

// 	it('should call showSmartStandby method - else case 2', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		powerService.isShellAvailable = true
// 		smartStandbyComponent.firstTimeLoad = false;
// 		let spy = spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(Promise.resolve(false))
// 		smartStandbyComponent.showSmartStandby()
// 		expect(spy).toHaveBeenCalled()
// 	});

// 	it('should call showSmartStandby method - else case 3', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		powerService.isShellAvailable = true
// 		let spy = spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(Promise.resolve(false))		
// 		smartStandbyComponent.firstTimeLoad = true;
// 		smartStandbyComponent.smartStandby.isCapable = false
// 		smartStandbyComponent.showSmartStandby()
// 		expect(spy).toHaveBeenCalled()
// 	});

// 	it('should call showSmartStandby method - catch block', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		powerService.isShellAvailable = true
// 		smartStandbyComponent.firstTimeLoad = false;
// 		let spy = spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(Promise.reject(false))
// 		smartStandbyComponent.showSmartStandby()
// 		expect(spy).toHaveBeenCalled()
// 	});

// 	// it('should call getSmartStandbyCapability', async(() => {
// 	// 	let fixture = TestBed.createComponent(SmartStandbyComponent);
// 	// 	let smartStandbyComponent = fixture.debugElement.componentInstance;
// 	// 	let spy = spyOn(smartStandbyComponent, 'showSmartStandby')
// 	// 	smartStandbyComponent.getSmartStandbyCapability()
// 	// 	fixture.detectChanges()
// 	// 	fixture.whenStable().then(() => {
// 	// 		expect(spy).toHaveBeenCalled()
// 	// 	})
// 	// }));

// 	it('should call setSmartStandbySection - else case - 1', async(() => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		powerService.isShellAvailable = false
// 		let spy = spyOn(powerService, 'getSmartStandbyEnabled')
// 		smartStandbyComponent.setSmartStandbySection()
// 		expect(spy).not.toHaveBeenCalled()
// 	}));

// 	it('should call setSmartStandbySection - else case - 2', async(() => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		powerService.isShellAvailable = true
// 		spyOn(powerService, 'getSmartStandbyEnabled').and.returnValue(Promise.resolve(false))
// 		let spy = spyOn(smartStandbyComponent, 'splitStartEndTime')
// 		smartStandbyComponent.cache = new SmartStandby()
// 		smartStandbyComponent.smartStandby.isEnabled = false
// 		smartStandbyComponent.setSmartStandbySection()
// 		expect(spy).not.toHaveBeenCalled()
// 	}));
	
	
// 	it('should call initDataFromCache - outer if', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		smartStandbyComponent.cache = new SmartStandby()
// 		smartStandbyComponent.initDataFromCache()
// 		expect(smartStandbyComponent.smartStandby.isCapable).toEqual(smartStandbyComponent.cache.isCapable)
// 	});

// 	it('should call initDataFromCache - inner else', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		smartStandbyComponent.smartStandby.isCapable = false
// 		smartStandbyComponent.cache = new SmartStandby()
// 		smartStandbyComponent.initDataFromCache()
// 		expect(smartStandbyComponent.smartStandby.isEnabled).toEqual(smartStandbyComponent.cache.isEnabled)
// 	});
	
// 	it('should call initDataFromCache - inner if', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		smartStandbyComponent.smartStandby.isCapable = true
// 		smartStandbyComponent.cache = new SmartStandby()
// 		let spy = spyOn(smartStandbyComponent.smartStandbyCapability, 'emit')
// 		smartStandbyComponent.initDataFromCache()
// 		expect(spy).toHaveBeenCalled()
// 	});
	

// 	it('should call onSmartStandbyToggle', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let event = {switchValue: true}
// 		smartStandbyComponent.onSmartStandbyToggle(event)
// 		expect(smartStandbyComponent.showDropDown).toEqual([false, false, false])
// 	});

// 	it('should call onSmartStandbyToggle - inner if', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		let event = {switchValue: true}
// 		let spy = spyOn(powerService, 'setSmartStandbyEnabled').and.returnValue(Promise.resolve(0))
// 		smartStandbyComponent.onSmartStandbyToggle(event)
// 		expect(spy).toHaveBeenCalled()
// 	});

// 	it('should call onSmartStandbyToggle isAutonomicCapability is true', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let event = {switchValue: true}
// 		smartStandbyComponent.isAutonomicCapability = true
// 		smartStandbyComponent.onSmartStandbyToggle(event)
// 	});

// 	it('should call onSetActiveStartEnd', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		spyOn(powerService, 'setSmartStandbyActiveStartEnd').and.returnValue(Promise.resolve(0))
// 		let isStart = true
// 		let event = new Event('click')
// 		let spy = spyOn(smartStandbyComponent, 'splitStartEndTime')
// 		smartStandbyComponent.onSetActiveStartEnd(event, isStart)
// 		expect(spy).toHaveBeenCalled()
// 	});

// 	it('should call onSetActiveStartEnd - isStart is false', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		spyOn(powerService, 'setSmartStandbyActiveStartEnd').and.returnValue(Promise.resolve(0))
// 		let isStart = false
// 		let event = new Event('click')
// 		let spy = spyOn(smartStandbyComponent, 'splitStartEndTime')
// 		smartStandbyComponent.onSetActiveStartEnd(event, isStart)
// 		expect(spy).toHaveBeenCalled()
// 	});

// 	it('should call onSetDaysOfWeekOff', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		let event = new Event('click')
// 		powerService.isShellAvailable = true
// 		smartStandbyComponent.cache = new SmartStandby()
// 		let spy = spyOn(powerService, 'setSmartStandbyDaysOfWeekOff').and.returnValue(Promise.resolve(0))
// 		smartStandbyComponent.onSetDaysOfWeekOff(event)
// 		expect(spy).toHaveBeenCalled()
// 	});

// 	it('should call onSetDaysOfWeekOff - outer else case', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		let smartStandbyService = fixture.debugElement.injector.get(SmartStandbyService)
// 		let event = new Event('click')
// 		powerService.isShellAvailable = false
// 		smartStandbyComponent.cache = new SmartStandby()
// 		// let spy = spyOn(powerService, 'setSmartStandbyDaysOfWeekOff').and.returnValue(Promise.resolve(1))
// 		smartStandbyComponent.onSetDaysOfWeekOff(event)
// 		expect(smartStandbyService.days).toEqual(smartStandbyComponent.smartStandby.daysOfWeekOff)
// 	});

// 	it('should call onSetDaysOfWeekOff - inner else case', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		let event = new Event('click')
// 		powerService.isShellAvailable = true
// 		smartStandbyComponent.cache = new SmartStandby()
// 		let spy = spyOn(powerService, 'setSmartStandbyDaysOfWeekOff').and.returnValue(Promise.resolve(1))
// 		smartStandbyComponent.onSetDaysOfWeekOff(event)
// 		expect(spy).toHaveBeenCalled()
// 	});

// 	it('should call onSmartStandbyNotification', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let notitfiaction: AppNotification = {
// 			type: 'smartStandbyToggles',
// 			payload: [{id: 1, value: ''}]
// 		}
// 		smartStandbyComponent.showDropDown = []
// 		smartStandbyComponent.onSmartStandbyNotification(notitfiaction)
// 		expect(smartStandbyComponent.showDropDown).not.toEqual([])
// 	});

// 	it('should call getIsAutonomicCapability - inner if ', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		powerService.isShellAvailable = true
// 		let spy = spyOn(powerService, 'getIsAutonomicCapability').and.returnValue(Promise.resolve(false))
// 		smartStandbyComponent.isAutonomicCapability = false
// 		smartStandbyComponent.getIsAutonomicCapability()
// 		expect(spy).toHaveBeenCalled()
// 	})

// 	// it('should call getIsAutonomicCapability - outer if ', () => {
// 	// 	let fixture = TestBed.createComponent(SmartStandbyComponent);
// 	// 	let smartStandbyComponent = fixture.debugElement.componentInstance;
// 	// 	let powerService = fixture.debugElement.injector.get(PowerService)
// 	// 	powerService.isShellAvailable = false
// 	// 	// let spy = spyOn(powerService, 'getIsAutonomicCapability').and.returnValue(Promise.resolve(false))
// 	// 	// smartStandbyComponent.isAutonomicCapability = false
// 	// 	smartStandbyComponent.getIsAutonomicCapability()
// 	// 	// expect(spy).toHaveBeenCalled()
// 	// })

// 	it('should call getIsAutonomicCapability - catch block', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		powerService.isShellAvailable = true
// 		let spy = spyOn(powerService, 'getIsAutonomicCapability').and.returnValue(Promise.reject(false))
// 		smartStandbyComponent.isAutonomicCapability = false
// 		smartStandbyComponent.getIsAutonomicCapability()
// 		expect(spy).toHaveBeenCalled()
// 	})
	
// 	it('should call getSmartStandbyIsAutonomic when reject', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		powerService.isShellAvailable = true
// 		let spy = spyOn(powerService, 'getSmartStandbyIsAutonomic').and.returnValue(Promise.reject())
// 		smartStandbyComponent.getSmartStandbyIsAutonomic()
// 		expect(spy).toHaveBeenCalled()
// 	});
	
// 	it('should call getSmartStandbyIsAutonomic - else', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let powerService = fixture.debugElement.injector.get(PowerService)
// 		powerService.isShellAvailable = false
// 		let spy = spyOn(powerService, 'getSmartStandbyIsAutonomic')
// 		smartStandbyComponent.getSmartStandbyIsAutonomic()
// 		expect(spy).not.toHaveBeenCalled()
// 	});

// 	it('should call onCheckboxClicked', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let event = new Event('click');
// 		smartStandbyComponent.onCheckboxClicked(event)
// 		expect(smartStandbyComponent.checkbox).toEqual(event)
// 	});

// 	it('should toggle html element', () => {
// 		let fixture = TestBed.createComponent(SmartStandbyComponent);
// 		let smartStandbyComponent = fixture.debugElement.componentInstance;
// 		let element: HTMLElement = document.createElement('input')
// 		smartStandbyComponent.onToggle(element)
// 		expect(smartStandbyComponent.isCollapsed).toEqual(smartStandbyComponent.isCollapsed)
// 	});

// 	// it('should call showUsageGraph', () => {
// 	// 	let fixture = TestBed.createComponent(SmartStandbyComponent);
// 	// 	let smartStandbyComponent = fixture.debugElement.componentInstance;
// 	// 	smartStandbyComponent.smartStandby.isEnabled = true;
// 	// 	smartStandbyComponent.showUsageGraph()
// 	// });
// });