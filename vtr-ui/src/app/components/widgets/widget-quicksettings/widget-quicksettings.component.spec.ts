import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetQuicksettingsComponent } from './widget-quicksettings.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DisplayService } from 'src/app/services/display/display.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { PowerService } from 'src/app/services/power/power.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
const featureStatus: FeatureStatus = {
	available: true,
	status: true,
	permission: true,
	isLoading: true
};

describe('WidgetQuicksettingsComponent', () => {
	let component: WidgetQuicksettingsComponent;
	let fixture: ComponentFixture<WidgetQuicksettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetQuicksettingsComponent],
			imports: [HttpClientModule, TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				},
				isolate: false
			}),
				TranslationModule.forChild()
			],
			providers: [
				DashboardService,
				CommonService,
				DisplayService,
				DeviceService,
				LoggerService,
				VantageShellService,
				PowerService,
				DevService,
				{
					provide: Router,
					useClass: class {
						navigate = jasmine.createSpy('navigate');
					}
				},
				RouterTestingModule
			],
			schemas: [NO_ERRORS_SCHEMA],
		})
			.compileComponents();
	}));
	describe(':', () => {
		let displayService: DisplayService;
		let commonService: CommonService;
		let logger: LoggerService;
		let dashboardService: DashboardService;
		function setup() {
			const s = TestBed.createComponent(WidgetQuicksettingsComponent);
			const component = fixture.componentInstance;
			displayService = fixture.debugElement.injector.get(DisplayService);
			dashboardService = fixture.debugElement.injector.get(DashboardService);
			return { fixture, component, commonService, logger, displayService, dashboardService };
		}

		beforeEach(() => {
			fixture = TestBed.createComponent(WidgetQuicksettingsComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});
		it('#stopMonitorForCamera should call', () => {
			const { fixture, component, displayService } = setup();
			spyOn(displayService, 'stopCameraPrivacyMonitor');
			fixture.detectChanges();
			component.stopMonitorForCamera();
			expect(displayService.stopCameraPrivacyMonitor).toHaveBeenCalled();

		});
		it('#onMicrophoneStatusToggle should call', () => {
			const { fixture, component, dashboardService } = setup();
			spyOn(dashboardService, 'setMicrophoneStatus');
			fixture.detectChanges();
			component.onMicrophoneStatusToggle(true);
			expect(dashboardService.setMicrophoneStatus).toHaveBeenCalled();

		});
		it('#onCameraStatusToggle should call', () => {
			const { fixture, component, dashboardService } = setup();
			spyOn(dashboardService, 'setCameraStatus');
			fixture.detectChanges();
			component.onCameraStatusToggle(true);
			expect(dashboardService.setCameraStatus).toHaveBeenCalled();

		});

		it('#getCameraPermission should call', () => {
			const { fixture, component, displayService } = setup();
			spyOn(displayService, 'getCameraSettingsInfo');
			fixture.detectChanges();
			component.getCameraPermission();
			expect(displayService.getCameraSettingsInfo).toHaveBeenCalled();

		});
		it('#startMonitorForCameraPrivacy should call', () => {
			const { fixture, component, displayService } = setup();
			spyOn(displayService, 'startCameraPrivacyMonitor');
			fixture.detectChanges();
			component.startMonitorForCameraPrivacy();
			expect(displayService.startCameraPrivacyMonitor).toHaveBeenCalled();

		});
		it('#updateMicrophoneStatus should call', () => {
			const { fixture, component, dashboardService } = setup();
			spyOn(dashboardService, 'getMicrophoneStatus').and.returnValue(Promise.resolve(featureStatus));
			const myPrivateSpy = spyOn<any>(component, 'updateMicrophoneStatus').and.callThrough();
			// fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(dashboardService.getMicrophoneStatus).toHaveBeenCalled();

		});
		it('#getMicrophoneStatus should call', () => {
			const { fixture, component, dashboardService } = setup();
			spyOn(dashboardService, 'getMicrophoneStatus').and.returnValue(Promise.resolve(featureStatus));
			const myPrivateSpy = spyOn<any>(component, 'getMicrophoneStatus').and.callThrough();
			// fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(dashboardService.getMicrophoneStatus).toHaveBeenCalled();

		});
		it('#getCameraPrivacyStatus should call', () => {
			const { fixture, component, dashboardService } = setup();
			spyOn(dashboardService, 'getCameraStatus').and.returnValue(Promise.resolve(featureStatus));
			const myPrivateSpy = spyOn<any>(component, 'getCameraPrivacyStatus').and.callThrough();
			// fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(dashboardService.getCameraStatus).toHaveBeenCalled();

		});
		it('#defaultAudioCaptureDeviceChanged should call', () => {
			const { fixture, component, dashboardService } = setup();
			const myPrivateSpy = spyOn<any>(component, 'defaultAudioCaptureDeviceChanged').and.callThrough();
			const myPrivateSpy1 = spyOn<any>(component, 'updateMicrophoneStatus').and.callThrough();
			myPrivateSpy.call(component);
			myPrivateSpy1.call(component);

		});
		it('#startMonitorHandlerForCamera should call', () => {
			const { fixture, component, displayService } = setup();
			fixture.detectChanges();
			component.startMonitorHandlerForCamera(featureStatus);

		});
	});
});
