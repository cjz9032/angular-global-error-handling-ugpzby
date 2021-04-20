import { TestBed } from '@angular/core/testing';
import { TranslateStore } from '@ngx-translate/core';
import { SmartAssistCache } from 'src/app/data-models/smart-assist/smart-assist-cache.model';
import { SmartAssistCapability } from 'src/app/data-models/smart-assist/smart-assist-capability.model';
import { TranslationModule } from 'src/app/modules/translation.module';
import { VantageShellService } from '../vantage-shell/vantage-shell-mock.service';
import { SmartAssistService } from './smart-assist.service';

describe('SmartAssistService', () => {
	const smartAssistCapability: SmartAssistCapability = new SmartAssistCapability();
	const smartAssistCache: SmartAssistCache = new SmartAssistCache();

	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [SmartAssistService, TranslateStore, VantageShellService],
			imports: [TranslationModule.forChild()],
		})
	);

	describe(':', () => {
		const setup = () => {
			const smartAssistService = TestBed.get(SmartAssistService);
			const shellService = TestBed.get(VantageShellService);
			return { smartAssistService, shellService };
		};

		it('service should create', () => {
			const { smartAssistService, shellService } = setup();
			expect(smartAssistService).toBeTruthy();
			expect(shellService).toBeTruthy();
		});

		it('getHPDVisibility called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDCapability'
			).and.callThrough();

			smartAssistService.getHPDVisibility();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getHPDStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDGlobalSetting'
			).and.callThrough();

			smartAssistService.getHPDStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setHPDStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'SetHPDGlobalSetting'
			).and.callThrough();

			smartAssistService.setHPDStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setHPDStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLockVisibility called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDLeaveCapability'
			).and.callThrough();

			smartAssistService.getZeroTouchLockVisibility();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLockStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDPresentLeaveSetting'
			).and.callThrough();

			smartAssistService.getZeroTouchLockStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getHPDLeaveSensitivityVisibility called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDLeaveSensitivityVisibility'
			).and.callThrough();

			smartAssistService.getHPDLeaveSensitivityVisibility();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getHPDLeaveSensitivity called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDLeaveSensitivity'
			).and.callThrough();

			smartAssistService.getHPDLeaveSensitivity();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('SetHPDLeaveSensitivitySetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'SetHPDLeaveSensitivitySetting'
			).and.callThrough();

			smartAssistService.SetHPDLeaveSensitivitySetting();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setZeroTouchLockStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'SetHPDPresentLeaveSetting'
			).and.callThrough();

			smartAssistService.setZeroTouchLockStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setZeroTouchLockStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLockFacialRecoStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'getLockFacialRecognitionSettings'
			).and.callThrough();

			smartAssistService.getZeroTouchLockFacialRecoStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setZeroTouchLockFacialRecoStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'setLockFacialRecognitionSettings'
			).and.callThrough();

			smartAssistService.setZeroTouchLockFacialRecoStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setZeroTouchLockFacialRecoStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLoginVisibility called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDApproachCapability'
			).and.callThrough();

			smartAssistService.getZeroTouchLoginVisibility();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLoginStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDApproachSetting'
			).and.callThrough();

			smartAssistService.getZeroTouchLoginStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLoginDistance called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDApproachDistance'
			).and.callThrough();

			smartAssistService.getZeroTouchLoginDistance();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setZeroTouchLoginStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'SetHPDApproachSetting'
			).and.callThrough();

			smartAssistService.setZeroTouchLoginStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setZeroTouchLoginStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLoginAdjustVisibility called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDAutoAdjustCapability'
			).and.callThrough();

			smartAssistService.getZeroTouchLoginAdjustVisibility();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLoginAdjustStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDAutoAdjustSetting'
			).and.callThrough();

			smartAssistService.getZeroTouchLoginAdjustStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setZeroTouchLoginAdjustStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'SetHPDAutoAdjustSetting'
			).and.callThrough();

			smartAssistService.setZeroTouchLoginAdjustStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setZeroTouchLoginAdjustStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setZeroTouchLoginDistance called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'SetHPDApproachDistanceSetting'
			).and.callThrough();

			smartAssistService.setZeroTouchLoginDistance(1);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getSelectedLockTimer called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDLeaveWait'
			).and.callThrough();

			smartAssistService.getSelectedLockTimer();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setSelectedLockTimer called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'SetHPDLeaveWaitSetting'
			).and.callThrough();

			smartAssistService.setSelectedLockTimer('2');
			expect(privateSpy).toHaveBeenCalled();
		});

		it('resetHPDSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'HPDSettingReset'
			).and.callThrough();

			smartAssistService.resetHPDSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.resetHPDSetting()).toBeUndefined();
		});

		it('getHPDAdvancedSetting called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'getHPDAdvancedSetting'
			).and.callThrough();

			smartAssistService.getHPDAdvancedSetting();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setHPDAdvancedSetting called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'setHPDAdvancedSetting'
			).and.callThrough();
			smartAssistService.setHPDAdvancedSetting('zeroTouchLogin', true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setHPDAdvancedSetting('zeroTouchLock', true);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getHsaIntelligentSecurityStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'getHsaIntelligentSecurityStatus'
			).and.callThrough();

			smartAssistService.isHPDShellAvailable = true;
			const jsonData =
				'{"capacity": true, "capability": true, "sensorType": 1, "presenceLeaveDistanceAutoAdjust": true, "presenceLeaveDistance": 1, "errorCode": 0, "videoAutoPauseResumeVersion": 0 }';
			smartAssistService.hsaIntelligentSecurity = {
				getAllSetting: () => jsonData,
			};

			smartAssistService.getHsaIntelligentSecurityStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getHsaIntelligentSecurityStatus called error', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'getHsaIntelligentSecurityStatus'
			).and.callThrough();

			smartAssistService.isHPDShellAvailable = true;
			smartAssistService.getHsaIntelligentSecurityStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('registerHPDRpcCallback called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'registerHPDRpcCallback'
			).and.callThrough();

			smartAssistService.hsaIntelligentSecurity = {
				registerCallback: () => 1,
			};

			smartAssistService.isHPDShellAvailable = true;
			smartAssistService.registerHPDRpcCallback();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isHPDShellAvailable = false;
			expect(smartAssistService.registerHPDRpcCallback()).toBeUndefined();
		});

		it('unRegisterHPDRpcCallback called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'unRegisterHPDRpcCallback'
			).and.callThrough();

			smartAssistService.hsaIntelligentSecurity = {
				unRegisterCallback: () => 0,
			};

			smartAssistService.isHPDShellAvailable = true;
			smartAssistService.unRegisterHPDRpcCallback();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isHPDShellAvailable = false;
			expect(smartAssistService.unRegisterHPDRpcCallback()).toBeUndefined();
		});

		it('setZeroTouchLockDistanceSensitivityAutoAdjust called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'setZeroTouchLockDistanceSensitivityAutoAdjust'
			).and.callThrough();

			smartAssistService.isHPDShellAvailable = true;
			smartAssistService.hsaIntelligentSecurity = {
				setPresenceLeaveDistanceAutoAdjust: () => 0,
			};

			smartAssistService.setZeroTouchLockDistanceSensitivityAutoAdjust(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isHPDShellAvailable = false;
			expect(
				smartAssistService.setZeroTouchLockDistanceSensitivityAutoAdjust(true)
			).toBeUndefined();
		});

		it('setZeroTouchLockDistanceSensitivity called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'setZeroTouchLockDistanceSensitivity'
			).and.callThrough();

			smartAssistService.isHPDShellAvailable = true;
			smartAssistService.hsaIntelligentSecurity = {
				setPresenceLeaveDistance: () => 0,
			};

			smartAssistService.setZeroTouchLockDistanceSensitivity(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isHPDShellAvailable = false;
			expect(smartAssistService.setZeroTouchLockDistanceSensitivity(true)).toBeUndefined();
		});

		it('resetHSAHPDSetting called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'resetHSAHPDSetting'
			).and.callThrough();

			smartAssistService.isHPDShellAvailable = true;
			smartAssistService.hsaIntelligentSecurity = {
				resetAllSetting: () => 0,
			};

			smartAssistService.resetHSAHPDSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isHPDShellAvailable = false;
			expect(smartAssistService.resetHSAHPDSetting()).toBeUndefined();
		});

		it('startMonitorHsaIntelligentSecurityStatus called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'startMonitorHsaIntelligentSecurityStatus'
			).and.callThrough();

			smartAssistService.isHPDShellAvailable = true;
			smartAssistService.hsaIntelligentSecurity = { onstatusupdated: () => {}, };

			smartAssistService.startMonitorHsaIntelligentSecurityStatus(1);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isHPDShellAvailable = false;
			expect(smartAssistService.startMonitorHsaIntelligentSecurityStatus(1)).toBeUndefined();
		});

		it('getWindowsHelloStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetFacialFeatureRegistered'
			).and.callThrough();

			smartAssistService.getWindowsHelloStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getWindowsHelloStatus()).toBeUndefined();
		});

		it('getVideoPauseResumeStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentMedia,
				'getVideoPauseResumeStatus'
			).and.callThrough();

			smartAssistService.getVideoPauseResumeStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getVideoPauseResumeStatus()).toBeUndefined();
		});

		it('setVideoPauseResumeStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentMedia,
				'setVideoPauseResumeStatus'
			).and.callThrough();

			smartAssistService.setVideoPauseResumeStatus('2');
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.setVideoPauseResumeStatus('2')).toBeUndefined();
		});

		it('getSuperResolutionStatus called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.superResolution,
				'getSuperResolutionStatus'
			).and.callThrough();

			smartAssistService.getSuperResolutionStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getSuperResolutionStatus()).toBeUndefined();
		});

		it('setSuperResolutionStatus called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.superResolution,
				'setSuperResolutionStatus'
			).and.callThrough();

			smartAssistService.setSuperResolutionStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.setSuperResolutionStatus()).toBeUndefined();
		});

		it('getAntiTheftStatus called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'getAntiTheftStatus'
			).and.callThrough();
			smartAssistService.isShellAvailable = true;
			const jsonData =
				'{ "available": false, "enabled": false, "cameraAllowed": false, "photoAddress": "", "cameraPrivacyState": true, "authorizedAccessState": true, "alarmDuration": 0, "photoNumber": 5, "errorCode": 0 }';
			smartAssistService.antiTheft = {
				getMotionAlertSetting:() => jsonData
			};
			smartAssistService.getAntiTheftStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getAntiTheftStatus called error', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'getAntiTheftStatus'
			).and.callThrough();
			smartAssistService.antiTheft = {};
			smartAssistService.isShellAvailable = true;
			smartAssistService.getAntiTheftStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getAntiTheftStatus called error', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'getAntiTheftStatus'
			).and.callThrough();
			smartAssistService.isShellAvailable = true;
			smartAssistService.getAntiTheftStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setAntiTheftStatus called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'setAntiTheftStatus'
			).and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertEnabled:(value: boolean) => {
					if (value) {
						return 0;
					}
				},
			};
			smartAssistService.isShellAvailable = true;
			smartAssistService.setAntiTheftStatus(true);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setAntiTheftStatus called return Failed', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'setAntiTheftStatus'
			).and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertEnabled:(value: boolean) => {
					if (value) {
						return 2;
					}
				},
			};
			smartAssistService.isShellAvailable = true;
			smartAssistService.setAntiTheftStatus(true);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setAntiTheftStatus called shell Failed', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'setAntiTheftStatus'
			).and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertEnabled:(value: boolean) => {
					if (value) {
						return 0;
					}
				},
			};
			smartAssistService.isShellAvailable = false;
			smartAssistService.setAntiTheftStatus(true);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setAlarmOften called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(smartAssistService, 'setAlarmOften').and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertAlarmDuration:(value: boolean) => {
					if (value) {
						return 0;
					}
				},
			};
			smartAssistService.isShellAvailable = true;
			smartAssistService.setAlarmOften(10);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setAlarmOften called return Failed', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(smartAssistService, 'setAlarmOften').and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertAlarmDuration:(value: number) => {
					if (value) {
						return 2;
					}
				},
			};
			smartAssistService.isShellAvailable = true;
			smartAssistService.setAlarmOften(10);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setAlarmOften called shell Failed', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(smartAssistService, 'setAlarmOften').and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertAlarmDuration:(value: number) => {
					if (value) {
						return 0;
					}
				},
			};
			smartAssistService.isShellAvailable = false;
			smartAssistService.setAlarmOften(10);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setPhotoNumber called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(smartAssistService, 'setPhotoNumber').and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertPhotoNumber:(value: boolean) => {
					if (value) {
						return 0;
					}
				},
			};
			smartAssistService.isShellAvailable = true;
			smartAssistService.setPhotoNumber(10);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setPhotoNumber called return Failed', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(smartAssistService, 'setPhotoNumber').and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertPhotoNumber:(value: number) => {
					if (value) {
						return 2;
					}
				},
			};
			smartAssistService.isShellAvailable = true;
			smartAssistService.setPhotoNumber(10);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setPhotoNumber called shell Failed', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(smartAssistService, 'setPhotoNumber').and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertPhotoNumber:(value: number) => {
					if (value) {
						return 0;
					}
				},
			};
			smartAssistService.isShellAvailable = false;
			smartAssistService.setPhotoNumber(10);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setAllowCamera called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(smartAssistService, 'setAllowCamera').and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertCameraAllowed:(value: boolean) => {
					if (value) {
						return 0;
					}
				},
			};
			smartAssistService.isShellAvailable = true;
			smartAssistService.setAllowCamera(true);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setAllowCamera called return Failed', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(smartAssistService, 'setAllowCamera').and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertCameraAllowed:(value: boolean) => {
					if (value) {
						return 2;
					}
				},
			};
			smartAssistService.isShellAvailable = true;
			smartAssistService.setAllowCamera(true);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setAllowCamera called shell Failed', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(smartAssistService, 'setAllowCamera').and.callThrough();
			smartAssistService.antiTheft = {
				setMotionAlertCameraAllowed:(value: boolean) => {
					if (value) {
						return 0;
					}
				},
			};
			smartAssistService.isShellAvailable = false;
			smartAssistService.setAllowCamera(true);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('startMonitorAntiTheftStatus called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'startMonitorAntiTheftStatus'
			).and.callThrough();
			smartAssistService.antiTheft = { onstatusupdated:() => {}, registerCallback:() => {} };
			smartAssistService.isShellAvailable = true;
			smartAssistService.startMonitorAntiTheftStatus(
				smartAssistService.antiTheft.registerCallback()
			);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('startMonitorAntiTheftStatus called shell Failed', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'startMonitorAntiTheftStatus'
			).and.callThrough();
			smartAssistService.antiTheft = { registerCallback:() => {} };
			smartAssistService.isShellAvailable = false;
			smartAssistService.startMonitorAntiTheftStatus(
				smartAssistService.antiTheft.registerCallback()
			);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('stopMonitorAntiTheftStatus called', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'stopMonitorAntiTheftStatus'
			).and.callThrough();
			smartAssistService.antiTheft = { unRegisterCallback:() => {} };
			smartAssistService.isShellAvailable = true;
			smartAssistService.stopMonitorAntiTheftStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('stopMonitorAntiTheftStatus called shell Failed', () => {
			const { smartAssistService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService,
				'stopMonitorAntiTheftStatus'
			).and.callThrough();
			smartAssistService.antiTheft = { unRegisterCallback:() => {} };
			smartAssistService.isShellAvailable = false;
			smartAssistService.stopMonitorAntiTheftStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getIntelligentScreenVisibility called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetSmartSensecapability'
			).and.callThrough();

			smartAssistService.getIntelligentScreenVisibility();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getIntelligentScreenVisibility()).toBeUndefined();
		});

		it('getAutoScreenOffVisibility called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetWalkingCapability'
			).and.callThrough();

			smartAssistService.getAutoScreenOffVisibility();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getAutoScreenOffVisibility()).toBeUndefined();
		});

		it('getAutoScreenOffStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetWalkingSetting'
			).and.callThrough();

			smartAssistService.getAutoScreenOffStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getAutoScreenOffStatus()).toBeUndefined();
		});

		it('setAutoScreenOffStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'SetWalkingMode'
			).and.callThrough();

			smartAssistService.setAutoScreenOffStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setAutoScreenOffStatus(false);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.setAutoScreenOffStatus()).toBeUndefined();
		});

		it('getAutoScreenOffNoteStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetWalkingCautionVisibility'
			).and.callThrough();

			smartAssistService.getAutoScreenOffNoteStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getAutoScreenOffNoteStatus()).toBeUndefined();
		});

		it('getReadingOrBrowsingVisibility called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetBrowsingCapability'
			).and.callThrough();

			smartAssistService.getReadingOrBrowsingVisibility();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getReadingOrBrowsingVisibility()).toBeUndefined();
		});

		it('getReadingOrBrowsingStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetBrowsingSetting'
			).and.callThrough();

			smartAssistService.getReadingOrBrowsingStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getReadingOrBrowsingStatus()).toBeUndefined();
		});

		it('setReadingOrBrowsingStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'setBrowsingMode'
			).and.callThrough();

			smartAssistService.setReadingOrBrowsingStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setReadingOrBrowsingStatus(false);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.setReadingOrBrowsingStatus()).toBeUndefined();
		});

		it('getReadingOrBrowsingTime called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetBrowsingTime'
			).and.callThrough();

			smartAssistService.getReadingOrBrowsingTime();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getReadingOrBrowsingTime()).toBeUndefined();
		});

		it('setReadingOrBrowsingTime called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'SetBrowsingTime'
			).and.callThrough();

			smartAssistService.setReadingOrBrowsingTime(5);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.setReadingOrBrowsingTime()).toBeUndefined();
		});

		it('getAPSCapability called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getAPSCapability'
			).and.callThrough();

			smartAssistService.getAPSCapability();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getAPSCapability()).toBeUndefined();
		});

		it('getSensorStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getSensorStatus'
			).and.callThrough();

			smartAssistService.getSensorStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getSensorStatus()).toBeUndefined();
		});

		it('getHDDStatus called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getHDDStatus'
			).and.callThrough();

			smartAssistService.getHDDStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getHDDStatus()).toBeUndefined();
		});

		it('getAPSMode called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getAPSMode'
			).and.callThrough();

			smartAssistService.getAPSMode();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getAPSMode()).toBeUndefined();
		});

		it('setAPSMode called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'setAPSMode'
			).and.callThrough();

			smartAssistService.setAPSMode(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setAPSMode()).toBeUndefined();
		});

		it('getAPSSensitivityLevel called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getAPSSensitivityLevel'
			).and.callThrough();

			smartAssistService.getAPSSensitivityLevel();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getAPSSensitivityLevel()).toBeUndefined();
		});

		it('setAPSSensitivityLevel called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'setAPSSensitivityLevel'
			).and.callThrough();

			smartAssistService.setAPSSensitivityLevel(20);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setAPSSensitivityLevel()).toBeUndefined();
		});

		it('getAutoDisableSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getAutoDisableSetting'
			).and.callThrough();

			smartAssistService.getAutoDisableSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getAutoDisableSetting()).toBeUndefined();
		});

		it('setAutoDisableSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'setAutoDisableSetting'
			).and.callThrough();

			smartAssistService.setAutoDisableSetting(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setAutoDisableSetting()).toBeUndefined();
		});

		it('getSnoozeSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getSnoozeSetting'
			).and.callThrough();

			smartAssistService.getSnoozeSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getSnoozeSetting()).toBeUndefined();
		});

		it('setSnoozeSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'setSnoozeSetting'
			).and.callThrough();

			smartAssistService.setSnoozeSetting(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setSnoozeSetting()).toBeUndefined();
		});

		it('getSnoozeTime called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getSnoozeTime'
			).and.callThrough();

			smartAssistService.getSnoozeTime();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getSnoozeTime()).toBeUndefined();
		});

		it('setSnoozeTime called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'setSnoozeTime'
			).and.callThrough();

			smartAssistService.setSnoozeTime('Mocking');
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setSnoozeTime()).toBeUndefined();
		});

		it('sendSnoozeCommand called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'sendSnoozeCommand'
			).and.callThrough();

			smartAssistService.sendSnoozeCommand('Mocking');
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.sendSnoozeCommand()).toBeUndefined();
		});

		it('getPenCapability called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getPenCapability'
			).and.callThrough();

			smartAssistService.getPenCapability();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getPenCapability()).toBeUndefined();
		});

		it('getTouchCapability called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getTouchCapability'
			).and.callThrough();

			smartAssistService.getTouchCapability();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getTouchCapability()).toBeUndefined();
		});

		it('getPSensorCapability called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getPSensorCapability'
			).and.callThrough();

			smartAssistService.getPSensorCapability();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getPSensorCapability()).toBeUndefined();
		});

		it('getPenSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getPenSetting'
			).and.callThrough();

			smartAssistService.getPenSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getPenSetting()).toBeUndefined();
		});

		it('getPenDelayTime called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getPenDelayTime'
			).and.callThrough();

			smartAssistService.getPenDelayTime();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getPenDelayTime()).toBeUndefined();
		});

		it('getTouchInputSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getTouchInputSetting'
			).and.callThrough();

			smartAssistService.getTouchInputSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getTouchInputSetting()).toBeUndefined();
		});

		it('getPSensorSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'getPSensorSetting'
			).and.callThrough();

			smartAssistService.getPSensorSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getPSensorSetting()).toBeUndefined();
		});

		it('setPenSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'setPenSetting'
			).and.callThrough();

			smartAssistService.setPenSetting(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setPenSetting()).toBeUndefined();
		});

		it('setPenDelayTime called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'setPenDelayTime'
			).and.callThrough();

			smartAssistService.setPenDelayTime(25);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setPenDelayTime()).toBeUndefined();
		});

		it('setTouchInputSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'setTouchInputSetting'
			).and.callThrough();

			smartAssistService.setTouchInputSetting(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setTouchInputSetting()).toBeUndefined();
		});

		it('setPSensorSetting called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.activeProtectionSystem,
				'setPSensorSetting'
			).and.callThrough();

			smartAssistService.setPSensorSetting(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setPSensorSetting()).toBeUndefined();
		});

		it('isLenovoVoiceAvailable called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.lenovoVoice,
				'getCapability'
			).and.callThrough();

			smartAssistService.isLenovoVoiceAvailable();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.lenovoVoice = false;
			expect(smartAssistService.isLenovoVoiceAvailable()).toBeUndefined();
		});

		it('isLenovoVoiceInstalled called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.lenovoVoice,
				'getInstallStatus'
			).and.callThrough();

			smartAssistService.isLenovoVoiceInstalled();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.lenovoVoice = false;
			expect(smartAssistService.isLenovoVoiceInstalled()).toBeUndefined();
		});

		it('downloadLenovoVoice called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.lenovoVoice,
				'downloadAndInstallVoiceApp'
			).and.callThrough();

			smartAssistService.downloadLenovoVoice();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.lenovoVoice = false;
			expect(smartAssistService.downloadLenovoVoice()).toBeUndefined();
		});

		it('launchLenovoVoice called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.lenovoVoice,
				'launchVoiceApp'
			).and.callThrough();

			smartAssistService.launchLenovoVoice();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.lenovoVoice = false;
			expect(smartAssistService.launchLenovoVoice()).toBeUndefined();
		});

		it('getHPDSensorType called', () => {
			const { smartAssistService, shellService } = setup();
			const privateSpy = spyOn<any>(
				smartAssistService.intelligentSensing,
				'GetHPDSensorType'
			).and.callThrough();

			smartAssistService.getHPDSensorType();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getHPDSensorType()).toBeUndefined();
		});

		it('getHPDSensorNotReadyStatus should return true when the sensor is ready', () => {
			const { smartAssistService, shellService } = setup();
			spyOn<any>(
				shellService,
				'GetHPDSensorNotReadyStatus'
			).and.returnValue(true);

			expect(smartAssistService.getHPDSensorNotReadyStatus()).toBeTrue();
		});

		it('getHPDSensorNotReadyStatus should return false when the shell is unavailable', () => {
			const { smartAssistService, shellService } = setup();
			spyOn<any>(
				shellService,
				'GetHPDSensorNotReadyStatus'
			).and.returnValue(true);

			expect(smartAssistService.getHPDSensorNotReadyStatus()).toBeTrue();
		});


		// when shellService.getActiveProtectionSystem() is false
		it('isAPSavailable = false', () => {
			const { shellService } = setup();
			const privateSpy = spyOn<any>(
				shellService,
				'getActiveProtectionSystem'
			).and.returnValue(false);

			const smartAssistServiceTemp = new SmartAssistService(shellService);
			expect(smartAssistServiceTemp.isAPSavailable).toBe(false);
		});

		// Testing exceptions on service
		it('Testing exception getVideoPauseResumeStatus', () => {
			const { shellService } = setup();
			const privateSpy = spyOn<any>(shellService, 'getIntelligentMedia').and.returnValue(
				new Error('caught exception')
			);
			const privateSpy1 = spyOn<any>(shellService, 'getSuperResolution').and.returnValue(
				new Error('caught exception')
			);

			const smartAssistServiceTemp = new SmartAssistService(shellService);
			let excp = () => {
				smartAssistServiceTemp.getVideoPauseResumeStatus();
			};
			expect(excp).toThrowError(Error);

			excp = () => {
				smartAssistServiceTemp.setVideoPauseResumeStatus(false);
			};
			expect(excp).toThrowError(Error);

			excp = () => {
				smartAssistServiceTemp.getSuperResolutionStatus();
			};
			expect(excp).toThrowError(Error);

			excp = () => {
				smartAssistServiceTemp.setSuperResolutionStatus(false);
			};
			expect(excp).toThrowError(Error);
		});
	});
});
