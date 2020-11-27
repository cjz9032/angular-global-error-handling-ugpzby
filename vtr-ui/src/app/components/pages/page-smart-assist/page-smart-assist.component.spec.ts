import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AntiTheftResponse } from 'src/app/data-models/antiTheft/antiTheft.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { HsaIntelligentSecurityResponse } from 'src/app/data-models/smart-assist/hsa-intelligent-security.model/hsa-intelligent-security.model';
import { IntelligentScreen } from 'src/app/data-models/smart-assist/intelligent-screen.model';
import { IntelligentSecurity } from 'src/app/data-models/smart-assist/intelligent-security.model';
import { SmartAssistCache } from 'src/app/data-models/smart-assist/smart-assist-cache.model';
import { SmartAssistCapability } from 'src/app/data-models/smart-assist/smart-assist-capability.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { CommsService } from 'src/app/services/comms/comms.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DisplayService } from 'src/app/services/display/display.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { PageSmartAssistComponent } from './page-smart-assist.component';
const intelligentScreen: IntelligentScreen = {
	isIntelligentScreenVisible: false,
	isAutoScreenOffVisible: false,
	isAutoScreenOffEnabled: false,
	isAutoScreenOffNoteVisible: false,
	isReadingOrBrowsingVisible: false,
	isReadingOrBrowsingEnabled: false,
	readingOrBrowsingTime: 0,
};

const antiTheftResponse: AntiTheftResponse = {
	available: true,
	status: true,
	isSupportPhoto: true,
	cameraPrivacyState: true,
	authorizedAccessState: true,
	photoAddress: '',
	alarmOften: 10,
	photoNumber: 5,
};

describe('Component: PageSmartAssistComponent', () => {
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PageSmartAssistComponent],
			imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
			providers: [
				CommonService,
				LoggerService,
				RouteHandlerService,
				DisplayService,
				DevService,
				CommsService,
				IntelligentSecurity,
			],
		}).compileComponents();
	}));

	/* beforeEach(() => {
		fixture = TestBed.createComponent(
			PageSmartAssistComponent
		);
		component = fixture.componentInstance;
		deviceService = TestBed.inject(DeviceService);
		commonService = TestBed.inject(CommonService);
		vantageShellService = TestBed.inject(VantageShellService);
		logger = TestBed.inject(LoggerService);
		smartAssistService = TestBed.inject(SmartAssistService);
		component.intelligentSecurity = new IntelligentSecurity();
		component.intelligentSecurity.isIntelligentSecuritySupported = true;
		fixture.detectChanges();

}); */
	describe(':', () => {
		function setup() {
			const fixture = TestBed.createComponent(PageSmartAssistComponent);
			const component = fixture.componentInstance;
			const smartAssistService = fixture.debugElement.injector.get(SmartAssistService);
			const deviceService = fixture.debugElement.injector.get(DeviceService);
			const commonService = fixture.debugElement.injector.get(CommonService);
			const localCacheService = fixture.debugElement.injector.get(LocalCacheService);
			const vantageShellService = fixture.debugElement.injector.get(VantageShellService);
			const logger = fixture.debugElement.injector.get(LoggerService);
			// smartAssistService = fixture.debugElement.injector.get(SmartAssistService);
			return {
				fixture,
				component,
				smartAssistService,
				deviceService,
				commonService,
				vantageShellService,
				logger,
				localCacheService,
			};
		}

		it('PageSmartAssistComponent :: should create', () => {
			const { fixture, component, localCacheService } = setup();
			component.intelligentScreen = intelligentScreen;
			component.intelligentScreen.isIntelligentScreenVisible = true;
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;

			component.superResolution = new FeatureStatus(false, true);
			const isSuperResolutionSupported = new FeatureStatus(false, true);
			localCacheService.setLocalCacheValue(
				LocalStorageKey.SmartAssistCapability,
				isSuperResolutionSupported
			);
			component.superResolution = { ...isSuperResolutionSupported };
			fixture.detectChanges();
			expect(component).toBeTruthy();
		});

		it('PageSmartAssistComponent :: should create SmartAssistCapability isIntelligentSecuritySupported ', () => {
			const { fixture, component, localCacheService } = setup();

			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			const smartAssistCapability = new SmartAssistCapability();
			smartAssistCapability.isIntelligentSecuritySupported = true;
			localCacheService.setLocalCacheValue(
				LocalStorageKey.SmartAssistCapability,
				smartAssistCapability
			);
			fixture.detectChanges();
			// const spyObject = spyOn(component, 'initZeroTouchLogin');
			const spyObject = spyOn<any>(component, 'initZeroTouchLogin');
			component.ngOnInit();
			expect(spyObject).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should create SmartAssistCapability isLenovoVoiceSupported ', () => {
			const { fixture, component, localCacheService } = setup();

			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			const smartAssistCapability = new SmartAssistCapability();
			smartAssistCapability.isLenovoVoiceSupported = true;
			localCacheService.setLocalCacheValue(
				LocalStorageKey.SmartAssistCapability,
				smartAssistCapability
			);
			fixture.detectChanges();
			const spyObject = spyOn<any>(component, 'checkHeaderMenuItems');
			component.ngOnInit();
			expect(spyObject).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should create SmartAssistCapability isIntelligentMediaSupported.available  ', () => {
			const { fixture, component, localCacheService } = setup();

			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			const smartAssistCapability = new SmartAssistCapability();
			const isIntelligentMediaSupported = new FeatureStatus(true, true);
			smartAssistCapability.isIntelligentMediaSupported = isIntelligentMediaSupported;
			localCacheService.setLocalCacheValue(
				LocalStorageKey.SmartAssistCapability,
				smartAssistCapability
			);
			fixture.detectChanges();
			const spyObject = spyOn<any>(component, 'checkHeaderMenuItems');
			component.ngOnInit();
			expect(spyObject).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should create SmartAssistCapability isIntelligentScreenSupported  ', () => {
			const { fixture, component, localCacheService } = setup();
			const smartAssistCapability = new SmartAssistCapability();
			smartAssistCapability.isIntelligentScreenSupported = true;
			localCacheService.setLocalCacheValue(
				LocalStorageKey.SmartAssistCapability,
				smartAssistCapability
			);
			fixture.detectChanges();
			const spyObject = spyOn<any>(component, 'checkHeaderMenuItems');
			component.ngOnInit();
			expect(spyObject).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should create SmartAssistCapability isAPSSupported  ', () => {
			const { fixture, component, localCacheService } = setup();
			const smartAssistCapability = new SmartAssistCapability();

			smartAssistCapability.isAPSSupported = true;
			localCacheService.setLocalCacheValue(
				LocalStorageKey.SmartAssistCapability,
				smartAssistCapability
			);
			fixture.detectChanges();
			const spyObject = spyOn<any>(component, 'checkHeaderMenuItems');
			component.ngOnInit();
			expect(spyObject).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should create SmartAssistCapability isAntiTheftSupported  ', () => {
			const { fixture, component, localCacheService } = setup();

			const smartAssistCapability = new SmartAssistCapability();
			// const isIntelligentScreenSupported = new FeatureStatus(true, true);

			smartAssistCapability.isAntiTheftSupported = antiTheftResponse;
			localCacheService.setLocalCacheValue(
				LocalStorageKey.SmartAssistCapability,
				smartAssistCapability
			);
			fixture.detectChanges();
			// const spyObject = spyOn(component, 'initZeroTouchLogin');
			const spyObject = spyOn<any>(component, 'checkHeaderMenuItems');
			component.ngOnInit();
			expect(spyObject).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should create with no cache SmartAssistCache', () => {
			const { fixture, component, localCacheService } = setup();
			component.smartAssistCache = undefined;
			spyOn(localCacheService, 'getLocalCacheValue').and.returnValue(undefined);
			component.intelligentScreen = intelligentScreen;
			component.intelligentScreen.isIntelligentScreenVisible = true;
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;

			component.superResolution = new FeatureStatus(false, true);

			fixture.detectChanges();

			const spyObject = spyOn(localCacheService, 'setLocalCacheValue');
			component.ngOnInit();
			expect(spyObject).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: updateSensingHeaderMenu', () => {
			const { fixture, component } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			// commonService = TestBed.inject(CommonService);
			fixture.detectChanges();
			component.updateSensingHeaderMenu(true);
		});

		it('PageSmartAssistComponent :: updateSensingHeaderMenu', () => {
			const { fixture, component } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			// commonService = TestBed.inject(CommonService);
			fixture.detectChanges();
			component.updateSensingHeaderMenu(false);
		});

		it('PageSmartAssistComponent :: getSuperResolutionStatus', () => {
			const { fixture, component, smartAssistService } = setup();
			// smartAssistService = TestBed.inject(SmartAssistService);
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			smartAssistService.isShellAvailable = true;
			component.smartAssistCache = new SmartAssistCache();
			const res = new FeatureStatus(true, true);
			const spy = spyOn(smartAssistService, 'getSuperResolutionStatus').and.returnValue(
				Promise.resolve(res)
			);
			fixture.detectChanges();
			component.getSuperResolutionStatus();
			expect(smartAssistService.getSuperResolutionStatus).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: setHPDAdvancedSetting', () => {
			const { fixture, component, smartAssistService } = setup();
			fixture.detectChanges();
			// smartAssistService = TestBed.inject(SmartAssistService);
			smartAssistService.isHPDShellAvailable = true;
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			component.hsaIntelligentSecurity = new HsaIntelligentSecurityResponse(false, false);
			const spy = spyOn(smartAssistService, 'setHPDAdvancedSetting').and.returnValue(
				Promise.resolve(true)
			);

			component.setHPDAdvancedSetting('zeroTouchLogin');
			expect(smartAssistService.setHPDAdvancedSetting).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: getHsaIntelligentSecurityStatus', () => {
			const { fixture, component, smartAssistService } = setup();
			fixture.detectChanges();
			// smartAssistService = TestBed.inject(SmartAssistService);
			smartAssistService.isHPDShellAvailable = true;
			component.isRegisterHPDRpcCallback = false;
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			const res: HsaIntelligentSecurityResponse = {
				capacity: true,
				zeroTouchLockDistanceAutoAdjust: true,
				zeroTouchLockDistance: 1,
				capability: 2047,
				sensorType: 1,
				videoAutoPauseResumeVersion: 0,
			};

			const spy = spyOn(
				smartAssistService,
				'getHsaIntelligentSecurityStatus'
			).and.returnValue(Promise.resolve(res));

			const spy2 = spyOn(smartAssistService, 'registerHPDRpcCallback').and.returnValue(
				Promise.resolve(1)
			);
			fixture.detectChanges();
			component.getHsaIntelligentSecurityStatus();
			expect(smartAssistService.getHsaIntelligentSecurityStatus).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: onZeroTouchLockDistanceSensitivityAdjustToggle', () => {
			const { fixture, component, smartAssistService } = setup();
			// smartAssistService = TestBed.inject(SmartAssistService);
			fixture.detectChanges();
			smartAssistService.isHPDShellAvailable = true;

			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;

			component.hsaIntelligentSecurity = new HsaIntelligentSecurityResponse(false, false);
			component.hsaIntelligentSecurity.zeroTouchLockDistanceAutoAdjust = true;

			const spy = spyOn(
				smartAssistService,
				'setZeroTouchLockDistanceSensitivityAutoAdjust'
			).and.returnValue(Promise.resolve(0));

			const para = {
				switchValue: false,
			};

			component.onZeroTouchLockDistanceSensitivityAdjustToggle(para);
			expect(
				smartAssistService.setZeroTouchLockDistanceSensitivityAutoAdjust
			).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: SetZeroTouchLockDistanceSensitivity', () => {
			const { fixture, component, smartAssistService } = setup();
			// smartAssistService = TestBed.inject(SmartAssistService);
			fixture.detectChanges();
			smartAssistService.isHPDShellAvailable = true;
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			const spy = spyOn(
				smartAssistService,
				'setZeroTouchLockDistanceSensitivity'
			).and.returnValue(Promise.resolve(1));

			component.SetZeroTouchLockDistanceSensitivity(1);
			expect(smartAssistService.setZeroTouchLockDistanceSensitivity).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: startMonitorHsaIntelligentSecurityStatus', () => {
			const { fixture, component, smartAssistService } = setup();
			// smartAssistService = TestBed.inject(SmartAssistService);
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();

			smartAssistService.isHPDShellAvailable = true;

			const spy = spyOn(
				smartAssistService,
				'startMonitorHsaIntelligentSecurityStatus'
			).and.returnValue(Promise.resolve(true));

			component.startMonitorHsaIntelligentSecurityStatus();
			expect(smartAssistService.startMonitorHsaIntelligentSecurityStatus).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: hsaIntelligentSecurityChange', () => {
			const { fixture, component } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();
			const jsonData =
				'{"capacity": true, "capability": 2047, "sensorType": 1, "presenceLeaveDistanceAutoAdjust": false, "presenceLeaveDistance": 1, "errorCode": 0 }';

			component.hsaIntelligentSecurity = new HsaIntelligentSecurityResponse(false, false);
			component.hsaIntelligentSecurityChange(jsonData);
			expect(component.hsaIntelligentSecurity.capability).not.toEqual(0);
		});

		it('PageSmartAssistComponent :: onDisplayDimTimeChange', () => {
			const { fixture, component } = setup();
			component.intelligentScreen = new IntelligentScreen();

			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();

			component.onDisplayDimTimeChange(10);
			expect(component.intelligentScreen.readingOrBrowsingTime).toEqual(10);
		});

		it('PageSmartAssistComponent :: setHPDLeaveSensitivitySetting', () => {
			const { fixture, component, smartAssistService } = setup();
			component.intelligentScreen = new IntelligentScreen();

			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();
			const spyObj = spyOn(
				smartAssistService,
				'SetHPDLeaveSensitivitySetting'
			).and.returnValue(Promise.resolve(true));
			component.setHPDLeaveSensitivitySetting(10);
			expect(spyObj).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should call onHumanPresenceDetectStatusToggle', () => {
			const { fixture, component, smartAssistService } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();

			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(smartAssistService, 'setHPDStatus').and.returnValue(
				Promise.resolve(true)
			);
			component.onHumanPresenceDetectStatusToggle({ switchValue: true });
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should call onZeroTouchLoginStatusToggle', () => {
			const { fixture, component, smartAssistService } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();

			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(smartAssistService, 'setZeroTouchLoginStatus').and.returnValue(
				Promise.resolve(true)
			);
			component.onZeroTouchLoginStatusToggle({ switchValue: true });
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should call setZeroTouchLoginSensitivity', () => {
			const { fixture, component, smartAssistService } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();
			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(smartAssistService, 'setZeroTouchLoginDistance').and.returnValue(
				Promise.resolve(true)
			);
			component.setZeroTouchLoginSensitivity(10);
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should call onZeroTouchLockStatusToggle', () => {
			const { fixture, component, smartAssistService } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();
			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(smartAssistService, 'setZeroTouchLockStatus').and.returnValue(
				Promise.resolve(true)
			);
			component.onZeroTouchLockStatusToggle({ switchValue: true });
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should call onZeroTouchLockTimerChange', () => {
			const { fixture, component, smartAssistService } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();

			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(smartAssistService, 'setSelectedLockTimer').and.returnValue(
				Promise.resolve(true)
			);
			component.onZeroTouchLockTimerChange({ switchValue: true });
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should call onZeroTouchLockFacialRecoChange', () => {
			const { fixture, component, smartAssistService } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();

			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(
				smartAssistService,
				'setZeroTouchLockFacialRecoStatus'
			).and.returnValue(Promise.resolve(true));
			component.onZeroTouchLockFacialRecoChange(true);
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should call onDistanceSensitivityAdjustToggle', () => {
			const { fixture, component, smartAssistService } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();

			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(smartAssistService, 'setZeroTouchLoginAdjustStatus').and.returnValue(
				Promise.resolve(true)
			);
			component.onDistanceSensitivityAdjustToggle({ switchValue: true });
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should call onAutoScreenOffToggle', () => {
			const { fixture, component, smartAssistService } = setup();
			component.intelligentScreen = new IntelligentScreen();
			component.intelligentScreen.isIntelligentScreenVisible = true;
			fixture.detectChanges();

			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(smartAssistService, 'setAutoScreenOffStatus').and.returnValue(
				Promise.resolve(true)
			);
			component.onAutoScreenOffToggle({ switchValue: true });
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should call onKeepMyDisplayToggle', () => {
			const { fixture, component, smartAssistService } = setup();
			component.intelligentScreen = new IntelligentScreen();
			component.intelligentScreen.isIntelligentScreenVisible = true;
			fixture.detectChanges();

			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(smartAssistService, 'setReadingOrBrowsingStatus').and.returnValue(
				Promise.resolve(true)
			);
			component.onKeepMyDisplayToggle({ switchValue: true });
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: should call ngOnDestroy isRegisterHPDRpcCallback is true', () => {
			const { fixture, component, smartAssistService, logger } = setup();
			component.isRegisterHPDRpcCallback = true;
			fixture.detectChanges();
			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(smartAssistService, 'unRegisterHPDRpcCallback').and.returnValue(
				Promise.resolve(true)
			);
			const spyLogger = spyOn(logger, 'info');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
			/* expect(spy).toHaveBeenCalledBefore(spyLogger);
			expect(spyLogger).toHaveBeenCalled(); */
		});

		it('PageSmartAssistComponent :: oonResetDefaultSettings should call', () => {
			const { fixture, component, smartAssistService } = setup();
			const spy = spyOn(smartAssistService, 'resetHSAHPDSetting').and.returnValue(
				Promise.resolve(1)
			);
			fixture.detectChanges();
			component.onResetDefaultSettings(true);
		});

		it('PageSmartAssistComponent :: onClick should call', () => {
			const { fixture, component, deviceService } = setup();
			const location = 'ms-settings:privacy-webcam';
			/* let win = window.open(location);
			let windowOpenSpy = spyOn(window, 'open');
			// let returnValue = { foo: 'bar' };
			let urlCreateObjectSpy = spyOn(URL, 'createObjectURL').and.returnValue(location); */
			const spyLaunchURI = spyOn(deviceService, 'launchUri').and.callFake(() => {});

			fixture.detectChanges();
			component.onClick(location);
			// expect(urlCreateObjectSpy).toHaveBeenCalledWith('foo');
			// expect(windowOpenSpy).toHaveBeenCalledWith(location);
		});

		it('PageSmartAssistComponent :: launchFaceEnrollment should call', () => {
			const { fixture, component, deviceService } = setup();
			const location = 'ms-settings:privacy-webcam';
			const spyLaunchURI = spyOn(deviceService, 'launchUri').and.callFake(() => {});

			fixture.detectChanges();
			component.launchFaceEnrollment();
		});

		it('PageSmartAssistComponent :: onJumpClick should call', () => {
			const { fixture, component, smartAssistService } = setup();
			const spy = spyOn(smartAssistService, 'resetHSAHPDSetting').and.returnValue(
				Promise.resolve(1)
			);
			fixture.detectChanges();
			component.onJumpClick();
		});

		it('PageSmartAssistComponent :: onVisibilityChanged should call', () => {
			const { fixture, component, smartAssistService } = setup();
			const spy = spyOn(smartAssistService, 'resetHSAHPDSetting').and.returnValue(
				Promise.resolve(1)
			);
			fixture.detectChanges();
			component.onVisibilityChanged();
		});

		it('PageSmartAssistComponent :: onMouseEnterEvent should call', () => {
			const { fixture, component, smartAssistService } = setup();
			const spy = spyOn(component, 'getFacialRecognitionStatus');
			fixture.detectChanges();
			component.onMouseEnterEvent();
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: permissionChanged should call', () => {
			const { fixture, component, smartAssistService } = setup();
			const spy = spyOn(component, 'getFacialRecognitionStatus');
			fixture.detectChanges();
			component.permissionChanged();
			expect(spy).toHaveBeenCalled();
		});
	});
});
