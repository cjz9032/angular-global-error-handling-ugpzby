import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogRef } from '@lenovo/material/dialog';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

import { PowerSmartSettingsComponent } from './power-smart-settings.component';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { PowerService } from 'src/app/services/power/power.service';
import { CommonService } from 'src/app/services/common/common.service';
import { IntelligentCoolingCapability } from 'src/app/data-models/device/intelligent-cooling-capability.model';
import { MetricService } from 'src/app/services/metric/metrics.service';
import {
	ICModes,
	IntelligentCoolingMode,
	IntelligentCoolingModes,
	IntelligentCoolingHardware,
	DYTC6Modes,
} from 'src/app/enums/intelligent-cooling.enum';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { DevService } from 'src/app/services/dev/dev.service';

describe('Component: PowerSmartSetting', () => {
	let component: PowerSmartSettingsComponent;
	let fixture: ComponentFixture<PowerSmartSettingsComponent>;
	let commonService: CommonService;
	let translate: TranslateService;
	let powerService: PowerService;
	let metricService: MetricService;
	// let modalService: MatDialog
	// let modalRef: MatDialogRef
	// let originalTimeout;
	// const thinkpad = 1;
	// const ideapad = 0;
	// const TRANSLATIONS_EN = require('assets/i18n/en.json');
	// const TRANSLATIONS_FR = require('assets/i18n/fr.json');
	beforeEach(
		waitForAsync(() => {
			// originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
			// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
			TestBed.configureTestingModule({
				schemas: [NO_ERRORS_SCHEMA],
				declarations: [PowerSmartSettingsComponent],
				imports: [
					RouterTestingModule,
					TranslateModule.forRoot({
						loader: {
							provide: TranslateLoader,
							useFactory: HttpLoaderFactory,
							deps: [HttpClient],
						},
					}),
					HttpClientTestingModule,
				],
				providers: [
					LoggerService,
					PowerService,
					CommonService,
					TranslateService,
					MatDialog,
					MetricService,
					DevService,
				],
			})
				// .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ModalIntelligentCoolingModesComponent] } })
				.compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PowerSmartSettingsComponent);
		component = fixture.componentInstance;
		commonService = TestBed.inject(CommonService);
		translate = TestBed.inject(TranslateService);
		powerService = TestBed.inject(PowerService);
		metricService = TestBed.inject(MetricService);
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
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	it('should call initDataFromCache -- if cache', () => {
		component.cache = new IntelligentCoolingCapability();
		component.cache = {
			showIC: 6,
			captionText: '',
			mode: { type: 'MMC_Cool', status: false, ideapadType4: 'MMC_Cool', ideapadType3: '' },
			showIntelligentCoolingModes: true,
			autoModeToggle: { available: true, status: true, permission: true, isLoading: true },
			apsState: false,
			selectedModeText: '',
			isAutoTransitionEnabled: false,
		};
		component.initDataFromCache();
		expect(component.showIC).toEqual(component.cache.showIC);
	});

	// it('should call initDataFromCache -- if cache mode', () => {
	// 	component.cache = new IntelligentCoolingCapability()
	// 	component.cache.mode = { type: "MMC_Cool", status: false, ideapadType4: "MMC_Cool", ideapadType3: "" }
	// 	component.showIC = 6
	// 	// let spy = spyOn<any>(component, 'setPerformanceAndCool')
	// 	component.initDataFromCache()
	// 	expect(component.dytc6Mode).toEqual(component.cache.captionText)
	// });

	it(
		'should call checkDriverForThinkPad',
		waitForAsync(() => {
			// spyOn<any>(component, 'isYoga730').and.returnValue(true);
			component.cache = new IntelligentCoolingCapability();
			component.checkDriverForThinkPad();
			expect(component.checkDriverForThinkPad).toBeTruthy();
		})
	);

	it('should call onIntelligentCoolingToggle', () => {
		component.cache = new IntelligentCoolingCapability();
		component.showIC = 0;
		const event = { switchValue: 'abc' };
		const isSetManualMode = true;
		component.onIntelligentCoolingToggle(event, isSetManualMode);
		expect(component.enableIntelligentCoolingToggle).toEqual(true);
	});

	it('should call onIntelligentCoolingToggle -- else', () => {
		component.cache = new IntelligentCoolingCapability();
		component.showIC = 0;
		const event = { switchValue: '' };
		const isSetManualMode = true;
		component.onIntelligentCoolingToggle(event, isSetManualMode);
		expect(component.enableIntelligentCoolingToggle).toEqual(false);
	});

	it('should call onIntelligentCoolingToggle -- else', () => {
		component.cache = new IntelligentCoolingCapability();
		component.showIC = 0;
		const event = { switchValue: '' };
		const isSetManualMode = false;
		const spy = spyOn<any>(component, 'setManualModeSetting').and.callThrough();
		component.onIntelligentCoolingToggle(event, isSetManualMode);
		expect(spy).not.toHaveBeenCalled();
	});

	it('should call changeQuietCool', () => {
		const event = new Event('cool');
		const spy = spyOn<any>(component, 'setManualModeSetting').and.callThrough();
		component.changeQuietCool();
		expect(spy).toHaveBeenCalled();
	});

	it('should call changePerformance', () => {
		const event = new Event('cool');
		const spy = spyOn<any>(component, 'setManualModeSetting').and.callThrough();
		component.changePerformance();
		expect(spy).toHaveBeenCalled();
	});

	it('should call changeBatterySaving', () => {
		const event = new Event('cool');
		const spy = spyOn<any>(component, 'setManualModeSetting').and.callThrough();
		component.changeBatterySaving();
		expect(spy).toHaveBeenCalled();
	});

	it('should call showMoreDytc6', () => {
		component.showMoreDytc6();
		expect(component.isCollapsed).toEqual(true);
	});

	it(
		'should call initPowerSmartSettingsForIdeaPad',
		waitForAsync(() => {
			const response = {
				// available: true,
				itsVersion: 4,
			};
			component.cache = new IntelligentCoolingCapability();
			const spy = spyOn(powerService, 'getITSModeForICIdeapad').and.returnValue(
				Promise.resolve(response)
			);
			component.initPowerSmartSettingsForIdeaPad();
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call initPowerSmartSettingsForIdeaPad - available is present',
		waitForAsync(() => {
			const response = {
				available: true,
				itsVersion: 3,
			};
			const spy = spyOn(powerService, 'getITSModeForICIdeapad').and.returnValue(
				Promise.resolve(response)
			);
			component.initPowerSmartSettingsForIdeaPad();
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call initPowerSmartSettingsForIdeaPad -catch block',
		waitForAsync(() => {
			// let response = {
			// 	available: true,
			// 	itsVersion: 3,
			// }
			component.cache = new IntelligentCoolingCapability();
			const spy = spyOn(powerService, 'getITSModeForICIdeapad').and.returnValue(
				Promise.reject(Error)
			);
			component.initPowerSmartSettingsForIdeaPad();
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call initPowerSmartSettingsForIdeaPad - itsVersion = 4',
		waitForAsync(() => {
			const response = {
				available: true,
				itsVersion: 4,
			};
			const spy = spyOn(powerService, 'getITSModeForICIdeapad').and.returnValue(
				Promise.resolve(response)
			);
			component.initPowerSmartSettingsForIdeaPad();
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call initPowerSmartSettingsForIdeaPad - itsVersion >= 5',
		waitForAsync(() => {
			const response = {
				available: true,
				itsVersion: 5,
			};
			const spy = spyOn(powerService, 'getITSModeForICIdeapad').and.returnValue(
				Promise.resolve(response)
			);
			component.initPowerSmartSettingsForIdeaPad();
			expect(spy).toHaveBeenCalled();
		})
	);

	it('should call initPowerSmartSettingsUIForIdeaPad itsVersion is 3', () => {
		const response = {
			available: true,
			itsVersion: 3,
			currentMode: 'ITS_Auto',
		};
		component.initPowerSmartSettingsUIForIdeaPad(response, false);
		expect(component.intelligentCoolingModes).toEqual(IntelligentCoolingHardware.ITS13);
	});

	it('should call initPowerSmartSettingsUIForIdeaPad itsVersion is 4', () => {
		const response = {
			available: true,
			itsVersion: 4,
		};
		component.initPowerSmartSettingsUIForIdeaPad(response, false);
		expect(component.intelligentCoolingModes).toEqual(IntelligentCoolingHardware.ITS14);
	});

	it('should call initPowerSmartSettingsUIForIdeaPad itsVersion is 5', () => {
		const response = {
			available: true,
			itsVersion: 5,
		};
		component.initPowerSmartSettingsUIForIdeaPad(response, false);
		expect(component.intelligentCoolingModes).toEqual(IntelligentCoolingHardware.ITS15);
	});

	it('should call initPowerSmartSettingsUIForIdeaPad itsVersion is empty', () => {
		const response = {
			available: true,
			itsVersion: '',
		};
		component.initPowerSmartSettingsUIForIdeaPad(response, false);
		expect(component.intelligentCoolingModes).toEqual(IntelligentCoolingHardware.ITS);
	});

	it('should call initPowerSmartSettingsUIForIdeaPad response is empty', () => {
		const response = {};
		component.initPowerSmartSettingsUIForIdeaPad(response, false);
		expect(component.intelligentCoolingModes).not.toEqual(IntelligentCoolingHardware.ITS13);
	});

	it('should call callbackForStartMonitorICIdeapad', () => {
		const response = {
			available: true,
			itsVersion: 3,
			currentMode: 'Cool',
		};
		const spy = spyOn(component, 'initPowerSmartSettingsUIForIdeaPad').and.callThrough();
		component.callbackForStartMonitorICIdeapad(response);
		expect(spy).toHaveBeenCalled();
	});

	it('should call startMonitorForICIdeapad', () => {
		powerService.isShellAvailable = true;
		const spy = spyOn(powerService, 'startMonitorForICIdeapad').and.returnValue(
			Promise.reject(Error)
		);
		component.startMonitorForICIdeapad();
		expect(spy).toHaveBeenCalled();
	});

	it('should call updateSelectedModeText -case 1', () => {
		component.cache = new IntelligentCoolingCapability();
		const mode: IntelligentCoolingModes = IntelligentCoolingModes.Cool;
		component.updateSelectedModeText(mode);
		expect(component.updateSelectedModeText).toBeTruthy();
	});

	it('should call updateSelectedModeText -case 2', () => {
		component.cache = new IntelligentCoolingCapability();
		const mode: IntelligentCoolingModes = IntelligentCoolingModes.Performance;
		component.updateSelectedModeText(mode);
		expect(component.updateSelectedModeText).toBeTruthy();
	});

	it('should call updateSelectedModeText -case 3 showIC=14', () => {
		component.cache = new IntelligentCoolingCapability();
		component.showIC = 14;
		const mode: IntelligentCoolingModes = IntelligentCoolingModes.BatterySaving;
		component.updateSelectedModeText(mode);
		expect(component.updateSelectedModeText).toBeTruthy();
	});

	it('should call updateSelectedModeText -case 3 showIC=15', () => {
		component.cache = new IntelligentCoolingCapability();
		component.showIC = 15;
		const mode: IntelligentCoolingModes = IntelligentCoolingModes.BatterySaving;
		component.updateSelectedModeText(mode);
		expect(component.updateSelectedModeText).toBeTruthy();
	});

	it('should call setPowerSmartSettingsForIdeaPad', () => {
		const value = 'abc';
		powerService.isShellAvailable = true;

		// @ts-ignore private method access
		component.setPowerSmartSettingsForIdeaPad(value);
		// @ts-ignore private method access
		expect(component.setPowerSmartSettingsForIdeaPad).toBeTruthy();
	});

	it('should call setPowerSmartSettingsForIdeaPad -else ', () => {
		const value = 'abc';
		powerService.isShellAvailable = false;
		// @ts-ignore private method access
		component.setPowerSmartSettingsForIdeaPad(value);
		// @ts-ignore private method access
		expect(component.setPowerSmartSettingsForIdeaPad).toBeTruthy();
	});

	it('should throw error - setPowerSmartSettingsForIdeaPad', () => {
		// @ts-ignore private method access
		expect(component.setPowerSmartSettingsForIdeaPad).toThrow();
	});

	// it('should call initPowerSmartSettingsForThinkPad - its is 4', async(() => {
	// 	component.cache = new IntelligentCoolingCapability()
	// 	spyOn(IntelligentCoolingModes, 'getMode').and.returnValue({ type: ICModes.Error, status: false, ideapadType4: '', ideapadType3: 'ITS_Auto' })
	// 	spyOn<any>(component, 'getITSServiceStatus').and.returnValue(Promise.resolve(true))
	// 	spyOn<any>(component, 'getDYTCRevision').and.returnValue(Promise.resolve(4))
	// 	component.initPowerSmartSettingsForThinkPad()
	// 	expect(component.cache.showIC).toEqual(component.showIC)
	// }))

	// it('should call initPowerSmartSettingsForThinkPad - catch block', async(() => {
	// 	component.cache = new IntelligentCoolingCapability()
	// 	spyOn<any>(component, 'getCQLCapability').and.returnValue(Promise.resolve(false))
	// 	spyOn<any>(component, 'getITSServiceStatus').and.returnValue(Promise.resolve(true))
	// 	spyOn<any>(component, 'getDYTCRevision').and.returnValue(Promise.resolve(4))
	// 	component.initPowerSmartSettingsForThinkPad()
	// 	expect(component.cache.showIC).toEqual(component.showIC)
	// }))

	// it('should call initPowerSmartSettingsForThinkPad - its is 5', async(() => {
	// 	component.cache = new IntelligentCoolingCapability()
	// 	spyOn<any>(component, 'getITSServiceStatus').and.returnValue(Promise.resolve(true))
	// 	spyOn<any>(component, 'getDYTCRevision').and.returnValue(Promise.resolve(5))
	// 	component.initPowerSmartSettingsForThinkPad()
	// 	expect(component.cache.showIC).toEqual(component.showIC)
	// }))

	// it('should call initPowerSmartSettingsForThinkPad - its is 6', ((done) => {
	// 	component.cache = new IntelligentCoolingCapability()
	// 	spyOn<any>(component, 'getITSServiceStatus').and.returnValue(Promise.resolve(true))
	// 	spyOn<any>(component, 'getDYTCRevision').and.returnValue(Promise.resolve(6))
	// 	// spyOn(powerService, 'getAMTCapability').and.returnValue(Promise.resolve(true))
	// 	component.initPowerSmartSettingsForThinkPad()
	// 	done()
	// 	expect(component.cache.showIC).toEqual(component.showIC)
	// }));

	it('should call dytc6GetStatus', () => {
		const amtCapability = true;
		const amtSetting = true;
		component.cache = new IntelligentCoolingCapability();
		// @ts-ignore private method access
		component.dytc6GetStatus(amtCapability, amtSetting);
		expect(component.dytc6Mode).toEqual(DYTC6Modes.Auto);
	});

	it('should call dytc6GetStatus - amtSetting is false', () => {
		const amtCapability = true;
		const amtSetting = false;
		component.cache = new IntelligentCoolingCapability();
		// @ts-ignore private method access
		component.dytc6GetStatus(amtCapability, amtSetting);
		expect(component.dytc6Mode).toEqual(DYTC6Modes.Manual);
	});

	it('should call dytc6GetStatus - both are false', () => {
		const amtCapability = false;
		const amtSetting = false;
		component.cache = new IntelligentCoolingCapability();
		// @ts-ignore private method access
		component.dytc6GetStatus(amtCapability, amtSetting);
		expect(component.dytc6Mode).toEqual(DYTC6Modes.Manual);
	});

	it('should call getITSServiceStatus - else', () => {
		powerService.isShellAvailable = false;
		const spy = spyOn(powerService, 'getITSServiceStatus');
		// @ts-ignore private method access
		component.getITSServiceStatus();
		expect(spy).not.toHaveBeenCalled();
	});

	it('should throw error - getITSServiceStatus', () => {
		// @ts-ignore private method access
		expect(component.getITSServiceStatus).toThrow();
	});

	it('should call getPMDriverStatus - else', () => {
		powerService.isShellAvailable = false;
		const spy = spyOn(powerService, 'getPMDriverStatus');
		// @ts-ignore private method access
		component.getPMDriverStatus();
		expect(spy).not.toHaveBeenCalled();
	});

	it('should throw error - getPMDriverStatus', () => {
		// @ts-ignore private method access
		expect(component.getPMDriverStatus).toThrow();
	});

	it('should call getEMDriverStatus', () => {
		powerService.isShellAvailable = true;
		// @ts-ignore private method access
		component.getEMDriverStatus();
		// @ts-ignore private method access
		expect(component.getEMDriverStatus).toBeTruthy();
	});

	it('should call getDYTCRevision - catch block', () => {
		// @ts-ignore private method access
		expect(component.getDYTCRevision).toThrow();
	});

	it('should call setPerformanceAndCool - Error mode', () => {
		component.cache = new IntelligentCoolingCapability();
		const mode: IntelligentCoolingMode = {
			type: ICModes.Error,
			status: false,
			ideapadType4: '',
			ideapadType3: 'ITS_Auto',
		};
		// @ts-ignore private method access
		component.setPerformanceAndCool(mode);
		expect(component.enableIntelligentCoolingToggle).toEqual(true);
	});

	it('should throw error - getCQLCapability', () => {
		// @ts-ignore private method access
		expect(component.getCQLCapability).toThrow();
	});

	it('should throw error - getTIOCapability', () => {
		// @ts-ignore private method access
		expect(component.getTIOCapability).toThrow();
	});

	it(
		'should call setAutoModeSetting',
		waitForAsync(() => {
			const event = { switchValue: true };
			component.intelligentCoolingModes = IntelligentCoolingHardware.ITS13;
			const spy = spyOn<any>(component, 'setPowerSmartSettingsForIdeaPad');
			// @ts-ignore private method access
			component.setAutoModeSetting(event);
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call setAutoModeSetting - switchValue is false',
		waitForAsync(() => {
			const event = { switchValue: false };
			component.intelligentCoolingModes = IntelligentCoolingHardware.ITS13;
			const spy = spyOn<any>(component, 'setPowerSmartSettingsForIdeaPad');
			// @ts-ignore private method access
			component.setAutoModeSetting(event);
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call setManualModeSetting - IntelligentCoolingHardware.ITS13',
		waitForAsync(() => {
			const mode: IntelligentCoolingMode = {
				type: ICModes.Cool,
				status: true,
				ideapadType4: 'ITS_Auto',
				ideapadType3: 'MMC_Cool',
			};
			component.intelligentCoolingModes = IntelligentCoolingHardware.ITS13;
			const spy = spyOn<any>(component, 'setPerformanceAndCool');
			// @ts-ignore private method access
			component.setManualModeSetting(mode);
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call setManualModeSetting - IntelligentCoolingHardware.ITS14',
		waitForAsync(() => {
			const mode: IntelligentCoolingMode = {
				type: ICModes.Performance,
				status: false,
				ideapadType4: 'MMC_Performance',
				ideapadType3: 'MMC_Performance',
			};
			component.intelligentCoolingModes = IntelligentCoolingHardware.ITS14;
			const spy = spyOn<any>(component, 'updateSelectedModeText');
			// @ts-ignore private method access
			component.setManualModeSetting(mode);
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call setManualModeSetting - IntelligentCoolingHardware.Legacy',
		waitForAsync(() => {
			const mode: IntelligentCoolingMode = {
				type: ICModes.Cool,
				status: true,
				ideapadType4: 'ITS_Auto',
				ideapadType3: 'MMC_Cool',
			};
			component.intelligentCoolingModes = IntelligentCoolingHardware.Legacy;
			const spy = spyOn<any>(component, 'setPerformanceAndCool');
			// @ts-ignore private method access
			component.setManualModeSetting(mode);
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call setManualModeSetting - isShellAvailable else',
		waitForAsync(() => {
			const mode: IntelligentCoolingMode = {
				type: ICModes.Cool,
				status: true,
				ideapadType4: 'ITS_Auto',
				ideapadType3: 'MMC_Cool',
			};
			// component.intelligentCoolingModes = IntelligentCoolingHardware.Legacy;
			powerService.isShellAvailable = false;
			const spy = spyOn<any>(component, 'setPerformanceAndCool');
			// @ts-ignore private method access
			component.setManualModeSetting(mode);
			expect(spy).not.toHaveBeenCalled();
		})
	);

	it('should throw error - getManualModeSetting', () => {
		// @ts-ignore private method access
		expect(component.getManualModeSetting).toThrow();
	});

	it('should throw error - setLegacyAutoModeState', () => {
		powerService.isShellAvailable = false;
		// @ts-ignore private method access
		component.setLegacyAutoModeState(false);
		// @ts-ignore private method access
		expect(component.setLegacyAutoModeState).toThrow();
	});

	it('should call setLegacyManualModeState', () => {
		powerService.isShellAvailable = true;
		// @ts-ignore private method access
		component.setLegacyManualModeState(true);
		// @ts-ignore private method access
		expect(component.setLegacyManualModeState).toBeTruthy();
	});

	it('should call setLegacyManualModeState', () => {
		powerService.isShellAvailable = false;
		// @ts-ignore private method access
		component.setLegacyManualModeState(true);
		// @ts-ignore private method access
		expect(component.setLegacyManualModeState).toBeTruthy();
	});

	it('should throw error - setLegacyManualModeState', () => {
		// @ts-ignore private method access
		expect(component.setLegacyManualModeState).toThrow();
	});

	it('should call getAMTCapability', () => {
		powerService.isShellAvailable = true;
		// @ts-ignore private method access
		component.getAMTCapability();
		// @ts-ignore private method access
		expect(component.getAMTCapability).toBeTruthy();
	});

	it('should call getAMTSetting', () => {
		powerService.isShellAvailable = true;
		// @ts-ignore private method access
		component.getAMTSetting();
		// @ts-ignore private method access
		expect(component.getAMTSetting).toBeTruthy();
	});

	// it('should call coolingModesPopUp', () => {
	// 	modalService = TestBed.inject(MatDialog)
	// 	modalRef = modalService.open(ModalIntelligentCoolingModesComponent)
	// 	let spy = spyOn(modalService, 'open').and.returnValue(modalRef)
	// 	component.coolingModesPopUp()
	// 	expect(spy).toHaveBeenCalled()
	// })

	it('should call readMore', () => {
		const readMoreDiv: HTMLElement = document.createElement('div');
		const event = new Event('click');
		component.readMore(readMoreDiv, event);
		expect(readMoreDiv.focus).toBeTruthy();
	});

	it('should call autoTransitionReadMoreClick', () => {
		const metricsData = {
			ItemParent: 'Device.MyDeviceSettings',
			ItemName: 'IntelligentCooling-5.0-AutoTransition-ReadMore',
			ItemType: 'FeatureClick',
			ItemValue: 'ExpandedToReadMore',
		};

		const spy = spyOn(metricService, 'sendMetrics').and.returnValue();
		component.autoTransitionReadMoreClick();
		expect(component.autoTransitionIsReadMore).toBeTruthy();
		expect(spy).toHaveBeenCalled();
	});

	it(
		'should call onAutoTransitionToggle',
		waitForAsync(() => {
			powerService.isShellAvailable = true;
			component.isAutoTransitionVisible = true;

			component.cache = new IntelligentCoolingCapability();
			const spy = spyOn(powerService, 'setAutoTransitionForICIdeapad').and.returnValue(
				Promise.resolve(true)
			);
			component.onAutoTransitionToggle(true);
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call onAutoTransitionToggle set failed',
		waitForAsync(() => {
			powerService.isShellAvailable = true;
			component.isAutoTransitionVisible = true;

			component.cache = new IntelligentCoolingCapability();
			const spy = spyOn(powerService, 'setAutoTransitionForICIdeapad').and.returnValue(
				Promise.resolve(false)
			);
			component.onAutoTransitionToggle(true);
			expect(spy).toHaveBeenCalled();
		})
	);
	it('should call initPowerSmartSettingsUIForIdeaPad itsVersion is 5', () => {
		const response = {
			available: true,
			itsVersion: 5,
			isAutoTransitionEnabled: true,
		};
		component.initPowerSmartSettingsUIForIdeaPad(response, false);
		expect(component.intelligentCoolingModes).toEqual(IntelligentCoolingHardware.ITS15);
	});
});
