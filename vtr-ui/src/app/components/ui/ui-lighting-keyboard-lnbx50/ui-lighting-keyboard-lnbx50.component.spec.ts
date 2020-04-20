import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { UiLightingKeyboardLNBx50Component } from './ui-lighting-keyboard-lnbx50.component';
import { KeyboardToggleStatusLNBx50 } from 'src/app/data-models/gaming/lighting-keyboard/keyboard-toggle-status-LNBx50';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { CommonService } from './../../../services/common/common.service';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gaming } from './../../../enums/gaming.enum';
import { of } from 'rxjs';

const lightingService = jasmine.createSpyObj('GamingLightingService', [
	'isShellAvailable',
	'setLightingProfileEffectColor',
	'checkAreaColorFn'
]);

describe('UiLightingKeyboardLNBx50Component', () => {
	let component: UiLightingKeyboardLNBx50Component;
	let fixture: ComponentFixture<UiLightingKeyboardLNBx50Component>;

	let KeyboardToggleStatusLNBx50Cache = null;
	let LightingProfileByIdNoteOff1Cache = null;
	let LightingProfileByIdNoteOn1Cache = null;
	let LightingProfileByIdNoteOff2Cache = null;
	let LightingProfileByIdNoteOn2Cache = null;
	let LightingProfileByIdNoteOff3Cache = null;
	let LightingProfileByIdNoteOn3Cache = null;

	const toggleStatus = {
		profileId1: {
			status: true,
			defaultStatus: false
		},
		profileId2: {
			status: false,
			defaultStatus: false
		},
		profileId3: {
			status: false,
			defaultStatus: true
		},
	};

	const keyboardInfo = {
		didSuccess: true,
		profileId: 1,
		brightness: 3,
		lightInfo: [
			{
				lightPanelType: 1,
				lightEffectType: 4,
				lightColor: 'FFFFFF'
			},
			{
				lightPanelType: 2,
				lightEffectType: 2,
				lightColor: 'FF0000'
			},
			{
				lightPanelType: 4,
				lightEffectType: 4,
				lightColor: 'FFFFFF'
			},
			{
				lightPanelType: 8,
				lightEffectType: 2,
				lightColor: 'FF0000'
			}
		]
	};

	const commonServiceMock = {
		getLocalStorageValue(key: any) {
			switch (key) {
				case '[LocalStorageKey] KeyboardToggleStatusLNBx50':
					return KeyboardToggleStatusLNBx50Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOff1':
					return LightingProfileByIdNoteOff1Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOn1':
					return LightingProfileByIdNoteOn1Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOff2':
					return LightingProfileByIdNoteOff2Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOn2':
					return LightingProfileByIdNoteOn2Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOff3':
					return LightingProfileByIdNoteOff3Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOn3':
					return LightingProfileByIdNoteOn3Cache;

			}
		},
		setLocalStorageValue(key: any, value: any) {
			switch (key) {
				case '[LocalStorageKey] KeyboardToggleStatusLNBx50':
					return KeyboardToggleStatusLNBx50Cache = value;
				case '[LocalStorageKey] LightingProfileByIdNoteOff1':
					return LightingProfileByIdNoteOff1Cache = value;
				case '[LocalStorageKey] LightingProfileByIdNoteOn1':
					return LightingProfileByIdNoteOn1Cache = value;
				case '[LocalStorageKey] LightingProfileByIdNoteOff2':
					return LightingProfileByIdNoteOff2Cache = value;
				case '[LocalStorageKey] LightingProfileByIdNoteOn2':
					return LightingProfileByIdNoteOn2Cache = value;
				case '[LocalStorageKey] LightingProfileByIdNoteOff3':
					return LightingProfileByIdNoteOff3Cache = value;
				case '[LocalStorageKey] LightingProfileByIdNoteOn3':
					return LightingProfileByIdNoteOn3Cache = value;
			}
		},
	};

	lightingService.isShellAvailable.and.returnValue(true);
	lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve(keyboardInfo));
	lightingService.checkAreaColorFn.and.returnValue(true);

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiLightingKeyboardLNBx50Component],
			imports: [TranslationModule],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				HttpClient,
				TranslateStore,
				{ provide: CommonService, useValue: commonServiceMock },
				{ provide: GamingLightingService, useValue: lightingService },
			]
		})
			.compileComponents();
		fixture = TestBed.createComponent(UiLightingKeyboardLNBx50Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));



	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('check init : ', () => {
		it('init KeyboardToggleStatusLNBx50 is undefined', () => {
			KeyboardToggleStatusLNBx50Cache = undefined;
			expect(commonServiceMock.getLocalStorageValue('[LocalStorageKey] KeyboardToggleStatusLNBx50')).toBeUndefined();
		});

		it('init KeyboardToggleStatusLNBx50 is obj', () => {
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			expect(commonServiceMock.getLocalStorageValue('[LocalStorageKey] KeyboardToggleStatusLNBx50')).toBeTruthy();
		});
	})


	describe('check ngOnChanges : ', () => {
		it('When changes.listInfo is true, check onChanges', () => {
			const spy = spyOn(component, 'setToggleStatusCache');
			component.ngOnChanges({ listInfo: true });
			fixture.detectChanges();
			expect(spy).toHaveBeenCalled();
		});

		it('When changes.listInfo is false, check onChanges', () => {
			const spy2 = spyOn(component, 'setToggleStatusCache');
			component.ngOnChanges({ listInfo: false });
			fixture.detectChanges();
			expect(spy2).not.toHaveBeenCalled();
		});

		it('When changes.isColorPicker is true, check onChanges', () => {
			component.isColorPicker = true;
			component.selectPanel = 1;
			component.selectedArea = 1;
			component.ngOnChanges({ isColorPicker: true });
			expect(component.selectPanel).not.toBe(0);
			expect(component.selectedArea).not.toBe(0);

			component.isColorPicker = false;
			component.selectPanel = 1;
			component.selectedArea = 1;
			component.ngOnChanges({ isColorPicker: true });
			expect(component.selectPanel).toBe(0);
			expect(component.selectedArea).toBe(0);
		});

		it('When changes.isColorPicker is false, check onChanges', () => {
			component.isColorPicker = true;
			component.selectPanel = 1;
			component.selectedArea = 1;
			component.ngOnChanges({ isColorPicker: false });
			fixture.detectChanges();
			expect(component.selectPanel).not.toBe(0);
			expect(component.selectedArea).not.toBe(0);

			component.isColorPicker = false;
			component.selectPanel = 1;
			component.selectedArea = 1;
			component.ngOnChanges({ isColorPicker: false });
			expect(component.selectPanel).not.toBe(0);
			expect(component.selectedArea).not.toBe(0);
		});
	})

	describe('check selectAreaFn : ', () => {
		it('check selectAreaFn & isDivideArea is false', () => {
			component.isDivideArea = false;
			component.selectAreaFn(1, '#434343');
			expect(component.selectPanel).toBe(1);
			expect(component.selectedArea).toBe(1);
		});

		it('check selectAreaFn & isDivideArea is true', () => {
			component.isDivideArea = true;
			component.selectAreaFn(2, '#434343');
			expect(component.selectPanel).toBe(2);
			expect(component.selectedArea).toBe(2);
		});
	})

	describe('check mouseoverFn : ', () => {
		it('check mouseoverFn & selectedArea === 0', () => {
			component.selectedArea = 0;
			component.selectPanel = 0;
			component.mouseoverFn({}, 2, '#434343');
			expect(component.selectPanel).toBe(2);

			component.selectedArea = 1;
			component.selectPanel = 0;
			component.mouseoverFn({}, 2, '#434343');
			expect(component.selectPanel).not.toBe(2);

			component.selectedArea = 2;
			component.selectPanel = 0;
			component.mouseoverFn({}, 2, '#434343');
			expect(component.selectPanel).not.toBe(2);

			component.selectedArea = 4;
			component.selectPanel = 0;
			component.mouseoverFn({}, 2, '#434343');
			expect(component.selectPanel).not.toBe(2);

			component.selectedArea = 8;
			component.selectPanel = 0;
			component.mouseoverFn({}, 2, '#434343');
			expect(component.selectPanel).not.toBe(2);
		});
	})

	describe('check mouseoutFn : ', () => {
		it('check mouseoutFn & selectedArea === 0 ', () => {
			component.selectedArea = 0;
			component.selectPanel = 0;
			component.mouseoutFn({}, 0);
			expect(component.selectPanel).toBe(0);

			component.selectedArea = 0;
			component.selectPanel = 1;
			component.mouseoutFn({}, 2);
			expect(component.selectPanel).toBe(0);

			component.selectedArea = 0;
			component.selectPanel = 2;
			component.mouseoutFn({}, 4);
			expect(component.selectPanel).toBe(0);

			component.selectedArea = 0;
			component.selectPanel = 4;
			component.mouseoutFn({}, 8);
			expect(component.selectPanel).toBe(0);

			component.selectedArea = 0;
			component.selectPanel = 8;
			component.mouseoutFn({}, 1);
			expect(component.selectPanel).toBe(0);
		});

		it('check mouseoutFn & selectedArea !== 0  ', () => {
			component.selectedArea = 1;
			component.selectPanel = 0;
			component.mouseoutFn({}, 2);
			expect(component.selectPanel).toBe(1);

			component.selectedArea = 2;
			component.selectPanel = 2;
			component.mouseoutFn({}, 4);
			expect(component.selectPanel).toBe(2);

			component.selectedArea = 4;
			component.selectPanel = 4;
			component.mouseoutFn({}, 8);
			expect(component.selectPanel).toBe(4);

			component.selectedArea = 8;
			component.selectPanel = 8;
			component.mouseoutFn({}, 1);
			expect(component.selectPanel).toBe(8);
		});
	})

	describe('check getProfileInfoCache : ', () => {
		it('check getProfileInfoCache & catch error  ', () => {
			LightingProfileByIdNoteOn1Cache = keyboardInfo;
			try {
				component.getProfileInfoCache(true);
			} catch (err) {
				expect(err).toMatch('getProfileInfoCache Cannot read property \'lightInfo\' of undefined');
			}
		})
		it('check getProfileInfoCache & argument is true & profileId is 1', () => {
			component.profileId = 1;
			LightingProfileByIdNoteOn1Cache = keyboardInfo;
			LightingProfileByIdNoteOn1Cache.profileId = 1;
			component.getProfileInfoCache(true);
			expect(commonServiceMock.getLocalStorageValue('[LocalStorageKey] LightingProfileByIdNoteOn1')).toBeTruthy();
		})

		it('check getProfileInfoCache & argument is true & profileId is 2', () => {
			component.profileId = 2;
			LightingProfileByIdNoteOn2Cache = keyboardInfo;
			LightingProfileByIdNoteOn2Cache.profileId = 2;
			component.getProfileInfoCache(true);
			expect(commonServiceMock.getLocalStorageValue('[LocalStorageKey] LightingProfileByIdNoteOn2')).toBeTruthy();
		})

		it('check getProfileInfoCache & argument is true & profileId is 3', () => {
			component.profileId = 3;
			LightingProfileByIdNoteOn3Cache = keyboardInfo;
			LightingProfileByIdNoteOn3Cache.profileId = 3;
			component.getProfileInfoCache(true);
			expect(commonServiceMock.getLocalStorageValue('[LocalStorageKey] LightingProfileByIdNoteOn3')).toBeTruthy();
		})

		it('check getProfileInfoCache & argument is false & profileId is 1', () => {
			component.profileId = 1;
			LightingProfileByIdNoteOff1Cache = keyboardInfo;
			LightingProfileByIdNoteOff1Cache.profileId = 1;
			component.getProfileInfoCache(false);
			expect(commonServiceMock.getLocalStorageValue('[LocalStorageKey] LightingProfileByIdNoteOff1')).toBeTruthy();
		})

		it('check getProfileInfoCache & argument is false & profileId is 2', () => {
			component.profileId = 2;
			LightingProfileByIdNoteOff2Cache = keyboardInfo;
			LightingProfileByIdNoteOff2Cache.profileId = 2;
			component.getProfileInfoCache(false);
			expect(commonServiceMock.getLocalStorageValue('[LocalStorageKey] LightingProfileByIdNoteOff2')).toBeTruthy();
		})

		it('check getProfileInfoCache & argument is false & profileId is 3', () => {
			component.profileId = 3;
			LightingProfileByIdNoteOff3Cache = keyboardInfo;
			LightingProfileByIdNoteOff3Cache.profileId = 3;
			component.getProfileInfoCache(false);
			expect(commonServiceMock.getLocalStorageValue('[LocalStorageKey] LightingProfileByIdNoteOff3')).toBeTruthy();
		})
	})

	describe('check onToggleOnOff : ', () => {
		it('check onToggleOnOff & catch error', async () => {
			component.profileId = 1;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff1Cache = keyboardInfo;
			LightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			try {
				lightingService.setLightingProfileEffectColor.and.throwError('setLightingProfileEffectColor error');
				component.onToggleOnOff(true);
			} catch (err) {
				expect(err).toMatch('setLightingProfileEffectColor error');
			}
		})

		it('check onToggleOnOff & toggle is true & profileId is 1 & isShellAvailable is false', fakeAsync(() => {
			component.profileId = 1;
			keyboardInfo.profileId = 1;
			component.isDivideArea = false;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff1Cache = keyboardInfo;
			LightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = false;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: true }));
			try {
				component.onToggleOnOff(true);
			} catch (err) {
				expect(err).toMatch('setLightingProfileEffectColor error');
			}
		}))

		it('check onToggleOnOff & toggle is true & profileId is 1 & response is true', fakeAsync(() => {
			component.profileId = 1;
			keyboardInfo.profileId = 1;
			component.isDivideArea = false;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff1Cache = keyboardInfo;
			LightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: true }));
			component.onToggleOnOff(true);
			// tick();
			expect(component.isDivideArea).toEqual(true);
			expect(KeyboardToggleStatusLNBx50Cache).toBeTruthy();
		}))

		it('check onToggleOnOff & toggle is true & profileId is 1 & response is false', fakeAsync(() => {
			component.profileId = 1;
			keyboardInfo.profileId = 1;
			component.isDivideArea = false;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff1Cache = keyboardInfo;
			LightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: false }));
			component.onToggleOnOff(true);
			tick();
			expect(component.isDivideArea).toEqual(false);
		}))

		it('check onToggleOnOff & toggle is true & profileId is 2 & response is true', fakeAsync(() => {
			component.profileId = 2;
			keyboardInfo.profileId = 2;
			component.isDivideArea = false;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff2Cache = keyboardInfo;
			LightingProfileByIdNoteOn2Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: true }));
			component.onToggleOnOff(true);
			tick();
			expect(component.isDivideArea).toEqual(true);
			expect(KeyboardToggleStatusLNBx50Cache).toBeTruthy();
		}))

		it('check onToggleOnOff & toggle is true & profileId is 2 & response is false', fakeAsync(() => {
			component.profileId = 2;
			keyboardInfo.profileId = 2;
			component.isDivideArea = false;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff2Cache = keyboardInfo;
			LightingProfileByIdNoteOn2Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: false }));
			component.onToggleOnOff(true);
			tick();
			expect(component.isDivideArea).toEqual(false);
		}))

		it('check onToggleOnOff & toggle is true & profileId is 3 response is true', fakeAsync(() => {
			component.profileId = 3;
			keyboardInfo.profileId = 3;
			component.isDivideArea = false;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff3Cache = keyboardInfo;
			LightingProfileByIdNoteOn3Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: true }));
			component.onToggleOnOff(true);
			tick();
			expect(component.isDivideArea).toEqual(true);
			expect(KeyboardToggleStatusLNBx50Cache).toBeTruthy();
		}))

		it('check onToggleOnOff & toggle is true & profileId is 3 & response is false', fakeAsync(() => {
			component.profileId = 3;
			keyboardInfo.profileId = 3;
			component.isDivideArea = false;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff3Cache = keyboardInfo;
			LightingProfileByIdNoteOn3Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: false }));
			component.onToggleOnOff(true);
			tick();
			expect(component.isDivideArea).toEqual(false);
		}))

		it('check onToggleOnOff & toggle is false & profileId is 1 & response is true', fakeAsync(() => {
			component.profileId = 1;
			keyboardInfo.profileId = 1;
			component.isDivideArea = true;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff1Cache = keyboardInfo;
			LightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: true }));
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(false);
			expect(KeyboardToggleStatusLNBx50Cache).toBeTruthy();
		}))

		it('check onToggleOnOff & toggle is false & profileId is 1 & response is false', fakeAsync(() => {
			component.profileId = 1;
			keyboardInfo.profileId = 1;
			component.isDivideArea = true;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff1Cache = keyboardInfo;
			LightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: false }));
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(true);
		}))

		it('check onToggleOnOff & toggle is false & profileId is 2 & response is true', fakeAsync(() => {
			component.profileId = 2;
			keyboardInfo.profileId = 2;
			component.isDivideArea = true;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff2Cache = keyboardInfo;
			LightingProfileByIdNoteOn2Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: true }));
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(false);
			expect(KeyboardToggleStatusLNBx50Cache).toBeTruthy();
		}))

		it('check onToggleOnOff & toggle is false & profileId is 2 & response is false', fakeAsync(() => {
			component.profileId = 2;
			keyboardInfo.profileId = 2;
			component.isDivideArea = true;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff2Cache = keyboardInfo;
			LightingProfileByIdNoteOn2Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: false }));
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(true);
		}))

		it('check onToggleOnOff & toggle is false & profileId is 3 & response is true', fakeAsync(() => {
			component.profileId = 3;
			keyboardInfo.profileId = 3;
			component.isDivideArea = true;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff3Cache = keyboardInfo;
			LightingProfileByIdNoteOn3Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: true }));
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(false);
			expect(KeyboardToggleStatusLNBx50Cache).toBeTruthy();
		}))

		it('check onToggleOnOff & toggle is false & profileId is 3 & response is false', fakeAsync(() => {
			component.profileId = 3;
			keyboardInfo.profileId = 3;
			component.isDivideArea = true;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			LightingProfileByIdNoteOff3Cache = keyboardInfo;
			LightingProfileByIdNoteOn3Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve({ didSuccess: false }));
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(true);
		}))

	})

	describe('check setToggleStatusCache : ', () => {
		it('check setToggleStatusCache & catch error', async () => {
			component.listInfo = keyboardInfo.lightInfo;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			try {
				component.setToggleStatusCache();
			} catch (err) {
				expect(err).toMatch('setToggleStatusCache Cannot read property \'status\' of undefined');
			}
		})

		it('check setToggleStatusCache & listInfo && profileId=0', async () => {
			component.listInfo = keyboardInfo.lightInfo;
			component.profileId = 0;
			KeyboardToggleStatusLNBx50Cache = false;
			component.setToggleStatusCache();
			expect(commonServiceMock.getLocalStorageValue('[LocalStorageKey] KeyboardToggleStatusLNBx50')).not.toBeTruthy();
		})

		it('check setToggleStatusCache & listInfo && profileId=1', async () => {
			component.listInfo = keyboardInfo.lightInfo;
			component.profileId = 1;
			KeyboardToggleStatusLNBx50Cache = toggleStatus;
			component.setToggleStatusCache();
			expect(commonServiceMock.getLocalStorageValue('[LocalStorageKey] KeyboardToggleStatusLNBx50')).toBeTruthy();
		})

		it('check setToggleStatusCache & listInfo && profileId is 1 & isDefault is true & defaultStatus = undefined', async () => {
			for (let i = 1; i <= 3; i++) {
				component.listInfo = keyboardInfo.lightInfo;
				component.profileId = i;
				component.isDefault = true;
				component.isDivideArea = true;
				KeyboardToggleStatusLNBx50Cache = {
					profileId1: {
						status: 'undefined',
						defaultStatus: 'undefined'
					},
					profileId2: {
						status: 'undefined',
						defaultStatus: 'undefined'
					},
					profileId3: {
						status: 'undefined',
						defaultStatus: 'undefined'
					},
				};
				component.setToggleStatusCache();
				expect(lightingService.checkAreaColorFn(keyboardInfo.lightInfo)).toBe(component.isDivideArea);
				expect(component.toggleStatusLNBx50['profileId' + i].defaultStatus).toBe(component.isDivideArea);
				expect(component.toggleStatusLNBx50['profileId' + i].status).toBe(component.isDivideArea);
			}
		})

		it('check setToggleStatusCache & listInfo && profileId is 1 & isDefault is false & defaultStatus = undefined', async () => {
			for (let i = 1; i <= 3; i++) {
				component.listInfo = keyboardInfo.lightInfo;
				component.profileId = i;
				component.isDefault = false;
				component.isDivideArea = true;
				KeyboardToggleStatusLNBx50Cache = {
					profileId1: {
						status: 'undefined',
						defaultStatus: 'undefined'
					},
					profileId2: {
						status: 'undefined',
						defaultStatus: 'undefined'
					},
					profileId3: {
						status: 'undefined',
						defaultStatus: 'undefined'
					},
				};
				component.setToggleStatusCache();
				expect(lightingService.checkAreaColorFn(keyboardInfo.lightInfo)).toBe(component.isDivideArea);
				expect(component.toggleStatusLNBx50['profileId' + i].status).toBe(component.isDivideArea);
			}
		})

		it('check setToggleStatusCache & listInfo && profileId is 1 & isDefault is true & defaultStatus != undefined', async () => {
			for (let i = 1; i <= 3; i++) {
				component.listInfo = keyboardInfo.lightInfo;
				component.profileId = i;
				component.isDefault = true;
				component.isDivideArea = true;
				KeyboardToggleStatusLNBx50Cache = {
					profileId1: {
						status: 'undefined',
						defaultStatus: false
					},
					profileId2: {
						status: 'undefined',
						defaultStatus: false
					},
					profileId3: {
						status: 'undefined',
						defaultStatus: false
					},
				};
				component.setToggleStatusCache();
				expect(component.toggleStatusLNBx50['profileId' + i].status).toBe(KeyboardToggleStatusLNBx50Cache['profileId' + i].defaultStatus);
				expect(component.isDivideArea).toBe(KeyboardToggleStatusLNBx50Cache['profileId' + i].defaultStatus);
			}
		})

		it('check setToggleStatusCache & listInfo && profileId is 1 & isDefault is false & defaultStatus != undefined', async () => {
			for (let i = 1; i <= 3; i++) {
				component.listInfo = keyboardInfo.lightInfo;
				component.profileId = i;
				component.isDefault = false;
				component.isDivideArea = true;
				KeyboardToggleStatusLNBx50Cache = {
					profileId1: {
						status: 'undefined',
						defaultStatus: true
					},
					profileId2: {
						status: 'undefined',
						defaultStatus: false
					},
					profileId3: {
						status: 'undefined',
						defaultStatus: false
					},
				};
				component.setToggleStatusCache();
				expect(component.toggleStatusLNBx50['profileId' + i].status).toBe(KeyboardToggleStatusLNBx50Cache['profileId' + i].status);
			}
		})

	})


});
