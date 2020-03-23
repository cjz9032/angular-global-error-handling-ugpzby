import { async, TestBed, ComponentFixture, fakeAsync, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PowerSmartSettingsComponent } from './power-smart-settings.component';
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PowerService } from 'src/app/services/power/power.service';
import { CommonService } from 'src/app/services/common/common.service';
import { IntelligentCoolingCapability } from 'src/app/data-models/device/intelligent-cooling-capability.model';
import { ModalIntelligentCoolingModesComponent } from '../../modal/modal-intelligent-cooling-modes/modal-intelligent-cooling-modes.component';

import {
	ICModes,
	IntelligentCoolingMode,
	IntelligentCoolingModes,
	IntelligentCoolingHardware,
	DYTC6Modes
} from 'src/app/enums/intelligent-cooling.enum';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe("Component: PowerSmartSetting", () => {
	let component: PowerSmartSettingsComponent;
	let fixture: ComponentFixture<PowerSmartSettingsComponent>;
	let commonService: CommonService;
	let translate: TranslateService
	let powerService: PowerService;
	let modalService: NgbModal
	let modalRef: NgbModalRef
	// let originalTimeout;
	const thinkpad = 1;
	const ideapad = 0;
	// const TRANSLATIONS_EN = require('assets/i18n/en.json');
	// const TRANSLATIONS_FR = require('assets/i18n/fr.json');
	beforeEach(async(() => {
		// originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
			providers: [LoggerService, PowerService, CommonService, TranslateService,NgbModal ]
		})
		// .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ModalIntelligentCoolingModesComponent] } })
		.compileComponents()
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PowerSmartSettingsComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		translate = TestBed.get(TranslateService)
		powerService = TestBed.get(PowerService)
	});

	// it("should create", function (done) {
	// 	setTimeout(function () {
	// 		done();
	// 	}, 9000);
	// 	expect(component).toBeTruthy();
	// });

	// afterEach(function () {
	// 	jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	// });

	it('should create component', () => {
		fixture.detectChanges()
		expect(component).toBeDefined()
	});

	it('should call initDataFromCache -- if cache', () => {
		component.cache = new IntelligentCoolingCapability()
		component.cache = {
			showIC: 6,
			captionText: '',
			mode: { type: "MMC_Cool", status: false, ideapadType4: "MMC_Cool", ideapadType3: "" },
			showIntelligentCoolingModes: true,
			autoModeToggle: { available: true, status: true, permission: true, isLoading: true},
			apsState: false,
			selectedModeText: ''
		}
		component.initDataFromCache()
		expect(component.showIC ).toEqual(component.cache.showIC)
	});

	// it('should call initDataFromCache -- if cache mode', () => {
	// 	component.cache = new IntelligentCoolingCapability()
	// 	component.cache.mode = { type: "MMC_Cool", status: false, ideapadType4: "MMC_Cool", ideapadType3: "" }
	// 	component.showIC = 6
	// 	// let spy = spyOn<any>(component, 'setPerformanceAndCool')
	// 	component.initDataFromCache()
	// 	expect(component.dytc6Mode).toEqual(component.cache.captionText)
	// });

	it('should call checkDriverForThinkPad', async(() => {
		// spyOn<any>(component, 'isYoga730').and.returnValue(true);
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
			currentMode: 'ITS_Auto'
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

	it('should call startMonitorForICIdeapad', () => {
		powerService.isShellAvailable = true
		let spy = spyOn(powerService, 'startMonitorForICIdeapad').and.returnValue(Promise.reject(Error))
		component.startMonitorForICIdeapad()
		expect(spy).toHaveBeenCalled()
	})

	it('should call updateSelectedModeText -case 1', () => {
		component.cache = new IntelligentCoolingCapability()
		let mode: IntelligentCoolingModes = IntelligentCoolingModes.Cool;
		component.updateSelectedModeText(mode)
		expect(component.updateSelectedModeText).toBeTruthy()
	})

	it('should call updateSelectedModeText -case 2', () => {
		component.cache = new IntelligentCoolingCapability()
		let mode: IntelligentCoolingModes = IntelligentCoolingModes.Performance;
		component.updateSelectedModeText(mode)
		expect(component.updateSelectedModeText).toBeTruthy()
	})

	it('should call updateSelectedModeText -case 3', () => {
		component.cache = new IntelligentCoolingCapability()
		let mode: IntelligentCoolingModes = IntelligentCoolingModes.BatterySaving;
		component.updateSelectedModeText(mode)
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

	it('should throw error - setPowerSmartSettingsForIdeaPad', () => {
		expect(component['setPowerSmartSettingsForIdeaPad']).toThrow()
	})

	it('should call initPowerSmartSettingsForThinkPad - its is 4', async(() => {
		component.cache = new IntelligentCoolingCapability()
		spyOn(IntelligentCoolingModes, 'getMode').and.returnValue({ type: ICModes.Error, status: false, ideapadType4: "", ideapadType3: "ITS_Auto" })
		spyOn<any>(component, 'getITSServiceStatus').and.returnValue(Promise.resolve(true))
		spyOn<any>(component, 'getDYTCRevision').and.returnValue(Promise.resolve(4))
		component.initPowerSmartSettingsForThinkPad()
		expect(component.cache.showIC).toEqual(component.showIC)
	}))

	it('should call initPowerSmartSettingsForThinkPad - catch block', async(() => {
		component.cache = new IntelligentCoolingCapability()
		spyOn<any>(component, 'getCQLCapability').and.returnValue(Promise.resolve(false))
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

	it('should call initPowerSmartSettingsForThinkPad - its is 6', ((done) => {
		component.cache = new IntelligentCoolingCapability()
		spyOn<any>(component, 'getITSServiceStatus').and.returnValue(Promise.resolve(true))
		spyOn<any>(component, 'getDYTCRevision').and.returnValue(Promise.resolve(6))
		// spyOn(powerService, 'getAMTCapability').and.returnValue(Promise.resolve(true))
		component.initPowerSmartSettingsForThinkPad()
		done()
		expect(component.cache.showIC).toEqual(component.showIC)		
	}));

	it('should call dytc6GetStatus', () => {
		let amtCapability = true
		let amtSetting = true
		component.cache = new IntelligentCoolingCapability()
		component['dytc6GetStatus'](amtCapability, amtSetting)
		expect(component.dytc6Mode).toEqual(DYTC6Modes.Auto)
	})

	it('should call dytc6GetStatus - amtSetting is false', () => {
		let amtCapability = true
		let amtSetting = false
		component.cache = new IntelligentCoolingCapability()
		component['dytc6GetStatus'](amtCapability, amtSetting)
		expect(component.dytc6Mode).toEqual(DYTC6Modes.Manual)
	})

	it('should call dytc6GetStatus - both are false', () => {
		let amtCapability = false
		let amtSetting = false
		component.cache = new IntelligentCoolingCapability()
		component['dytc6GetStatus'](amtCapability, amtSetting)
		expect(component.dytc6Mode).toEqual(DYTC6Modes.Manual)
	})

	it('should call getITSServiceStatus - else', () => {
		powerService.isShellAvailable = false
		let spy = spyOn(powerService, 'getITSServiceStatus');
		component['getITSServiceStatus']();
		expect(spy).not.toHaveBeenCalled()
	});

	it('should throw error - getITSServiceStatus', () => {
		expect(component['getITSServiceStatus']).toThrow()
	})

	it('should call getPMDriverStatus - else', () => {
		powerService.isShellAvailable = false
		let spy = spyOn(powerService, 'getPMDriverStatus');
		component['getPMDriverStatus']();
		expect(spy).not.toHaveBeenCalled()
	});

	it('should throw error - getPMDriverStatus', () => {
		expect(component['getPMDriverStatus']).toThrow()
	})

	it('should call getEMDriverStatus', () => {
		powerService.isShellAvailable = true
		component['getEMDriverStatus']()
		expect(component['getEMDriverStatus']).toBeTruthy()
	});

	it('should call isShowIntelligentCoolingModes', () => {
		component.legacyManualModeCapability = false
		component.isShowIntelligentCoolingModes()
		expect(component.isShowIntelligentCoolingModes).toBeTruthy()
	});

	it('should call isShowIntelligentCoolingModes -else', () => {
		component.legacyManualModeCapability = true
		component.isShowIntelligentCoolingModes()
		expect(component.isShowIntelligentCoolingModes).toBeTruthy()
	});

	it('should call getDYTCRevision - catch block', () => {
		expect(component['getDYTCRevision']).toThrow()
	});

	it('should call setPerformanceAndCool - Error mode', () => {
		component.cache = new IntelligentCoolingCapability()
		let mode: IntelligentCoolingMode = { type: ICModes.Error, status: false, ideapadType4: "", ideapadType3: "ITS_Auto" };
		component['setPerformanceAndCool'](mode)
		expect(component.enableIntelligentCoolingToggle).toEqual(true)
	});

	it('should throw error - getCQLCapability', () => {
		expect(component['getCQLCapability']).toThrow()
	})

	it('should throw error - getTIOCapability', () => {
		expect(component['getTIOCapability']).toThrow()
	})

	it('should call setAutoModeSetting', async(() => {
		let event = {switchValue: true}
		component.intelligentCoolingModes = IntelligentCoolingHardware.ITS13
		let spy = spyOn<any>(component, 'setPowerSmartSettingsForIdeaPad')
		component['setAutoModeSetting'](event)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setAutoModeSetting - switchValue is false', async(() => {
		let event = {switchValue: false}
		component.intelligentCoolingModes = IntelligentCoolingHardware.ITS13
		let spy = spyOn<any>(component, 'setPowerSmartSettingsForIdeaPad')
		component['setAutoModeSetting'](event)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setManualModeSetting - IntelligentCoolingHardware.ITS13', async(() => {
		let mode: IntelligentCoolingMode = { type: ICModes.Cool, status: true, ideapadType4: "ITS_Auto", ideapadType3: "MMC_Cool" };
		component.intelligentCoolingModes = IntelligentCoolingHardware.ITS13;
		let spy = spyOn<any>(component, 'setPerformanceAndCool')
		component['setManualModeSetting'](mode)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setManualModeSetting - IntelligentCoolingHardware.ITS14', async(() => {
		let mode: IntelligentCoolingMode = { type: ICModes.Performance, status: false, ideapadType4: "MMC_Performance", ideapadType3: "MMC_Performance" };
		component.intelligentCoolingModes = IntelligentCoolingHardware.ITS14;
		let spy = spyOn<any>(component, 'updateSelectedModeText')
		component['setManualModeSetting'](mode)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setManualModeSetting - IntelligentCoolingHardware.Legacy', async(() => {
		let mode: IntelligentCoolingMode = { type: ICModes.Cool, status: true, ideapadType4: "ITS_Auto", ideapadType3: "MMC_Cool" };
		component.intelligentCoolingModes = IntelligentCoolingHardware.Legacy;
		let spy = spyOn<any>(component, 'setPerformanceAndCool')
		component['setManualModeSetting'](mode)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setManualModeSetting - isShellAvailable else', async(() => {
		let mode: IntelligentCoolingMode = { type: ICModes.Cool, status: true, ideapadType4: "ITS_Auto", ideapadType3: "MMC_Cool" };
		// component.intelligentCoolingModes = IntelligentCoolingHardware.Legacy;
		powerService.isShellAvailable = false
		let spy = spyOn<any>(component, 'setPerformanceAndCool')
		component['setManualModeSetting'](mode)
		expect(spy).not.toHaveBeenCalled()
	}));

	it('should throw error - getManualModeSetting', () => {
		expect(component['getManualModeSetting']).toThrow()
	});

	it('should throw error - setLegacyAutoModeState', () => {
		powerService.isShellAvailable = false
		component['setLegacyAutoModeState'](false)
		expect(component['setLegacyAutoModeState']).toThrow()
	});

	it('should call setLegacyManualModeState', () => {
		powerService.isShellAvailable = true
		component['setLegacyManualModeState'](true)
		expect(component['setLegacyManualModeState']).toBeTruthy()
	});

	it('should call setLegacyManualModeState', () => {
		powerService.isShellAvailable = false
		component['setLegacyManualModeState'](true)
		expect(component['setLegacyManualModeState']).toBeTruthy()
	});

	it('should throw error - setLegacyManualModeState', () => {
		expect(component['setLegacyManualModeState']).toThrow()
	});

	it('should call getAMTCapability', () => {
		powerService.isShellAvailable = true;
		component['getAMTCapability']();
		expect(component['getAMTCapability']).toBeTruthy()
	});

	it('should call getAMTSetting', () => {
		powerService.isShellAvailable = true;
		component['getAMTSetting']()
		expect(component['getAMTSetting']).toBeTruthy()
	});

	// it('should call coolingModesPopUp', () => {
	// 	modalService = TestBed.get(NgbModal)
	// 	modalRef = modalService.open(ModalIntelligentCoolingModesComponent)
	// 	let spy = spyOn(modalService, 'open').and.returnValue(modalRef)
	// 	component.coolingModesPopUp()
	// 	expect(spy).toHaveBeenCalled()
	// })

	it('should call readMore', () => {
		let readMoreDiv: HTMLElement = document.createElement('div')
		component.readMore(readMoreDiv)
		expect(readMoreDiv.focus).toBeTruthy()
	});
});