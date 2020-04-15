import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, Component } from '@angular/core';
import { PageSmartAssistComponent } from './page-smart-assist.component';
import { RouterTestingModule } from "@angular/router/testing";
import { DeviceService } from "src/app/services/device/device.service";
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
import { AntiTheftResponse } from 'src/app/data-models/antiTheft/antiTheft.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';


describe('Component: PageSmartAssistComponent', () => {
	let component: PageSmartAssistComponent;
	let fixture: ComponentFixture<PageSmartAssistComponent>;
	let deviceService: DeviceService;
	let smartAssistService: SmartAssistService;
	let logger: LoggerService;
	let commonService: CommonService;
	let vantageShellService: VantageShellService;
	let navigationExtras : NavigationExtras;
	 beforeEach(async(() => {
		        TestBed.configureTestingModule({
		            declarations: [PageSmartAssistComponent],
		            imports: [
		                HttpClientTestingModule,
		                TranslateModule.forRoot(),
		                RouterTestingModule
		            ],
		            providers: [
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
		fixture.detectChanges()
		expect(component).toBeDefined()
	});

	it("getHPDAdvancedSetting", () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isShellAvailable = true;

		const res = {
			zeroTouchLoginAdvanced: false,
			zeroTouchLockAdvanced: false
		}

		const spy = spyOn(
			smartAssistService, 
			"getHPDAdvancedSetting"
		).and.returnValue(Promise.resolve(res));

		component.getHPDAdvancedSetting();
		expect(smartAssistService.getHPDAdvancedSetting).toHaveBeenCalled();
	});

	it("getSuperResolutionStatus", () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isShellAvailable = true;
		const res: FeatureStatus = {
			available: true, 
			status: true,
			 permission:true,
		     isLoading:true
		}
		const spy = spyOn(
			smartAssistService, 
			"getSuperResolutionStatus"
		).and.returnValue(Promise.resolve(res));
		component.getSuperResolutionStatus();
		expect(smartAssistService.getSuperResolutionStatus).toHaveBeenCalled();
	});

	it("getAntiTheftStatus", () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isShellAvailable = true;
		const res: AntiTheftResponse = {
			available: true, 
			status: true,
			isSupportPhoto:true,
			cameraPrivacyState:true,
			authorizedAccessState:true,
			photoAddress:"",
			alarmOften:  0, 
			photoNumber:  0,
		}
		const spy = spyOn(
			smartAssistService, 
			"getAntiTheftStatus"
		).and.returnValue(Promise.resolve(res));

		component.getAntiTheftStatus();
		expect(smartAssistService.getAntiTheftStatus).toHaveBeenCalled();
	});


	it("setHPDAdvancedSetting", () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isShellAvailable = true;

		const spy = spyOn(
			smartAssistService, 
			"setHPDAdvancedSetting"
		).and.returnValue(Promise.resolve(true));

		component.setHPDAdvancedSetting('zeroTouchLogin', true);
		expect(smartAssistService.setHPDAdvancedSetting).toHaveBeenCalled();
	});

	it("getHsaIntelligentSecurityStatus", () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isShellAvailable = true;

		const res: HsaIntelligentSecurityResponse = {
			capacity: true,
			zeroTouchLockDistanceAutoAdjust: true,
			zeroTouchLockDistance: 1,
			capability: 2047,
			sensorType: 1,
		}

		const spy = spyOn(
			smartAssistService, 
			"getHsaIntelligentSecurityStatus"
		).and.returnValue(Promise.resolve(res));

		component.getHsaIntelligentSecurityStatus();
		expect(smartAssistService.getHsaIntelligentSecurityStatus).toHaveBeenCalled();
	});

	it("onZeroTouchLockDistanceSensitivityAdjustToggle", () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isShellAvailable = true;

		component.hsaIntelligentSecurity = new HsaIntelligentSecurityResponse(false, false);
		component.hsaIntelligentSecurity.zeroTouchLockDistanceAutoAdjust = true;

		const spy = spyOn(
			smartAssistService, 
			"setZeroTouchLockDistanceSensitivityAutoAdjust"
		).and.returnValue(Promise.resolve(0));

		const para = {
			switchValue: false,
		}

		component.onZeroTouchLockDistanceSensitivityAdjustToggle(para);
		expect(smartAssistService.setZeroTouchLockDistanceSensitivityAutoAdjust).toHaveBeenCalled();
	});

	it("SetZeroTouchLockDistanceSensitivity", () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isShellAvailable = true;

		const spy = spyOn(
			smartAssistService, 
			"setZeroTouchLockDistanceSensitivity"
		).and.returnValue(Promise.resolve(1));

		const para = {
			switchValue: false,
		}

		component.SetZeroTouchLockDistanceSensitivity(para);
		expect(smartAssistService.setZeroTouchLockDistanceSensitivity).toHaveBeenCalled();
	});

	it("SetZeroTouchLockDistanceSensitivity", () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isShellAvailable = true;

		const spy = spyOn(
			smartAssistService, 
			"setZeroTouchLockDistanceSensitivity"
		).and.returnValue(Promise.resolve(1));

		const para = {
			switchValue: false,
		}

		component.SetZeroTouchLockDistanceSensitivity(para);
		expect(smartAssistService.setZeroTouchLockDistanceSensitivity).toHaveBeenCalled();
	});

	it("startMonitorHsaIntelligentSecurityStatus", () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isShellAvailable = true;

		const spy = spyOn(
			smartAssistService, 
			"startMonitorHsaIntelligentSecurityStatus"
		).and.returnValue(Promise.resolve(true));

		component.startMonitorHsaIntelligentSecurityStatus();
		expect(smartAssistService.startMonitorHsaIntelligentSecurityStatus).toHaveBeenCalled();
	});

	it("hsaIntelligentSecurityChange", () => {
		const jsonData = {
			capacity: true,
			capability: 2047,
			sensorType: 1,
			presenceLeaveDistanceAutoAdjust: false,
			presenceLeaveDistance: 2
		}

		const spy = spyOn<any>(
			component, 
			"hsaIntelligentSecurityChange"
		);

		component.hsaIntelligentSecurityChange(jsonData);
		expect(spy).toHaveBeenCalled();
	});

	it("onResetDefaultSettings", () => {
		smartAssistService = TestBed.get(SmartAssistService);
		smartAssistService.isShellAvailable = true;

		const spy = spyOn(
			smartAssistService, 
			"resetHSAHPDSetting"
		).and.returnValue(Promise.resolve(0));

		const spy2 = spyOn(
			smartAssistService, 
			"resetHPDSetting"
		).and.returnValue(Promise.resolve(true));
		
		component.intelligentSecurity = new IntelligentSecurity();
		component.intelligentSecurity.isZeroTouchLockFacialRecoVisible = true;
		const spy3 = spyOn(
			smartAssistService, 
			"resetFacialRecognitionStatus"
		).and.returnValue(Promise.resolve(true));

		component.onResetDefaultSettings(0);
		expect(smartAssistService.resetHSAHPDSetting).toHaveBeenCalled();
		expect(smartAssistService.resetHPDSetting).toHaveBeenCalled();
		expect(smartAssistService.resetFacialRecognitionStatus).toHaveBeenCalled();
	});
	
	it('should call onZeroTouchLockFacialRecoChange', () => {
		component.intelligentSecurity = new IntelligentSecurity();
		// component.smartAssistCache = new SmartAssistCache();
		let spy = spyOn(smartAssistService, 'setZeroTouchLockFacialRecoStatus').and.returnValue(Promise.resolve(true));
		component.onZeroTouchLockFacialRecoChange(true);
		expect(spy).toHaveBeenCalled();
	});

	it('should call getFacialRecognitionStatus', () => {
		component.intelligentSecurity = new IntelligentSecurity();
		
		let spy = spyOn(smartAssistService, 'getZeroTouchLockFacialRecoStatus').and.returnValue(Promise.resolve(true));
		component.getFacialRecognitionStatus();
		expect(spy).toHaveBeenCalled();
	});

	it('should call onVisibilityChanged', () => {		
		let spy = spyOn<any>(component, 'getFacialRecognitionStatus');
		component.onVisibilityChanged();
		expect(spy).toHaveBeenCalled();
	});

	it('should call onMouseEnterEvent', () => {
		let spy = spyOn<any>(component, 'getFacialRecognitionStatus');
		component.onMouseEnterEvent();
		expect(spy).toHaveBeenCalled();
	});

	it('should call permissionChanged', () => {
		let spy = spyOn<any>(component, 'getFacialRecognitionStatus');
		component.permissionChanged();
		expect(spy).toHaveBeenCalled();
	});

});
