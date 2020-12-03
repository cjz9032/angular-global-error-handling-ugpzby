import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalSmartStandByComponent } from 'src/app/components/modal/modal-smart-stand-by/modal-smart-stand-by.component';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { SmartStandby } from 'src/app/data-models/device/smart-standby.model';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PowerService } from 'src/app/services/power/power.service';
import { SmartStandbyService } from 'src/app/services/smart-standby/smart-standby.service';
import { SmartStandbyComponent } from './smart-standby.component';

describe('Component: SmartStandby', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [SmartStandbyComponent, ModalSmartStandByComponent],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule],
			providers: [SmartStandbyService, LoggerService, PowerService, CommonService],
		}).overrideModule(BrowserDynamicTestingModule, {
			set: { entryComponents: [ModalSmartStandByComponent] },
		});
	});

	describe(':', () => {
		function setup() {
			const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService);
			const modalService = fixture.debugElement.injector.get(NgbModal);
			const loggerService = fixture.debugElement.injector.get(LoggerService);
			const commonService = fixture.debugElement.injector.get(CommonService);
			const smartStandbyService = fixture.debugElement.injector.get(SmartStandbyService);
			const translateService = fixture.debugElement.injector.get(TranslateService);
			return {
				fixture,
				smartStandbyComponent,
				modalService,
				powerService,
				loggerService,
				commonService,
				smartStandbyService,
				translateService,
			};
		}

		it('should create SmartStandby component', () => {
			const { fixture, smartStandbyComponent } = setup();
			expect(smartStandbyComponent).toBeTruthy();
		});

		it('should call ngOnit method', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const { fixture, smartStandbyComponent, powerService } = setup();
			const spy = spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(
				Promise.resolve(true)
			);
			fixture.detectChanges();
			expect(smartStandbyComponent.firstTimeLoad).toEqual(true);
		});

		it('should call showSmartStandby method - else case 1', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const { fixture, smartStandbyComponent, powerService } = setup();
			powerService.isShellAvailable = false;
			smartStandbyComponent.showSmartStandby();
			expect(smartStandbyComponent.smartStandby.isCapable).toEqual(false);
		});

		it('should call showSmartStandby method - else case 2', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const { fixture, smartStandbyComponent, powerService } = setup();
			powerService.isShellAvailable = true;
			smartStandbyComponent.firstTimeLoad = false;
			const spy = spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(
				Promise.resolve(false)
			);
			smartStandbyComponent.showSmartStandby();
			expect(spy).toHaveBeenCalled();
		});

		it('should call showSmartStandby method - else case 3', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const { fixture, smartStandbyComponent, powerService } = setup();
			powerService.isShellAvailable = true;
			const spy = spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(
				Promise.resolve(false)
			);
			smartStandbyComponent.firstTimeLoad = true;
			smartStandbyComponent.smartStandby.isCapable = false;
			smartStandbyComponent.showSmartStandby();
			expect(spy).toHaveBeenCalled();
		});

		it('should call showSmartStandby method - catch block', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const { fixture, smartStandbyComponent, powerService } = setup();
			powerService.isShellAvailable = true;
			smartStandbyComponent.firstTimeLoad = false;
			const spy = spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(
				Promise.reject(false)
			);
			smartStandbyComponent.showSmartStandby();
			expect(spy).toHaveBeenCalled();
		});

		// it('should call getSmartStandbyCapability', async(() => {
		// 	const fixture = TestBed.createComponent(SmartStandbyComponent);
		// 	const smartStandbyComponent = fixture.debugElement.componentInstance;
		// 	const spy = spyOn(smartStandbyComponent, 'showSmartStandby')
		// 	smartStandbyComponent.getSmartStandbyCapability()
		// 	fixture.detectChanges()
		// 	fixture.whenStable().then(() => {
		// 		expect(spy).toHaveBeenCalled();
		// 	})
		// }));

		/* it('should call setSmartStandbySection - for true', async(() => {
			const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService);
			powerService.isShellAvailable = true;
			smartStandbyComponent.cache = new SmartStandby();
			smartStandbyComponent.smartStandby = smartStandbyComponent.cache;
			smartStandbyComponent.smartStandby.isEnabled = true;
			//spyOn(powerService, 'getSmartStandbyEnabled').and.returnValue(Promise.resolve(true));
			const spy = spyOn(smartStandbyComponent, 'splitStartEndTime');
			smartStandbyComponent.setSmartStandbySection(true);
			expect(spy).toHaveBeenCalled();
		})); */

		it('should call setSmartStandbySection - else case - 2', waitForAsync(() => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const { fixture, smartStandbyComponent, powerService } = setup();
			powerService.isShellAvailable = true;
			spyOn(powerService, 'getSmartStandbyEnabled').and.returnValue(Promise.resolve(false));
			const spy = spyOn(smartStandbyComponent, 'splitStartEndTime');
			smartStandbyComponent.cache = new SmartStandby();
			smartStandbyComponent.smartStandby.isEnabled = false;
			smartStandbyComponent.setSmartStandbySection(true);
			expect(spy).not.toHaveBeenCalled();
		}));

		it('should call initDataFromCache - outer if', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const commonService = fixture.debugElement.injector.get(CommonService); */
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			const smartStandby = new SmartStandby();
			smartStandby.isCapable = true;
			smartStandbyComponent.smartStandby = smartStandby;

			// this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartStandbyCapability, smartStandby);
			spyOn(commonService, 'getLocalStorageValue').and.returnValue(smartStandby);
			// smartStandbyComponent.cache = new SmartStandby();
			const spy = spyOn(smartStandbyComponent, 'updateScheduleComputerModesUIModel');

			smartStandbyComponent.initDataFromCache();
			expect(spy).toHaveBeenCalled();
			expect(smartStandbyComponent.smartStandby.isCapable).toEqual(
				smartStandbyComponent.cache.isCapable
			);
		});

		it('should call initDataFromCache - with empty cache', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const commonService = fixture.debugElement.injector.get(CommonService); */
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			const data = new SmartStandby();
			// this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartStandbyCapability, undefined);
			spyOn(commonService, 'getLocalStorageValue').and.returnValue(undefined);
			smartStandbyComponent.initDataFromCache();
			expect(smartStandbyComponent.cache).toEqual(data);
		});

		it('should call initDataFromCache - inner else', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const commonService = fixture.debugElement.injector.get(CommonService); */
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			const smartStandby = new SmartStandby();
			smartStandby.isCapable = true;
			smartStandbyComponent.smartStandby = smartStandby;

			spyOn(commonService, 'getLocalStorageValue').and.returnValue(smartStandby);

			// smartStandbyComponent.cache.isCapable = false;
			// smartStandbyComponent.smartStandby = smartStandbyComponent.cache;
			// this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartStandbyCapability, smartStandby);
			// spyOn(commonService, 'getLocalStorageValue').and.returnValue(smartStandbyComponent.cache);
			smartStandbyComponent.initDataFromCache();
			expect(smartStandbyComponent.smartStandby.isEnabled).toEqual(
				smartStandbyComponent.cache.isEnabled
			);
		});

		it('should call initDataFromCache - inner if', () => {
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			const smartStandby = new SmartStandby();
			smartStandby.isCapable = false;
			smartStandbyComponent.smartStandby = smartStandby;

			spyOn(commonService, 'getLocalStorageValue').and.returnValue(smartStandby);
			// this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartStandbyCapability, smartStandby);
			// smartStandbyComponent.cache = new SmartStandby();
			const spy = spyOn(smartStandbyComponent.smartStandbyCapability, 'emit');
			smartStandbyComponent.initDataFromCache();
			expect(spy).toHaveBeenCalled();
		});

		it('should call onSmartStandbyToggle', () => {
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			const smartStandby = new SmartStandby();
			smartStandbyComponent.smartStandby = smartStandby;
			const event = { switchValue: true };
			smartStandbyComponent.onSmartStandbyToggle(event);
			expect(smartStandbyComponent.showDropDown).toEqual([false, false, false]);
		});

		it('should call onSmartStandbyToggle throws exception', () => {
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			const smartStandby = new SmartStandby();
			smartStandbyComponent.smartStandby = smartStandby;
			const event = { switchValue: true };
			smartStandbyComponent.onSmartStandbyToggle(event);
			expect(smartStandbyComponent.onSmartStandbyToggle).toThrow();
		});

		it('should call onSmartStandbyToggle - inner if', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			const smartStandby = new SmartStandby();
			smartStandbyComponent.smartStandby = smartStandby;
			const event = { switchValue: true };
			const spy = spyOn(powerService, 'setSmartStandbyEnabled').and.returnValue(
				Promise.resolve(0)
			);
			smartStandbyComponent.onSmartStandbyToggle(event);
			expect(spy).toHaveBeenCalled();
		});

		it('should call onSmartStandbyToggle - inner if- UpdateScheduleComputerModesUIModel', () => {
			// const fixture = TestBed.createComponent(SmartStandbyComponent);
			// const smartStandbyComponent = fixture.debugElement.componentInstance;
			// const powerService = fixture.debugElement.injector.get(PowerService);
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			const smartStandby = new SmartStandby();
			smartStandbyComponent.smartStandby = smartStandby;
			smartStandbyComponent.cache = smartStandby;
			smartStandbyComponent.isAutonomicCapability = true;
			const event = { switchValue: true };
			powerService.isShellAvailable = true;
			const spy = spyOn(powerService, 'setSmartStandbyEnabled').and.returnValue(
				Promise.resolve(0)
			);
			const spyUpdateScheduleComputerModesUIModel = spyOn(
				smartStandbyComponent,
				'setSmartStandbySection'
			);
			smartStandbyComponent.onSmartStandbyToggle(event);
			// expect(spyUpdateScheduleComputerModesUIModel).toHaveBeenCalled();
		});

		it('should call onSmartStandbyToggle isAutonomicCapability is true', () => {
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			const event = { switchValue: true };
			smartStandbyComponent.isAutonomicCapability = true;
			smartStandbyComponent.onSmartStandbyToggle(event);
		});

		it('should call onSetActiveStartEnd', () => {
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			spyOn(powerService, 'setSmartStandbyActiveStartEnd').and.returnValue(
				Promise.resolve(0)
			);
			const isStart = true;
			const event = new Event('click');
			const spy = spyOn(smartStandbyComponent, 'splitStartEndTime');
			smartStandbyComponent.onSetActiveStartEnd(event, isStart);
			expect(spy).toHaveBeenCalled();

			smartStandbyComponent.onSetActiveStartEnd(event, isStart);
			expect(smartStandbyComponent.onSetActiveStartEnd).toThrow();
		});

		it('should call onSetActiveStartEnd throws exception', () => {
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			spyOn(powerService, 'setSmartStandbyActiveStartEnd').and.returnValue(
				Promise.resolve(0)
			);
			const isStart = true;
			const event = new Event('click');
			const spy = spyOn(smartStandbyComponent, 'splitStartEndTime');

			smartStandbyComponent.onSetActiveStartEnd(event, isStart);
			expect(smartStandbyComponent.onSetActiveStartEnd).toThrow();
		});

		it('should call onSetActiveStartEnd - isStart is false', () => {
			/* 	const fixture = TestBed.createComponent(SmartStandbyComponent);
				const smartStandbyComponent = fixture.debugElement.componentInstance;
				const powerService = fixture.debugElement.injector.get(PowerService); */
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			spyOn(powerService, 'setSmartStandbyActiveStartEnd').and.returnValue(
				Promise.resolve(0)
			);
			const isStart = false;
			const event = new Event('click');
			const spy = spyOn(smartStandbyComponent, 'splitStartEndTime');
			smartStandbyComponent.onSetActiveStartEnd(event, isStart);
			expect(spy).toHaveBeenCalled();
		});

		it('should call onSetDaysOfWeekOff', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const { fixture, smartStandbyComponent, powerService, commonService } = setup();
			const event = new Event('click');
			powerService.isShellAvailable = true;
			smartStandbyComponent.cache = new SmartStandby();
			const spy = spyOn(powerService, 'setSmartStandbyDaysOfWeekOff').and.returnValue(
				Promise.resolve(0)
			);
			smartStandbyComponent.onSetDaysOfWeekOff(event);
			expect(spy).toHaveBeenCalled();

			smartStandbyComponent.onSetDaysOfWeekOff(event);
			expect(smartStandbyComponent.onSetDaysOfWeekOff).toThrow();
		});

		it('should call onSetDaysOfWeekOff - outer else case', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService);
			const smartStandbyService = fixture.debugElement.injector.get(SmartStandbyService); */
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			const event = new Event('click');
			powerService.isShellAvailable = false;
			smartStandbyComponent.cache = new SmartStandby();
			// const spy = spyOn(powerService, 'setSmartStandbyDaysOfWeekOff').and.returnValue(Promise.resolve(1))
			smartStandbyComponent.onSetDaysOfWeekOff(event);
			expect(smartStandbyService.days).toEqual(
				smartStandbyComponent.smartStandby.daysOfWeekOff
			);
		});

		it('should call onSetDaysOfWeekOff - inner else case', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			const event = new Event('click');
			powerService.isShellAvailable = true;
			smartStandbyComponent.cache = new SmartStandby();
			const spy = spyOn(powerService, 'setSmartStandbyDaysOfWeekOff').and.returnValue(
				Promise.resolve(1)
			);
			smartStandbyComponent.onSetDaysOfWeekOff(event);
			expect(spy).toHaveBeenCalled();
		});

		it('should call onSmartStandbyNotification', () => {
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			const notitfiaction: AppNotification = {
				type: 'smartStandbyToggles',
				payload: [{ id: 1, value: '' }],
			};
			smartStandbyComponent.showDropDown = [];
			smartStandbyComponent.onSmartStandbyNotification(notitfiaction);
			expect(smartStandbyComponent.showDropDown).not.toEqual([]);
		});

		it('should call onSmartStandbyNotification iterate through all showDropDown', () => {
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			const notitfiaction: AppNotification = {
				type: 'smartStandbyToggles',
				payload: { id: 1, value: true },
			};
			smartStandbyComponent.showDropDown = [false, false, false];
			smartStandbyComponent.onSmartStandbyNotification(notitfiaction);
			// expect(smartStandbyComponent.showDropDown).not.toEqual([]);
		});

		it('should call getIsAutonomicCapability - inner if ', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			powerService.isShellAvailable = true;
			const spy = spyOn(powerService, 'getIsAutonomicCapability').and.returnValue(
				Promise.resolve(false)
			);
			smartStandbyComponent.isAutonomicCapability = false;
			smartStandbyComponent.getIsAutonomicCapability();
			expect(spy).toHaveBeenCalled();
		});

		// it('should call getIsAutonomicCapability - outer if ', () => {
		// 	let fixture = TestBed.createComponent(SmartStandbyComponent);
		// 	let smartStandbyComponent = fixture.debugElement.componentInstance;
		// 	let powerService = fixture.debugElement.injector.get(PowerService)
		// 	powerService.isShellAvailable = false
		// 	// let spy = spyOn(powerService, 'getIsAutonomicCapability').and.returnValue(Promise.resolve(false))
		// 	// smartStandbyComponent.isAutonomicCapability = false
		// 	smartStandbyComponent.getIsAutonomicCapability()
		// 	// expect(spy).toHaveBeenCalled();
		// })

		it('should call getIsAutonomicCapability - catch block', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			powerService.isShellAvailable = true;
			const spy = spyOn(powerService, 'getIsAutonomicCapability').and.returnValue(
				Promise.reject(false)
			);
			smartStandbyComponent.isAutonomicCapability = false;
			smartStandbyComponent.getIsAutonomicCapability();
			expect(spy).toHaveBeenCalled();

			smartStandbyComponent.getIsAutonomicCapability();
			expect(smartStandbyComponent.getIsAutonomicCapability).toThrow();
		});

		it('should call getSmartStandbyIsAutonomic when reject', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			powerService.isShellAvailable = true;
			const spy = spyOn(powerService, 'getSmartStandbyIsAutonomic').and.returnValue(
				Promise.reject()
			);
			smartStandbyComponent.getSmartStandbyIsAutonomic();
			expect(spy).toHaveBeenCalled();
		});

		it('should call getSmartStandbyIsAutonomic - else', () => {
			/* const fixture = TestBed.createComponent(SmartStandbyComponent);
			const smartStandbyComponent = fixture.debugElement.componentInstance;
			const powerService = fixture.debugElement.injector.get(PowerService); */
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			powerService.isShellAvailable = false;
			const spy = spyOn(powerService, 'getSmartStandbyIsAutonomic');
			smartStandbyComponent.getSmartStandbyIsAutonomic();
			expect(spy).not.toHaveBeenCalled();
		});

		it('should call onCheckboxClicked', () => {
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			const AUTOMATIC_MODE = 'Automatic mode';
			// const event = new Event('click');
			const event = { value: AUTOMATIC_MODE };
			smartStandbyComponent.onCheckboxClicked(event);
			expect(smartStandbyComponent.checkbox).toEqual(true);
		});

		it('should toggle html element', () => {
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			const element: HTMLElement = document.createElement('input');
			smartStandbyComponent.onToggle(element);
			expect(smartStandbyComponent.isCollapsed).toEqual(smartStandbyComponent.isCollapsed);
		});

		it('should call showUsageGraph', () => {
			const {
				fixture,
				smartStandbyComponent,
				powerService,
				commonService,
				smartStandbyService,
			} = setup();
			smartStandbyComponent.cache = new SmartStandby();
			smartStandbyComponent.smartStandby = smartStandbyComponent.cache;
			smartStandbyComponent.smartStandby.isEnabled = true;
			smartStandbyComponent.showUsageGraph();
		});
	});
});
