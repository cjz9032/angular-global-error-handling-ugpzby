import { LightEffectComplexType } from './../../../enums/light-effect-complex-type';
import { LightEffectRGBFeature } from './../../../enums/light-effect-rgbfeature';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UiLightingProfileComponent } from './ui-lighting-profile.component';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device/device.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LocalCacheService } from './../../../services/local-cache/local-cache.service';

const gamingLightingServiceMock = jasmine.createSpyObj('GamingLightingService', ['getLightingProfileById', 'setLightingProfileId', 'setLightingProfileBrightness',
	'isShellAvailable', 'getLightingCapabilities', 'optionChangedRGBTop', 'optionChangedRGBSide', 'setLightingDefaultProfileById', 'setLightingProfileEffectColor']);
const deviceServiceMock = jasmine.createSpyObj('DeviceService', ['isShellAvailable', 'getMachineInfo']);
let singleColorResponse = { LightPanelType: [1], LedType_Complex: [0], LedType_simple: [1, 2, 3, 4], BrightAdjustLevel: 0, RGBfeature: 1 };
let multipleColorResponse = { LightPanelType: [32, 64], LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128], LedType_simple: [0], BrightAdjustLevel: 4, RGBfeature: 255 };
let getLightingProfileById: any = {
	didSuccess: true, profileId: 2, brightness: 3,
	lightInfo: [
		{ lightPanelType: 32, lightEffectType: 2, lightColor: '55943D' },
		{ lightPanelType: 64, lightEffectType: 2, lightColor: '4A9325' }
	]
};
const lightingResp = {
	LightPanelType: [32, 64],
	LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128],
	LedType_simple: [0], BrightAdjustLevel: 4,
	RGBfeature: 255
};
const gamingAllCapabilitiesService = jasmine.createSpyObj('GamingAllCapabilitiesService', [
	'getCapabilityFromCache'
]);

let localcacheServiceMock = {
    getLocalCacheValue(key: any) {
        switch (key) {
            case '[LocalStorageKey] LightingCapabilities':
                return singleColorResponse;
            case '[LocalStorageKey] LightingProfileById':
				return getLightingProfileById;
			case '[LocalStorageKey] LightingSetDefaultProfile':
				return getLightingProfileById;
        }
    },
    setLocalCacheValue(key: any, value: any) {
        switch (key) {
            case '[LocalStorageKey] LightingCapabilities':
                singleColorResponse = value;
                break;
            case '[LocalStorageKey] LightingProfileById':
                getLightingProfileById = value;
				break;
			case '[LocalStorageKey] LightingSetDefaultProfile':
				getLightingProfileById = value;
				break;
        }
    }
};
let LightEffectComplexTypeMock = {
	Static: 1,// Same as On
	Flicker: 2,
	Breath: 4,
	Wave: 8,
	Music: 16,
	Smooth: 32, ///change spectrum to smooth
	CPU_thermal: 64,
	CPU_frequency: 128,
	Response: 256,
	Ripple: 512,
	Off: 268435456 ///same Off
}
let panelImageData = [
	{PanelType: 1,RGB: 1,PanelImage: 'C530@2x.png'},
	{PanelType: 4,RGB: 1,PanelImage: 'T730Front@2x.png'}
]

describe('UiLightingProfileComponent', () => {
	let component: UiLightingProfileComponent;
	let fixture: ComponentFixture<UiLightingProfileComponent>;
	gamingLightingServiceMock.isShellAvailable.and.returnValue(true);
	gamingLightingServiceMock.setLightingProfileEffectColor.and
		.returnValue(Promise.resolve(getLightingProfileById));
	deviceServiceMock.isShellAvailable.and.returnValue(true);
	deviceServiceMock.getMachineInfo.and.returnValue(Promise.resolve({disSuccess: true}));
	beforeEach(fakeAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiLightingProfileComponent,
				mockPipe({ name: 'translate' })],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: VantageShellService },
				{ provide: HttpHandler },
				{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesService },
				{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
				{ provide: DeviceService, useValue: deviceServiceMock },
				{ provide: GamingLightingService, useValue: gamingLightingServiceMock },
                { provide: LocalCacheService, useValue: localcacheServiceMock },
                { provide: LightEffectComplexType, useValue: LightEffectComplexTypeMock }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(UiLightingProfileComponent);
		component = fixture.debugElement.componentInstance;
		if (!component.lightingCapabilities) {
			component.lightingCapabilities = { RGBfeature: false };
		}
	}));

	it('should create', fakeAsync(() => {
		expect(component).toBeTruthy();
	}));

	it('get cache lighting profileById when enter lighting subpage', fakeAsync(() => {
		component.lightingCapabilities = multipleColorResponse;
		component.enumLightingRGBFeature =  {Simple: 255, Complex: 2};
		getLightingProfileById.lightInfo[0].lightEffectType = 2;
		getLightingProfileById.lightInfo[1].lightEffectType = 2;
		component.getLightingProfileByIdFromcache(getLightingProfileById);
		expect(component.sideSelectedValue).toEqual(2);
		tick(30);
		component.lightingCapabilities = singleColorResponse;
		component.getLightingProfileByIdFromcache(getLightingProfileById);
		expect(component.sideSelectedValue).toEqual(2);
		tick(1000);
		getLightingProfileById.lightInfo[0].lightEffectType = 8;
		getLightingProfileById.lightInfo[1].lightEffectType = 8;
		component.getLightingProfileByIdFromcache(getLightingProfileById);
		expect(component.frontSelectedValue).toEqual(8);
		tick(30);
		getLightingProfileById.lightInfo[0].lightEffectType = 32;
		getLightingProfileById.lightInfo[1].lightEffectType = 32;
		component.getLightingProfileByIdFromcache(getLightingProfileById);
		expect(component.frontSelectedValue).toEqual(32);
		tick(30);
		getLightingProfileById.lightInfo[0].lightEffectType = 64;
		getLightingProfileById.lightInfo[1].lightEffectType = 64;
		component.getLightingProfileByIdFromcache(getLightingProfileById);
		expect(component.frontSelectedValue).toEqual(64);
		tick(30);
		getLightingProfileById.lightInfo[0].lightEffectType = 128;
		getLightingProfileById.lightInfo[1].lightEffectType = 128;
		component.getLightingProfileByIdFromcache(getLightingProfileById);
		expect(component.frontSelectedValue).toEqual(128);
	}));

	it('update capabilities according Interface', fakeAsync(() => {
		singleColorResponse.BrightAdjustLevel = 0;
		component.updateGetGamingLightingCapabilities(singleColorResponse);
		expect(component.showBrightnessSlider).toEqual(false);
		tick(30);
		singleColorResponse.BrightAdjustLevel = 1;
		component.enumLightEffectSingleOrComplex = {Simple: 1, Complex: 1};
		singleColorResponse.LightPanelType = [1,4];
		singleColorResponse.LedType_simple = [1,2,4,8];
		component.panelImageData = panelImageData;
		component.updateGetGamingLightingCapabilities(singleColorResponse);
		expect(component.showBrightnessSlider).toEqual(true);
		tick(30);
		component.enumLightEffectSingleOrComplex = {Simple: 1, Complex: 1};
		component.enumLightingRGBFeature = {Simple: 1, Complex: 1};
		singleColorResponse.RGBfeature = 1;
		localcacheServiceMock.setLocalCacheValue("[LocalStorageKey] LightingCapabilities",singleColorResponse);
		component.updateGetGamingLightingCapabilities(undefined);
		expect(component.updateGetGamingLightingCapabilities(undefined)).toBeUndefined();
		tick(30);
		localcacheServiceMock.setLocalCacheValue("[LocalStorageKey] LightingCapabilities",multipleColorResponse);
		component.updateGetGamingLightingCapabilities(undefined);
		expect(component.updateGetGamingLightingCapabilities(undefined)).toBeUndefined();
	}));

	it('Profile should be off', () => {
		component.currentProfileId = 0;
		fixture.detectChanges();
		component.ngOnInit();
		expect(component.isProfileOff).toEqual(true);
	});

	it('Profile shouldn\'t be off', () => {
		component.currentProfileId = 1;
		fixture.detectChanges();
		component.ngOnInit();
		expect(component.isProfileOff).toEqual(false);
	});

	it('should update the lightining features for single color', fakeAsync(() => {
		component.currentProfileId = 1;
		fixture.detectChanges();
		gamingLightingServiceMock.getLightingCapabilities.and.returnValue(Promise.resolve(singleColorResponse));
		component.getGamingLightingCapabilities();
		tick(10);
		expect(Object.keys(component.lightingCapabilities).length).toBeGreaterThanOrEqual(1);
	}));

	it('should update the lightining features for multi color', fakeAsync(() => {
		component.currentProfileId = 1;
		fixture.detectChanges();
		gamingLightingServiceMock.getLightingCapabilities.and.returnValue(Promise.resolve(multipleColorResponse));
		component.getGamingLightingCapabilities();
		tick(10);
		expect(Object.keys(component.lightingCapabilities).length).toBeGreaterThanOrEqual(1);
	}));

	it('should set the lighting profile to default', fakeAsync(() => {
		component.setDefaultProfile(0);
		expect(component.isProfileOff).toEqual(true);
		gamingLightingServiceMock.isShellAvailable = true;
		getLightingProfileById.didSuccess = true;
		getLightingProfileById.lightInfo[0].lightEffectType = 1;
		getLightingProfileById.lightInfo[1].lightEffectType = 1;
		gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(getLightingProfileById));
		component.setDefaultProfile(2);
		expect(component.isProfileOff).toEqual(false);
		tick(30);
		getLightingProfileById.lightInfo[0].lightEffectType = 8;
		getLightingProfileById.lightInfo[1].lightEffectType = 8;
		gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(getLightingProfileById));
		component.setDefaultProfile(2);
		expect(component.isProfileOff).toEqual(false);
	    tick(30);
		component.lightingCapabilities.RGBfeature = 1;
		component.setDefaultProfile(2);
		expect(component.isProfileOff).toEqual(false);
	}));

	it('should set the lighting profile to default false', fakeAsync(() => {
		getLightingProfileById.didSuccess = false;
		getLightingProfileById.lightInfo[0].lightEffectType = 1;
		getLightingProfileById.lightInfo[1].lightEffectType = 1;
		gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(getLightingProfileById));
		localcacheServiceMock.setLocalCacheValue("[LocalStorageKey] LightingSetDefaultProfile",getLightingProfileById);
		component.setDefaultProfile(2);
		expect(component.isProfileOff).toEqual(false);
		tick(30);
		getLightingProfileById.lightInfo[0].lightEffectType = 8;
		getLightingProfileById.lightInfo[1].lightEffectType = 8;
		gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(getLightingProfileById));
		localcacheServiceMock.setLocalCacheValue("[LocalStorageKey] LightingSetDefaultProfile",getLightingProfileById);
		component.setDefaultProfile(2);
		expect(component.isProfileOff).toEqual(false);
		tick(30);
		component.lightingCapabilities.RGBfeature = 1;
		component.setDefaultProfile(2);
		expect(component.isProfileOff).toEqual(false);
		tick(30);
		getLightingProfileById.profileId = 0;
		getLightingProfileById.didSuccess = false;
		gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(getLightingProfileById));
		localcacheServiceMock.setLocalCacheValue("[LocalStorageKey] LightingSetDefaultProfile",getLightingProfileById);
		component.setDefaultProfile(2);
		expect(component.isProfileOff).toEqual(false);
	}));

	it('get cache lighting capabilities when enter lighting subpage', () => {
		component.getCacheLightingCapabilities(multipleColorResponse);
		expect(component.showBrightnessSlider).toEqual(true);
		component.enumLightEffectSingleOrComplex = {Simple: 2, Complex: 2};
		multipleColorResponse.RGBfeature = 2;
		multipleColorResponse.LightPanelType = [64];
		component.getCacheLightingCapabilities(multipleColorResponse);
		expect(component.showBrightnessSlider).toEqual(true);
	});

	it('Should call the color changed front', () => {
		component.colorChangedFront({ hex: '#fffff' });
		expect(component.inHex1).toBe('#fffff');
	});

	it('Should call the color changed side', fakeAsync(() => {
		component.colorChangedSide({ hex: '#fffff' });
		expect(component.inHex2).toBe('#fffff');
		tick(10);
	}));

	it('Should call the optionChangedRGBTop', fakeAsync(() => {
		const event = { value: LightEffectComplexType.CPU_frequency};
		component.lightingCapabilities = {
			RGBfeature: LightEffectRGBFeature.Complex,
			LightPanelType: [{}],
			LedType_Complex: [{}],
			lightInfo: [
				{ lightPanelType: 32, lightEffectType: 2, lightColor: '55943D' },
				{ lightPanelType: 64, lightEffectType: 2, lightColor: '4A9325' }
			]
		};
		const res = component.optionChangedRGBTop(event, {});
		expect(res).toBe(undefined);
		tick(5);
		getLightingProfileById.didSuccess = true;
		getLightingProfileById.lightInfo[0].lightEffectType = 8;
		gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
		event.value = LightEffectComplexType.Breath;
		component.optionChangedRGBTop(event, {});
		expect(component.showHideOverlay).toEqual(false);
		tick(5);
		event.value = LightEffectComplexType.CPU_thermal;
		component.optionChangedRGBTop(event, {});
		expect(component.showHideOverlay).toEqual(true);
		tick(5);
		event.value = 8;
		getLightingProfileById.lightInfo[1].lightEffectType = 8;
		gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
		component.optionChangedRGBTop(event, {});
		expect(component.showHideOverlaySide).toEqual(true);
		tick(5);
		event.value = 1;
		getLightingProfileById.lightInfo[1].lightEffectType = 1;
		gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
		component.optionChangedRGBTop(event, {});
		expect(component.showHideOverlaySide).toEqual(false);
	}));

	it('Should call the optionChangedRGBTop(disSuccess is false)', fakeAsync(() => {
		getLightingProfileById.didSuccess = false;
		gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
		localcacheServiceMock.setLocalCacheValue("[LocalStorageKey] LightingProfileById ",getLightingProfileById);
		component.lightingCapabilities = {
			LightPanelType: [32, 64], 
			LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128], 
			LedType_simple: [0], 
			BrightAdjustLevel: 4, 
			RGBfeature: 255};
		component.simpleOrComplex = 4;
		component.enumLightEffectSingleOrComplex = {Simple: 2, Complex: 4};
		component.optionChangedRGBTop({ value: 2}, {});
		expect(component.showHideOverlaySide).toEqual(false);
		tick(20);
		component.optionChangedRGBTop({ value: 8}, {});
		expect(component.showHideOverlaySide).toEqual(true);
		tick(20);
		getLightingProfileById.lightInfo[1].lightEffectType = 4;
		gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
		component.optionChangedRGBTop({ value: 8}, {});
		expect(component.showHideOverlaySide).toEqual(true);
		tick(20);
		getLightingProfileById.lightInfo[1].lightEffectType = 12;
		gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
		component.optionChangedRGBTop({ value: 8}, {});
		expect(component.showHideOverlaySide).toEqual(true);
		tick(20);
	}))

	it('Should call the optionChangedRGBSide', fakeAsync(() => {
		const event = { value: LightEffectComplexType.CPU_frequency };
		component.lightingCapabilities = {
			RGBfeature: LightEffectRGBFeature.Complex,
			LightPanelType: [{}],
			LedType_Complex: [{}],
			lightInfo: [
				{ lightPanelType: 32, lightEffectType: 2, lightColor: '55943D' },
				{ lightPanelType: 64, lightEffectType: 2, lightColor: '4A9325' }
			]
		};
		const res = component.optionChangedRGBSide(event, {});
		expect(res).toBe(undefined);
		tick(5);
		gamingLightingServiceMock.isShellAvailable = true;
		gamingLightingServiceMock.setLightingProfileEffectColor.and
			.returnValue(Promise.resolve({ ...getLightingProfileById, didSuccess: false}));
		event.value = LightEffectComplexType.Breath;
		component.simpleOrComplex = LightEffectRGBFeature.Complex;
		const res1 = component.optionChangedRGBSide(event, {});
		expect(res1).toBe(undefined);
	}));

	it('should call the colorEffectChangedSide', fakeAsync(() => {
		component.lightingCapabilities = { LightPanelType: [] };
		gamingLightingServiceMock.setLightingProfileEffectColor.and
			.returnValue(Promise.resolve({ ...getLightingProfileById, didSuccess: true}));
		const res = component.colorEffectChangedSide('#fffff');
		expect(res).toBe(undefined);
	}));

	it('should call the colorEffectChangedSide', fakeAsync(() => {
		component.lightingCapabilities = { LightPanelType: [] };
		gamingLightingServiceMock.setLightingProfileEffectColor.and
			.returnValue(Promise.resolve({ ...getLightingProfileById, didSuccess: true}));
		const res = component.colorEffectChangedFront('#fffff');
		expect(res).toBe(undefined);
	}));

	it('should call the setLightingProfileId', fakeAsync(() => {
		component.setLightingProfileId({target: {value: 0}});
		expect(component.isProfileOff).toEqual(true);     
		tick(20); 
		getLightingProfileById.lightInfo[0].lightEffectType = 32;
		getLightingProfileById.lightInfo[1].lightEffectType = 32;
		getLightingProfileById.didSuccess = true;
		getLightingProfileById.profileId = 2;
	    gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(getLightingProfileById));
		component.setLightingProfileId({target: {value: 2}});
		expect(component.isProfileOff).toEqual(false); 
		tick(20);
		getLightingProfileById.lightInfo[0].lightEffectType = 4;
		getLightingProfileById.lightInfo[1].lightEffectType = 4;
		gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(getLightingProfileById));
		component.setLightingProfileId({target: {value: 2}});
		expect(component.isProfileOff).toEqual(false); 
		tick(20);
		component.lightingCapabilities = { 
			LightPanelType: [32, 64], 
			LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128], 
			LedType_simple: [0], 
			BrightAdjustLevel: 4, 
			RGBfeature: 255 };
		component.enumLightingRGBFeature = {Simple: 255, Complex: 2};
		component.setLightingProfileId({target: {value: 2}});
		expect(component.isProfileOff).toEqual(false); 
		tick(20);
		component.lightingCapabilities.LedType_Complex = [1];
		component.lightingCapabilities.LedType_simple = [1,2,4];
		component.setLightingProfileId({target: {value: 2}});
		expect(component.isProfileOff).toEqual(false); 
	}));

	it('should call the setLightingProfileId(didSuccess is false)', fakeAsync(() => {
		getLightingProfileById.didSuccess = false;
		getLightingProfileById.lightInfo[0].lightEffectType = 8;
		getLightingProfileById.lightInfo[1].lightEffectType = 8;
		getLightingProfileById.profileId = 2;
		gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(getLightingProfileById));
		component.setLightingProfileId({target: {value: 2}});
		expect(component.isProfileOff).toEqual(false); 
		tick(20);
		getLightingProfileById.lightInfo[0].lightEffectType = 1;
		getLightingProfileById.lightInfo[1].lightEffectType = 1;
		gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(getLightingProfileById));
		component.setLightingProfileId({target: {value: 2}});
		expect(component.isProfileOff).toEqual(false); 
		tick(20);
		component.lightingCapabilities = {
			LightPanelType: [32, 64], 
			LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128], 
			LedType_simple: [0], 
			BrightAdjustLevel: 4, 
			RGBfeature: 255};
		component.enumLightingRGBFeature =  {Simple: 255, Complex: 2};
		component.setLightingProfileId({target: {value: 2}});
		expect(component.isProfileOff).toEqual(false);
		tick(20);
		component.lightingCapabilities = {LightPanelType: [1], 
			LedType_Complex: [0], 
			LedType_simple: [1, 2, 3, 4], 
			BrightAdjustLevel: 0, 
			RGBfeature: 1 };
		component.enumLightingRGBFeature =  {Simple: 1, Complex: 2};
		component.setLightingProfileId({target: {value: 2}});
		expect(component.isProfileOff).toEqual(false);
	}));

	it('should call the setLightingBrightness', fakeAsync(() => {
		gamingLightingServiceMock.setLightingProfileBrightness.and.returnValue(Promise.resolve({ didSuccess: true }));
		const res = component.setLightingBrightness({ target: { value: 3 } });
		expect(res).toBe(undefined);
		gamingLightingServiceMock.setLightingProfileBrightness.and.returnValue(Promise.resolve({ didSuccess: false }));
		const res1 = component.setLightingBrightness({ target: { value: 3 } });
		expect(res1).toBe(undefined);
	}));

	it('should call the changeSingleCoorEffect', fakeAsync(() => {
		component.lightingCapabilities = { LightPanelType: [1], LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128] };
		const res = component.changeSingleCoorEffect({});
		expect(res).toBe(undefined);
	}));

	it('should call the getLightingProfileById with available shell', fakeAsync(() => {
		component.lightingCapabilities = {
			LightPanelType: [1],
			RGBfeature: LightEffectRGBFeature.Simple, LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128]
		};
		gamingLightingServiceMock.getLightingProfileById.and.returnValue(Promise.resolve(getLightingProfileById));
		gamingLightingServiceMock.isShellAvailable = true;
		tick(5);
		const res = component.getLightingProfileById(1);
		expect(res).toBe(undefined);
	}));

	it('should call the getLightingProfileById with no shell available', fakeAsync(() => {
		component.lightingCapabilities = {
			LightPanelType: [1],
			RGBfeature: LightEffectRGBFeature.Simple, LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128]
		};
		gamingLightingServiceMock.getLightingProfileById.and.returnValue(Promise.resolve({ ...getLightingProfileById, didSuccess: false }));
		gamingLightingServiceMock.isShellAvailable = true;
		tick(5);
		const res = component.getLightingProfileById(1);
		expect(res).toBe(undefined);
	}));
});

/**
 * @param options pipeName which has to be mock
 * @description To mock the pipe.
 * @summary This has to move to one utils file.
 */
export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(class MockPipe {
		public transform(query: string, ...args: any[]): any {
			return query;
		}
	}) as any;
}
