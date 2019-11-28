import { async, TestBed } from '@angular/core/testing';
import { QaService } from '../../../services/qa/qa.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { NO_ERRORS_SCHEMA,Pipe} from '@angular/core';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { PageDeviceSettingsComponent } from './page-device-settings.component';
import { CommsService } from '../../../services/comms/comms.service';
import { DevService } from '../../../services/dev/dev.service';

describe('PageDeviceSettingsComponent', () => {
	let audioService: AudioService;
	let commonService: CommonService;
	let	 logger: LoggerService;
	let deviceService: DeviceService;
	let cmsService: CMSService;
    let qaService: QaService;
    let commsService:CommsService
    let debugElement;
    let activeElement: HTMLElement;
    const notification={
        'type':'string',
        'payload' : <any> 2
    };
    const microphone={
         'available': true,
		 'muteDisabled': true,
		 'volume': 1,
		 'currentMode': 'string',
		 'keyboardNoiseSuppression': true,
		 'autoOptimization': true,
		 'AEC': true,
		 'disableEffect': true,
		 'permission': true
    };
    const queryOptions = {
        Page: 'device-settings'
    };
    
	beforeEach(async(() => {
        TestBed.configureTestingModule({
			declarations: [PageDeviceSettingsComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore,CommsService,DevService]
		})
			.compileComponents();
	}));

	describe(':', () => {
        function setup() {
			const fixture = TestBed.createComponent(PageDeviceSettingsComponent);
            const component = fixture.componentInstance;
            commonService = fixture.debugElement.injector.get(CommonService);
            commsService = fixture.debugElement.injector.get(CommsService);
            cmsService = fixture.debugElement.injector.get(CMSService);
            qaService = fixture.debugElement.injector.get(QaService);
			audioService = fixture.debugElement.injector.get(AudioService);
			logger = fixture.debugElement.injector.get(LoggerService);
			deviceService= fixture.debugElement.injector.get(DeviceService);
			return { fixture, component, logger, deviceService,audioService,cmsService,qaService,commsService};
		}

	it('should create', () => {
        const { component } = setup();
		expect(component).toBeTruthy();
    });

    it('#onNotification should call', async() => {
		const { fixture, component } = setup();
        const myPrivateSpy = spyOn<any>(component, 'onNotification').and.callThrough();
        fixture.detectChanges();
        myPrivateSpy.call(component);
        notification.payload = {page:2};
        component.getMicrophoneSettings();

    });
    it('#getMicrophoneSettings should call', async() => {
		const { fixture, component,audioService } = setup();
		spyOn(audioService, 'getMicrophoneSettings').and.returnValue(Promise.resolve(microphone));
		spyOn(component,'getMicrophoneSettings')
		fixture.detectChanges();
		await component.getMicrophoneSettings();
        expect(component.getMicrophoneSettings).toHaveBeenCalled();
    });
    it('#fetchCMSArticles should call', async() => {
		const { fixture, component,audioService } = setup();
		spyOn(cmsService, 'getOneCMSContent').and.returnValue(Promise.resolve(true));
		spyOn(component,'fetchCMSArticles')
		fixture.detectChanges();
		await component.fetchCMSArticles();
        expect(component.fetchCMSArticles).toHaveBeenCalled();

    });
    it('#onRouteActivate should call', async() => {
		const { fixture, component } = setup();
		fixture.detectChanges();
		await component.onRouteActivate(new Event('click'),activeElement);
	});
    
});

});
