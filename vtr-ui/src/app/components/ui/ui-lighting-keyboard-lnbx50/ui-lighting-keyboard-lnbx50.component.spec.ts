import { fakeAsync, ComponentFixture, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { UiLightingKeyboardLNBx50Component } from './ui-lighting-keyboard-lnbx50.component';
import { KeyboardToggleStatusLNBx50 } from 'src/app/data-models/gaming/lighting-keyboard/keyboard-toggle-status-LNBx50';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { CommonService } from './../../../services/common/common.service';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

const lightingService = jasmine.createSpyObj('GamingLightingService', [
	'isShellAvailable',
	'setLightingProfileEffectColor',
	'checkAreaColorFn',
]);

@Component({ selector: 'vtr-ui-toggle', template: '' })
export class UiToggleStubComponent {
	@Input() onOffSwitchId: string;
}

describe('UiLightingKeyboardLNBx50Component', () => {
	let component: UiLightingKeyboardLNBx50Component;
	let fixture: ComponentFixture<UiLightingKeyboardLNBx50Component>;

	let keyboardToggleStatusLNBx50Cache = null;
	let lightingProfileByIdNoteOff1Cache = null;
	let lightingProfileByIdNoteOn1Cache = null;
	let lightingProfileByIdNoteOff2Cache = null;
	let lightingProfileByIdNoteOn2Cache = null;
	let lightingProfileByIdNoteOff3Cache = null;
	let lightingProfileByIdNoteOn3Cache = null;

	const toggleStatus = {
		profileId1: {
			status: true,
			defaultStatus: false,
		},
		profileId2: {
			status: false,
			defaultStatus: false,
		},
		profileId3: {
			status: false,
			defaultStatus: true,
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
				lightColor: 'FFFFFF',
			},
			{
				lightPanelType: 2,
				lightEffectType: 2,
				lightColor: 'FF0000',
			},
			{
				lightPanelType: 4,
				lightEffectType: 4,
				lightColor: 'FFFFFF',
			},
			{
				lightPanelType: 8,
				lightEffectType: 2,
				lightColor: 'FF0000',
			},
		],
	};

	const localCacheServiceSpy = {
		getLocalCacheValue: (key: any) => {
			switch (key) {
				case '[LocalStorageKey] KeyboardToggleStatusLNBx50':
					return keyboardToggleStatusLNBx50Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOff1':
					return lightingProfileByIdNoteOff1Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOn1':
					return lightingProfileByIdNoteOn1Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOff2':
					return lightingProfileByIdNoteOff2Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOn2':
					return lightingProfileByIdNoteOn2Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOff3':
					return lightingProfileByIdNoteOff3Cache;
				case '[LocalStorageKey] LightingProfileByIdNoteOn3':
					return lightingProfileByIdNoteOn3Cache;
			}
		},
		setLocalCacheValue: (key: any, value: any) => {
			switch (key) {
				case '[LocalStorageKey] KeyboardToggleStatusLNBx50':
					return (keyboardToggleStatusLNBx50Cache = value);
				case '[LocalStorageKey] LightingProfileByIdNoteOff1':
					return (lightingProfileByIdNoteOff1Cache = value);
				case '[LocalStorageKey] LightingProfileByIdNoteOn1':
					return (lightingProfileByIdNoteOn1Cache = value);
				case '[LocalStorageKey] LightingProfileByIdNoteOff2':
					return (lightingProfileByIdNoteOff2Cache = value);
				case '[LocalStorageKey] LightingProfileByIdNoteOn2':
					return (lightingProfileByIdNoteOn2Cache = value);
				case '[LocalStorageKey] LightingProfileByIdNoteOff3':
					return (lightingProfileByIdNoteOff3Cache = value);
				case '[LocalStorageKey] LightingProfileByIdNoteOn3':
					return (lightingProfileByIdNoteOn3Cache = value);
			}
		}
	};

	const commonServiceMock = {
		getShellVersion: () => '1.1.1.1',
		compareVersion: (v1, v2) =>  0 ,
		cloneObj: (obj) => JSON.parse(JSON.stringify(obj))
	};

	lightingService.isShellAvailable.and.returnValue(true);
	lightingService.setLightingProfileEffectColor.and.returnValue(Promise.resolve(keyboardInfo));
	lightingService.checkAreaColorFn.and.returnValue(true);

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiLightingKeyboardLNBx50Component, UiToggleStubComponent],
			imports: [TranslationModule],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				HttpClient,
				TranslateStore,
				{ provide: CommonService, useValue: commonServiceMock },
				{ provide: GamingLightingService, useValue: lightingService },
				{ provide: LocalCacheService, useValue: localCacheServiceSpy }
			],
		}).compileComponents();
		fixture = TestBed.createComponent(UiLightingKeyboardLNBx50Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('hideColordisk', () => {
		component.hideColordisk();
		expect(component.selectPanel).toBe(0);
		expect(component.selectedArea).toBe(0);
	});

	describe('check init : ', () => {
		it('init KeyboardToggleStatusLNBx50 is undefined', () => {
			keyboardToggleStatusLNBx50Cache = undefined;
			expect(
				localCacheServiceSpy.getLocalCacheValue(
					'[LocalStorageKey] KeyboardToggleStatusLNBx50'
				)
			).toBeUndefined();
		});

		it('init KeyboardToggleStatusLNBx50 is obj', () => {
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			expect(
				localCacheServiceSpy.getLocalCacheValue(
					'[LocalStorageKey] KeyboardToggleStatusLNBx50'
				)
			).toBeTruthy();
		});
	});

	describe('check ngOnChanges : ', () => {
		it('When changes.listInfo is true, check onChanges', fakeAsync(() => {
			const spy = spyOn(component, 'setToggleStatusCache');
			component.ngOnChanges({ listInfo: true });
			fixture.detectChanges();
			tick(150);
			expect(spy).toHaveBeenCalled();
		}));

		it('When changes.listInfo is false, check onChanges', fakeAsync(() => {
			const spy2 = spyOn(component, 'setToggleStatusCache');
			component.ngOnChanges({ listInfo: false });
			fixture.detectChanges();
			tick(150);
			expect(spy2).not.toHaveBeenCalled();
		}));

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
	});

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
	});

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
	});

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
	});

	describe('check getProfileInfoCache : ', () => {
		it('check getProfileInfoCache & catch error  ', () => {
			lightingProfileByIdNoteOn1Cache = keyboardInfo;
			try {
				component.getProfileInfoCache(true);
			} catch (err) {
				expect(err).toMatch(
					'getProfileInfoCache Cannot read property \'lightInfo\' of undefined'
				);
			}
		});
		it('check getProfileInfoCache & argument is true & profileId is 1', () => {
			component.profileId = 1;
			lightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingProfileByIdNoteOn1Cache.profileId = 1;
			component.getProfileInfoCache(true);
			expect(
				localCacheServiceSpy.getLocalCacheValue(
					'[LocalStorageKey] LightingProfileByIdNoteOn1'
				)
			).toBeTruthy();
		});

		it('check getProfileInfoCache & argument is true & profileId is 2', () => {
			component.profileId = 2;
			lightingProfileByIdNoteOn2Cache = keyboardInfo;
			lightingProfileByIdNoteOn2Cache.profileId = 2;
			component.getProfileInfoCache(true);
			expect(
				localCacheServiceSpy.getLocalCacheValue(
					'[LocalStorageKey] LightingProfileByIdNoteOn2'
				)
			).toBeTruthy();
		});

		it('check getProfileInfoCache & argument is true & profileId is 3', () => {
			component.profileId = 3;
			lightingProfileByIdNoteOn3Cache = keyboardInfo;
			lightingProfileByIdNoteOn3Cache.profileId = 3;
			component.getProfileInfoCache(true);
			expect(
				localCacheServiceSpy.getLocalCacheValue(
					'[LocalStorageKey] LightingProfileByIdNoteOn3'
				)
			).toBeTruthy();
		});

		it('check getProfileInfoCache & argument is false & profileId is 1', () => {
			component.profileId = 1;
			lightingProfileByIdNoteOff1Cache = keyboardInfo;
			lightingProfileByIdNoteOff1Cache.profileId = 1;
			component.getProfileInfoCache(false);
			expect(
				localCacheServiceSpy.getLocalCacheValue(
					'[LocalStorageKey] LightingProfileByIdNoteOff1'
				)
			).toBeTruthy();
		});

		it('check getProfileInfoCache & argument is false & profileId is 2', () => {
			component.profileId = 2;
			lightingProfileByIdNoteOff2Cache = keyboardInfo;
			lightingProfileByIdNoteOff2Cache.profileId = 2;
			component.getProfileInfoCache(false);
			expect(
				localCacheServiceSpy.getLocalCacheValue(
					'[LocalStorageKey] LightingProfileByIdNoteOff2'
				)
			).toBeTruthy();
		});

		it('check getProfileInfoCache & argument is false & profileId is 3', () => {
			component.profileId = 3;
			lightingProfileByIdNoteOff3Cache = keyboardInfo;
			lightingProfileByIdNoteOff3Cache.profileId = 3;
			component.getProfileInfoCache(false);
			expect(
				localCacheServiceSpy.getLocalCacheValue(
					'[LocalStorageKey] LightingProfileByIdNoteOff3'
				)
			).toBeTruthy();
		});
	});

	describe('check onToggleOnOff : ', () => {
		it('check onToggleOnOff & catch error', async () => {
			component.profileId = 1;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff1Cache = keyboardInfo;
			lightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			try {
				lightingService.setLightingProfileEffectColor.and.throwError(
					'setLightingProfileEffectColor error'
				);
				component.onToggleOnOff(true);
			} catch (err) {
				expect(err).toMatch('setLightingProfileEffectColor error');
			}
		});

		it('check onToggleOnOff & toggle is true & profileId is 1 & isShellAvailable is false', fakeAsync(() => {
			component.profileId = 1;
			keyboardInfo.profileId = 1;
			component.isDivideArea = false;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff1Cache = keyboardInfo;
			lightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = false;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: true })
			);
			try {
				component.onToggleOnOff(true);
			} catch (err) {
				expect(err).toMatch('setLightingProfileEffectColor error');
			}
		}));

		it('check onToggleOnOff & toggle is true & profileId is 1 & response is true', fakeAsync(() => {
			component.profileId = 1;
			keyboardInfo.profileId = 1;
			component.isDivideArea = false;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff1Cache = keyboardInfo;
			lightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: true })
			);
			component.onToggleOnOff(true);
			// tick();
			expect(component.isDivideArea).toEqual(true);
			expect(keyboardToggleStatusLNBx50Cache).toBeTruthy();
		}));

		it('check onToggleOnOff & toggle is true & profileId is 1 & response is false', fakeAsync(() => {
			component.profileId = 1;
			keyboardInfo.profileId = 1;
			component.isDivideArea = false;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff1Cache = keyboardInfo;
			lightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: false })
			);
			component.onToggleOnOff(true);
			tick();
			expect(component.isDivideArea).toEqual(false);
		}));

		it('check onToggleOnOff & toggle is true & profileId is 2 & response is true', fakeAsync(() => {
			component.profileId = 2;
			keyboardInfo.profileId = 2;
			component.isDivideArea = false;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff2Cache = keyboardInfo;
			lightingProfileByIdNoteOn2Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: true })
			);
			component.onToggleOnOff(true);
			tick();
			expect(component.isDivideArea).toEqual(true);
			expect(keyboardToggleStatusLNBx50Cache).toBeTruthy();
		}));

		it('check onToggleOnOff & toggle is true & profileId is 2 & response is false', fakeAsync(() => {
			component.profileId = 2;
			keyboardInfo.profileId = 2;
			component.isDivideArea = false;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff2Cache = keyboardInfo;
			lightingProfileByIdNoteOn2Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: false })
			);
			component.onToggleOnOff(true);
			tick();
			expect(component.isDivideArea).toEqual(false);
		}));

		it('check onToggleOnOff & toggle is true & profileId is 3 response is true', fakeAsync(() => {
			component.profileId = 3;
			keyboardInfo.profileId = 3;
			component.isDivideArea = false;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff3Cache = keyboardInfo;
			lightingProfileByIdNoteOn3Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: true })
			);
			component.onToggleOnOff(true);
			tick();
			expect(component.isDivideArea).toEqual(true);
			expect(keyboardToggleStatusLNBx50Cache).toBeTruthy();
		}));

		it('check onToggleOnOff & toggle is true & profileId is 3 & response is false', fakeAsync(() => {
			component.profileId = 3;
			keyboardInfo.profileId = 3;
			component.isDivideArea = false;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff3Cache = keyboardInfo;
			lightingProfileByIdNoteOn3Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: false })
			);
			component.onToggleOnOff(true);
			tick();
			expect(component.isDivideArea).toEqual(false);
		}));

		it('check onToggleOnOff & toggle is false & profileId is 1 & response is true', fakeAsync(() => {
			component.profileId = 1;
			keyboardInfo.profileId = 1;
			component.isDivideArea = true;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff1Cache = keyboardInfo;
			lightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: true })
			);
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(false);
			expect(keyboardToggleStatusLNBx50Cache).toBeTruthy();
		}));

		it('check onToggleOnOff & toggle is false & profileId is 1 & response is false', fakeAsync(() => {
			component.profileId = 1;
			keyboardInfo.profileId = 1;
			component.isDivideArea = true;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff1Cache = keyboardInfo;
			lightingProfileByIdNoteOn1Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: false })
			);
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(true);
		}));

		it('check onToggleOnOff & toggle is false & profileId is 2 & response is true', fakeAsync(() => {
			component.profileId = 2;
			keyboardInfo.profileId = 2;
			component.isDivideArea = true;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff2Cache = keyboardInfo;
			lightingProfileByIdNoteOn2Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: true })
			);
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(false);
			expect(keyboardToggleStatusLNBx50Cache).toBeTruthy();
		}));

		it('check onToggleOnOff & toggle is false & profileId is 2 & response is false', fakeAsync(() => {
			component.profileId = 2;
			keyboardInfo.profileId = 2;
			component.isDivideArea = true;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff2Cache = keyboardInfo;
			lightingProfileByIdNoteOn2Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: false })
			);
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(true);
		}));

		it('check onToggleOnOff & toggle is false & profileId is 3 & response is true', fakeAsync(() => {
			component.profileId = 3;
			keyboardInfo.profileId = 3;
			component.isDivideArea = true;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff3Cache = keyboardInfo;
			lightingProfileByIdNoteOn3Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: true })
			);
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(false);
			expect(keyboardToggleStatusLNBx50Cache).toBeTruthy();
		}));

		it('check onToggleOnOff & toggle is false & profileId is 3 & response is false', fakeAsync(() => {
			component.profileId = 3;
			keyboardInfo.profileId = 3;
			component.isDivideArea = true;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			lightingProfileByIdNoteOff3Cache = keyboardInfo;
			lightingProfileByIdNoteOn3Cache = keyboardInfo;
			lightingService.isShellAvailable = true;
			lightingService.setLightingProfileEffectColor.and.returnValue(
				Promise.resolve({ didSuccess: false })
			);
			component.onToggleOnOff(false);
			tick();
			expect(component.isDivideArea).toEqual(true);
		}));
	});

	describe('check setToggleStatusCache : ', () => {
		it('check setToggleStatusCache & catch error', async () => {
			component.listInfo = keyboardInfo.lightInfo;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			try {
				component.setToggleStatusCache();
			} catch (err) {
				expect(err).toMatch(
					'setToggleStatusCache Cannot read property \'status\' of undefined'
				);
			}
		});

		it('check setToggleStatusCache & listInfo && profileId=0', async () => {
			component.listInfo = keyboardInfo.lightInfo;
			component.profileId = 0;
			keyboardToggleStatusLNBx50Cache = false;
			component.setToggleStatusCache();
			expect(
				localCacheServiceSpy.getLocalCacheValue(
					'[LocalStorageKey] KeyboardToggleStatusLNBx50'
				)
			).not.toBeTruthy();
		});

		it('check setToggleStatusCache & listInfo && profileId=1', async () => {
			component.listInfo = keyboardInfo.lightInfo;
			component.profileId = 1;
			keyboardToggleStatusLNBx50Cache = toggleStatus;
			component.setToggleStatusCache();
			expect(
				localCacheServiceSpy.getLocalCacheValue(
					'[LocalStorageKey] KeyboardToggleStatusLNBx50'
				)
			).toBeTruthy();
		});

		it('check setToggleStatusCache & listInfo && profileId is 1 & isDefault is true & defaultStatus = undefined', async () => {
			for (let i = 1; i <= 3; i++) {
				component.listInfo = keyboardInfo.lightInfo;
				component.profileId = i;
				component.isDefault = true;
				component.isDivideArea = true;
				keyboardToggleStatusLNBx50Cache = {
					profileId1: {
						status: 'undefined',
						defaultStatus: 'undefined',
					},
					profileId2: {
						status: 'undefined',
						defaultStatus: 'undefined',
					},
					profileId3: {
						status: 'undefined',
						defaultStatus: 'undefined',
					},
				};
				component.setToggleStatusCache();
				expect(lightingService.checkAreaColorFn(keyboardInfo.lightInfo)).toBe(
					component.isDivideArea
				);
				expect(component.toggleStatusLNBx50['profileId' + i].defaultStatus).toBe(
					component.isDivideArea
				);
				expect(component.toggleStatusLNBx50['profileId' + i].status).toBe(
					component.isDivideArea
				);
			}
		});

		it('check setToggleStatusCache & listInfo && profileId is 1 & isDefault is false & defaultStatus = undefined', async () => {
			for (let i = 1; i <= 3; i++) {
				component.listInfo = keyboardInfo.lightInfo;
				component.profileId = i;
				component.isDefault = false;
				component.isDivideArea = true;
				keyboardToggleStatusLNBx50Cache = {
					profileId1: {
						status: 'undefined',
						defaultStatus: 'undefined',
					},
					profileId2: {
						status: 'undefined',
						defaultStatus: 'undefined',
					},
					profileId3: {
						status: 'undefined',
						defaultStatus: 'undefined',
					},
				};
				component.setToggleStatusCache();
				expect(lightingService.checkAreaColorFn(keyboardInfo.lightInfo)).toBe(
					component.isDivideArea
				);
				expect(component.toggleStatusLNBx50['profileId' + i].status).toBe(
					component.isDivideArea
				);
			}
		});

		it('check setToggleStatusCache & listInfo && profileId is 1 & isDefault is true & defaultStatus != undefined', async () => {
			for (let i = 1; i <= 3; i++) {
				component.listInfo = keyboardInfo.lightInfo;
				component.profileId = i;
				component.isDefault = true;
				component.isDivideArea = true;
				keyboardToggleStatusLNBx50Cache = {
					profileId1: {
						status: 'undefined',
						defaultStatus: false,
					},
					profileId2: {
						status: 'undefined',
						defaultStatus: false,
					},
					profileId3: {
						status: 'undefined',
						defaultStatus: false,
					},
				};
				component.setToggleStatusCache();
				expect(component.toggleStatusLNBx50['profileId' + i].status).toBe(
					keyboardToggleStatusLNBx50Cache['profileId' + i].defaultStatus
				);
				expect(component.isDivideArea).toBe(
					keyboardToggleStatusLNBx50Cache['profileId' + i].defaultStatus
				);
			}
		});

		it('check setToggleStatusCache & listInfo && profileId is 1 & isDefault is false & defaultStatus != undefined', async () => {
			for (let i = 1; i <= 3; i++) {
				component.listInfo = keyboardInfo.lightInfo;
				component.profileId = i;
				component.isDefault = false;
				component.isDivideArea = true;
				keyboardToggleStatusLNBx50Cache = {
					profileId1: {
						status: 'undefined',
						defaultStatus: true,
					},
					profileId2: {
						status: 'undefined',
						defaultStatus: false,
					},
					profileId3: {
						status: 'undefined',
						defaultStatus: false,
					},
				};
				component.setToggleStatusCache();
				expect(component.toggleStatusLNBx50['profileId' + i].status).toBe(
					keyboardToggleStatusLNBx50Cache['profileId' + i].status
				);
			}
		});
	});
});
