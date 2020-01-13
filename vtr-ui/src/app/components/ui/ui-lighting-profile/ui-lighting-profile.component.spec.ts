import { LightEffectComplexType } from './../../../enums/light-effect-complex-type';
import { LightEffectRGBFeature } from './../../../enums/light-effect-rgbfeature';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UiLightingProfileComponent } from './ui-lighting-profile.component';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device/device.service';

const gamingLightingServiceMock = jasmine.createSpyObj('GamingLightingService', ['getLightingProfileById', 'setLightingProfileId', 'setLightingProfileBrightness',
	'isShellAvailable', 'getLightingCapabilities', 'optionChangedRGBTop', 'optionChangedRGBSide', 'setLightingDefaultProfileById', 'setLightingProfileEffectColor']);
const deviceServiceMock = jasmine.createSpyObj('DeviceService', ['isShellAvailable', 'getMachineInfo']);
const singleColorResponse = { LightPanelType: [1], LedType_Complex: [0], LedType_simple: [1, 2, 3, 4], BrightAdjustLevel: 0, RGBfeature: 1 };
const multipleColorResponse = { LightPanelType: [32, 64], LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128], LedType_simple: [0], BrightAdjustLevel: 4, RGBfeature: 255 };
const getLightingProfileById: any = {
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
describe('UiLightingProfileComponent', () => {
	let component: UiLightingProfileComponent;
	let fixture: ComponentFixture<UiLightingProfileComponent>;
	gamingLightingServiceMock.isShellAvailable.and.returnValue(true);
	gamingLightingServiceMock.setLightingProfileEffectColor.and
		.returnValue(Promise.resolve(getLightingProfileById));
	deviceServiceMock.isShellAvailable.and.returnValue(true);
	deviceServiceMock.getMachineInfo.and.returnValue(Promise.resolve(undefined));
	beforeEach(fakeAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiLightingProfileComponent,
				mockPipe({ name: 'translate' })],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
				{ provide: DeviceService, useValue: deviceServiceMock },
				{ provide: GamingLightingService, useValue: gamingLightingServiceMock }
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

	it('Profile should be off', () => {
		component.currentProfileId = 0;
		fixture.detectChanges();
		// deviceServiceMock.getMachineInfo.and.returnValue(Promise.resolve(undefined));
		// component.defaultLanguage = 'en';
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
		component.currentProfileId = 1;
		fixture.detectChanges();
		gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(
			{
				didSuccess: true,
				profileId: 1,
				brightness: 3,
				lightInfo: [
					{
						lightPanelType: 32,
						lightEffectType: 4,
						lightColor: 'FFFFFF'
					},
					{
						lightPanelType: 64,
						lightEffectType: 2,
						lightColor: 'FF0000'
					}
				]
			}
		));
		component.setDefaultProfile(component.currentProfileId);
		tick(10);
		expect(component.profileBrightness).toEqual(3);
		tick(10);
		gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(
			{
				didSuccess: false,
				profileId: 1,
				brightness: 3,
				lightInfo: [
					{
						lightPanelType: 32,
						lightEffectType: 4,
						lightColor: 'FFFFFF'
					},
					{
						lightPanelType: 64,
						lightEffectType: 2,
						lightColor: 'FF0000'
					}
				]
			}
		));
		component.setDefaultProfile(component.currentProfileId);
		tick(10);
	}));

	it('SHould get the cache details', () => {
		const res = component.getCacheLightingCapabilities({
			RGBfeature: LightEffectRGBFeature.Complex,
			LedType_Complex: [1], LightPanelType: [{}]
		});
		expect(res).toBe(undefined);
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

	it('Should call the update lighting', fakeAsync(() => {
		const res = component.updateGetGamingLightingCapabilities(null);
		expect(res).toBe(undefined);
	}));

	it('Should call the optionChangedRGBTop', fakeAsync(() => {
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
		const res = component.optionChangedRGBTop(event, {});
		expect(res).toBe(undefined);
		tick(5);
		gamingLightingServiceMock.isShellAvailable = true;
		gamingLightingServiceMock.setLightingProfileEffectColor.and
			.returnValue(Promise.resolve({...getLightingProfileById, didSuccess: false}));
		event.value = LightEffectComplexType.Breath;
		component.simpleOrComplex = LightEffectRGBFeature.Complex;
		const res1 = component.optionChangedRGBTop(event, {});
		expect(res1).toBe(undefined);
	}));

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
		component.lightingCapabilities = { LightPanelType: [], LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128] };
		gamingLightingServiceMock.setLightingProfileEffectColor.and
			.returnValue(Promise.resolve({...getLightingProfileById, didSuccess: true}));
		gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve({ profileId: 1, didSuccess: false }));
		const res = component.setLightingProfileId({ target: { value: 3 } });
		expect(res).toBe(undefined);
	}));

	it('should call the setLightingBrightness', fakeAsync(() => {
		gamingLightingServiceMock.setLightingProfileBrightness.and.returnValue(Promise.resolve({ didSuccess: true }));
		const res = component.setLightingBrightness({ target: { value: 3 } });
		expect(res).toBe(undefined);
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
