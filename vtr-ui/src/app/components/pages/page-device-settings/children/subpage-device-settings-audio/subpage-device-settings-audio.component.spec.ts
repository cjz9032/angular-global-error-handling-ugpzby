import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SubpageDeviceSettingsAudioComponent } from './subpage-device-settings-audio.component';

import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { DolbyAudioToggleCapability } from 'src/app/data-models/device/dolby-audio-toggle-capability';

import { DolbyModesTranslationPipe } from 'src/app/pipe/dolby-modes-translation.pipe';
import { RemoveSpacePipe } from 'src/app/pipe/remove-space/remove-space.pipe';
import { SeparatePascalCasePipe } from 'src/app/pipe/separate-pascal-case.pipe';

import { LoggerService } from 'src/app/services/logger/logger.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

import { TranslateModule } from '@ngx-translate/core';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

const autoDolbyFeatureStatus = {
	available: true,
	isLoading: true,
	permission: true,
	status: true
};
const dolbyModeResponse = {
	available: true,
	supporedModes: ['Dynamic', 'Movie', 'Music', 'Games', 'Voip'],
	currentMode: 'Dynamic'
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
	permission: true
};
const microOptimizeModeResponse = {
	modes: ['VoiceRecognition', 'OnlyMyVoice', 'Normal', 'MultipleVoices'],
	current: 'VoiceRecognition'
};

describe('SubpageDeviceSettingsAudioComponent', () => {
	let fixture: ComponentFixture<SubpageDeviceSettingsAudioComponent>;
	let component: SubpageDeviceSettingsAudioComponent;

	let shellService: VantageShellService;
	let commonService: CommonService;
	let audioService: AudioService;
	let dashboardService: DashboardService;
	let logService: LoggerService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				SubpageDeviceSettingsAudioComponent,
				DolbyModesTranslationPipe,
				RemoveSpacePipe,
				SeparatePascalCasePipe
			],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [
				DevService,
				DashboardService,
				LoggerService,
				AudioService,
				CommonService,
				VantageShellService
			]
		});
	}));

	it('should create', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		const welcomeTut: WelcomeTutorial = {
			page: 2,
			tutorialVersion: 'someVersion',
			isDone: true
		};
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(
			welcomeTut
		);
		spyOn<any>(component, 'initFeatures');
		component.dolbyModeResponse = { ...dolbyModeResponse };
		component.microphoneProperties = { ...microphoneProperties };
		component.autoDolbyFeatureStatus = { ...autoDolbyFeatureStatus };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should call initFeatures', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		const spy = spyOn(component, 'getDolbyFeatureStatus');
		spyOn(component, 'getDolbyModesStatus');
		component['initFeatures']();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initDolbyAudioFromCache - else block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		const spy = spyOn(
			commonService,
			'getLocalStorageValue'
		).and.returnValue(undefined);
		component.dolbyModeResponse = { ...dolbyModeResponse };
		component.autoDolbyFeatureStatus = { ...autoDolbyFeatureStatus };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		component.initDolbyAudioFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call onNotification - case LocalStorageKey.WelcomeTutorial', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		const spy = spyOn<any>(component, 'initFeatures');
		const notification: AppNotification = {
			type: LocalStorageKey.WelcomeTutorial,
			payload: { page: 2 }
		};
		component['onNotification'](notification);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onOptimizeModesRadioChange - microOptimizeModeResponse is equal to newVal', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		component.microOptimizeModeResponse = {
			modes: ['checked', 'unchecked'],
			current: 'checked'
		};
		const event = { target: { value: 'checked' } };
		const spy = spyOn(audioService, 'setMicrophoneOpitimaztion');
		component.onOptimizeModesRadioChange(event);
		expect(spy).not.toHaveBeenCalled();
	});

	it('should call onOptimizeModesRadioChange - microOptimizeModeResponse is not equal to newVal', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		component.microOptimizeModeResponse = {
			modes: ['checked', 'unchecked'],
			current: 'checked'
		};
		const event = { target: { value: 'unchecked' } };
		spyOn(audioService, 'setMicrophoneOpitimaztion').and.returnValue(
			Promise.resolve(true)
		);
		component.onOptimizeModesRadioChange(event);
		expect(component.cacheFlag.currentMode).toEqual(false);
	});

	it('should call onOptimizeModesRadioChange - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		component.microOptimizeModeResponse = {
			modes: ['checked', 'unchecked'],
			current: 'checked'
		};
		const event = { target: { value: 'unchecked' } };
		const error = { message: 'Error' };
		const spy = spyOn(
			audioService,
			'setMicrophoneOpitimaztion'
		).and.returnValue(Promise.reject(error));
		component.onOptimizeModesRadioChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onOptimizeModesRadioChange - try/catch catch block ', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.get(LoggerService);
		const spy = spyOn(logService, 'error');
		component.onOptimizeModesRadioChange(undefined);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onAutomaticDolbyAudioToggleOnOff - promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		component.autoDolbyFeatureStatus = {
			...autoDolbyFeatureStatus,
			available: false
		};
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		const event = { switchValue: true };
		const spy = spyOn(audioService, 'setDolbyOnOff').and.returnValue(
			Promise.resolve(true)
		);
		component.onAutomaticDolbyAudioToggleOnOff(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onAutomaticDolbyAudioToggleOnOff - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		component.autoDolbyFeatureStatus = {
			...autoDolbyFeatureStatus,
			available: false
		};
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		const event = { switchValue: true };
		const error = { message: 'Error' };
		const spy = spyOn(audioService, 'setDolbyOnOff').and.returnValue(
			Promise.reject(error)
		);
		component.onAutomaticDolbyAudioToggleOnOff(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onAutomaticDolbyAudioToggleOnOff - try/catch catch block ', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.get(LoggerService);
		const spy = spyOn(logService, 'error');
		component.onAutomaticDolbyAudioToggleOnOff(undefined);
		expect(spy).toHaveBeenCalled();
	});

	it('should call getDolbyFeatureStatus - Promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		component.isDTmachine = true;
		component.autoDolbyFeatureStatus = { ...autoDolbyFeatureStatus };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		audioService.isShellAvailable = true;
		const spy = spyOn(
			audioService,
			'getDolbyFeatureStatus'
		).and.returnValue(Promise.resolve(autoDolbyFeatureStatus));
		component.getDolbyFeatureStatus();
		expect(spy).toHaveBeenCalled();
	});

	it('should call getDolbyFeatureStatus - Promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		component.isDTmachine = false;
		component.autoDolbyFeatureStatus = { ...autoDolbyFeatureStatus };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		audioService.isShellAvailable = true;
		const spy = spyOn(
			audioService,
			'getDolbyFeatureStatus'
		).and.returnValue(Promise.reject(autoDolbyFeatureStatus));
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
		audioService = TestBed.get(AudioService);
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
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		const error = { message: 'Error' };
		const spy = spyOn(audioService, 'getDolbyMode').and.returnValue(
			Promise.reject(error)
		);
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
		audioService = TestBed.get(AudioService);
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
		audioService = TestBed.get(AudioService);
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
		commonService = TestBed.get(CommonService);
		const spy = spyOn(commonService, 'setLocalStorageValue');
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		component.startMonitorHandlerForDolby(dolbyModeResponse);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onDolbySettingRadioChange - promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		component.dolbyModeResponse = { ...dolbyModeResponse };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		const event = { target: { value: 'checked' } };
		const spy = spyOn(audioService, 'setDolbyMode').and.returnValue(
			Promise.resolve(true)
		);
		component.onDolbySettingRadioChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onDolbySettingRadioChange - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		component.dolbyModeResponse = { ...dolbyModeResponse };
		component.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
		const event = { target: { value: 'checked' } };
		const error = { message: 'Error' };
		const spy = spyOn(audioService, 'setDolbyMode').and.returnValue(
			Promise.reject(error)
		);
		component.onDolbySettingRadioChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onDolbySettingRadioChange - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		const event = { target: { value: '' } };
		logService = TestBed.get(LoggerService);
		const spy = spyOn(logService, 'error');
		component.onDolbySettingRadioChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfMicrophoneAutoOptimization - promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		const event = { switchValue: true };
		component.microphoneProperties = { ...microphoneProperties };
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(
			audioService,
			'setMicrophoneAutoOptimization'
		).and.returnValue(Promise.resolve(true));
		component.onToggleOfMicrophoneAutoOptimization(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfMicrophoneAutoOptimization - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		const event = { switchValue: true };
		const error = { message: 'Error' };
		component.microphoneProperties = { ...microphoneProperties };
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(
			audioService,
			'setMicrophoneAutoOptimization'
		).and.returnValue(Promise.reject(error));
		component.onToggleOfMicrophoneAutoOptimization(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfMicrophoneAutoOptimization - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.get(LoggerService);
		const event = { switchValue: '' };
		const spy = spyOn(logService, 'error');
		component.onToggleOfMicrophoneAutoOptimization(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setVolume - promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
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
		audioService = TestBed.get(AudioService);
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
		logService = TestBed.get(LoggerService);
		const event = 0;
		const spy = spyOn(logService, 'error');
		component.onMicrophoneVolumeChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfMicrophone - promise resolve', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		dashboardService = TestBed.get(DashboardService);
		component.microphoneProperties = { ...microphoneProperties };
		const event = { switchValue: true };
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(
			dashboardService,
			'setMicrophoneStatus'
		).and.returnValue(Promise.resolve(true));
		component.onToggleOfMicrophone(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfMicrophone - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		dashboardService = TestBed.get(DashboardService);
		component.microphoneProperties = { ...microphoneProperties };
		const event = { switchValue: true };
		const error = { message: 'error' };
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(
			dashboardService,
			'setMicrophoneStatus'
		).and.returnValue(Promise.reject(error));
		component.onToggleOfMicrophone(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfMicrophone - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.get(LoggerService);
		const event = { switchValue: '' };
		const spy = spyOn(logService, 'error');
		component.onToggleOfMicrophone(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfSuppressKbdNoise - promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		const event = { switchValue: true };
		component.microphoneProperties = { ...microphoneProperties };
		audioService.isShellAvailable = true;
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(
			audioService,
			'setSuppressKeyboardNoise'
		).and.returnValue(Promise.resolve(true));
		component.onToggleOfSuppressKbdNoise(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfSuppressKbdNoise - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		const event = { switchValue: true };
		component.microphoneProperties = { ...microphoneProperties };
		audioService.isShellAvailable = true;
		const error = { message: 'Error' };
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(
			audioService,
			'setSuppressKeyboardNoise'
		).and.returnValue(Promise.reject(error));
		component.onToggleOfSuppressKbdNoise(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOfSuppressKbdNoise - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.get(LoggerService);
		const event = { switchValue: '' };
		const spy = spyOn(logService, 'error');
		component.onToggleOfSuppressKbdNoise(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setMicrophoneAEC - promise resolved', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		const event = { switchValue: true };
		component.microphoneProperties = { ...microphoneProperties };
		audioService.isShellAvailable = true;
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(audioService, 'setMicrophoneAEC').and.returnValue(
			Promise.resolve(true)
		);
		component.setMicrophoneAEC(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setMicrophoneAEC - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		const event = { switchValue: true };
		const error = { message: 'Error' };
		component.microphoneProperties = { ...microphoneProperties };
		audioService.isShellAvailable = true;
		spyOn(component, 'updateMicrophoneCache');
		const spy = spyOn(audioService, 'setMicrophoneAEC').and.returnValue(
			Promise.reject(error)
		);
		component.setMicrophoneAEC(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setMicrophoneAEC - try-catch catch block', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		logService = TestBed.get(LoggerService);
		const event = { switchValue: '' };
		const spy = spyOn(logService, 'error');
		component.setMicrophoneAEC(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call startMicrophoneMonitor - promise rejected', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		const error = { message: 'Error' };
		const spy = spyOn(
			audioService,
			'startMicrophoneMonitor'
		).and.returnValue(Promise.reject(error));
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
		audioService = TestBed.get(AudioService);
		audioService.isShellAvailable = true;
		const error = { message: 'Error' };
		const spy = spyOn(
			audioService,
			'stopMicrophoneMonitor'
		).and.returnValue(Promise.reject(error));
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

	// it('should call onCardCollapse', () => {
	// 	fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
	// 	component = fixture.componentInstance;
	// 	const spy = spyOn(component.manualRefresh, 'emit');
	// 	component.onCardCollapse(false);
	// 	expect(spy).toHaveBeenCalled();
	// });

	it('should call initMicrophoneFromCache', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		const microphoneCache = {
			data: {
				autoOptimization: true,
				keyboardNoiseSuppression: true,
				AEC: true,
				currentMode: 'data'
			},
			modes: [
				'VoiceRecognition',
				'OnlyMyVoice',
				'Normal',
				'MultipleVoices'
			]
		};
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const spy = spyOn(
			commonService,
			'getLocalStorageValue'
		).and.returnValue(microphoneCache);
		component.initMicrophoneFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initMicrophoneFromCache - inner else cases - 1', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		const microphoneCache = {
			data: {}
		};
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const spy = spyOn(
			commonService,
			'getLocalStorageValue'
		).and.returnValue(microphoneCache);
		component.initMicrophoneFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initMicrophoneFromCache - inner else cases - 2', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		const microphoneCache = {
			data: {},
			modes: [
				'VoiceRecognition',
				'OnlyMyVoice',
				'Normal',
				'MultipleVoices'
			]
		};
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const spy = spyOn(
			commonService,
			'getLocalStorageValue'
		).and.returnValue(microphoneCache);
		component.initMicrophoneFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initMicrophoneFromCache - inner else cases - 2', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		const microphoneCache = {};
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse };
		const spy = spyOn(
			commonService,
			'getLocalStorageValue'
		).and.returnValue(microphoneCache);
		component.initMicrophoneFromCache();
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateMicrophoneHandler', () => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
		component = fixture.componentInstance;
		component.microphoneProperties = { ...microphoneProperties };
		component.microOptimizeModeResponse = { ...microOptimizeModeResponse }
		const msg = {
			available: true,
			muteDisabled: true,
			volume: 2,
			permission: true,
			modes: [
				'VoiceRecognition',
				'OnlyMyVoice',
				'Normal',
				'MultipleVoices'
			],
			currentMode: 'data',
			keyboardNoiseSuppression: true,
			AEC: true,
			disableEffect: true,
			autoOptimization: true,
			finished: true
		}
		component.updateMicrophoneHandler(msg);
		expect(component.cacheFlag.AEC).toEqual(true)
	});
});
