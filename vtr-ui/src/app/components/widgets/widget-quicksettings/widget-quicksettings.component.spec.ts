import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WidgetQuicksettingsComponent } from './widget-quicksettings.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DisplayService } from 'src/app/services/hwsettings/hwsettings.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { PowerService } from 'src/app/services/power/power.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

const featureStatus: FeatureStatus = {
	available: true,
	status: true,
	permission: true,
	isLoading: true,
};

describe('WidgetQuicksettingsComponent', () => {
	const routerMock = { params: of({ id: 1 }) };

	beforeEach(waitForAsync(() => {
		environment.isLoggingEnabled = false;
		TestBed.configureTestingModule({
			declarations: [WidgetQuicksettingsComponent],
			imports: [
				HttpClientModule,
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient],
					},
					isolate: false,
				}),
				TranslationModule.forChild(),
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
					},
				},
				RouterTestingModule,
				{ provide: ActivatedRoute, useValue: routerMock },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	}));

	describe(':', () => {
		const setup = () => {
			const fixture = TestBed.createComponent(WidgetQuicksettingsComponent);
			const component = fixture.componentInstance;
			const displayService = fixture.debugElement.injector.get(DisplayService);
			const dashboardService = fixture.debugElement.injector.get(DashboardService);
			const commonService = fixture.debugElement.injector.get(CommonService);
			const logger = fixture.debugElement.injector.get(LoggerService);
			return { fixture, component, commonService, logger, displayService, dashboardService };
		};

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

		it('#startMonitorForCameraPrivacy should call', () => {
			const { fixture, component, displayService } = setup();
			spyOn(displayService, 'startCameraPrivacyMonitor');
			fixture.detectChanges();
			component.startMonitorForCameraPrivacy();
			expect(displayService.startCameraPrivacyMonitor).toHaveBeenCalled();
		});

		it('#updateMicrophoneStatus should call', () => {
			const { fixture, component, dashboardService } = setup();
			spyOn(dashboardService, 'getMicrophoneStatus').and.returnValue(
				Promise.resolve(featureStatus)
			);
			const myPrivateSpy = spyOn<any>(component, 'updateMicrophoneStatus').and.callThrough();
			// fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(dashboardService.getMicrophoneStatus).toHaveBeenCalled();
		});

		it('#getMicrophoneStatus should call', () => {
			const { fixture, component, dashboardService } = setup();
			spyOn(dashboardService, 'getMicrophoneStatus').and.returnValue(
				Promise.resolve(featureStatus)
			);
			const myPrivateSpy = spyOn<any>(component, 'getMicrophoneStatus').and.callThrough();
			// fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(dashboardService.getMicrophoneStatus).toHaveBeenCalled();
		});

		it('#getCameraPrivacyStatus should call', () => {
			const { fixture, component, dashboardService } = setup();
			spyOn(dashboardService, 'getCameraStatus').and.returnValue(
				Promise.resolve(featureStatus)
			);
			const myPrivateSpy = spyOn<any>(component, 'getCameraPrivacyStatus').and.callThrough();
			// fixture.detectChanges();
			myPrivateSpy.call(component);
			expect(dashboardService.getCameraStatus).toHaveBeenCalled();
		});
	});

	describe('class', () => {
		describe('Given Vantage does not have access to the Microphone', () => {
			let fixture: ComponentFixture<WidgetQuicksettingsComponent>;
			let component: WidgetQuicksettingsComponent;

			beforeEach(() => {
				fixture = TestBed.createComponent(WidgetQuicksettingsComponent);
				component = fixture.componentInstance;
				component.microphoneStatus = {
					available: false,
					status: false,
					permission: false,
					isLoading: false
				};
			});

			it('When call showMicrophonePermissionNote, then should show the microphone permission note', () => {
				component.microphoneStatus.available = true;
				const showMicrophonePermissionNote = component.showMicrophonePermissionNote();
				expect(showMicrophonePermissionNote).toBeTruthy();
			});

			it('When call showMicrophonePermissionNote and microphne is not available, then should not show the microphone permission note', () => {
				component.microphoneStatus.available = false;
				const showMicrophonePermissionNote = component.showMicrophonePermissionNote();
				expect(showMicrophonePermissionNote).toBeFalsy();
			});
		});

		describe('Given Vantage does not have access to the Camera', () => {
			let fixture: ComponentFixture<WidgetQuicksettingsComponent>;
			let component: WidgetQuicksettingsComponent;

			beforeEach(() => {
				fixture = TestBed.createComponent(WidgetQuicksettingsComponent);
				component = fixture.componentInstance;
				component.cameraPrivacyGreyOut = false;
				component.cameraStatus = {
					available: false,
					status: false,
					permission: false,
					isLoading: false
				};
			});

			it('When call showCameraPrivacyPermissionNote, then should show the camera privacy permission note', () => {
				component.cameraStatus.available = true;
				const showMicrophonePermissionNote = component.showCameraPrivacyPermissionNote();
				expect(showMicrophonePermissionNote).toBeTruthy();
			});

			it('When call showCameraPrivacyPermissionNote and camera is not available, then should show the camera privacy permission note', () => {
				component.cameraStatus.available = false;
				const showMicrophonePermissionNote = component.showCameraPrivacyPermissionNote();
				expect(showMicrophonePermissionNote).toBeTruthy();
			});

			it('When call showCameraPrivacyPermissionNote and camera greyout is true, then should not show the camera privacy permission note', () => {
				component.cameraPrivacyGreyOut = true;
				const showMicrophonePermissionNote = component.showCameraPrivacyPermissionNote();
				expect(showMicrophonePermissionNote).toBeFalsy();
			});
		});
	});
});
