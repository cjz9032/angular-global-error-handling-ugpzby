import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, Component } from '@angular/core';
import { PageSmartAssistComponent } from './page-smart-assist.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceService } from 'src/app/services/device/device.service';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { CommonService } from 'src/app/services/common/common.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { DisplayColorTempComponent } from '../../display/display-color-temp/display-color-temp.component';
import { Router, NavigationExtras } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DisplayService } from 'src/app/services/display/display.service'
import { DevService } from 'src/app/services/dev/dev.service';
import { CommsService } from 'src/app/services/comms/comms.service';
import { IntelligentSecurity } from 'src/app/data-models/smart-assist/intelligent-security.model';
import { SmartAssistCache } from 'src/app/data-models/smart-assist/smart-assist-cache.model';
import { HsaIntelligentSecurityResponse } from 'src/app/data-models/smart-assist/hsa-intelligent-security.model/hsa-intelligent-security.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { IntelligentScreen } from 'src/app/data-models/smart-assist/intelligent-screen.model';
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
	function setup() {
		const fixture = TestBed.createComponent(PageSmartAssistComponent);
		const component = fixture.componentInstance;
		smartAssistService = fixture.debugElement.injector.get(SmartAssistService);
		return { fixture, component, commonService, logger, smartAssistService };
	}
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

	beforeEach(() => {
		fixture = TestBed.createComponent(
			PageSmartAssistComponent
		);
		component = fixture.componentInstance;
		deviceService = TestBed.get(DeviceService);
		commonService = TestBed.get(CommonService);
		vantageShellService = TestBed.get(VantageShellService);
		logger = TestBed.get(LoggerService);
		smartAssistService = TestBed.get(SmartAssistService);

	});

	it('should create', () => {
		component.intelligentScreen = new IntelligentScreen();
		component.intelligentScreen.isIntelligentScreenVisible = true;
		fixture.detectChanges();
		component.superResolution = new FeatureStatus(false, true);
		const isSuperResolutionSupported: FeatureStatus = {
			available: false,
			status: true,
			permission: true,
			isLoading: false
		};
		commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCapability, isSuperResolutionSupported);
		component.superResolution = { ...isSuperResolutionSupported };
		expect(component).toBeTruthy();
	});

	it('getSuperResolutionStatus', () => {
		smartAssistService = TestBed.get(SmartAssistService);
		component.intelligentSecurity = new IntelligentSecurity();
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
		component.getSuperResolutionStatus();
		expect(smartAssistService.getSuperResolutionStatus).toHaveBeenCalled();
	});

	it("updateSensingHeaderMenu", () => {
		component.intelligentSecurity = new IntelligentSecurity();
		commonService = TestBed.get(CommonService);
		component.updateSensingHeaderMenu(true);
	});

	it("updateSensingHeaderMenu", () => {
		component.intelligentSecurity = new IntelligentSecurity();
		commonService = TestBed.get(CommonService);
		component.updateSensingHeaderMenu(false);
	});

	it('getHPDAdvancedSetting', () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isHPDShellAvailable = true;

		const res = {
			zeroTouchLoginAdvanced: false,
			zeroTouchLockAdvanced: false
		}

		const spy = spyOn(
			smartAssistService,
			'getHPDAdvancedSetting'
		).and.returnValue(Promise.resolve(res));

		component.getHPDAdvancedSetting();
		expect(smartAssistService.getHPDAdvancedSetting).toHaveBeenCalled();
	});


	it('setHPDAdvancedSetting', () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isHPDShellAvailable = true;

		const spy = spyOn(
			smartAssistService,
			'setHPDAdvancedSetting'
		).and.returnValue(Promise.resolve(true));

		component.setHPDAdvancedSetting('zeroTouchLogin');
		expect(smartAssistService.setHPDAdvancedSetting).toHaveBeenCalled();
	});

	it('getHsaIntelligentSecurityStatus', () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isHPDShellAvailable = true;
		component.isRegisterHPDRpcCallback = false;

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

		component.getHsaIntelligentSecurityStatus();
		expect(smartAssistService.getHsaIntelligentSecurityStatus).toHaveBeenCalled();
	});

	it('onZeroTouchLockDistanceSensitivityAdjustToggle', () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isHPDShellAvailable = true;

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

	it('SetZeroTouchLockDistanceSensitivity', () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isHPDShellAvailable = true;

		const spy = spyOn(
			smartAssistService,
			'setZeroTouchLockDistanceSensitivity'
		).and.returnValue(Promise.resolve(1));

		component.SetZeroTouchLockDistanceSensitivity(1);
		expect(smartAssistService.setZeroTouchLockDistanceSensitivity).toHaveBeenCalled();
	});

	it('startMonitorHsaIntelligentSecurityStatus', () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isHPDShellAvailable = true;

		const spy = spyOn(
			smartAssistService,
			'startMonitorHsaIntelligentSecurityStatus'
		).and.returnValue(Promise.resolve(true));

		component.startMonitorHsaIntelligentSecurityStatus();
		expect(smartAssistService.startMonitorHsaIntelligentSecurityStatus).toHaveBeenCalled();
	});

	it('hsaIntelligentSecurityChange', () => {
		const jsonData = '{"capacity": true, "capability": 2047, "sensorType": 1, "presenceLeaveDistanceAutoAdjust": false, "presenceLeaveDistance": 1, "errorCode": 0 }';
		component.hsaIntelligentSecurity = new HsaIntelligentSecurityResponse(false, false);
		component.hsaIntelligentSecurityChange(jsonData);
		expect(component.hsaIntelligentSecurity.capability).not.toEqual(0);
	});

	it('should call onZeroTouchLockFacialRecoChange', () => {
		component.intelligentSecurity = new IntelligentSecurity();
		// component.smartAssistCache = new SmartAssistCache();
		const spy = spyOn(smartAssistService, 'setZeroTouchLockFacialRecoStatus').and.returnValue(Promise.resolve(true));
		component.onZeroTouchLockFacialRecoChange(true);
		expect(spy).toHaveBeenCalled();
	});
	it('#onResetDefaultSettings should call', () => {
		const { fixture, component, smartAssistService } = setup();
		const spy = spyOn(smartAssistService, 'resetHSAHPDSetting').and.returnValue(Promise.resolve(1));
		fixture.detectChanges();
		component.onResetDefaultSettings(true);
	});
});
