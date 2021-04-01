import { TestBed } from '@angular/core/testing';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { VantageShellService } from '../vantage-shell/vantage-shell-mock.service';
import { InputAccessoriesService } from './input-accessories.service';
import { VoipResponse, VoipApp } from 'src/app/data-models/input-accessories/voip.model';
import { SupportedAppEnum, VoipErrorCodeEnum } from 'src/app/enums/voip.enum';

class KeyBoardManagerMock {
	setUserDefinedKeySetting(
		type: string,
		actionType: string,
		settingKey: string,
		settingValue: string
	): Promise<boolean> {
		return Promise.resolve(true);
	}
	StartSpecialKeyMonitor(installDirectory: string): Promise<boolean> {
		return Promise.resolve(true);
	}
	EndSpecialKeyMonitor(): Promise<boolean> {
		return Promise.resolve(true);
	}
	Initialize() {
		return Promise.resolve(true);
	}
	AddApplicationOrFiles(selectedUDK: string, appSelectorType: string): Promise<any> {
		return Promise.resolve(true);
	}
	DeleteUDKApplication(udkType: string, itemId: string, displayName: string): Promise<boolean> {
		return Promise.resolve(true);
	}
	GetAllCapability(): Promise<any> {
		return Promise.resolve(0);
	}

	GetUDKTypeList(): Promise<any> {
		return Promise.resolve(true);
	}
	GetKeyboardVersion(): Promise<string> {
		return Promise.resolve('MSD');
	}
	GetKBDLayoutName(): Promise<any> {
		return Promise.resolve(1);
	}
	GetKBDMachineType(): Promise<any> {
		return Promise.resolve(true);
	}
	GetKbdHiddenKeyPrivacyFilterCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}
	GetKbdHiddenKeyBackLightCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}
	GetKbdHiddenKeyMagnifierCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}
	GetKbdHiddenKeyPerformanceModeCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}

	GetTopRowFnLockCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}
	GetTopRowFnStickKeyCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}

	GetTopRowPrimaryFunctionCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public GetFnLockStatus(): Promise<boolean> {
		return Promise.resolve(true);
	}
	public GetFnStickKeyStatus(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public GetPrimaryFunctionStatus(): Promise<boolean> {
		return Promise.resolve(true);
	}
	public SetFnStickKey(value): Promise<boolean> {
		return Promise.resolve(true);
	}

	public SetFnLock(value): Promise<boolean> {
		return Promise.resolve(true);
	}

	public SetPrimaryFunction(value): Promise<boolean> {
		return Promise.resolve(true);
	}
	public GetFnCtrlSwapCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public GetFnCtrlSwap() {
		return Promise.resolve(true);
	}

	public SetFnCtrlSwap(value) {
		return Promise.resolve(true);
	}
	public GetFnAsCtrlCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public GetFnAsCtrl() {
		return Promise.resolve(true);
	}

	public SetFnAsCtrl(value) {
		return Promise.resolve(true);
	}
	public GetMouseCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public GetTouchPadCapability() {
		return Promise.resolve(true);
	}

	public RestartMachine() {
		return;
	}
}

class MouseAndTouchPadMock {
	public GetMouseCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public GetTouchpadCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}
}

class KeyBoardMock {
	public GetAutoKBDBacklightCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public GetKBDBacklightCapability(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public GetAutoKBDStatus(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public GetKBDBacklightStatus(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public GetKBDBacklightLevel(): Promise<boolean> {
		return Promise.resolve(true);
	}

	public SetKBDBacklightStaus(level: string): Promise<boolean> {
		return Promise.resolve(true);
	}

	public SetAutomaticKBDBacklight(level: boolean): Promise<boolean> {
		return Promise.resolve(true);
	}

	public SetAutoKBDEnableStatus(): Promise<boolean> {
		return Promise.resolve(true);
	}
}
const voipApp1: VoipApp = {
	appName: SupportedAppEnum.MICROSOFT_TEAMS,
	isAppInstalled: false,
	isSelected: true,
};
const voipApp2 = {
	appName: SupportedAppEnum.SKYPE_FOR_BUSINESS_2016,
	isAppInstalled: false,
	isSelected: true,
};
const voipResponse: VoipResponse = {
	errorCode: VoipErrorCodeEnum.FAILED,
	capability: true,
	keyboardVersion: 'test',
	appList: [voipApp1, voipApp2],
};
class VoipHotKeys {
	public getVOIPHotkeysSettings(): Promise<VoipResponse> {
		return Promise.resolve(voipResponse);
	}

	public setVOIPHotkeysSettings(selectedApp: number): Promise<VoipResponse> {
		return Promise.resolve(voipResponse);
	}
}

describe('InputAccessoriesService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [InputAccessoriesService, VantageShellService, TranslateStore],
			imports: [TranslationModule.forChild()],
		})
	);
	describe(':', () => {
		const setup = () => {
			const inputAccessoriesService = TestBed.inject(InputAccessoriesService);
			const shellService = TestBed.inject(VantageShellService);
			inputAccessoriesService.keyboardManager = new KeyBoardManagerMock();
			inputAccessoriesService.keyboard = new KeyBoardMock();
			return { inputAccessoriesService, shellService };
		};
		it('should be created', () => {
			const { inputAccessoriesService } = setup();
			expect(inputAccessoriesService).toBeTruthy();
		});

		it('should call setUserDefinedKeySetting', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'setUserDefinedKeySetting'
			).and.callThrough();
			inputAccessoriesService.setUserDefinedKeySetting(
				'test',
				'testaction',
				'settingKey',
				'settingValue'
			);
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.setUserDefinedKeySetting(
				'test',
				'testaction',
				'settingKey',
				'settingValue'
			);
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.setUserDefinedKeySetting).toThrow();
		});

		it('should call StartSpecialKeyMonitor', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'StartSpecialKeyMonitor'
			).and.callThrough();
			inputAccessoriesService.StartSpecialKeyMonitor('test');
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.StartSpecialKeyMonitor('test');
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.StartSpecialKeyMonitor).toThrow();
		});

		it('should call EndSpecialKeyMonitor', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'EndSpecialKeyMonitor'
			).and.callThrough();
			inputAccessoriesService.EndSpecialKeyMonitor();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.EndSpecialKeyMonitor();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.EndSpecialKeyMonitor).toThrow();
		});

		it('should call Initialize', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'Initialize'
			).and.callThrough();
			inputAccessoriesService.Initialize();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.Initialize();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.Initialize).toThrow();
		});

		it('should call AddApplicationOrFiles', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'AddApplicationOrFiles'
			).and.callThrough();
			inputAccessoriesService.AddApplicationOrFiles('selectedUDK', 'appSelectorType');
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.AddApplicationOrFiles(
				'selectedUDK',
				'appSelectorType'
			);
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.AddApplicationOrFiles).toThrow();
		});

		it('should call DeleteUDKApplication', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'DeleteUDKApplication'
			).and.callThrough();
			inputAccessoriesService.DeleteUDKApplication('udkType', 'itemId', 'displayName');
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.DeleteUDKApplication(
				'udkType',
				'itemId',
				'displayName'
			);
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.DeleteUDKApplication).toThrow();
		});

		it('should call GetAllCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetAllCapability'
			).and.callThrough();
			inputAccessoriesService.GetAllCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetAllCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetAllCapability).toThrow();
		});

		it('should call GetUDKTypeList', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetUDKTypeList'
			).and.callThrough();
			inputAccessoriesService.GetUDKTypeList();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetUDKTypeList();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetUDKTypeList).toThrow();
		});

		it('should call GetKeyboardVersion', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetKeyboardVersion'
			).and.callThrough();
			inputAccessoriesService.GetKeyboardVersion();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetKeyboardVersion();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetKeyboardVersion).toThrow();
		});

		it('should call GetKBDLayoutName', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetKBDLayoutName'
			).and.callThrough();
			inputAccessoriesService.GetKBDLayoutName();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetKBDLayoutName();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetKBDMachineType).toThrow();
		});

		it('should call GetKBDMachineType', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetKBDMachineType'
			).and.callThrough();
			inputAccessoriesService.GetKBDMachineType();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetKBDMachineType();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetKBDMachineType).toThrow();
		});

		it('should call GetKbdHiddenKeyPrivacyFilterCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetKbdHiddenKeyPrivacyFilterCapability'
			).and.callThrough();
			inputAccessoriesService.GetKbdHiddenKeyPrivacyFilterCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetKbdHiddenKeyPrivacyFilterCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetKbdHiddenKeyPrivacyFilterCapability).toThrow();
		});

		it('should call GetKbdHiddenKeyBackLightCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetKbdHiddenKeyBackLightCapability'
			).and.callThrough();
			inputAccessoriesService.GetKbdHiddenKeyBackLightCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetKbdHiddenKeyBackLightCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetKbdHiddenKeyBackLightCapability).toThrow();
		});

		it('should call GetKbdHiddenKeyMagnifierCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetKbdHiddenKeyMagnifierCapability'
			).and.callThrough();
			inputAccessoriesService.GetKbdHiddenKeyMagnifierCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetKbdHiddenKeyMagnifierCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetKbdHiddenKeyMagnifierCapability).toThrow();
		});

		it('should call GetKbdHiddenKeyPerformanceModeCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetKbdHiddenKeyPerformanceModeCapability'
			).and.callThrough();
			inputAccessoriesService.GetKbdHiddenKeyPerformanceModeCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetKbdHiddenKeyPerformanceModeCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetKbdHiddenKeyPerformanceModeCapability).toThrow();
		});

		it('should call getTopRowFnLockCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetTopRowFnLockCapability'
			).and.callThrough();
			inputAccessoriesService.getTopRowFnLockCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.getTopRowFnLockCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getTopRowFnLockCapability).toThrow();
		});

		it('should call getTopRowFnStickKeyCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetTopRowFnStickKeyCapability'
			).and.callThrough();
			inputAccessoriesService.getTopRowFnStickKeyCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.getTopRowFnStickKeyCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getTopRowFnStickKeyCapability).toThrow();
		});

		it('should call getTopRowPrimaryFunctionCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetTopRowPrimaryFunctionCapability'
			).and.callThrough();
			inputAccessoriesService.getTopRowPrimaryFunctionCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.getTopRowPrimaryFunctionCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getTopRowPrimaryFunctionCapability).toThrow();
		});

		it('should call GetFnLockStatus', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetFnLockStatus'
			).and.callThrough();
			inputAccessoriesService.getFnLockStatus();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.getFnLockStatus();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getFnLockStatus).toThrow();
		});

		it('should call getFnStickKeyStatus', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetFnStickKeyStatus'
			).and.callThrough();
			inputAccessoriesService.getFnStickKeyStatus();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.getFnStickKeyStatus();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getFnStickKeyStatus).toThrow();
		});

		it('should call getPrimaryFunctionStatus', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetPrimaryFunctionStatus'
			).and.callThrough();
			inputAccessoriesService.getPrimaryFunctionStatus();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.getPrimaryFunctionStatus();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getPrimaryFunctionStatus).toThrow();
		});

		it('should call setFnStickKeyStatus', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'SetFnStickKey'
			).and.callThrough();
			inputAccessoriesService.setFnStickKeyStatus(10);
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.setFnStickKeyStatus(10);
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.setFnStickKeyStatus).toThrow();
		});

		it('should call setFnLock', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'SetFnLock'
			).and.callThrough();
			inputAccessoriesService.setFnLock(10);
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.setFnLock(10);
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.setFnLock).toThrow();
		});

		it('should call setPrimaryFunction', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'SetPrimaryFunction'
			).and.callThrough();
			inputAccessoriesService.setPrimaryFunction(10);
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.setPrimaryFunction(10);
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.setPrimaryFunction).toThrow();
		});

		it('should call GetFnCtrlSwapCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetFnCtrlSwapCapability'
			).and.callThrough();
			inputAccessoriesService.GetFnCtrlSwapCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetFnCtrlSwapCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetFnCtrlSwapCapability).toThrow();
		});

		it('should call GetFnCtrlSwapCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetFnCtrlSwapCapability'
			).and.callThrough();
			inputAccessoriesService.GetFnCtrlSwapCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetFnCtrlSwapCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetFnCtrlSwapCapability).toThrow();
		});

		it('should call GetFnCtrlSwap', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetFnCtrlSwap'
			).and.callThrough();
			inputAccessoriesService.GetFnCtrlSwap();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetFnCtrlSwap();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetFnCtrlSwap).toThrow();
		});

		it('should call SetFnCtrlSwap', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'SetFnCtrlSwap'
			).and.callThrough();
			inputAccessoriesService.SetFnCtrlSwap(10);
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.SetFnCtrlSwap(10);
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.SetFnCtrlSwap).toThrow();
		});

		it('should call GetFnAsCtrlCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetFnAsCtrlCapability'
			).and.callThrough();
			inputAccessoriesService.GetFnAsCtrlCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetFnAsCtrlCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetFnAsCtrlCapability).toThrow();
		});

		it('should call GetFnAsCtrl', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'GetFnAsCtrl'
			).and.callThrough();
			inputAccessoriesService.GetFnAsCtrl();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.GetFnAsCtrl();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.GetFnAsCtrl).toThrow();
		});

		it('should call SetFnAsCtrl', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'SetFnCtrlSwap'
			).and.callThrough();
			inputAccessoriesService.SetFnAsCtrl(10);
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboardManager = undefined;
			const returnValue = inputAccessoriesService.SetFnAsCtrl(10);
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.SetFnAsCtrl).toThrow();
		});

		it('should call getMouseCapability', () => {
			const { inputAccessoriesService } = setup();

			const mouseAndTouchPadMock = new MouseAndTouchPadMock();
			(inputAccessoriesService as any).mouseAndTouchPad = mouseAndTouchPadMock;

			const spy = spyOn<any>(mouseAndTouchPadMock, 'GetMouseCapability');
			inputAccessoriesService.getMouseCapability();
			expect(spy).toHaveBeenCalled();

			(inputAccessoriesService as any).mouseAndTouchPad = undefined;
			const returnValue = inputAccessoriesService.getMouseCapability();
			expect(returnValue).toBeTruthy();

			expect(inputAccessoriesService.getMouseCapability).toThrow();
		});

		it('should call getTouchPadCapability', () => {
			const { inputAccessoriesService } = setup();

			const mouseAndTouchPadMock = new MouseAndTouchPadMock();
			(inputAccessoriesService as any).mouseAndTouchPad = mouseAndTouchPadMock;

			const spy = spyOn<any>(mouseAndTouchPadMock, 'GetTouchpadCapability');
			inputAccessoriesService.getTouchPadCapability();
			expect(spy).toHaveBeenCalled();

			(inputAccessoriesService as any).mouseAndTouchPad = undefined;
			const returnValue = inputAccessoriesService.getTouchPadCapability();
			expect(returnValue).toBeTruthy();

			expect(inputAccessoriesService.getTouchPadCapability).toThrow();
		});

		it('should call getVoipHotkeysSettings', () => {
			const { inputAccessoriesService } = setup();

			const voipHotkeysMock = new VoipHotKeys();
			(inputAccessoriesService as any).voipHotkeys = voipHotkeysMock;

			const spy = spyOn(voipHotkeysMock, 'getVOIPHotkeysSettings');
			inputAccessoriesService.getVoipHotkeysSettings();
			expect(spy).toHaveBeenCalled();

			(inputAccessoriesService as any).voipHotkeys = undefined;
			const returnValue = inputAccessoriesService.getVoipHotkeysSettings();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getVoipHotkeysSettings).toThrow();
		});

		it('should call setVoipHotkeysSettings', () => {
			const { inputAccessoriesService } = setup();

			const voipHotkeysMock = new VoipHotKeys();
			(inputAccessoriesService as any).voipHotkeys = voipHotkeysMock;

			const spy = spyOn(voipHotkeysMock, 'setVOIPHotkeysSettings');

			inputAccessoriesService.setVoipHotkeysSettings(1);
			expect(spy).toHaveBeenCalled();

			(inputAccessoriesService as any).voipHotkeys = undefined;
			const returnValue = inputAccessoriesService.setVoipHotkeysSettings(1);
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.setVoipHotkeysSettings).toThrow();
		});

		it('should call getAutoKBDBacklightCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboard,
				'GetAutoKBDBacklightCapability'
			).and.callThrough();
			inputAccessoriesService.getAutoKBDBacklightCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboard = undefined;
			const returnValue = inputAccessoriesService.getAutoKBDBacklightCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getAutoKBDBacklightCapability).toThrow();
		});

		it('should call getKBDBacklightCapability', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboard,
				'GetKBDBacklightCapability'
			).and.callThrough();
			inputAccessoriesService.getKBDBacklightCapability();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboard = undefined;
			const returnValue = inputAccessoriesService.getKBDBacklightCapability();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getKBDBacklightCapability).toThrow();
		});

		it('should call getAutoKBDStatus', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboard,
				'GetAutoKBDStatus'
			).and.callThrough();
			inputAccessoriesService.getAutoKBDStatus();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboard = undefined;
			const returnValue = inputAccessoriesService.getAutoKBDStatus();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getAutoKBDStatus).toThrow();
		});

		it('should call getKBDBacklightStatus', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboard,
				'GetKBDBacklightStatus'
			).and.callThrough();
			inputAccessoriesService.getKBDBacklightStatus();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboard = undefined;
			const returnValue = inputAccessoriesService.getKBDBacklightStatus();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getKBDBacklightStatus).toThrow();
		});

		it('should call getKBDBacklightLevel', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboard,
				'GetKBDBacklightLevel'
			).and.callThrough();
			inputAccessoriesService.getKBDBacklightLevel();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboard = undefined;
			const returnValue = inputAccessoriesService.getKBDBacklightLevel();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.getKBDBacklightLevel).toThrow();
		});

		it('should call setKBDBacklightStatus', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboard,
				'SetKBDBacklightStaus'
			).and.callThrough();
			inputAccessoriesService.setKBDBacklightStatus('1');
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboard = undefined;
			const returnValue = inputAccessoriesService.setKBDBacklightStatus('1');
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.setKBDBacklightStatus).toThrow();
		});

		it('should call setAutomaticKBDBacklight', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboard,
				'SetAutomaticKBDBacklight'
			).and.callThrough();
			inputAccessoriesService.setAutomaticKBDBacklight(true);
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboard = undefined;
			const returnValue = inputAccessoriesService.setAutomaticKBDBacklight(true);
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.setAutomaticKBDBacklight).toThrow();
		});

		it('should call setAutoKBDEnableStatus', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboard,
				'SetAutoKBDEnableStatus'
			).and.callThrough();
			inputAccessoriesService.setAutoKBDEnableStatus();
			expect(spy).toHaveBeenCalled();

			inputAccessoriesService.keyboard = undefined;
			const returnValue = inputAccessoriesService.setAutoKBDEnableStatus();
			expect(returnValue).toBe(undefined);

			expect(inputAccessoriesService.setAutoKBDEnableStatus).toThrow();
		});

		it('should call restartMachine', () => {
			const { inputAccessoriesService } = setup();

			const spy = spyOn(
				inputAccessoriesService.keyboardManager,
				'RestartMachine'
			).and.callThrough();
			inputAccessoriesService.restartMachine();
			expect(spy).toHaveBeenCalled();
			inputAccessoriesService.restartMachine();
		});
	});
});
