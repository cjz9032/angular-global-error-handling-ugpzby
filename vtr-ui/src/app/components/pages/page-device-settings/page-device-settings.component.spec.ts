import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, Pipe, EventEmitter } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { PageDeviceSettingsComponent } from "./page-device-settings.component";

import { AudioService } from "../../../services/audio/audio.service";
import { CMSService } from "../../../services/cms/cms.service";
import { CommonService } from "../../../services/common/common.service";
import { CommsService } from "../../../services/comms/comms.service";
import { DevService } from "../../../services/dev/dev.service";
import { DeviceService } from "../../../services/device/device.service";
import { InputAccessoriesService } from "../../../services/input-accessories/input-accessories.service";
import { LoggerService } from "../../../services/logger/logger.service";
import { QaService } from "../../../services/qa/qa.service";

import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { AppNotification } from '../../../data-models/common/app-notification.model';

import {
	TranslateModule,
	TranslateService,
	LangChangeEvent
} from "@ngx-translate/core";
import { of } from "rxjs";
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';

const microphone = {
	available: true,
	muteDisabled: true,
	volume: 1,
	currentMode: "string",
	keyboardNoiseSuppression: true,
	autoOptimization: true,
	AEC: true,
	disableEffect: true,
	permission: true
};
const queryOptions = {
	Page: "device-settings"
};

class TranslateServiceStub {
	public onTranslationChange: EventEmitter<any> = new EventEmitter();
	public onDefaultLangChange: EventEmitter<any> = new EventEmitter();
	instant(data: string) {}
	stream(data: string) {
		return of(data);
	}
	get(key: string) {
		return of(key);
	}
	setDefaultLang(lang: string) {}
	use(lang: string) {}
	get onLangChange() {
		return of({ lang: "en" });
	}
}

describe("PageDeviceSettingsComponent", () => {
	let component: PageDeviceSettingsComponent;
	let fixture: ComponentFixture<PageDeviceSettingsComponent>;
	let audioService: AudioService;
	let commonService: CommonService;
	let logger: LoggerService;
	let deviceService: DeviceService;
	let cmsService: CMSService;
	let qaService: QaService;
	let keyboardService: InputAccessoriesService;
	let translate: TranslateService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageDeviceSettingsComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [
				CommsService,
				DevService,
				AudioService,
				LoggerService,
				CMSService,
				InputAccessoriesService,
				QaService,
				CommonService,
				{ provide: TranslateService, useClass: TranslateServiceStub }
			]
		});
	}));

	it("should create", async(() => {
		fixture = TestBed.createComponent(PageDeviceSettingsComponent);
		component = fixture.componentInstance;
		translate = TestBed.get(TranslateService);
		commonService = TestBed.get(CommonService);
		spyOn(component, 'initInputAccessories');
		const welcomeTut: WelcomeTutorial = {page: 2, tutorialVersion: 'someVersion', isDone: true}
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(welcomeTut)
		spyOnProperty(translate, "onLangChange", "get").and.returnValue(
			of({ lang: "fr" })
		);
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should call hidePowerPage', async(() => {
		fixture = TestBed.createComponent(PageDeviceSettingsComponent);
		component = fixture.componentInstance;
		spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
		const routeTo: boolean = true;
		component.hidePowerPage(routeTo);
		expect(component['router'].navigate).toHaveBeenCalledWith(['device/device-settings/audio'], { replaceUrl: true })
	}));

	it('should call onNotification - WelcomeTutorial', async(() => {
		fixture = TestBed.createComponent(PageDeviceSettingsComponent);
		component = fixture.componentInstance;
		const spy = spyOn(component, 'getAudioPageSettings')
		const notification: AppNotification = {
			type: LocalStorageKey.WelcomeTutorial,
			payload: {page: 2}
		}
		component['onNotification'](notification);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onNotification - IsPowerPageAvailable with no payload', async(() => {
		fixture = TestBed.createComponent(PageDeviceSettingsComponent);
		component = fixture.componentInstance;
		const spy = spyOn(component, 'hidePowerPage');
		const notification: AppNotification = {
			type: LocalStorageKey.IsPowerPageAvailable
		}
		component['onNotification'](notification);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onNotification - IsPowerPageAvailable with payload', async(() => {
		fixture = TestBed.createComponent(PageDeviceSettingsComponent);
		component = fixture.componentInstance;
		const spy = spyOn(component, 'hidePowerPage');
		const notification: AppNotification = {
			type: LocalStorageKey.IsPowerPageAvailable,
			payload: {page: 2}
		}
		component['onNotification'](notification);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call initInputAccessories - machineType equal to 1', async(() => {
		fixture = TestBed.createComponent(PageDeviceSettingsComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		component.machineType = 1;
		spyOn(commonService, 'getLocalStorageValue').and.returnValue('LenovoTablet10');
		const spy = spyOn(commonService, 'removeObjFrom')
		component.initInputAccessories()
		expect(spy).toHaveBeenCalled();
	}));

	it('should call initInputAccessories - machineType not equal to 1 or 0', async(() => {
		fixture = TestBed.createComponent(PageDeviceSettingsComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		component.machineType = 2;
		const spy = spyOn(commonService, 'removeObjFrom')
		component.initInputAccessories()
		expect(spy).toHaveBeenCalled();
	}));

	it('should call initInputAccessories - machineType equal to 1 or 0', async(() => {
		fixture = TestBed.createComponent(PageDeviceSettingsComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		component.machineType = 1;
		component.machineType = 0;
		const inputAccessoriesCapability: InputAccessoriesCapability = {
			isKeyboardMapAvailable: true,
			isUdkAvailable: false,
			isVoipAvailable: true,
			image: '',
			additionalCapabilitiesObj: {},
			keyboardVersion: '4.0.1',
			keyboardLayoutName: ''
		}
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(inputAccessoriesCapability);
		// const spy = spyOn(commonService, 'removeObjFrom')
		component.initInputAccessories()
		// expect(spy).toHaveBeenCalled();
	}));
});
