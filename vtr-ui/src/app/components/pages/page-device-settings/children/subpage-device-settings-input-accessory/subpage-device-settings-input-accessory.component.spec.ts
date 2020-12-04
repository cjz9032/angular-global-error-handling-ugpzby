import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UiCircleRadioWithCheckBoxListModel } from 'src/app/components/ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.model';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';
import { VoipApp, VoipResponse } from 'src/app/data-models/input-accessories/voip.model';
import { SupportedAppEnum } from 'src/app/enums/voip.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { BacklightService } from './backlight/backlight.service';
import { SubpageDeviceSettingsInputAccessoryComponent } from './subpage-device-settings-input-accessory.component';
import { TopRowFunctionsIdeapadService } from './top-row-functions-ideapad/top-row-functions-ideapad.service';

describe('SubpageDeviceSettingsInputAccessoryComponent', () => {
	let component: SubpageDeviceSettingsInputAccessoryComponent;
	let fixture: ComponentFixture<SubpageDeviceSettingsInputAccessoryComponent>;
	let topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService;
	let keyboardService: InputAccessoriesService;
	let commonService: CommonService;
	const circleRadioWithCheckBox: UiCircleRadioWithCheckBoxListModel = {
		componentId: null,
		label: null,
		value: null,
		isChecked: null,
		isDisabled: null,
		processIcon: null,
		processLabel: null,
		hideIcon: null,
		customIcon: null,
		metricsItem: null,
	};

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [SubpageDeviceSettingsInputAccessoryComponent],
			imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
			providers: [
				BacklightService,
				TopRowFunctionsIdeapadService,
				InputAccessoriesService,
				CommonService,
				LoggerService,
				RouteHandlerService,
			],
		});
	}));

	it('should create SubpageDeviceSettingsInputAccessoryComponent', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		topRowFunctionsIdeapadService = TestBed.inject(TopRowFunctionsIdeapadService);
		const capabilities: any = [{ key: 'FnLock', value: 'True' }];
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(1);
		spyOn(component, 'initHiddenKbdFnFromCache');
		spyOn<any>(topRowFunctionsIdeapadService, 'requestCapability').and.returnValue(
			of(capabilities)
		);
		component.keyboardCompatibility = true;
		fixture.detectChanges();
		expect(component).toBeTruthy();
		expect(component.fnLockCapability).toEqual(true);
	}));

	it('should create SubpageDeviceSettingsInputAccessoryComponent - capability else case', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		topRowFunctionsIdeapadService = TestBed.inject(TopRowFunctionsIdeapadService);
		const capabilities: any = [{ key: 'FnLock', value: 'False' }];
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(1);
		spyOn(component, 'initHiddenKbdFnFromCache');
		spyOn<any>(topRowFunctionsIdeapadService, 'requestCapability').and.returnValue(
			of(capabilities)
		);
		component.keyboardCompatibility = true;
		fixture.detectChanges();
		expect(component).toBeTruthy();
		expect(component.fnLockCapability).toEqual(false);
	}));

	it('should create SubpageDeviceSettingsInputAccessoryComponent - keyboardCompatibility else case', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(1);
		spyOn(component, 'initHiddenKbdFnFromCache');
		component.keyboardCompatibility = false;
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should create SubpageDeviceSettingsInputAccessoryComponent - machineType else case', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(0);
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should call getVoipHotkeysSettings - res is available', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		keyboardService = TestBed.inject(InputAccessoriesService);
		const res: any = [
			{
				errorCode: 0,
				capability: true,
				appList: [
					{
						isAppInstalled: false,
						isSelected: false,
					},
				],
			},
		];
		const spy = spyOn(keyboardService, 'getVoipHotkeysSettings').and.returnValue(
			Promise.resolve(res)
		);
		component.getVoipHotkeysSettings();
		expect(spy).toHaveBeenCalled();
	}));

	it('should call getVoipHotkeysSettings - error catch block', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		keyboardService = TestBed.inject(InputAccessoriesService);
		const error = {};
		const spy = spyOn(keyboardService, 'getVoipHotkeysSettings').and.returnValue(
			Promise.reject(error)
		);
		component.getVoipHotkeysSettings();
		expect(spy).toHaveBeenCalled();
	}));

	it('should call setVoipHotkeysSettings', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		keyboardService = TestBed.inject(InputAccessoriesService);
		const app: VoipApp = {
			appName: SupportedAppEnum.MICROSOFT_TEAMS,
			isAppInstalled: true,
			isSelected: true,
		};
		const voipRes: VoipResponse = {
			errorCode: -1,
			capability: true,
		};
		component.selectedApp = app;
		const spy = spyOn(keyboardService, 'setVoipHotkeysSettings').and.returnValue(
			Promise.resolve(voipRes)
		);
		component.setVoipHotkeysSettings(circleRadioWithCheckBox);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call setVoipHotkeysSettings - else case', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		keyboardService = TestBed.inject(InputAccessoriesService);
		const app: VoipApp = {
			appName: SupportedAppEnum.MICROSOFT_TEAMS,
			isAppInstalled: true,
			isSelected: true,
		};
		const voipRes: VoipResponse = {
			errorCode: 0,
			capability: true,
			appList: [],
		};
		spyOn(keyboardService, 'setVoipHotkeysSettings').and.returnValue(Promise.resolve(voipRes));
		component.setVoipHotkeysSettings(circleRadioWithCheckBox);
		expect(component.installedApps).toEqual(voipRes.appList);
	}));

	it('should call setVoipHotkeysSettings - catch block', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		keyboardService = TestBed.inject(InputAccessoriesService);
		const app: VoipApp = {
			appName: SupportedAppEnum.MICROSOFT_TEAMS,
			isAppInstalled: true,
			isSelected: true,
		};
		const voipRes: VoipResponse = {
			errorCode: 0,
			capability: true,
			appList: [],
		};
		const spy = spyOn(keyboardService, 'setVoipHotkeysSettings').and.returnValue(
			Promise.reject()
		);
		component.setVoipHotkeysSettings(circleRadioWithCheckBox);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call initHiddwnKbdFnfromCache', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		const inputAccessories: InputAccessoriesCapability = {
			isKeyboardMapAvailable: true,
			isUdkAvailable: true,
			isVoipAvailable: true,
			image: '890',
			additionalCapabilitiesObj: {},
			keyboardVersion: '4.0.1',
			keyboardLayoutName: 'hello',
		};
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(inputAccessories);
		component.initHiddenKbdFnFromCache();
		expect(component.cacheFound).toEqual(true);
	}));

	it('should call initHiddwnKbdFnfromCache - else case', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(undefined);
		component.initHiddenKbdFnFromCache();
		expect(component.cacheFound).toEqual(false);
	}));

	it('should call getAdditionalCapabilitiesFromCache', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		component.additionalCapabilitiesObj = {
			performance: true,
			privacy: true,
			magnifier: true,
			backLight: true,
		};
		component.getAdditionalCapabilitiesFromCache();
		expect(component.shortcutKeys.length).toEqual(5);
	}));

	it('should call getKBDLayoutName - else case', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		keyboardService = TestBed.inject(InputAccessoriesService);
		keyboardService.isShellAvailable = false;
		const spy = spyOn(keyboardService, 'GetKBDLayoutName');
		component.getKBDLayoutName();
		expect(spy).not.toHaveBeenCalled();
	}));

	it('should call getKBDMachineType - else case', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		keyboardService = TestBed.inject(InputAccessoriesService);
		keyboardService.isShellAvailable = false;
		const spy = spyOn(keyboardService, 'GetKBDLayoutName');
		const layoutName = 'turkish_f';
		component.getKBDMachineType(layoutName);
		expect(spy).not.toHaveBeenCalled();
	}));

	// it('should call getFnCtrlSwapCapability', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	keyboardService.keyboardManager = {
	// 		GetFnCtrlSwapCapability() {
	// 			return
	// 		}
	// 	}
	// 	const spy = spyOn(keyboardService, 'GetFnCtrlSwapCapability').and.returnValue(Promise.resolve(keyboardService.keyboardManager))
	// 	component.getFnCtrlSwapCapability()
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call getFnCtrlSwapCapability -inner else case', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	const spy = spyOn(keyboardService, 'GetFnCtrlSwapCapability').and.returnValue(Promise.resolve(undefined))
	// 	component.getFnCtrlSwapCapability()
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call getFnCtrlSwapCapability - catch block', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	const error = {message: 'error'}
	// 	const spy = spyOn(keyboardService, 'GetFnCtrlSwapCapability').and.returnValue(Promise.reject(error))
	// 	component.getFnCtrlSwapCapability()
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call getFnCtrlSwapCapability - isShellAvailable is false', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = false
	// 	const spy = spyOn(keyboardService, 'GetFnCtrlSwapCapability')
	// 	component.getFnCtrlSwapCapability()
	// 	expect(spy).not.toHaveBeenCalled();
	// }));

	// it('should call getFnCtrlSwapCapability - throw error', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	const error = {message: 'error'}
	// 	const spy = spyOn<any>(keyboardService, 'GetFnCtrlSwapCapability').and.returnValue(error)
	// 	component.getFnCtrlSwapCapability()
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call getFnCtrlSwap', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	keyboardService.keyboardManager = {
	// 		GetFnCtrlSwap() {
	// 			return
	// 		}
	// 	}
	// 	const spy = spyOn(keyboardService, 'GetFnCtrlSwap').and.returnValue(Promise.resolve(keyboardService.keyboardManager));
	// 	component.getFnCtrlSwap()
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call getFnCtrlSwap - catch block inner', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	const error = {message: 'error'}
	// 	const spy = spyOn(keyboardService, 'GetFnCtrlSwap').and.returnValue(Promise.reject(error));
	// 	component.getFnCtrlSwap()
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call fnCtrlKey', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	const event = {
	// 		switchValue: true
	// 	}
	// 	const res = {
	// 		RebootRequired: true
	// 	}
	// 	keyboardService.isShellAvailable = true
	// 	spyOn(keyboardService, 'SetFnCtrlSwap').and.returnValue(Promise.resolve(res))
	// 	component.fnCtrlKey(event)
	// 	expect(component.fnCtrlSwapStatus).toEqual(event.switchValue)
	// }));

	// it('should call fnCtrlKey - inner else', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	const event = {
	// 		switchValue: true
	// 	}
	// 	const res = {
	// 		RebootRequired: false
	// 	}
	// 	keyboardService.isShellAvailable = true
	// 	const spy = spyOn(keyboardService, 'SetFnCtrlSwap').and.returnValue(Promise.resolve(res))
	// 	component.fnCtrlKey(event)
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call fnCtrlKey - outer else', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	const event = {
	// 		switchValue: true
	// 	}
	// 	keyboardService.isShellAvailable = false
	// 	const spy = spyOn(keyboardService, 'SetFnCtrlSwap')
	// 	component.fnCtrlKey(event)
	// 	expect(spy).not.toHaveBeenCalled();
	// }));

	// it('should call fnCtrlKey - catch block', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	const event = {
	// 		switchValue: true
	// 	}
	// 	keyboardService.isShellAvailable = true
	// 	const error = {message: 'error'}
	// 	const spy = spyOn(keyboardService, 'SetFnCtrlSwap').and.returnValue(error)
	// 	component.fnCtrlKey(event)
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call getFnAsCtrlCapability', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	const spy = spyOn(keyboardService, 'GetFnAsCtrlCapability').and.returnValue(Promise.resolve(true))
	// 	component.getFnAsCtrlCapability()
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call getFnAsCtrlCapability - inner catch block', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	const error = {message: 'error'}
	// 	const spy = spyOn(keyboardService, 'GetFnAsCtrlCapability').and.returnValue(Promise.reject(error))
	// 	component.getFnAsCtrlCapability()
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call getFnAsCtrlCapability - inner else case', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	const spy = spyOn(keyboardService, 'GetFnAsCtrlCapability').and.returnValue(Promise.resolve(false))
	// 	component.getFnAsCtrlCapability()
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call getFnAsCtrlCapability - outer else case', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = false
	// 	const spy = spyOn(keyboardService, 'GetFnAsCtrlCapability')
	// 	component.getFnAsCtrlCapability()
	// 	expect(spy).not.toHaveBeenCalled();
	// }));

	// it('should call getFnAsCtrlCapability - outer catch block', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	const error: any = {message: 'error'}
	// 	const spy = spyOn(keyboardService, 'GetFnAsCtrlCapability').and.returnValue(error)
	// 	component.getFnAsCtrlCapability()
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call getFnAsCtrlStatus', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	spyOn(keyboardService, 'GetFnAsCtrl').and.returnValue(Promise.resolve(true))
	// 	component.getFnAsCtrlStatus()
	// 	expect(component.fnAsCtrlStatus).toEqual(false)
	// }));

	// it('should call getFnAsCtrlStatus - inner catch block', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = true
	// 	const error = {message: 'error'}
	// 	spyOn(keyboardService, 'GetFnAsCtrl').and.returnValue(Promise.reject(error))
	// 	component.getFnAsCtrlStatus()
	// 	expect(component.fnAsCtrlStatus).toEqual(false)
	// }));

	// it('should call getFnAsCtrlStatus - outer catch block', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService);
	// 	keyboardService.isShellAvailable = false
	// 	const spy = spyOn(keyboardService, 'GetFnAsCtrl')
	// 	component.getFnAsCtrlStatus()
	// 	expect(spy).not.toHaveBeenCalled();
	// }));

	it('should call getKeyboardMap keyboardVersion is 1', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		const layoutName = 'turkish_f';
		component.imagesArray = [
			'Belgium.png',
			'French.png',
			'French_Canadian.png',
			'German.png',
			'Italian.png',
			'Spanish.png',
			'Turkish_F.png',
			'Standered.png',
		];
		const machineType = 'grafevo';
		component.keyboardVersion = '1';
		component.getKeyboardMap(layoutName, machineType);
		expect(component.image).not.toEqual('');
	}));

	it('should call getKeyboardMap type is grafevo', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		const layoutName = 'turkish_f';
		component.imagesArray = [
			'Belgium.png',
			'French.png',
			'French_Canadian.png',
			'German.png',
			'Italian.png',
			'Spanish.png',
			'Turkish_F.png',
			'Standered.png',
		];
		const machineType = 'grafevo';
		component.keyboardVersion = '2';
		component.getKeyboardMap(layoutName, machineType);
		expect(component.image).not.toEqual('');
	}));

	it('should call getAdditionalCapabilities - empty response', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		keyboardService = TestBed.inject(InputAccessoriesService);
		keyboardService.isShellAvailable = true;
		component.inputAccessoriesCapability = {
			isKeyboardMapAvailable: true,
			isUdkAvailable: true,
			isVoipAvailable: true,
			image: '890',
			additionalCapabilitiesObj: {},
			keyboardVersion: '4.0.1',
			keyboardLayoutName: 'hello',
		};
		const res: any = [];
		const spy = spyOn(
			keyboardService,
			'GetKbdHiddenKeyPerformanceModeCapability'
		).and.returnValue(Promise.resolve(res));
		component.getAdditionalCapabilities();
		expect(spy).toHaveBeenCalled();
	}));

	it('should call getAdditionalCapabilities - else case', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		keyboardService = TestBed.inject(InputAccessoriesService);
		keyboardService.isShellAvailable = false;
		const spy = spyOn(keyboardService, 'GetKbdHiddenKeyPerformanceModeCapability');
		component.getAdditionalCapabilities();
		expect(spy).not.toHaveBeenCalled();
	}));

	it('should call getLayoutTable - layout is TURKISH_F', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		const layoutName = 'turkish_f';
		const spy = spyOn(component, 'generateLayOutTable');
		component.getLayoutTable(layoutName);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call getLayoutTable - layout is BELGIUM', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		const layoutName = 'belgium';
		const spy = spyOn(component, 'generateLayOutTable');
		component.getLayoutTable(layoutName);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call getLayoutTable - layout is FRENCH', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		const layoutName = 'french';
		const spy = spyOn(component, 'generateLayOutTable');
		component.getLayoutTable(layoutName);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call getLayoutTable - layout is FRENC_CANADIAN', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		const layoutName = 'french_canadian';
		const spy = spyOn(component, 'generateLayOutTable');
		component.getLayoutTable(layoutName);
		expect(spy).toHaveBeenCalled();
	}));

	it("should call getLayoutTable - layout is ''", waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		const layoutName = '';
		const spy = spyOn(component, 'generateLayOutTable');
		component.getLayoutTable(layoutName);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call generateLayOutTable', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		const array = [7, 4, 10, 11, 2, 9, 13, 12];
		component.isFrenchKeyboard = true;
		component.generateLayOutTable(array);
		expect(component.fnCtrlKeyTooltipContent.length).not.toEqual(0);
	}));

	// it('should call setFnAsCtrl', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService)
	// 	keyboardService.isShellAvailable = true
	// 	const event = {
	// 		switchValue: true
	// 	}
	// 	const spy = spyOn(keyboardService, 'SetFnAsCtrl').and.returnValue(Promise.resolve(true))
	// 	component.setFnAsCtrl(event)
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call setFnAsCtrl - inner catch block', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService)
	// 	keyboardService.isShellAvailable = true
	// 	const event = {
	// 		switchValue: true
	// 	}
	// 	const error = {message: 'error'}
	// 	const spy = spyOn(keyboardService, 'SetFnAsCtrl').and.returnValue(Promise.reject(error))
	// 	component.setFnAsCtrl(event)
	// 	expect(spy).toHaveBeenCalled();
	// }));

	// it('should call setFnAsCtrl - else case', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService)
	// 	keyboardService.isShellAvailable = false
	// 	const event = {
	// 		switchValue: true
	// 	}
	// 	const spy = spyOn(keyboardService, 'SetFnAsCtrl')
	// 	component.setFnAsCtrl(event)
	// 	expect(spy).not.toHaveBeenCalled();
	// }));

	// it('should call setFnAsCtrl - outer catch block', async(() => {
	// 	fixture = TestBed.createComponent(
	// 		SubpageDeviceSettingsInputAccessoryComponent
	// 	);
	// 	component = fixture.componentInstance;
	// 	keyboardService = TestBed.inject(InputAccessoriesService)
	// 	keyboardService.isShellAvailable = true
	// 	const event = {
	// 		switchValue: true
	// 	}
	// 	const error = {message: 'error'}
	// 	const spy = spyOn(keyboardService, 'SetFnAsCtrl').and.returnValue(error)
	// 	component.setFnAsCtrl(event)
	// 	expect(spy).toHaveBeenCalled();
	// }));

	it('should call showHideKeyboardBacklight', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		component.showHideKeyboardBacklight(true);
		expect(component.isKbdBacklightAvailable).toEqual(true);
	}));

	it('should call getMouseAndTouchPadCapability - else case', waitForAsync(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
		component = fixture.componentInstance;
		keyboardService = TestBed.inject(InputAccessoriesService);
		keyboardService.isShellAvailable = false;
		const spy = spyOn(keyboardService, 'getMouseCapability');
		component.getMouseAndTouchPadCapability();
		expect(spy).not.toHaveBeenCalled();
	}));
});
