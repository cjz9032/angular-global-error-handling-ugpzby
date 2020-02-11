import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";

import { TranslateModule } from "@ngx-translate/core";
import WinRT from '@lenovo/tan-client-bridge/src/util/winrt';

import { SubpageDeviceSettingsInputAccessoryComponent } from "./subpage-device-settings-input-accessory.component";

import { BacklightService } from "./backlight/backlight.service";
import { TopRowFunctionsIdeapadService } from "./top-row-functions-ideapad/top-row-functions-ideapad.service";
import { LoggerService } from "src/app/services/logger/logger.service";
import { CommonService } from "src/app/services/common/common.service";
import { InputAccessoriesService } from "src/app/services/input-accessories/input-accessories.service";
import { RouteHandlerService } from "src/app/services/route-handler/route-handler.service";
import { of } from "rxjs";
import {
	BacklightLevelEnum,
	BacklightStatusEnum
} from "./backlight/backlight.enum";
import {
	BacklightStatus,
	BacklightLevel
} from "./backlight/backlight.interface";
import { VoipApp, VoipResponse } from 'src/app/data-models/input-accessories/voip.model';
import { SupportedAppEnum } from 'src/app/enums/voip.enum';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';

describe("SubpageDeviceSettingsInputAccessoryComponent", () => {
	let component: SubpageDeviceSettingsInputAccessoryComponent;
	let fixture: ComponentFixture<SubpageDeviceSettingsInputAccessoryComponent>;
	let backlightService: BacklightService;
	let topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService;
	let keyboardService: InputAccessoriesService;
	let commonService: CommonService;
	let loggerService: LoggerService;
	let routeHandlerService: RouteHandlerService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [SubpageDeviceSettingsInputAccessoryComponent],
			imports: [
				HttpClientTestingModule,
				TranslateModule.forRoot(),
				RouterTestingModule
			],
			providers: [
				BacklightService,
				TopRowFunctionsIdeapadService,
				InputAccessoriesService,
				CommonService,
				LoggerService,
				RouteHandlerService
			]
		});
	}));

	it("should create SubpageDeviceSettingsInputAccessoryComponent", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		topRowFunctionsIdeapadService = TestBed.get(
			TopRowFunctionsIdeapadService
		);
		const capabilities: any = [{ key: "FnLock", value: "True" }];
		spyOn(commonService, "getLocalStorageValue").and.returnValue(1);
		spyOn(component, "initHiddenKbdFnFromCache");
		spyOn<any>(
			topRowFunctionsIdeapadService,
			"requestCapability"
		).and.returnValue(of(capabilities));
		component.keyboardCompatibility = true;
		fixture.detectChanges();
		expect(component).toBeTruthy();
		expect(component.fnLockCapability).toEqual(true);
	}));

	it("should create SubpageDeviceSettingsInputAccessoryComponent - capability else case", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		topRowFunctionsIdeapadService = TestBed.get(
			TopRowFunctionsIdeapadService
		);
		const capabilities: any = [{ key: "FnLock", value: "False" }];
		spyOn(commonService, "getLocalStorageValue").and.returnValue(1);
		spyOn(component, "initHiddenKbdFnFromCache");
		spyOn<any>(
			topRowFunctionsIdeapadService,
			"requestCapability"
		).and.returnValue(of(capabilities));
		component.keyboardCompatibility = true;
		fixture.detectChanges();
		expect(component).toBeTruthy();
		expect(component.fnLockCapability).toEqual(false);
	}));

	it("should create SubpageDeviceSettingsInputAccessoryComponent - keyboardCompatibility else case", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		spyOn(commonService, "getLocalStorageValue").and.returnValue(1);
		spyOn(component, "initHiddenKbdFnFromCache");
		component.keyboardCompatibility = false;
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it("should create SubpageDeviceSettingsInputAccessoryComponent - machineType else case", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		spyOn(commonService, "getLocalStorageValue").and.returnValue(0);
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should call getVoipHotkeysSettings - res is available', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService)
		const res: any = [{
			errorCode: 0,
			capability: true,
			appList: [{
				isAppInstalled: false,
				isSelected: false
			}]
		}]
		const spy = spyOn(keyboardService, 'getVoipHotkeysSettings').and.returnValue(Promise.resolve(res))
		component.getVoipHotkeysSettings()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getVoipHotkeysSettings - error catch block', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService)
		const error = {}
		const spy = spyOn(keyboardService, 'getVoipHotkeysSettings').and.returnValue(Promise.reject(error))
		component.getVoipHotkeysSettings()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setVoipHotkeysSettings', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService)
		const app: VoipApp = {
			appName: SupportedAppEnum.MICROSOFT_TEAMS,
			isAppInstalled: true,
			isSelected: true			
		}
		const voipRes: VoipResponse = {
			errorCode: -1,
			capability: true
		}
		component.selectedApp = app
		const spy = spyOn(keyboardService, 'setVoipHotkeysSettings').and.returnValue(Promise.resolve(voipRes))
		component.setVoipHotkeysSettings(app)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setVoipHotkeysSettings - else case', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService)
		const app: VoipApp = {
			appName: SupportedAppEnum.MICROSOFT_TEAMS,
			isAppInstalled: true,
			isSelected: true			
		}
		const voipRes: VoipResponse = {
			errorCode: 0,
			capability: true,
			appList: []
		}
		spyOn(keyboardService, 'setVoipHotkeysSettings').and.returnValue(Promise.resolve(voipRes))
		component.setVoipHotkeysSettings(app)
		expect(component.installedApps).toEqual(voipRes.appList)
	}));

	it('should call setVoipHotkeysSettings - catch block', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService)
		const app: VoipApp = {
			appName: SupportedAppEnum.MICROSOFT_TEAMS,
			isAppInstalled: true,
			isSelected: true			
		}
		const voipRes: VoipResponse = {
			errorCode: 0,
			capability: true,
			appList: []
		}
		const spy = spyOn(keyboardService, 'setVoipHotkeysSettings').and.returnValue(Promise.reject())
		component.setVoipHotkeysSettings(app)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call initHiddwnKbdFnfromCache', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		const inputAccessories: InputAccessoriesCapability = {
			isKeyboardMapAvailable: true,
			isUdkAvailable: true,
			isVoipAvailable: true,
			image: '890',
			additionalCapabilitiesObj: {},
			keyboardVersion: '4.0.1',
			keyboardLayoutName: 'hello'
		}
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(inputAccessories)
		component.initHiddenKbdFnFromCache();
		expect(component.cacheFound).toEqual(true)
	}));

	it('should call initHiddwnKbdFnfromCache - else case', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(undefined)
		component.initHiddenKbdFnFromCache();
		expect(component.cacheFound).toEqual(false)
	}));

	it('should call getAdditionalCapabilitiesFromCache', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		component.additionalCapabilitiesObj = {
			performance: true,
			privacy: true,
			magnifier: true,
			backLight: true
		}
		component.getAdditionalCapabilitiesFromCache()
		expect(component.shortcutKeys.length).toEqual(5)
	}));

	it('should call getFnCtrlSwapCapability', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		keyboardService.keyboardManager = {
			GetFnCtrlSwapCapability() {
				return
			}
		}
		const spy = spyOn(keyboardService, 'GetFnCtrlSwapCapability').and.returnValue(Promise.resolve(keyboardService.keyboardManager))
		component.getFnCtrlSwapCapability()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getFnCtrlSwapCapability -inner else case', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		const spy = spyOn(keyboardService, 'GetFnCtrlSwapCapability').and.returnValue(Promise.resolve(undefined))
		component.getFnCtrlSwapCapability()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getFnCtrlSwapCapability - catch block', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		const error = {message: 'error'}
		const spy = spyOn(keyboardService, 'GetFnCtrlSwapCapability').and.returnValue(Promise.reject(error))
		component.getFnCtrlSwapCapability()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getFnCtrlSwapCapability - isShellAvailable is false', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = false
		const spy = spyOn(keyboardService, 'GetFnCtrlSwapCapability')
		component.getFnCtrlSwapCapability()
		expect(spy).not.toHaveBeenCalled()
	}));

	it('should call getFnCtrlSwapCapability - throw error', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		const error = {message: 'error'}
		const spy = spyOn<any>(keyboardService, 'GetFnCtrlSwapCapability').and.returnValue(error)
		component.getFnCtrlSwapCapability()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getFnCtrlSwap', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		keyboardService.keyboardManager = {
			GetFnCtrlSwap() {
				return
			}
		}
		const spy = spyOn(keyboardService, 'GetFnCtrlSwap').and.returnValue(Promise.resolve(keyboardService.keyboardManager));
		component.getFnCtrlSwap()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getFnCtrlSwap - catch block inner', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		const error = {message: 'error'}
		const spy = spyOn(keyboardService, 'GetFnCtrlSwap').and.returnValue(Promise.reject(error));
		component.getFnCtrlSwap()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fnCtrlKey', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		const event = {
			switchValue: true
		}
		const res = {
			RebootRequired: true
		}
		keyboardService.isShellAvailable = true
		spyOn(keyboardService, 'SetFnCtrlSwap').and.returnValue(Promise.resolve(res))
		component.fnCtrlKey(event)
		expect(component.fnCtrlSwapStatus).toEqual(event.switchValue)
	}));

	it('should call fnCtrlKey - inner else', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		const event = {
			switchValue: true
		}
		const res = {
			RebootRequired: false
		}
		keyboardService.isShellAvailable = true
		const spy = spyOn(keyboardService, 'SetFnCtrlSwap').and.returnValue(Promise.resolve(res))
		component.fnCtrlKey(event)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fnCtrlKey - outer else', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		const event = {
			switchValue: true
		}
		keyboardService.isShellAvailable = false
		const spy = spyOn(keyboardService, 'SetFnCtrlSwap')
		component.fnCtrlKey(event)
		expect(spy).not.toHaveBeenCalled()
	}));

	it('should call fnCtrlKey - catch block', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		const event = {
			switchValue: true
		}
		keyboardService.isShellAvailable = true
		const error = {message: 'error'}
		const spy = spyOn(keyboardService, 'SetFnCtrlSwap').and.returnValue(error)
		component.fnCtrlKey(event)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getFnAsCtrlCapability', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		const spy = spyOn(keyboardService, 'GetFnAsCtrlCapability').and.returnValue(Promise.resolve(true))
		component.getFnAsCtrlCapability()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getFnAsCtrlCapability - inner catch block', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		const error = {message: 'error'}
		const spy = spyOn(keyboardService, 'GetFnAsCtrlCapability').and.returnValue(Promise.reject(error))
		component.getFnAsCtrlCapability()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getFnAsCtrlCapability - inner else case', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		const spy = spyOn(keyboardService, 'GetFnAsCtrlCapability').and.returnValue(Promise.resolve(false))
		component.getFnAsCtrlCapability()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getFnAsCtrlCapability - outer else case', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = false
		const spy = spyOn(keyboardService, 'GetFnAsCtrlCapability')
		component.getFnAsCtrlCapability()
		expect(spy).not.toHaveBeenCalled()
	}));

	it('should call getFnAsCtrlCapability - outer catch block', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		const error: any = {message: 'error'}
		const spy = spyOn(keyboardService, 'GetFnAsCtrlCapability').and.returnValue(error)
		component.getFnAsCtrlCapability()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getFnAsCtrlStatus', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		spyOn(keyboardService, 'GetFnAsCtrl').and.returnValue(Promise.resolve(true))
		component.getFnAsCtrlStatus()
		expect(component.fnAsCtrlStatus).toEqual(false)
	}));

	it('should call getFnAsCtrlStatus - inner catch block', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = true
		const error = {message: 'error'}
		spyOn(keyboardService, 'GetFnAsCtrl').and.returnValue(Promise.reject(error))
		component.getFnAsCtrlStatus()
		expect(component.fnAsCtrlStatus).toEqual(false)
	}));

	it('should call getFnAsCtrlStatus - outer catch block', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService);
		keyboardService.isShellAvailable = false
		const spy = spyOn(keyboardService, 'GetFnAsCtrl')
		component.getFnAsCtrlStatus()
		expect(spy).not.toHaveBeenCalled()
	}));

	it('should call getLayoutTable - layout is TURKISH_F', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		const layoutName = 'turkish_f'
		const spy = spyOn(component, 'generateLayOutTable')
		component.getLayoutTable(layoutName)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getLayoutTable - layout is BELGIUM', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		const layoutName = 'belgium'
		const spy = spyOn(component, 'generateLayOutTable')
		component.getLayoutTable(layoutName)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getLayoutTable - layout is FRENCH', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		const layoutName = 'french'
		const spy = spyOn(component, 'generateLayOutTable')
		component.getLayoutTable(layoutName)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getLayoutTable - layout is FRENC_CANADIAN', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		const layoutName = 'french_canadian'
		const spy = spyOn(component, 'generateLayOutTable')
		component.getLayoutTable(layoutName)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getLayoutTable - layout is \'\'', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		const layoutName = ''
		const spy = spyOn(component, 'generateLayOutTable')
		component.getLayoutTable(layoutName)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call generateLayOutTable', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		const array = [7, 4, 10, 11, 2, 9, 13, 12]
		component.isFrenchKeyboard = true
		component.generateLayOutTable(array)
		expect(component.fnCtrlKeyTooltipContent.length).not.toEqual(0)
	}));

	it('should call setFnAsCtrl', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService)
		keyboardService.isShellAvailable = true
		const event = {
			switchValue: true
		}
		const spy = spyOn(keyboardService, 'SetFnAsCtrl').and.returnValue(Promise.resolve(true))
		component.setFnAsCtrl(event)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setFnAsCtrl - inner catch block', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService)
		keyboardService.isShellAvailable = true
		const event = {
			switchValue: true
		}
		const error = {message: 'error'}
		const spy = spyOn(keyboardService, 'SetFnAsCtrl').and.returnValue(Promise.reject(error))
		component.setFnAsCtrl(event)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setFnAsCtrl - else case', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService)
		keyboardService.isShellAvailable = false
		const event = {
			switchValue: true
		}
		const spy = spyOn(keyboardService, 'SetFnAsCtrl')
		component.setFnAsCtrl(event)
		expect(spy).not.toHaveBeenCalled()
	}));

	it('should call setFnAsCtrl - outer catch block', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		keyboardService = TestBed.get(InputAccessoriesService)
		keyboardService.isShellAvailable = true
		const event = {
			switchValue: true
		}
		const error = {message: 'error'}
		const spy = spyOn(keyboardService, 'SetFnAsCtrl').and.returnValue(error)
		component.setFnAsCtrl(event)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call showHideKeyboardBacklight', async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsInputAccessoryComponent
		);
		component = fixture.componentInstance;
		component.showHideKeyboardBacklight(true)
		expect(component.isKbdBacklightAvailable).toEqual(true)
	}));
});
