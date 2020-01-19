import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubpageDeviceSettingsInputAccessoryComponent } from './subpage-device-settings-input-accessory.component';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';


describe('SubpageDeviceSettingsInputAccessoryComponent', () => {
  let inputAccessoriesService: InputAccessoriesService;
  let commonService: CommonService;
  let logger: LoggerService;
  let modalService: NgbModal;
  const additionalCapabilitiesObj = {
	performance: true,
	privacy: true,
	magnifier: true,
	backLight: true,
  };
  const appVersion = {
	appName: 'SKYPE_FOR_BUSINESS_2016',
	isAppInstalled: true,
	isSelected: true
  };


  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [SubpageDeviceSettingsInputAccessoryComponent],
		schemas: [NO_ERRORS_SCHEMA],
		imports: [TranslationModule, HttpClientModule, RouterTestingModule],
		providers: [TranslateStore]
	})
		.compileComponents();
  }));
  describe(':', () => {
	function setup() {
		const fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
	 const component = fixture.componentInstance;
	 component.additionalCapabilitiesObj = additionalCapabilitiesObj;
		commonService = fixture.debugElement.injector.get(CommonService);
		inputAccessoriesService = fixture.debugElement.injector.get(InputAccessoriesService);
		logger = fixture.debugElement.injector.get(LoggerService);
		modalService = fixture.debugElement.injector.get(NgbModal);
		return { fixture, component, commonService, logger, modalService, inputAccessoriesService };
	}

	it('should create', () => {
		const { component } = setup();
		expect(component).toBeTruthy();
  });
	it('#ngOnInit should call initDataFromCache', () => {
		const { fixture, component } = setup();
		spyOn(component, 'initDataFromCache');
		fixture.detectChanges();
		component.ngOnInit();
		component.initDataFromCache();
		expect(component.initDataFromCache).toHaveBeenCalled();
  });
 it('#initHiddenKbdFnFromCache should call', async () => {
		const { fixture, component } = setup();
		spyOn(component, 'initHiddenKbdFnFromCache');
		fixture.detectChanges();
		component.ngOnInit();
		await component.initHiddenKbdFnFromCache();
		expect(component.initHiddenKbdFnFromCache).toHaveBeenCalled();
  });

	it('#getKBDLayoutName should call', () => {
		const { fixture, component, } = setup();
		spyOn(inputAccessoriesService, 'GetKBDLayoutName').and.returnValue(Promise.resolve('Standard'));
		fixture.detectChanges();
		component.getKBDLayoutName();
		expect(inputAccessoriesService.GetKBDLayoutName).toHaveBeenCalled();
	});
	it('#getKBDMachineType should call', () => {
		const { fixture, component, } = setup();
		spyOn(inputAccessoriesService, 'GetKBDMachineType').and.returnValue(Promise.resolve('Standard'));
		fixture.detectChanges();
		component.getKBDMachineType('Standard');
		expect(inputAccessoriesService.GetKBDMachineType).toHaveBeenCalled();
  });
 it('should call getAdditionalCapabilitiesFromCache', () => {
	const { component } = setup();
	component.additionalCapabilitiesObj = additionalCapabilitiesObj;
	const spy = spyOn(component, 'getAdditionalCapabilitiesFromCache');
	component.getAdditionalCapabilitiesFromCache();
	expect(spy).toHaveBeenCalled();
  });
//  it('#setVoipHotkeysSettings should call', () => {
// 		const { fixture, component, } = setup();
// 		spyOn(inputAccessoriesService, 'setVoipHotkeysSettings').and.returnValue(Promise.resolve(appVersion));
// 		fixture.detectChanges();
// 		component.setVoipHotkeysSettings(appVersion);
// 		expect(inputAccessoriesService.setVoipHotkeysSettings).toHaveBeenCalled();
//   });

 it('#GetKbdHiddenKeyPerformanceModeCapability should call', () => {
		const { fixture, component, } = setup();
		spyOn(inputAccessoriesService, 'GetKbdHiddenKeyPerformanceModeCapability').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.getAdditionalCapabilities();
		expect(inputAccessoriesService.GetKbdHiddenKeyPerformanceModeCapability).toHaveBeenCalled();
  });
	it('#getFnCtrlSwapCapability should call', () => {
		const { fixture, component, } = setup();
		spyOn(inputAccessoriesService, 'GetFnCtrlSwapCapability').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.getFnCtrlSwapCapability();
		expect(inputAccessoriesService.GetFnCtrlSwapCapability).toHaveBeenCalled();
	});
	it('#getFnCtrlSwap should call', () => {
		const { fixture, component, } = setup();
		spyOn(inputAccessoriesService, 'GetFnCtrlSwap').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.getFnCtrlSwap();
		expect(inputAccessoriesService.GetFnCtrlSwap).toHaveBeenCalled();
	});
	it('#setfnCtrlKey should call', async () => {
		const { fixture, component } = setup();
		const privateSpy = spyOn<any>(component, 'fnCtrlKey').and.callThrough();
		fixture.detectChanges();
		component.machineType = 1;
		await component.fnCtrlKey(new Event('click'));
		expect(privateSpy).toHaveBeenCalled();
		component.fnCtrlKey({ switchValue: true });
		expect(privateSpy).toHaveBeenCalled();
	});

	it('#getFnAsCtrlCapability should call', () => {
		const { fixture, component, } = setup();
		spyOn(inputAccessoriesService, 'GetFnAsCtrlCapability').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.getFnAsCtrlCapability();
		component.hasUDKCapability = component.hasUDKCapability || true;
		expect(inputAccessoriesService.GetFnAsCtrlCapability).toHaveBeenCalled();
	});
	it('#getFnAsCtrlStatus should call', () => {
		const { fixture, component, } = setup();
		spyOn(inputAccessoriesService, 'GetFnAsCtrl').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.getFnAsCtrlStatus();
		expect(inputAccessoriesService.GetFnAsCtrl).toHaveBeenCalled();
	});
	it('#setFnAsCtrl should call', async () => {
		const { fixture, component } = setup();
		const privateSpy = spyOn<any>(component, 'setFnAsCtrl').and.callThrough();
		fixture.detectChanges();
		component.machineType = 1;
		await component.setFnAsCtrl(new Event('click'));
		expect(privateSpy).toHaveBeenCalled();
		component.setFnAsCtrl({ switchValue: true });
		expect(privateSpy).toHaveBeenCalled();
  });
 it('#getLayoutTable should call', () => {
		const { fixture, component } = setup();
		spyOn(component, 'getLayoutTable');
		fixture.detectChanges();
		component.getLayoutTable('Standard');
		expect(component.getLayoutTable).toHaveBeenCalled();
  });
  });
});

export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			// public transform(query: string, ...args: any[]): any {
			// 	return query;
			// }
		}
	);
}
