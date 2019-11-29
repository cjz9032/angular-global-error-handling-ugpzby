import { TestBed } from '@angular/core/testing';

import { SmartAssistService } from './smart-assist.service';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { VantageShellService } from '../vantage-shell/vantage-shell-mock.service';
import { async } from 'q';

describe('SmartAssistService', () => {

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
			smartAssistService.resetHPDSetting();
			expect(privateSpy).toHaveBeenCalled();

		});

		it('getWindowsHelloStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentSensing,'GetFacialFeatureRegistered').and.callThrough();

			smartAssistService.getWindowsHelloStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			smartAssistService.getWindowsHelloStatus();
			expect(privateSpy).toHaveBeenCalled();

		});

		it('getVideoPauseResumeStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentMedia,'getVideoPauseResumeStatus').and.callThrough();

			smartAssistService.getVideoPauseResumeStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			smartAssistService.getVideoPauseResumeStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setVideoPauseResumeStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.intelligentMedia,'setVideoPauseResumeStatus').and.callThrough();

			smartAssistService.setVideoPauseResumeStatus('2');
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			smartAssistService.setVideoPauseResumeStatus('2');
			expect(privateSpy).toHaveBeenCalled();
		});

		it('getSuperResolutionStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.superResolution,'getSuperResolutionStatus').and.callThrough();

			smartAssistService.getSuperResolutionStatus();
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			smartAssistService.getSuperResolutionStatus();
			expect(privateSpy).toHaveBeenCalled();
		});

		it('setSuperResolutionStatus called', ()=> {
			const {smartAssistService, shellService} = setup();	
			const privateSpy = spyOn<any>(smartAssistService.superResolution,'setSuperResolutionStatus').and.callThrough();

			smartAssistService.setSuperResolutionStatus(true);
			expect(privateSpy).toHaveBeenCalled();

			smartAssistService.isShellAvailable = false;
			smartAssistService.setSuperResolutionStatus(false);
			expect(privateSpy).toHaveBeenCalled();
		});


		//Testing exceptions
		// it('Testing exception', (() => {
		// 	const {smartAssistService, shellService} = setup();	
		// 	const privateSpy = spyOn<any>(smartAssistService.intelligentMedia,'getVideoPauseResumeStatus').and.returnValue(Promise.resolve(new TypeError("caught exception")));

		// 	let excp = function () {
		// 		smartAssistService.getVideoPauseResumeStatus();
		// 		smartAssistService.intelligentMedia.getVideoPauseResumeStatus();
		// 		throw new TypeError("caught exception");
		// 	};
		// 	expect(excp).toThrowError(TypeError);
		// }));



	});
});
