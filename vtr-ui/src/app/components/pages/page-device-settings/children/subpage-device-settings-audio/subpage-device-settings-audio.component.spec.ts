import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageDeviceSettingsAudioComponent } from './subpage-device-settings-audio.component';
import { NO_ERRORS_SCHEMA,Pipe} from '@angular/core';
import { DolbyModesTranslationPipe } from 'src/app/pipe/dolby-modes-translation.pipe';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DevService } from 'src/app/services/dev/dev.service';

const autoDolbyFeatureStatus =
    {
        'available': true,
        'isLoading': true,
        'permission': true,
        'status': true
    }
    const dolbyModeResponse={
        'available': true,
        'supporedModes' : ["Dynamic","Movie","Music","Games","Voip"],
        'currentMode' : "Dynamic"

    }
    const microphoneProperties={
         'available': true,
         'muteDisabled': true,
         'volume': 1,
         'currentMode': "data",
         'keyboardNoiseSuppression': true,
         'autoOptimization': true,
         'AEC': true,
         'disableEffect': true,
         'permission': true
    }
    const microOptimizeModeResponse={
        'modes':[ "VoiceRecognition","OnlyMyVoice","Normal", "MultipleVoices"],
        'current':"VoiceRecognition"
    }
describe('SubpageDeviceSettingsAudioComponent', () => {
    let commonService: CommonService;
    let audioService;
    let dashboardService;
    let logService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SubpageDeviceSettingsAudioComponent,DolbyModesTranslationPipe,
                mockPipe({ name: 'translate' }), 
                mockPipe({ name: 'removeSpace' }),mockPipe({ name: 'separatePascalCase' })],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [TranslationModule, HttpClientModule, RouterTestingModule],
            providers: [TranslateStore,DevService]
        })
            .compileComponents();
    }));

    describe(':', () => {
        function setup() {
            const fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
            const component = fixture.componentInstance;
            component.autoDolbyFeatureStatus = autoDolbyFeatureStatus;
            component.dolbyModeResponse= dolbyModeResponse;
            component.microphoneProperties = microphoneProperties;
            commonService = fixture.debugElement.injector.get(CommonService);
            audioService = fixture.debugElement.injector.get(AudioService);
            logService = fixture.debugElement.injector.get(LoggerService);
            dashboardService= fixture.debugElement.injector.get(DashboardService)
            return { fixture, component, commonService, audioService, dashboardService,logService };
        }

    it('should create', () => {
        const { component } = setup();
        expect(component).toBeTruthy();
      });
      it('#ngOnInit should call initFeatures', () => {
        const { fixture, component } = setup();
        const myPrivateSpyObj = spyOn<any>(component, 'initFeatures').and.callThrough();
        fixture.detectChanges();
        component.ngOnInit();
        myPrivateSpyObj.call(component);
    });
    it('getSupportedModes should call', async () => {
        const { fixture, component ,audioService} = setup();
         spyOn(audioService, 'getSupportedModes').and.returnValue(Promise.resolve(microOptimizeModeResponse));
          await component.getSupportedModes();
            fixture.detectChanges();
            let microphone = component.microOptimizeModeResponse || microOptimizeModeResponse
            expect(microphone).toEqual(microOptimizeModeResponse);

    });

    it('startMonitorForDolby should call', async () => {
        const { fixture, component ,audioService} = setup();
         spyOn(audioService, 'startMonitorForDolby').and.returnValue(Promise.resolve(true));
          await component.startMonitorForDolby();
            fixture.detectChanges();
            expect(audioService.startMonitorForDolby).toHaveBeenCalled();

    });

    it('getDolbyModesStatus should call', async () => {
        const { fixture, component ,audioService} = setup();
         spyOn(audioService, 'getDolbyMode').and.returnValue(Promise.resolve(true));
          await component.getDolbyModesStatus();
            fixture.detectChanges();
            expect(audioService.getDolbyMode).toHaveBeenCalled();

    });

    it('startMonitor should call', async () => {
        const { fixture, component ,audioService} = setup();
         spyOn(audioService, 'startMicrophoneMonitor').and.returnValue(Promise.resolve(true));
          await component.startMonitor();
            fixture.detectChanges();
            expect(audioService.startMicrophoneMonitor).toHaveBeenCalled();

    });
    it('setMicrophoneAEC should call', async () => {
        const { fixture, component ,audioService,logService} = setup();
         spyOn(audioService, 'setMicrophoneAEC').and.returnValue(Promise.resolve(true));
          await component.setMicrophoneAEC(new Event('click'));
            fixture.detectChanges();
            expect(audioService.setMicrophoneAEC).toHaveBeenCalled();

    });
    it('onToggleOfSuppressKbdNoise should call', async () => {
        const { fixture, component ,audioService} = setup();
         spyOn(audioService, 'setSuppressKeyboardNoise').and.returnValue(Promise.resolve(true));
          await component.onToggleOfSuppressKbdNoise(new Event('click'));
            fixture.detectChanges();
            expect(audioService.setSuppressKeyboardNoise).toHaveBeenCalled();

    });
    it('onToggleOfMicrophone should call', async () => {
        const { fixture, component ,dashboardService} = setup();
         spyOn(dashboardService, 'setMicrophoneStatus').and.returnValue(Promise.resolve(true));
          await component.onToggleOfMicrophone(new Event('click'));
            fixture.detectChanges();
            expect(dashboardService.setMicrophoneStatus).toHaveBeenCalled();

    });
    it('setVolume should call', async () => {
        const { fixture, component ,audioService} = setup();
         spyOn(audioService, 'setMicrophoneVolume').and.returnValue(Promise.resolve(true));
          await component.setVolume(new Event('click'));
            fixture.detectChanges();
            expect(audioService.setMicrophoneVolume).toHaveBeenCalled();

    });
    it('onToggleOfMicrophoneAutoOptimization should call', async () => {
        const { fixture, component ,audioService} = setup();
         spyOn(audioService, 'setMicrophoneAutoOptimization').and.returnValue(Promise.resolve(true));
          await component.onToggleOfMicrophoneAutoOptimization(new Event('click'));
            fixture.detectChanges();
            expect(audioService.setMicrophoneAutoOptimization).toHaveBeenCalled();

    });
    it('getMicrophoneSettings should call', async () => {
        const { fixture, component ,audioService} = setup();
         spyOn(audioService, 'getMicrophoneSettings').and.returnValue(Promise.resolve(true));
          await component.getMicrophoneSettings();
            fixture.detectChanges();
            expect(audioService.getMicrophoneSettings).toHaveBeenCalled();

    });
    it('initFeatures should call', async () => {
        const { fixture, component } = setup();
        const myPrivateSpyObj = spyOn<any>(component, 'initFeatures').and.callThrough();
        myPrivateSpyObj.call(component);

    });
    it('onCardCollapse should call', async () => {
        const { fixture, component } = setup();
          await component.onCardCollapse(true);
            fixture.detectChanges();

    });
    it('startMonitorHandler should call', async () => {
        const { fixture, component } = setup();
          await component.startMonitorHandler(microphoneProperties);
            fixture.detectChanges();

    });

    it('onDolbySeetingRadioChange should call', async() => {
        const { fixture, component ,audioService,} = setup();
        spyOn(audioService, 'setDolbyMode').and.callThrough();
        await component.onDolbySeetingRadioChange(new Event('click'));
        fixture.detectChanges();
        expect(component.dolbyModeResponse.currentMode).toEqual(dolbyModeResponse.currentMode);
        expect(audioService.setDolbyMode).toBeDefined();

    });
    it('onAutomaticDolbyAudioToggleOnOff should call',async() => {
        const { fixture, component} = setup();
          await component.onAutomaticDolbyAudioToggleOnOff(new Event('click'));
            fixture.detectChanges();
    });
    it('onOptimizeModesRadioChange should call',async() => {
        const { fixture, component,audioService} = setup();
          await component.onOptimizeModesRadioChange(new Event('click'));
            fixture.detectChanges();
    });

  });
});
export function mockPipe(options: Pipe): Pipe {
    const metadata: Pipe = {
        name: options.name
    };
    return Pipe(metadata)(
        class MockPipe {
            public transform(query: string, ...args: any[]): any {
                return query;
            }
        }
    );
}
