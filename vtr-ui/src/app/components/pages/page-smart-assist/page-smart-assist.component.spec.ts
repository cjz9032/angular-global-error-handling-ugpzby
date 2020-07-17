import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationExtras } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { HsaIntelligentSecurityResponse } from 'src/app/data-models/smart-assist/hsa-intelligent-security.model/hsa-intelligent-security.model';
import { IntelligentScreen } from 'src/app/data-models/smart-assist/intelligent-screen.model';
import { IntelligentSecurity } from 'src/app/data-models/smart-assist/intelligent-security.model';
import { SmartAssistCache } from 'src/app/data-models/smart-assist/smart-assist-cache.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { CommsService } from 'src/app/services/comms/comms.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DisplayService } from 'src/app/services/display/display.service';
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
	readingOrBrowsingTime: 0
};

describe('Component: PageSmartAssistComponent', () => {
	let component: PageSmartAssistComponent;
	let fixture: ComponentFixture<PageSmartAssistComponent>;
	let deviceService: DeviceService;
	let smartAssistService: SmartAssistService;
	let logger: LoggerService;
	let commonService: CommonService;
	let vantageShellService: VantageShellService;
	let navigationExtras: NavigationExtras;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageSmartAssistComponent],
			imports: [
				HttpClientTestingModule,
				TranslateModule.forRoot(),
				RouterTestingModule
			],
			providers: [
				CommonService,
				LoggerService,
				RouteHandlerService,
				DisplayService,
				DevService,
				CommsService,
				IntelligentSecurity
			]
		}).compileComponents();
	}));


	/* beforeEach(() => {
		fixture = TestBed.createComponent(
			PageSmartAssistComponent
		);
		component = fixture.componentInstance;
		deviceService = TestBed.get(DeviceService);
		commonService = TestBed.get(CommonService);
		vantageShellService = TestBed.get(VantageShellService);
		logger = TestBed.get(LoggerService);
		smartAssistService = TestBed.get(SmartAssistService);
		component.intelligentSecurity = new IntelligentSecurity();
		component.intelligentSecurity.isIntelligentSecuritySupported = true;
		fixture.detectChanges();

}); */
	describe(':', () => {
		function setup() {
			const fixture = TestBed.createComponent(PageSmartAssistComponent);
			const component = fixture.componentInstance;
			smartAssistService = fixture.debugElement.injector.get(SmartAssistService);
			deviceService = fixture.debugElement.injector.get(DeviceService);
			commonService = fixture.debugElement.injector.get(CommonService);
			vantageShellService = fixture.debugElement.injector.get(VantageShellService);
			logger = fixture.debugElement.injector.get(LoggerService);
			//smartAssistService = fixture.debugElement.injector.get(SmartAssistService);
			return { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger };
		}

		it('PageSmartAssistComponent :: should create', () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			component.intelligentScreen = intelligentScreen;
			component.intelligentScreen.isIntelligentScreenVisible = true;
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;

			component.superResolution = new FeatureStatus(false, true);
			const isSuperResolutionSupported: FeatureStatus = {
				available: false,
				status: true,
				permission: true,
				isLoading: false
			};
			commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCapability, isSuperResolutionSupported);
			component.superResolution = { ...isSuperResolutionSupported };
			fixture.detectChanges();
			expect(component).toBeTruthy();
		});

		it('PageSmartAssistComponent :: should create with no cache SmartAssistCache', () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			component.smartAssistCache = undefined;
			spyOn(commonService, 'getLocalStorageValue').and.returnValue(undefined);
			// spyOnProperty(component, 'smartAssistCache', 'set').and.returnValue(undefined);
			component.intelligentScreen = intelligentScreen;
			component.intelligentScreen.isIntelligentScreenVisible = true;
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;

			component.superResolution = new FeatureStatus(false, true);
			const isSuperResolutionSupported: FeatureStatus = {
				available: false,
				status: true,
				permission: true,
				isLoading: false
			};
			fixture.detectChanges();
			// commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCapability, isSuperResolutionSupported);
			const spyObject = spyOn(commonService, 'setLocalStorageValue');
			component.ngOnInit();
			expect(spyObject).toHaveBeenCalled();
		});


		it("PageSmartAssistComponent :: updateSensingHeaderMenu", () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			commonService = TestBed.get(CommonService);
			fixture.detectChanges();
			component.updateSensingHeaderMenu(true);
		});

		it("PageSmartAssistComponent :: updateSensingHeaderMenu", () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			commonService = TestBed.get(CommonService);
			fixture.detectChanges();
			component.updateSensingHeaderMenu(false);
		});

		it('PageSmartAssistComponent :: getSuperResolutionStatus', () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			smartAssistService = TestBed.get(SmartAssistService);
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			smartAssistService.isShellAvailable = true;
			component.smartAssistCache = new SmartAssistCache();
			const res: FeatureStatus = {
				available: true,
				status: true,
				permission: true,
				isLoading: true
			}
			const spy = spyOn(
				smartAssistService,
				'getSuperResolutionStatus'
			).and.returnValue(Promise.resolve(res));
			fixture.detectChanges();
			component.getSuperResolutionStatus();
			expect(smartAssistService.getSuperResolutionStatus).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: setHPDAdvancedSetting', () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			fixture.detectChanges();
			smartAssistService = TestBed.get(SmartAssistService);
			smartAssistService.isHPDShellAvailable = true;
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			component.hsaIntelligentSecurity = new HsaIntelligentSecurityResponse(false, false);
			const spy = spyOn(
				smartAssistService,
				'setHPDAdvancedSetting'
			).and.returnValue(Promise.resolve(true));

			component.setHPDAdvancedSetting('zeroTouchLogin');
			expect(smartAssistService.setHPDAdvancedSetting).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: getHsaIntelligentSecurityStatus', () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			fixture.detectChanges();
			smartAssistService = TestBed.get(SmartAssistService);
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
			}

			const spy = spyOn(
				smartAssistService,
				'getHsaIntelligentSecurityStatus'
			).and.returnValue(Promise.resolve(res));

			const spy2 = spyOn(
				smartAssistService,
				'registerHPDRpcCallback'
			).and.returnValue(Promise.resolve(1));
			fixture.detectChanges();
			component.getHsaIntelligentSecurityStatus();
			expect(smartAssistService.getHsaIntelligentSecurityStatus).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: onZeroTouchLockDistanceSensitivityAdjustToggle', () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			smartAssistService = TestBed.get(SmartAssistService);
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
			}

			component.onZeroTouchLockDistanceSensitivityAdjustToggle(para);
			expect(smartAssistService.setZeroTouchLockDistanceSensitivityAutoAdjust).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: SetZeroTouchLockDistanceSensitivity', () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			smartAssistService = TestBed.get(SmartAssistService);
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
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			smartAssistService = TestBed.get(SmartAssistService);
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
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();
			const jsonData = '{"capacity": true, "capability": 2047, "sensorType": 1, "presenceLeaveDistanceAutoAdjust": false, "presenceLeaveDistance": 1, "errorCode": 0 }';

			component.hsaIntelligentSecurity = new HsaIntelligentSecurityResponse(false, false);
			component.hsaIntelligentSecurityChange(jsonData);
			expect(component.hsaIntelligentSecurity.capability).not.toEqual(0);
		});

		it('PageSmartAssistComponent :: onDisplayDimTimeChange', () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			component.intelligentScreen = new IntelligentScreen();

			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();

			component.onDisplayDimTimeChange(10);
			expect(component.intelligentScreen.readingOrBrowsingTime).toEqual(10);
		});

		it('PageSmartAssistComponent :: should call onZeroTouchLockFacialRecoChange', () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();

			// component.smartAssistCache = new SmartAssistCache();
			const spy = spyOn(smartAssistService, 'setZeroTouchLockFacialRecoStatus').and.returnValue(Promise.resolve(true));
			component.onZeroTouchLockFacialRecoChange(true);
			expect(spy).toHaveBeenCalled();
		});

		it('PageSmartAssistComponent :: onResetDefaultSettings should call', () => {
			let { fixture, component, smartAssistService, deviceService, commonService, vantageShellService, logger } = setup();
			component.intelligentSecurity = new IntelligentSecurity();
			component.intelligentSecurity.isIntelligentSecuritySupported = true;
			fixture.detectChanges();
			const spy = spyOn(smartAssistService, 'resetHSAHPDSetting').and.returnValue(Promise.resolve(1));
			fixture.detectChanges();
			component.onResetDefaultSettings(true);
		});
		/*
				*/
	});

});
