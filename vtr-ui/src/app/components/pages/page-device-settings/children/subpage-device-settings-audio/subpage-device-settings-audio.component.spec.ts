import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { DolbyAudioToggleCapability } from 'src/app/data-models/device/dolby-audio-toggle-capability';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { DolbyModesTranslationPipe } from 'src/app/pipe/dolby-modes-translation.pipe';
import { RemoveSpacePipe } from 'src/app/pipe/remove-space/remove-space.pipe';
import { SeparatePascalCasePipe } from 'src/app/pipe/separate-pascal-case.pipe';
import { AudioService } from 'src/app/services/audio/audio.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SubpageDeviceSettingsAudioComponent } from './subpage-device-settings-audio.component';
import { DeviceService } from '../../../../../services/device/device.service';

const autoDolbyFeatureStatus = {
	available: true,
	isLoading: true,
	permission: true,
	status: true,
};
const dolbyModeResponse = {
	available: true,
	supportedModes: ['Dynamic', 'Movie', 'Music', 'Games', 'Voip'],
	currentMode: 'Dynamic',
	isAudioProfileEnabled: false,
	eCourseStatus: 'True',
	voIPStatus: 'True',
	entertainmentStatus: 'True',
	driverAvailability: true,
};
const microphoneProperties = {
	available: true,
	muteDisabled: true,
	volume: 1,
	currentMode: 'data',
	keyboardNoiseSuppression: true,
	autoOptimization: true,
	AEC: true,
	disableEffect: true,
	permission: true,
};
const microOptimizeModeResponse = {
	modes: ['VoiceRecognition', 'OnlyMyVoice', 'Normal', 'MultipleVoices'],
	current: 'VoiceRecognition',
};

describe('SubpageDeviceSettingsAudioComponent', () => {
	let fixture: ComponentFixture<SubpageDeviceSettingsAudioComponent>;
	let component: SubpageDeviceSettingsAudioComponent;
	let commonService: CommonService;
	let audioService: AudioService;
	let dashboardService: DashboardService;
	let logService: LoggerService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				SubpageDeviceSettingsAudioComponent,
				DolbyModesTranslationPipe,
				RemoveSpacePipe,
				SeparatePascalCasePipe,
			],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [
				DevService,
				DashboardService,
				LoggerService,
				AudioService,
				CommonService,
				VantageShellService,
			],
		});
	}));

	it('should create', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		const welcomeTut: WelcomeTutorial = {
			page: 2,
			tutorialVersion: 'someVersion',
			isDone: true,
		};
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(welcomeTut);
		spyOn<any>(component, 'initFeatures');
		component.dolbyModeResponse = { ...dolbyModeResponse };
		component.microphoneProperties = { ...microphoneProperties };
		component.autoDolbyFeatureStatus = { ...autoDolbyFeatureStatus };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should call initFeatures', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		const spy = spyOn(component, 'getDolbyModesStatus');
		component.initFeatures();
		expect(spy).toHaveBeenCalled();
	});

	it('onRightIconClick', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		dolbyModeResponse.isAudioProfileEnabled = true;
		component.dolbyModeResponse = dolbyModeResponse;
		component.microphoneProperties = { ...microphoneProperties };
		fixture.detectChanges();
		component.onRightIconClick('', '');
	});

	it('toggleToolTip', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		component.dolbyModeResponse = dolbyModeResponse;
		dolbyModeResponse.isAudioProfileEnabled = true;
		component.microphoneProperties = { ...microphoneProperties };
		fixture.detectChanges();
		const tooltip = {
			isOpen: () => true,
			close: () => {}
		};
		component.toggleToolTip(tooltip, false);
	});

	it('toggleToolTip', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		component.dolbyModeResponse = dolbyModeResponse;
		dolbyModeResponse.isAudioProfileEnabled = true;
		component.microphoneProperties = { ...microphoneProperties };
		fixture.detectChanges();
		const tooltip = {
			isOpen: () => false,
			open: () => {},
		};
		component.toggleToolTip(tooltip, true);
	});

	it('onDolbyAudioToggleOnOff', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		commonService = TestBed.inject(CommonService);
		audioService.isShellAvailable = true;
		component.dolbyModeResponse = dolbyModeResponse;
		const event = { switchValue: true };
		const spy = spyOn(audioService, 'setDolbyAudioState').and.returnValue(Promise.reject(true));
		component.onDolbyAudioToggleOnOff(event);
		expect(audioService.setDolbyAudioState).toHaveBeenCalled();
	});

	it('onVoipCheckboxChange isNewplugin  true', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		commonService = TestBed.inject(CommonService);
		audioService.isShellAvailable = true;
		component.dolbyModeResponse = dolbyModeResponse;
		const spy = spyOn(audioService, 'setDolbyAudioProfileState').and.returnValue(
			Promise.reject(true)
		);
		component.onVoipCheckboxChange(true);
		expect(audioService.setDolbyAudioProfileState).toHaveBeenCalled();
	});

	it('onVoipCheckboxChange isNewplugin  false', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		commonService = TestBed.inject(CommonService);
		audioService.isShellAvailable = true;

		component.isNewplugin = false;
		component.dolbyModeResponse = dolbyModeResponse;
		component.microphoneProperties = { ...microphoneProperties };
		fixture.detectChanges();

		const spy = spyOn(component, 'updateMicrophoneCache');
		component.onVoipCheckboxChange(true);
		expect(component.updateMicrophoneCache).toHaveBeenCalled();
	});

	it('onVoipCheckboxChange', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		commonService = TestBed.inject(CommonService);
		audioService.isShellAvailable = true;
		component.dolbyModeResponse = dolbyModeResponse;
		const spy = spyOn(audioService, 'setDolbyAudioProfileState').and.returnValue(
			Promise.reject(true)
		);
		component.onVoipCheckboxChange(true);
		expect(audioService.setDolbyAudioProfileState).toHaveBeenCalled();
	});

	it('onEntertainmentCheckboxChange', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		commonService = TestBed.inject(CommonService);
		audioService.isShellAvailable = true;
		component.dolbyModeResponse = dolbyModeResponse;
		const spy = spyOn(audioService, 'setDolbyAudioProfileState').and.returnValue(
			Promise.reject(true)
		);
		component.onEntertainmentCheckboxChange(true);
		expect(audioService.setDolbyAudioProfileState).toHaveBeenCalled();
	});

	it('onEntertainmentCheckboxChange isNewplugin false ', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		commonService = TestBed.inject(CommonService);
		audioService.isShellAvailable = true;
		component.dolbyModeResponse = dolbyModeResponse;
		component.isNewplugin = false;
		const spy = spyOn(audioService, 'setDolbyOnOff');
		component.onEntertainmentCheckboxChange(true);
		expect(audioService.setDolbyOnOff).toHaveBeenCalled();
	});

	it('onToggleOfeCourseAutoOptimization', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		commonService = TestBed.inject(CommonService);
		audioService.isShellAvailable = true;
		component.dolbyModeResponse = dolbyModeResponse;
		const spy = spyOn(audioService, 'setDolbyAudioProfileState').and.returnValue(
			Promise.reject(true)
		);
		component.onToggleOfeCourseAutoOptimization(true);
		expect(audioService.setDolbyAudioProfileState).toHaveBeenCalled();
	});

	it('should call initDolbyAudioFromCache - else block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		const spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(undefined);
		component.dolbyModeResponse = { ...dolbyModeResponse };
		component.autoDolbyFeatureStatus = { ...autoDolbyFeatureStatus };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		component.initDolbyAudioFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call onOptimizeModesRadioChange - microOptimizeModeResponse is equal to newVal', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		component.microOptimizeModeResponse = {
			modes: ['checked', 'unchecked'],
			current: 'checked',
		};
		const event = { target: { value: 'checked' } };
		const spy = spyOn(audioService, 'setMicrophoneOpitimaztion');
		component.onOptimizeModesRadioChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onOptimizeModesRadioChange - microOptimizeModeResponse is not equal to newVal', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		component.microOptimizeModeResponse = {
			modes: ['checked', 'unchecked'],
			current: 'checked',
		};
		const event = { target: { value: 'unchecked' } };
		spyOn(audioService, 'setMicrophoneOpitimaztion').and.returnValue(Promise.resolve(true));
		component.onOptimizeModesRadioChange(event);
		expect(component.cacheFlag.currentMode).toEqual(false);
	});

	it('should call onOptimizeModesRadioChange - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		component.microOptimizeModeResponse = {
			modes: ['checked', 'unchecked'],
			current: 'checked',
		};
		const event = { target: { value: 'unchecked' } };
		const error = { message: 'Error' };
		const spy = spyOn(audioService, 'setMicrophoneOpitimaztion').and.returnValue(
			Promise.reject(error)
		);
		component.onOptimizeModesRadioChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onOptimizeModesRadioChange - try/catch catch block ', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.inject(LoggerService);
		const spy = spyOn(logService, 'error');
		component.onOptimizeModesRadioChange(undefined);
		expect(spy).toHaveBeenCalled();
	});

	it('should call getDolbyFeatureStatus - Promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		component.isDTmachine = true;
		component.autoDolbyFeatureStatus = { ...autoDolbyFeatureStatus };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		audioService.isShellAvailable = true;
		const spy = spyOn(audioService, 'getDolbyFeatureStatus').and.returnValue(
			Promise.resolve(autoDolbyFeatureStatus)
		);
		component.getDolbyFeatureStatus();
		expect(spy).toHaveBeenCalled();
	});

	it('should call getDolbyFeatureStatus - Promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		component.isDTmachine = false;
		component.autoDolbyFeatureStatus = { ...autoDolbyFeatureStatus };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		audioService.isShellAvailable = true;
		const spy = spyOn(audioService, 'getDolbyFeatureStatus').and.returnValue(
			Promise.reject(autoDolbyFeatureStatus)
		);
		component.getDolbyFeatureStatus();
		expect(spy).toHaveBeenCalled();
	});

	it('should call getDolbyFeatureStatus - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		expect(component.getDolbyFeatureStatus).toThrowError();
	});

	it('should call getDolbyModesStatus - Promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		const spy = spyOn(audioService, 'getDolbyMode').and.returnValue(
			Promise.resolve(dolbyModeResponse)
		);
		component.getDolbyModesStatus();
		expect(spy).toHaveBeenCalled();
	});

	it('should call getDolbyModesStatus - Promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		const error = { message: 'Error' };
		const spy = spyOn(audioService, 'getDolbyMode').and.returnValue(Promise.reject(error));
		component.getDolbyModesStatus();
		expect(spy).toHaveBeenCalled();
	});

	it('should call getDolbyModesStatus - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		expect(component.getDolbyModesStatus).toThrowError();
	});

	it('should call startMonitorForDolby - Promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		const error = { message: 'Error' };
		const spy = spyOn(audioService, 'startMonitorForDolby').and.returnValue(
			Promise.reject(error)
		);
		component.startMonitorForDolby();
		expect(spy).toHaveBeenCalled();
	});

	it('should call startMonitorForDolby - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		expect(component.startMonitorForDolby).toThrowError();
	});

	it('should call stopMonitorForDolby - Promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		const error = { message: 'Error' };
		const spy = spyOn(audioService, 'stopMonitorForDolby').and.returnValue(
			Promise.reject(error)
		);
		component.stopMonitorForDolby();
		expect(spy).toHaveBeenCalled();
	});

	it('should call stopMonitorForDolby - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		expect(component.stopMonitorForDolby).toThrowError();
	});

	it('should call startMonitorHandlerForDolby', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		audioService = TestBed.inject(AudioService);

		const spy = spyOn(commonService, 'setLocalStorageValue');
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		component.dolbyModeResponse = dolbyModeResponse;
		const spyGetDolbyMode = spyOn(audioService, 'getDolbyMode').and.returnValue(
			Promise.resolve(dolbyModeResponse)
		);
		component.updateDolbyModeModel(dolbyModeResponse);
		component.getDolbyModesStatus();
		component.startMonitorHandlerForDolby(dolbyModeResponse);

		expect(spy).toHaveBeenCalled();
	});

	it('should call initVisibility ', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		dolbyModeResponse.available = false;
		const spyInitVisibility = spyOn(component, 'initVisibility');
		const spy = spyOn(audioService, 'getDolbyMode').and.returnValue(
			Promise.resolve(dolbyModeResponse)
		);
		component.getDolbyModesStatus();

		expect(spy).toHaveBeenCalled();
	});

	it('should call onDolbySettingRadioChange - promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		component.dolbyModeResponse = { ...dolbyModeResponse };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		const event = { target: { value: 'checked' } };
		const spy = spyOn(audioService, 'setDolbyMode').and.returnValue(Promise.resolve(true));
		component.onDolbySettingRadioChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onDolbySettingRadioChange - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		component.dolbyModeResponse = { ...dolbyModeResponse };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		const event = { target: { value: 'checked' } };
		const error = { message: 'Error' };
		const spy = spyOn(audioService, 'setDolbyMode').and.returnValue(Promise.reject(error));
		component.onDolbySettingRadioChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onDolbySettingRadioChange - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		const event = { target: { value: '' } };
		logService = TestBed.inject(LoggerService);
		const spy = spyOn(logService, 'error');
		component.onDolbySettingRadioChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setVolume - promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		const event = 2;
		component.microphoneProperties = { ...microphoneProperties };
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(audioService, 'setMicrophoneVolume').and.returnValue(
			Promise.resolve(true)
		);
		component.onMicrophoneVolumeChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setVolume - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		const event = 2;
		component.microphoneProperties = { ...microphoneProperties };
		const error = { message: 'Error' };
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(audioService, 'setMicrophoneVolume').and.returnValue(
			Promise.reject(error)
		);
		component.onMicrophoneVolumeChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setVolume - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.inject(LoggerService);
		const event = 0;
		const spy = spyOn(logService, 'error');
		component.onMicrophoneVolumeChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfMicrophone - promise resolve', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		dashboardService = TestBed.inject(DashboardService);
		component.microphoneProperties = { ...microphoneProperties };
		const event = { switchValue: true };
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(dashboardService, 'setMicrophoneStatus').and.returnValue(
			Promise.resolve(true)
		);
		component.onToggleOfMicrophone(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfMicrophone - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		dashboardService = TestBed.inject(DashboardService);
		component.microphoneProperties = { ...microphoneProperties };
		const event = { switchValue: true };
		const error = { message: 'error' };
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(dashboardService, 'setMicrophoneStatus').and.returnValue(
			Promise.reject(error)
		);
		component.onToggleOfMicrophone(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfMicrophone - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.inject(LoggerService);
		const event = { switchValue: '' };
		const spy = spyOn(logService, 'error');
		component.onToggleOfMicrophone(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfSuppressKbdNoise - promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		const event = { switchValue: true };
		component.microphoneProperties = { ...microphoneProperties };
		audioService.isShellAvailable = true;
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(audioService, 'setSuppressKeyboardNoise').and.returnValue(
			Promise.resolve(true)
		);
		component.onToggleOfSuppressKbdNoise(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfSuppressKbdNoise - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		const event = { switchValue: true };
		component.microphoneProperties = { ...microphoneProperties };
		audioService.isShellAvailable = true;
		const error = { message: 'Error' };
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(audioService, 'setSuppressKeyboardNoise').and.returnValue(
			Promise.reject(error)
		);
		component.onToggleOfSuppressKbdNoise(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfSuppressKbdNoise - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.inject(LoggerService);
		const event = { switchValue: '' };
		const spy = spyOn(logService, 'error');
		component.onToggleOfSuppressKbdNoise(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setMicrophoneAEC - promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		const event = { switchValue: true };
		component.microphoneProperties = { ...microphoneProperties };
		audioService.isShellAvailable = true;
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(audioService, 'setMicrophoneAEC').and.returnValue(Promise.resolve(true));
		component.setMicrophoneAEC(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setMicrophoneAEC - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		const event = { switchValue: true };
		const error = { message: 'Error' };
		component.microphoneProperties = { ...microphoneProperties };
		audioService.isShellAvailable = true;
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(audioService, 'setMicrophoneAEC').and.returnValue(Promise.reject(error));
		component.setMicrophoneAEC(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setMicrophoneAEC - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.inject(LoggerService);
		const event = { switchValue: '' };
		const spy = spyOn(logService, 'error');
		component.setMicrophoneAEC(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call startMicrophoneMonitor - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		const error = { message: 'Error' };
		const spy = spyOn(audioService, 'startMicrophoneMonitor').and.returnValue(
			Promise.reject(error)
		);
		component.startMicrophoneMonitor();
		expect(spy).toHaveBeenCalled();
	});

	it('should call startMicrophoneMonitor - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		component.startMicrophoneMonitor();
		expect(component.startMicrophoneMonitor).toThrowError();
	});

	it('should call stopMicrophoneMonitor - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.inject(AudioService);
		audioService.isShellAvailable = true;
		const error = { message: 'Error' };
		const spy = spyOn(audioService, 'stopMicrophoneMonitor').and.returnValue(
			Promise.reject(error)
		);
		component.stopMicrophoneMonitor();
		expect(spy).toHaveBeenCalled();
	});

	it('should call stopMicrophoneMonitor - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		component.stopMicrophoneMonitor();
		expect(component.stopMicrophoneMonitor).toThrowError();
	});

	it('should call startMonitorHandler', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		const microphone = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const spy = spyOn(component, 'updateMicrophoneCache');
		component.startMonitorHandler(microphone);
		expect(spy).toHaveBeenCalled();
	});

	it('should call initMicrophoneFromCache', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		const microphoneCache = {
			data: {
				autoOptimization: true,
				keyboardNoiseSuppression: true,
				AEC: true,
				currentMode: 'data',
			},
			modes: ['VoiceRecognition', 'OnlyMyVoice', 'Normal', 'MultipleVoices'],
		};
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(microphoneCache);
		component.initMicrophoneFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initMicrophoneFromCache isNewPlugin false', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component.isNewplugin = false;
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		const microphoneCache = {
			data: {
				autoOptimization: true,
				keyboardNoiseSuppression: true,
				AEC: true,
				currentMode: 'data',
			},
			modes: ['VoiceRecognition', 'OnlyMyVoice', 'Normal', 'MultipleVoices'],
		};
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(microphoneCache);
		component.initMicrophoneFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initMicrophoneFromCache - inner else cases - 1', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		const microphoneCache = {
			data: {},
		};
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(microphoneCache);
		component.initMicrophoneFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initMicrophoneFromCache - inner else cases - 2', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		const microphoneCache = {
			data: {},
			modes: ['VoiceRecognition', 'OnlyMyVoice', 'Normal', 'MultipleVoices'],
		};
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(microphoneCache);
		component.initMicrophoneFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initMicrophoneFromCache - inner else cases - 2', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		const microphoneCache = {};
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(microphoneCache);
		component.initMicrophoneFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateMicrophoneHandler', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const msg = {
			available: true,
			muteDisabled: true,
			volume: 2,
			permission: true,
			modes: ['VoiceRecognition', 'OnlyMyVoice', 'Normal', 'MultipleVoices'],
			currentMode: 'data',
			keyboardNoiseSuppression: true,
			AEC: true,
			disableEffect: true,
			autoOptimization: true,
			finished: true,
		};
		component.updateMicrophoneHandler(msg);
		expect(component.cacheFlag.AEC).toEqual(true);
	});
});
describe('Microphone Optimization Section\'s block status', () => {
	let fixture: ComponentFixture<SubpageDeviceSettingsAudioComponent>;
	let component: SubpageDeviceSettingsAudioComponent;
	let deviceService: DeviceService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsAudioComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [
				DevService,
				DashboardService,
				LoggerService,
				AudioService,
				CommonService,
				VantageShellService,
				DeviceService,
			],
		});
		deviceService = TestBed.inject(DeviceService);
	}));

	it('should be false as default', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		expect(component.canShowMicrophoneOptimization).toBeFalsy();
	});

	it('should be blocked when machine\'s mt code is in block list', async () => {
		const machineMtCodeInBlockList = '20YC';
		const deviceServiceSpy = spyOn(deviceService, 'getMachineInfo');
		deviceServiceSpy.and.returnValue(
			Promise.resolve({
				mt: machineMtCodeInBlockList,
			})
		);
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		expect(component.canShowMicrophoneOptimization).toBeTruthy('Filter logic has gone wrong');
	});

	it('should NOT be blocked when machine\'s mt code is in block list', async () => {
		const machineMtCodeNotInBlockList = '81RS';
		const deviceServiceSpy = spyOn(deviceService, 'getMachineInfo');
		deviceServiceSpy.and.returnValue(
			Promise.resolve({
				mt: machineMtCodeNotInBlockList,
			})
		);
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		expect(component.canShowMicrophoneOptimization).toBeFalsy('Filter logic has gone wrong');
	});
});
