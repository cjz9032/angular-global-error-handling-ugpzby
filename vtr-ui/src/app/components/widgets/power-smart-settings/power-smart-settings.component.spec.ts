import { async, TestBed, ComponentFixture, fakeAsync, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { PowerSmartSettingsComponent } from './power-smart-settings.component';
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PowerService } from 'src/app/services/power/power.service';
import { CommonService } from 'src/app/services/common/common.service';
import { IntelligentCoolingCapability } from 'src/app/data-models/device/intelligent-cooling-capability.model';
import {
	ICModes,
	IntelligentCoolingMode,
	IntelligentCoolingModes,
	IntelligentCoolingHardware,
	DYTC6Modes
} from 'src/app/enums/intelligent-cooling.enum';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';

describe("Component: PowerSmartSetting", () => {
	let component: PowerSmartSettingsComponent;
	let fixture: ComponentFixture<PowerSmartSettingsComponent>;
	let commonService: CommonService;
	let translate: TranslateService
	let powerService: PowerService;
	// const fakeTraslateService = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
	const thinkpad = 1;
	const ideapad = 0;
	// const TRANSLATIONS_EN = require('../../../assets/i18n/en.json');
	// const TRANSLATIONS_FR = require('../../../assets/i18n/fr.json');
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [PowerSmartSettingsComponent],
			imports: [TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				  }
			}), HttpClientTestingModule],
			providers: [LoggerService, PowerService, CommonService, TranslateService ]
		}).compileComponents()
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PowerSmartSettingsComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		translate = TestBed.get(TranslateService)
		powerService = TestBed.get(PowerService)
	});

	it('should create component', () => {
		fixture.detectChanges()
		expect(component).toBeDefined()
	});

	it('should call initDataFromCache -- if cache mode', () => {
		component.cache = new IntelligentCoolingCapability()
		component.cache.mode = { type: ICModes.Cool, status: true, ideapadType4: "ITS_Auto", ideapadType3: "MMC_Cool" }
		let spy = spyOn<any>(component, 'setPerformanceAndCool').and.callThrough()
		component.initDataFromCache()
		fixture.detectChanges()
		// expect(spy).toHaveBeenCalled()
	});

	it('should call initDataFromCache -- else cache mode', () => {
		component.cache = new IntelligentCoolingCapability()
		component.cache.mode = { type: '', status: false, ideapadType4: "", ideapadType3: "" }
		let spy = spyOn<any>(component, 'setPerformanceAndCool').and.callThrough()
		component.initDataFromCache()
		fixture.detectChanges()
		// expect(spy).not.toHaveBeenCalled()
	});

	it('should call checkDriverForThinkPad', async(() => {
		// spyOn<any>(component, 'getEMDriverStatus').and.returnValue(Promise.resolve(true));
		component.cache = new IntelligentCoolingCapability()
		component.checkDriverForThinkPad()
		expect(component.checkDriverForThinkPad).toBeTruthy()
	}));

	it('should call onIntelligentCoolingToggle', () => {
		component.cache = new IntelligentCoolingCapability()
		component.showIC = 0
		const event = {switchValue: 'abc'};
		const isSetManualMode: boolean = true;
		component.onIntelligentCoolingToggle(event, isSetManualMode)
		expect(component.enableIntelligentCoolingToggle).toEqual(true)
	});

	it('should call onIntelligentCoolingToggle -- else', () => {
		component.cache = new IntelligentCoolingCapability()
		component.showIC = 0
		const event = {switchValue: ''};
		const isSetManualMode: boolean = true;
		component.onIntelligentCoolingToggle(event, isSetManualMode)
		expect(component.enableIntelligentCoolingToggle).toEqual(false)
	});

	it('should call onIntelligentCoolingToggle -- else', () => {
		component.cache = new IntelligentCoolingCapability()
		component.showIC = 0
		const event = {switchValue: ''};
		const isSetManualMode: boolean = false;
		let spy = spyOn<any>(component, 'setManualModeSetting').and.callThrough()
		component.onIntelligentCoolingToggle(event, isSetManualMode)
		expect(spy).not.toHaveBeenCalled()
	});

	it('should call changeQuietCool', () => {
		let event = new Event('cool')
		let spy = spyOn<any>(component, 'setManualModeSetting').and.callThrough()
		component.changeQuietCool(event)
		expect(spy).toHaveBeenCalled()
	});

	it('should call changePerformance', () => {
		let event = new Event('cool')
		let spy = spyOn<any>(component, 'setManualModeSetting').and.callThrough()
		component.changePerformance(event)
		expect(spy).toHaveBeenCalled()
	});

	it('should call changeBatterySaving', () => {
		let event = new Event('cool')
		let spy = spyOn<any>(component, 'setManualModeSetting').and.callThrough()
		component.changeBatterySaving(event)
		expect(spy).toHaveBeenCalled()
	});

	it('should call showMoreDytc6', () => {
		component.showMoreDytc6();
		expect(component.isCollapsed).toEqual(true)
	});

	it('should call initPowerSmartSettingsForIdeaPad', async(() => {
		let response = {
			// available: true,
			itsVersion: 4,
		}
		component.cache = new IntelligentCoolingCapability()
		let spy = spyOn(powerService, 'getITSModeForICIdeapad').and.returnValue(Promise.resolve(response))
		component.initPowerSmartSettingsForIdeaPad()
		expect(spy).toHaveBeenCalled()
	}));	

	it('should call initPowerSmartSettingsForIdeaPad - available is present', async(() => {
		let response = {
			available: true,
			itsVersion: 3,
		}
		let spy = spyOn(powerService, 'getITSModeForICIdeapad').and.returnValue(Promise.resolve(response))
		component.initPowerSmartSettingsForIdeaPad()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call initPowerSmartSettingsForIdeaPad -catch block', async(() => {
		// let response = {
		// 	available: true,
		// 	itsVersion: 3,
		// }
		component.cache = new IntelligentCoolingCapability()
		let spy = spyOn(powerService, 'getITSModeForICIdeapad').and.returnValue(Promise.reject(Error))
		component.initPowerSmartSettingsForIdeaPad()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call initPowerSmartSettingsUIForIdeaPad itsVersion is 3', () => {
		let response = {
			available: true,
			itsVersion: 3,
		}
		
		component.initPowerSmartSettingsUIForIdeaPad(response)
		expect(component.intelligentCoolingModes).toEqual(IntelligentCoolingHardware.ITS13)
	})

	it('should call initPowerSmartSettingsUIForIdeaPad itsVersion is 4', () => {
		let response = {
			available: true,
			itsVersion: 4,
		}
		component.initPowerSmartSettingsUIForIdeaPad(response)
		expect(component.intelligentCoolingModes).toEqual(IntelligentCoolingHardware.ITS14)
	})

	it('should call initPowerSmartSettingsUIForIdeaPad itsVersion is empty', () => {
		let response = {
			available: true,
			itsVersion: ''
		}
		component.initPowerSmartSettingsUIForIdeaPad(response)
		expect(component.intelligentCoolingModes).toEqual(IntelligentCoolingHardware.ITS)
	});

	it('should call initPowerSmartSettingsUIForIdeaPad response is empty', () => {
		let response = {}
		component.initPowerSmartSettingsUIForIdeaPad(response)
		expect(component.intelligentCoolingModes).not.toEqual(IntelligentCoolingHardware.ITS13)
	});

	it('should call callbackForStartMonitorICIdeapad', () => {
		let response = {
			available: true,
			itsVersion: 3,
			currentMode: 'Cool'
		}
		let spy = spyOn(component, 'initPowerSmartSettingsUIForIdeaPad').and.callThrough()
		component.callbackForStartMonitorICIdeapad(response)
		expect(spy).toHaveBeenCalled()
	});

	it('should call updateSelectedModeText', () => {
		// component.selectedModeText = ''
		component.cache = new IntelligentCoolingCapability()
		let modes: IntelligentCoolingModes = { type: ICModes.Cool, status: true, ideapadType4: "ITS_Auto", ideapadType3: "MMC_Cool" };
		spyOn(translate, 'instant').and.returnValue('device.deviceSettings.power.powerSmartSettings.intelligentCooling.selectedModeText.quiteCool')
		component.updateSelectedModeText(modes)
		expect(component.updateSelectedModeText).toBeTruthy()
	})

	it('should call setPowerSmartSettingsForIdeaPad', () => {
		let value = 'abc'
		powerService.isShellAvailable = true
		component['setPowerSmartSettingsForIdeaPad'](value)
		expect(component['setPowerSmartSettingsForIdeaPad']).toBeTruthy()
	});

	it('should call setPowerSmartSettingsForIdeaPad -else ', () => {
		let value = 'abc'
		powerService.isShellAvailable = false
		component['setPowerSmartSettingsForIdeaPad'](value)
		expect(component['setPowerSmartSettingsForIdeaPad']).toBeTruthy()
	});

	it('should call initPowerSmartSettingsForThinkPad - its is 4', async(() => {
		component.cache = new IntelligentCoolingCapability()
		spyOn<any>(component, 'getITSServiceStatus').and.returnValue(Promise.resolve(true))
		spyOn<any>(component, 'getDYTCRevision').and.returnValue(Promise.resolve(4))
		component.initPowerSmartSettingsForThinkPad()
		expect(component.cache.showIC).toEqual(component.showIC)
	}))

	it('should call initPowerSmartSettingsForThinkPad - its is 5', async(() => {
		component.cache = new IntelligentCoolingCapability()
		spyOn<any>(component, 'getITSServiceStatus').and.returnValue(Promise.resolve(true))
		spyOn<any>(component, 'getDYTCRevision').and.returnValue(Promise.resolve(5))
		component.initPowerSmartSettingsForThinkPad()
		expect(component.cache.showIC).toEqual(component.showIC)
	}))

	// it('should call initPowerSmartSettingsForThinkPad - its is 6', async(() => {
	// 	component.cache = new IntelligentCoolingCapability()
	// 	spyOn<any>(component, 'getITSServiceStatus').and.returnValue(Promise.resolve(true))
	// 	spyOn<any>(component, 'getDYTCRevision').and.returnValue(Promise.resolve(6))
	// 	// spyOn(powerService, 'getAMTCapability').and.returnValue(Promise.resolve(true))
	// 	component.initPowerSmartSettingsForThinkPad()
		
	// }))

	it('should call dytc6GetStatus', () => {
		let amtCapability = true
		let amtSetting = true
		component.cache = new IntelligentCoolingCapability()
		component['dytc6GetStatus'](amtCapability, amtSetting)

	})

	it('should call setPerformanceAndCool - Error mode', () => {
		component.cache = new IntelligentCoolingCapability()
		let mode: IntelligentCoolingMode = { type: ICModes.Error, status: false, ideapadType4: "", ideapadType3: "ITS_Auto" };
		component['setPerformanceAndCool'](mode)
		expect(component.enableIntelligentCoolingToggle).toEqual(true)
	})

	it('should call readMore', () => {
		let readMoreDiv: HTMLElement = document.createElement('div')
		component.readMore(readMoreDiv)
		expect(readMoreDiv.focus).toBeTruthy()
	});
});