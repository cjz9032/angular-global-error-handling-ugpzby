import { TestBed } from '@angular/core/testing';

import { SmartAssistService } from './smart-assist.service';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { VantageShellService } from '../vantage-shell/vantage-shell-mock.service';
import { SmartAssistCapability } from 'src/app/data-models/smart-assist/smart-assist-capability.model';
import { IntelligentScreen } from 'src/app/data-models/smart-assist/intelligent-screen.model';
import { IntelligentSecurity } from 'src/app/data-models/smart-assist/intelligent-security.model';
import { SmartAssistCache } from 'src/app/data-models/smart-assist/smart-assist-cache.model';

describe('SmartAssistService', () => {

	let smartAssistCapability: SmartAssistCapability  = new SmartAssistCapability();
	let smartAssistCache  : SmartAssistCache   = new SmartAssistCache();

	beforeEach(() => TestBed.configureTestingModule({
		providers: [SmartAssistService, TranslateStore, VantageShellService],
		imports: [TranslationModule.forChild()]
	}));

	describe(':', () => {

		function setup() {
			const smartAssistService = TestBed.get(SmartAssistService);
        	const shellService = TestBed.get(VantageShellService);

			return { smartAssistService, shellService };
		}

		it('service should create', ()=> {
			const {smartAssistService, shellService} = setup();	
			expect(smartAssistService).toBeTruthy();
			expect(shellService).toBeTruthy();
		});

		it('getHPDVisibility called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDCapability').and.callThrough();

			smartAssistService.getHPDVisibility();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getHPDStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDGlobalSetting').and.callThrough();

			smartAssistService.getHPDStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setHPDStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'SetHPDGlobalSetting').and.callThrough();

			smartAssistService.setHPDStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setHPDStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLockVisibility called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDLeaveCapability').and.callThrough();

			smartAssistService.getZeroTouchLockVisibility();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLockStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDPresentLeaveSetting').and.callThrough();

			smartAssistService.getZeroTouchLockStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getHPDLeaveSensitivityVisibility called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDLeaveSensitivityVisibility').and.callThrough();

			smartAssistService.getHPDLeaveSensitivityVisibility();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getHPDLeaveSensitivity called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDLeaveSensitivity').and.callThrough();

			smartAssistService.getHPDLeaveSensitivity();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('SetHPDLeaveSensitivitySetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'SetHPDLeaveSensitivitySetting').and.callThrough();

			smartAssistService.SetHPDLeaveSensitivitySetting();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setZeroTouchLockStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'SetHPDPresentLeaveSetting').and.callThrough();

			smartAssistService.setZeroTouchLockStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setZeroTouchLockStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLockFacialRecoStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'getLockFacialRecognitionSettings').and.callThrough();

			smartAssistService.getZeroTouchLockFacialRecoStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setZeroTouchLockFacialRecoStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'setLockFacialRecognitionSettings').and.callThrough();

			smartAssistService.setZeroTouchLockFacialRecoStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setZeroTouchLockFacialRecoStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLoginVisibility called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDApproachCapability').and.callThrough();

			smartAssistService.getZeroTouchLoginVisibility();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLoginStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDApproachSetting').and.callThrough();

			smartAssistService.getZeroTouchLoginStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLoginDistance called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDApproachDistance').and.callThrough();

			smartAssistService.getZeroTouchLoginDistance();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setZeroTouchLoginStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'SetHPDApproachSetting').and.callThrough();

			smartAssistService.setZeroTouchLoginStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setZeroTouchLoginStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLoginAdjustVisibility called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDAutoAdjustCapability').and.callThrough();

			smartAssistService.getZeroTouchLoginAdjustVisibility();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getZeroTouchLoginAdjustStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDAutoAdjustSetting').and.callThrough();

			smartAssistService.getZeroTouchLoginAdjustStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setZeroTouchLoginAdjustStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'SetHPDAutoAdjustSetting').and.callThrough();

			smartAssistService.setZeroTouchLoginAdjustStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setZeroTouchLoginAdjustStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setZeroTouchLoginDistance called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'SetHPDApproachDistanceSetting').and.callThrough();

			smartAssistService.setZeroTouchLoginDistance(1);
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getSelectedLockTimer called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDLeaveWait').and.callThrough();

			smartAssistService.getSelectedLockTimer();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setSelectedLockTimer called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'SetHPDLeaveWaitSetting').and.callThrough();

			smartAssistService.setSelectedLockTimer('2');
			expect(privateSpy).toHaveBeenCalled();
		});

		it('resetHPDSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'HPDSettingReset').and.callThrough();

			smartAssistService.resetHPDSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.resetHPDSetting()).toBeUndefined();

		});

		it('getWindowsHelloStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetFacialFeatureRegistered').and.callThrough();

			smartAssistService.getWindowsHelloStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getWindowsHelloStatus()).toBeUndefined();

		});

		it('getVideoPauseResumeStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentMedia,'getVideoPauseResumeStatus').and.callThrough();

			smartAssistService.getVideoPauseResumeStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getVideoPauseResumeStatus()).toBeUndefined();
		});

		it('setVideoPauseResumeStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentMedia,'setVideoPauseResumeStatus').and.callThrough();

			smartAssistService.setVideoPauseResumeStatus('2');
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.setVideoPauseResumeStatus('2')).toBeUndefined();
		});

		it('getSuperResolutionStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.superResolution,'getSuperResolutionStatus').and.callThrough();

			smartAssistService.getSuperResolutionStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getSuperResolutionStatus()).toBeUndefined();
		});

		it('setSuperResolutionStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.superResolution,'setSuperResolutionStatus').and.callThrough();

			smartAssistService.setSuperResolutionStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.setSuperResolutionStatus()).toBeUndefined();
		});

		it('getIntelligentScreenVisibility called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetSmartSensecapability').and.callThrough();

			smartAssistService.getIntelligentScreenVisibility();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false; 
			expect(smartAssistService.getIntelligentScreenVisibility()).toBeUndefined();
		});

		it('getAutoScreenOffVisibility called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetWalkingCapability').and.callThrough();

			smartAssistService.getAutoScreenOffVisibility();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getAutoScreenOffVisibility()).toBeUndefined();
		});

		it('getAutoScreenOffStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetWalkingSetting').and.callThrough();

			smartAssistService.getAutoScreenOffStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getAutoScreenOffStatus()).toBeUndefined();
		});

		it('setAutoScreenOffStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'SetWalkingMode').and.callThrough();

			smartAssistService.setAutoScreenOffStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setAutoScreenOffStatus(false);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.setAutoScreenOffStatus()).toBeUndefined();
		});

		it('getAutoScreenOffNoteStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetWalkingCautionVisibility').and.callThrough();

			smartAssistService.getAutoScreenOffNoteStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getAutoScreenOffNoteStatus()).toBeUndefined();
		});

		it('getReadingOrBrowsingVisibility called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetBrowsingCapability').and.callThrough();

			smartAssistService.getReadingOrBrowsingVisibility();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getReadingOrBrowsingVisibility()).toBeUndefined();
		});

		it('getReadingOrBrowsingStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetBrowsingSetting').and.callThrough();

			smartAssistService.getReadingOrBrowsingStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getReadingOrBrowsingStatus()).toBeUndefined();
		});

		it('setReadingOrBrowsingStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'setBrowsingMode').and.callThrough();

			smartAssistService.setReadingOrBrowsingStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.setReadingOrBrowsingStatus(false);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.setReadingOrBrowsingStatus()).toBeUndefined();
		});

		it('getReadingOrBrowsingTime called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetBrowsingTime').and.callThrough();

			smartAssistService.getReadingOrBrowsingTime();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getReadingOrBrowsingTime()).toBeUndefined();
		});

		it('setReadingOrBrowsingTime called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'SetBrowsingTime').and.callThrough();

			smartAssistService.setReadingOrBrowsingTime(5);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.setReadingOrBrowsingTime()).toBeUndefined();
		});

		it('getAPSCapability called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getAPSCapability').and.callThrough();

			smartAssistService.getAPSCapability();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getAPSCapability()).toBeUndefined();
		});

		it('getSensorStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getSensorStatus').and.callThrough();

			smartAssistService.getSensorStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getSensorStatus()).toBeUndefined();
		});

		it('getHDDStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getHDDStatus').and.callThrough();

			smartAssistService.getHDDStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getHDDStatus()).toBeUndefined();
		});

		it('getAPSMode called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getAPSMode').and.callThrough();

			smartAssistService.getAPSMode();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getAPSMode()).toBeUndefined();
		});

		it('setAPSMode called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'setAPSMode').and.callThrough();

			smartAssistService.setAPSMode(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setAPSMode()).toBeUndefined();
		});

		it('getAPSSensitivityLevel called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getAPSSensitivityLevel').and.callThrough();

			smartAssistService.getAPSSensitivityLevel();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getAPSSensitivityLevel()).toBeUndefined();
		});

		it('setAPSSensitivityLevel called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'setAPSSensitivityLevel').and.callThrough();

			smartAssistService.setAPSSensitivityLevel(20);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setAPSSensitivityLevel()).toBeUndefined();
		});

		it('getAutoDisableSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getAutoDisableSetting').and.callThrough();

			smartAssistService.getAutoDisableSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getAutoDisableSetting()).toBeUndefined();
		});

		it('setAutoDisableSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'setAutoDisableSetting').and.callThrough();

			smartAssistService.setAutoDisableSetting(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setAutoDisableSetting()).toBeUndefined();
		});

		it('getSnoozeSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getSnoozeSetting').and.callThrough();

			smartAssistService.getSnoozeSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getSnoozeSetting()).toBeUndefined();
		});

		it('setSnoozeSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'setSnoozeSetting').and.callThrough();

			smartAssistService.setSnoozeSetting(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setSnoozeSetting()).toBeUndefined();
		});

		it('getSnoozeTime called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getSnoozeTime').and.callThrough();

			smartAssistService.getSnoozeTime();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getSnoozeTime()).toBeUndefined();
		});

		it('setSnoozeTime called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'setSnoozeTime').and.callThrough();

			smartAssistService.setSnoozeTime('Mocking');
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setSnoozeTime()).toBeUndefined();
		});

		it('sendSnoozeCommand called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'sendSnoozeCommand').and.callThrough();

			smartAssistService.sendSnoozeCommand('Mocking');
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.sendSnoozeCommand()).toBeUndefined();
		});

		it('getPenCapability called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getPenCapability').and.callThrough();

			smartAssistService.getPenCapability();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getPenCapability()).toBeUndefined();
		});

		it('getTouchCapability called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getTouchCapability').and.callThrough();

			smartAssistService.getTouchCapability();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getTouchCapability()).toBeUndefined();
		});

		it('getPSensorCapability called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getPSensorCapability').and.callThrough();

			smartAssistService.getPSensorCapability();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getPSensorCapability()).toBeUndefined();
		});

		it('getPenSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getPenSetting').and.callThrough();

			smartAssistService.getPenSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getPenSetting()).toBeUndefined();
		});

		it('getPenDelayTime called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getPenDelayTime').and.callThrough();

			smartAssistService.getPenDelayTime();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getPenDelayTime()).toBeUndefined();
		});

		it('getTouchInputSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getTouchInputSetting').and.callThrough();

			smartAssistService.getTouchInputSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getTouchInputSetting()).toBeUndefined();
		});

		it('getPSensorSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'getPSensorSetting').and.callThrough();

			smartAssistService.getPSensorSetting();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.getPSensorSetting()).toBeUndefined();
		});

		it('setPenSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'setPenSetting').and.callThrough();

			smartAssistService.setPenSetting(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setPenSetting()).toBeUndefined();
		});

		it('setPenDelayTime called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'setPenDelayTime').and.callThrough();

			smartAssistService.setPenDelayTime(25);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setPenDelayTime()).toBeUndefined();
		});

		it('setTouchInputSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'setTouchInputSetting').and.callThrough();

			smartAssistService.setTouchInputSetting(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setTouchInputSetting()).toBeUndefined();
		});

		it('setPSensorSetting called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.activeProtectionSystem,'setPSensorSetting').and.callThrough();

			smartAssistService.setPSensorSetting(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isAPSavailable = false;
			expect(smartAssistService.setPSensorSetting()).toBeUndefined();
		});

		it('isLenovoVoiceAvailable called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.lenovoVoice,'getCapability').and.callThrough();

			smartAssistService.isLenovoVoiceAvailable();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.lenovoVoice = false;
			expect(smartAssistService.isLenovoVoiceAvailable()).toBeUndefined();
		});

		it('isLenovoVoiceInstalled called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.lenovoVoice,'getInstallStatus').and.callThrough();

			smartAssistService.isLenovoVoiceInstalled();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.lenovoVoice = false;
			expect(smartAssistService.isLenovoVoiceInstalled()).toBeUndefined();
		});

		it('downloadLenovoVoice called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.lenovoVoice,'downloadAndInstallVoiceApp').and.callThrough();

			smartAssistService.downloadLenovoVoice();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.lenovoVoice = false;
			expect(smartAssistService.downloadLenovoVoice()).toBeUndefined();
		});

		it('launchLenovoVoice called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.lenovoVoice,'launchVoiceApp').and.callThrough();

			smartAssistService.launchLenovoVoice();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.lenovoVoice = false;
			expect(smartAssistService.launchLenovoVoice()).toBeUndefined();
		});

		it('getHPDSensorType called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetHPDSensorType').and.callThrough();

			smartAssistService.getHPDSensorType();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			expect(smartAssistService.getHPDSensorType()).toBeUndefined();
		});

		//when shellService.getActiveProtectionSystem() is false
		it('isAPSavailable = false', ()=> {
			const {shellService} = setup();	
			const privateSpy = spyOn<any>(shellService,'getActiveProtectionSystem').and.returnValue(false);

			let smartAssistServiceTemp = new SmartAssistService(shellService);
			expect(smartAssistServiceTemp.isAPSavailable).toBe(false);
		});

		//Testing exceptions on service
		it('Testing exception getVideoPauseResumeStatus', (() => {
			const {shellService} = setup();	
			const privateSpy = spyOn<any>(shellService,'getIntelligentMedia').and.returnValue(new Error("caught exception"));
			const privateSpy1 = spyOn<any>(shellService,'getSuperResolution').and.returnValue(new Error("caught exception"));

			let smartAssistServiceTemp = new SmartAssistService(shellService);
			let excp = function () {
				smartAssistServiceTemp.getVideoPauseResumeStatus();
			};
			expect(excp).toThrowError(Error);

			excp = function () {
				smartAssistServiceTemp.setVideoPauseResumeStatus(false);
			};
			expect(excp).toThrowError(Error);

			excp = function () {
				smartAssistServiceTemp.getSuperResolutionStatus();
			};
			expect(excp).toThrowError(Error);

			excp = function () {
				smartAssistServiceTemp.setSuperResolutionStatus(false);
			};
			expect(excp).toThrowError(Error);

		}));

	});
});
