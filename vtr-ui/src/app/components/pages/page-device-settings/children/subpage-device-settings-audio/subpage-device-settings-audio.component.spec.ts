import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageDeviceSettingsAudioComponent } from './subpage-device-settings-audio.component';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { DolbyModesTranslationPipe } from 'src/app/pipe/dolby-modes-translation.pipe';
import { TranslateStore } from '@ngx-translate/core';
import { AudioService } from 'src/app/services/audio/audio.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DolbyAudioToggleCapability } from 'src/app/data-models/device/dolby-audio-toggle-capability';
import { DolbyModeResponse } from 'src/app/data-models/audio/dolby-mode-response';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { MicrophoneOptimizeModes } from 'src/app/data-models/audio/microphone-optimize-modes';
import { CommonService } from 'src/app/services/common/common.service';

fdescribe('SubpageDeviceSettingsAudioComponent', () => {
	
	let autoDolbyFeatureStatus: FeatureStatus= new FeatureStatus(true,true);
	let  microOptimizeModeResponse: MicrophoneOptimizeModes= new MicrophoneOptimizeModes([],null) ;
	let microphoneOptimizeModes: MicrophoneOptimizeModes=new MicrophoneOptimizeModes([], '');
	let microphoneProperties: Microphone = {
		available: false,
		 muteDisabled: false,
		 volume: 30,
		 currentMode: null,
		 keyboardNoiseSuppression: true,
		 autoOptimization: false,
		 AEC: true,
		 disableEffect: false,
		 permission: true
	};
	let   dolbyModeResponse: DolbyModeResponse = new DolbyModeResponse(true,[],null);
	let dolbyAudioToggleCache: DolbyAudioToggleCapability = {
		 available : true,
			status :false,
			loader : true,
			icon : [],
			dolbyModeResponse: dolbyModeResponse
	};
	

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsAudioComponent, DolbyModesTranslationPipe],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslationModule.forChild(), CommonPipeModule],
			providers: [TranslateStore,FeatureStatus]
		})
			.compileComponents();
	}));

	describe(':', () => {
		function setup() {
            const fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
            const component = fixture.debugElement.componentInstance;
            const audioService = fixture.debugElement.injector.get(AudioService);
			const commonService = fixture.debugElement.injector.get(CommonService);
            return { fixture, component, audioService,commonService };
        }

		it('should create the app', (() => {
            const { component } = setup();
            expect(component).toBeTruthy();
		}));

		 	it(' initFeatures ', async(() => {
				const { fixture, component } = setup();
				component.autoDolbyFeatureStatus =autoDolbyFeatureStatus;
			component.dolbyAudioToggleCache= dolbyAudioToggleCache;
			 component.dolbyModeResponse= dolbyModeResponse;
			 component.microphoneProperties = microphoneProperties;
			 component.microOptimizeModeResponse = microOptimizeModeResponse;
			// component.commonService.isOnline =false;
				spyOn(component,'initMockData');
				fixture.detectChanges();
				
				component.initFeatures();
				expect(component.initMockData).toHaveBeenCalled();

			 }));
			 it(' ngOnDestroy ', async(() => {
				const { fixture, component, audioService } = setup();
				component.autoDolbyFeatureStatus =autoDolbyFeatureStatus;
			component.dolbyAudioToggleCache= dolbyAudioToggleCache;
			 component.dolbyModeResponse= dolbyModeResponse;
			 component.microphoneProperties = microphoneProperties;
			 component.microOptimizeModeResponse = microOptimizeModeResponse;
				spyOn(component,'ngOnDestroy');
				fixture.detectChanges();
				component.ngOnDestroy();
				//component.initFeatures();
				expect(component.ngOnDestroy).toHaveBeenCalled();
			 }));

		it('startMonitorForDolby calling audioService', async(() => {
             const { fixture, component, audioService } = setup();
			component.autoDolbyFeatureStatus =autoDolbyFeatureStatus;
			component.dolbyAudioToggleCache= dolbyAudioToggleCache;
			component.dolbyModeResponse= dolbyModeResponse;
			component.microphoneProperties = microphoneProperties;
			 component.microOptimizeModeResponse = microOptimizeModeResponse;
		 	spyOn(component, 'startMonitorForDolby').and.returnValue(Promise.resolve(true));
			 fixture.detectChanges();
		 	component.startMonitorForDolby();
             
		 	expect(component.startMonitorForDolby).toHaveBeenCalled();
		
	}));
	it('stopMonitorForDolby calling audioService', async(() => {
		const { fixture, component, audioService } = setup();
	   component.autoDolbyFeatureStatus =autoDolbyFeatureStatus;
	   component.dolbyAudioToggleCache= dolbyAudioToggleCache;
	   component.dolbyModeResponse= dolbyModeResponse;
	   component.microphoneProperties = microphoneProperties;
		component.microOptimizeModeResponse = microOptimizeModeResponse;
		spyOn(component, 'stopMonitorForDolby').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.stopMonitorForDolby();
		
		expect(component.stopMonitorForDolby).toHaveBeenCalled();
   
}));
it('initDolbyAudioFromCache calling audioService', async(() => {
	const { fixture, component, audioService } = setup();
   component.autoDolbyFeatureStatus =autoDolbyFeatureStatus;
   component.dolbyAudioToggleCache= dolbyAudioToggleCache;
   component.dolbyModeResponse= dolbyModeResponse;
   component.microphoneProperties = microphoneProperties;
	component.microOptimizeModeResponse = microOptimizeModeResponse;
	spyOn(component, 'initDolbyAudioFromCache');
	fixture.detectChanges();
	component.initDolbyAudioFromCache();
	
	expect(component.initDolbyAudioFromCache).toHaveBeenCalled();

}));
it('startMonitorForDolby calling audioService', async(() => {
	const { fixture, component, audioService } = setup();
   component.autoDolbyFeatureStatus =autoDolbyFeatureStatus;
   component.dolbyAudioToggleCache= dolbyAudioToggleCache;
   component.dolbyModeResponse= dolbyModeResponse;
   component.microphoneProperties = microphoneProperties;
	component.microOptimizeModeResponse = microOptimizeModeResponse;
	spyOn(component, 'startMonitorForDolby').and.returnValue(Promise.resolve(true));
	fixture.detectChanges();
	component.startMonitorForDolby();
	
	expect(component.startMonitorForDolby).toHaveBeenCalled();

}));

it('getMicrophoneSettings calling audioService', async(() => {
	const { fixture, component, audioService } = setup();
   component.autoDolbyFeatureStatus =autoDolbyFeatureStatus;
   component.dolbyAudioToggleCache= dolbyAudioToggleCache;
   component.dolbyModeResponse= dolbyModeResponse;
   component.microphoneProperties = microphoneProperties;
	component.microOptimizeModeResponse = microOptimizeModeResponse;
	spyOn(component, 'getMicrophoneSettings').and.returnValue(Promise.resolve(microphoneProperties));
	fixture.detectChanges();
	component.getMicrophoneSettings();
	
	expect(component.getMicrophoneSettings).toHaveBeenCalled();

}));


it('getMicrophoneSettings calling audioService', async(() => {
	const { fixture, component, audioService } = setup();
   component.autoDolbyFeatureStatus =autoDolbyFeatureStatus;
   component.dolbyAudioToggleCache= dolbyAudioToggleCache;
   component.dolbyModeResponse= dolbyModeResponse;
   component.microphoneProperties = microphoneProperties;
	component.microOptimizeModeResponse = microOptimizeModeResponse;
	spyOn(component, 'getMicrophoneSettings').and.returnValue(Promise.resolve(microphoneProperties));
	fixture.detectChanges();
	component.getMicrophoneSettings();
	
	expect(component.getMicrophoneSettings).toHaveBeenCalled();

}));
it('getDolbyFeatureStatus calling audioService', async(() => {
	const { fixture, component, audioService } = setup();
   component.autoDolbyFeatureStatus =autoDolbyFeatureStatus;
   component.dolbyAudioToggleCache= dolbyAudioToggleCache;
   component.dolbyModeResponse= dolbyModeResponse;
   component.microphoneProperties = microphoneProperties;
	component.microOptimizeModeResponse = microOptimizeModeResponse;
	spyOn(component, 'getDolbyFeatureStatus');
	fixture.detectChanges();
	component.getDolbyFeatureStatus();
	
	expect(component.getDolbyFeatureStatus).toHaveBeenCalled();

}));
it('getSupportedModes calling audioService', async(() => {
	const { fixture, component } = setup();
   component.autoDolbyFeatureStatus =autoDolbyFeatureStatus;
   component.dolbyAudioToggleCache= dolbyAudioToggleCache;
   component.dolbyModeResponse= dolbyModeResponse;
   component.microphoneProperties = microphoneProperties;
	component.microOptimizeModeResponse = microOptimizeModeResponse;
	
	spyOn(component, 'getSupportedModes').and.returnValue(Promise.resolve(microphoneOptimizeModes));
	fixture.detectChanges();
	component.audioService.isShellAvailable=true;
	component.getSupportedModes();
	
	expect(component.getSupportedModes).toHaveBeenCalled();

}));

});
});
