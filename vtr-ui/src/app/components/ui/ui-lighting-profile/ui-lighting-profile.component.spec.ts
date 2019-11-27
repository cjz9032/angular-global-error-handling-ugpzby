import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UiLightingProfileComponent } from './ui-lighting-profile.component';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device/device.service';

const gamingLightingServiceMock = jasmine.createSpyObj('GamingLightingService', ['isShellAvailable', 'getLightingCapabilities', 'optionChangedRGBTop', 'optionChangedRGBSide', 'setLightingDefaultProfileById', 'setLightingProfileEffectColor']);
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
xdescribe('UiLightingProfileComponent', () => {
	let component: UiLightingProfileComponent;
	let fixture: ComponentFixture<UiLightingProfileComponent>;
	gamingLightingServiceMock.isShellAvailable.and.returnValue(true);
	deviceServiceMock.isShellAvailable.and.returnValue(true);
	deviceServiceMock.getMachineInfo.and.returnValue(Promise.resolve(undefined));
	beforeEach(fakeAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiLightingProfileComponent,
				mockPipe({ name: 'translate' })],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } },
				{ provide: DeviceService, useValue: deviceServiceMock },
				{ provide: GamingLightingService, useValue: gamingLightingServiceMock }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(UiLightingProfileComponent);
		component = fixture.debugElement.componentInstance;
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
	})

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
						lightColor: "FFFFFF"
					},
					{
						lightPanelType: 64,
						lightEffectType: 2,
						lightColor: "FF0000"
					}
				]
			}
		));
		component.setDefaultProfile(component.currentProfileId);
		tick(10);
		expect(component.profileBrightness).toEqual(3);
		tick(10);
	}));

	it('should set the lighting profile', fakeAsync(() => {
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
						lightColor: "FFFFFF"
					},
					{
						lightPanelType: 64,
						lightEffectType: 2,
						lightColor: "FF0000"
					}
				]
			}
		));
		let e = { target: { value: 1 } }
		component.setDefaultProfile(e);
		component.setLightingProfileId(e);
		tick(10);
		expect(component.profileBrightness).toEqual(3);
		tick(10);
		expect(component.frontSelectedValue).toEqual(4);
		tick(10);
		expect(component.sideSelectedValue).toEqual(2);
		tick(10);
		expect(component.inHex1).toEqual('FFFFFF');
		tick(10);
		expect(component.inHex2).toEqual('FF0000');
	}));

	it('Should give false show hide overlay when call optionchange RGB top using setLightingProfileEffectColor function.', fakeAsync(() => {
		fixture = TestBed.createComponent(UiLightingProfileComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();

		gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(
			{
				profileId: 1,
				lightPanelType: 32,
				lightEffectType: 4
			}
		));
		component.optionChangedRGBTop(2, 1);
		tick(10);
		expect(component.showHideOverlay).toEqual(false);
	}));

	it('Should give false show hide overlay when call optionchange RGB side using setLightingProfileEffectColor function.', fakeAsync(() => {
		fixture = TestBed.createComponent(UiLightingProfileComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(
			{
				profileId: 1,
				lightPanelType: 32,
				lightEffectType: 4
			}
		));
		component.optionChangedRGBSide(2, 1);
		tick(10);
		expect(component.showHideOverlay).toEqual(false);
	}))

	xit('chcking', fakeAsync(() => {
		fixture = TestBed.createComponent(UiLightingProfileComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		let e = { target: { value: 1 } };
		component.changeSingleCoorEffect(e);
	}))

	// xit('should update the top dropdown ', fakeAsync(() => {
	// 	component.currentProfileId = 1;
	// 	fixture.detectChanges();
	// 	gamingLightingServiceMock.getLightingCapabilities.and.returnValue(Promise.resolve(multipleColorResponse));
	// 	component.optionChangedRGBTop({ value: 2 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(false);
	// 	component.optionChangedRGBTop({ value: 4 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(false);
	// 	component.optionChangedRGBTop({ value: 8 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(true);
	// 	component.optionChangedRGBTop({ value: 32 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(true);
	// 	component.optionChangedRGBTop({ value: 64 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(true);
	// 	component.optionChangedRGBTop({ value: 128 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(true);
	// 	component.optionChangedRGBTop({ value: 4 }, {});
	// 	tick(10);
	// 	expect(component.enableBrightCondition).toEqual(true);
	// 	component.optionChangedRGBTop({ value: 8 }, {});
	// 	tick(10);
	// 	expect(component.enableBrightCondition).toEqual(true);

	// }));

	// xit('should update the side dropdown ', fakeAsync(() => {
	// 	component.currentProfileId = 1;
	// 	gamingLightingServiceMock.getLightingCapabilities.and.returnValue(Promise.resolve(
	// 		{
	// 			"LightPanelType":[32],
	// 			"LedType_Complex": [268435456],
	// 			"LedType_simple":[268435456],
	// 			"BrightAdjustLevel":4|0,
	// 			"RGBfeature":255|0|0
	// 		}
	// 	));
	// 	component.optionChangedRGBSide({ value: 2 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(false);
	// 	component.optionChangedRGBSide({ value: 4 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(false);
	// 	component.optionChangedRGBSide({ value: 8 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(true);
	// 	component.optionChangedRGBSide({ value: 32 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(true);
	// 	component.optionChangedRGBSide({ value: 64 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(true);
	// 	component.optionChangedRGBSide({ value: 128 }, {});
	// 	tick(10);
	// 	expect(component.showHideOverlaySide).toEqual(true);
	// 	component.optionChangedRGBSide({ value: 4 }, {});
	// 	tick(10);
	// 	expect(component.enableBrightCondition).toEqual(true);
	// 	component.optionChangedRGBSide({ value: 8 }, {});
	// 	tick(10);
	// 	expect(component.enableBrightCondition).toEqual(true);
	// }));

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
	return <any>Pipe(metadata)(class MockPipe {
		public transform(query: string, ...args: any[]): any {
			return query;
		}
	});
}
