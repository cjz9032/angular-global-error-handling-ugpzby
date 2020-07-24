import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationExtras, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AntiTheftResponse } from 'src/app/data-models/antiTheft/antiTheft.model';
import { DevService } from 'src/app/services/dev/dev.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DisplayService } from 'src/app/services/display/display.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { AntiTheftComponent } from './anti-theft.component';
const antiTheftResponse: AntiTheftResponse = {
	available: false,
	status: true,
	isSupportPhoto: true,
	cameraPrivacyState: true,
	authorizedAccessState: true,
	photoAddress: '',
	alarmOften: 10,
	photoNumber: 5
};
describe('component: AntiTheftComponent', () => {
	let component: AntiTheftComponent;
	let fixture: ComponentFixture<AntiTheftComponent>;
	let smartAssist: SmartAssistService;
	let logger: LoggerService;
	let router: Router;
	let deviceService: DeviceService;
	// let displayService: DisplayService;
	// let translate: TranslateService;
	let metrics: MetricService;
	// let navigationExtras: NavigationExtras;
	let vantageShellService: VantageShellService;
	let cameraAccessChangedHandler: any;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AntiTheftComponent],
			imports: [
				HttpClientTestingModule,
				TranslateModule.forRoot(),
				RouterTestingModule
			],
			providers: [
				SmartAssistService,
				LoggerService,
				DeviceService,
				DevService,
				RouteHandlerService,
				DisplayService,
				TranslateService,
				MetricService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AntiTheftComponent);
		smartAssist = TestBed.inject(SmartAssistService);
		component = fixture.componentInstance;
		metrics = TestBed.inject(MetricService);
		logger = TestBed.inject(LoggerService);
		vantageShellService = TestBed.inject(VantageShellService);
		smartAssist.windows = vantageShellService.getWindows();
		cameraAccessChangedHandler;
	});

	it('should create', () => {
		fixture.detectChanges();
		component.antiTheft = antiTheftResponse;
		expect(component).toBeTruthy();
	});

	it('antiTheftStatusChange', () => {
		smartAssist = TestBed.inject(SmartAssistService);
		logger = TestBed.inject(LoggerService);
		smartAssist.isShellAvailable = true;
		const date = { available: true, enabled: true, cameraAllowed: true, alarmDuration: 10, photoNumber: 5, photoAddress: ' ', errorCode: 0 };
		component.antiTheftStatusChange(date);
	});

	it('getAntiTheftStatus', () => {
		smartAssist = TestBed.inject(SmartAssistService);
		logger = TestBed.inject(LoggerService);
		smartAssist.isShellAvailable = true;
		/* const antiTheftResponse: AntiTheftResponse = {
			available: false,
			status: true,
			isSupportPhoto: true,
			cameraPrivacyState: true,
			authorizedAccessState: true,
			photoAddress: '',
			alarmOften: 10,
			photoNumber: 5
		}; */
		const spy = spyOn<any>(
			component,
			'getAntiTheftStatus'
		).and.returnValue(Promise.resolve(antiTheftResponse));
		component.antiTheft = { ...antiTheftResponse };
		component.getAntiTheftStatus();
		expect(spy).toHaveBeenCalled();
	});

	it('setAntiTheftStatus', () => {
		smartAssist = TestBed.inject(SmartAssistService);
		logger = TestBed.inject(LoggerService);
		smartAssist.isShellAvailable = true;
		const spy = spyOn(
			smartAssist,
			'setAntiTheftStatus'
		).and.returnValue(Promise.resolve(true));

		component.setAntiTheftStatus(true);
		expect(smartAssist.setAntiTheftStatus).toHaveBeenCalled();
	});

	it('setAlarmOften', () => {
		smartAssist = TestBed.inject(SmartAssistService);
		logger = TestBed.inject(LoggerService);
		smartAssist.isShellAvailable = true;
		const spy = spyOn(
			smartAssist,
			'setAlarmOften'
		).and.returnValue(Promise.resolve(true));

		component.setAlarmOften(1);
		expect(smartAssist.setAlarmOften).toHaveBeenCalled();
	});

	it('setPhotoNumber', () => {
		smartAssist = TestBed.inject(SmartAssistService);
		logger = TestBed.inject(LoggerService);
		smartAssist.isShellAvailable = true;
		const spy = spyOn(
			smartAssist,
			'setPhotoNumber'
		).and.returnValue(Promise.resolve(true));

		component.setPhotoNumber(1);
		expect(smartAssist.setPhotoNumber).toHaveBeenCalled();
	});

	it('setAllowCamera', () => {
		smartAssist = TestBed.inject(SmartAssistService);
		logger = TestBed.inject(LoggerService);
		smartAssist.isShellAvailable = true;
		const spy = spyOn(
			smartAssist,
			'setAllowCamera'
		).and.returnValue(Promise.resolve(true));

		component.setAllowCamera(true);
		expect(smartAssist.setAllowCamera).toHaveBeenCalled();
	});

	it('showCameraPrivacyPage', () => {
		router = TestBed.inject(Router);
		logger = TestBed.inject(LoggerService);
		component.showCameraPrivacyPage();
	});

	it('showCameraAuthorizedAccess', () => {
		deviceService = TestBed.inject(DeviceService);
		logger = TestBed.inject(LoggerService);
		component.showCameraAuthorizedAccess();
	});

	it('showPhotoFolder', () => {
		smartAssist = TestBed.inject(SmartAssistService);
		logger = TestBed.inject(LoggerService);
		smartAssist.isShellAvailable = true;
		component.showPhotoFolder('C://');
	});

	it('startMonitorAntiTheftStatus()', () => {
		smartAssist = TestBed.inject(SmartAssistService);
		logger = TestBed.inject(LoggerService);
		smartAssist.isShellAvailable = true;
		component.startMonitorAntiTheftStatus();
	});

	it('showAccessingFileSystem', () => {
		deviceService = TestBed.inject(DeviceService);
		logger = TestBed.inject(LoggerService);
		component.showAccessingFileSystem();
	});

	it('cameraAuthorizedChange', () => {
		component.cameraAuthorizedChange({ status: true });
	});

	it('cameraPrivacyChange', () => {
		component.cameraPrivacyChange({ status: true });
	});

	it('onRightIconClick', () => {
		component.onRightIconClick('', '');
	});

	it('toggleToolTip', () => {
		const tooltip = { isOpen() { return true; }, close() { } };
		component.toggleToolTip(tooltip, false);
	});

	it('toggleToolTip', () => {
		const tooltip = { isOpen() { return false; }, open() { } };
		component.toggleToolTip(tooltip, true);
	});

});
