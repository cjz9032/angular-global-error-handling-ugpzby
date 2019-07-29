import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UiLightingProfileComponent } from './ui-lighting-profile.component';
import { Pipe } from '@angular/core';
const gamingLightingServiceMock = jasmine.createSpyObj('GamingLightingService', ['isShellAvailable', 'getLightingCapabilities']);
const singleColorResponse = { LightPanelType: [1], LedType_Complex: [0], LedType_simple: [1, 2, 3, 4], BrightAdjustLevel: 0, RGBfeature: 1 };
const multipleColorResponse = { LightPanelType: [32, 64], LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128], LedType_simple: [0], BrightAdjustLevel: 4, RGBfeature: 255 };

describe('UiLightingProfileComponent', () => {
	let component: UiLightingProfileComponent;
	let fixture: ComponentFixture<UiLightingProfileComponent>;
	gamingLightingServiceMock.isShellAvailable.and.returnValue(true);

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiLightingProfileComponent,
				mockPipe({ name: 'translate' })],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [{ provide: HttpClient }, { provide: GamingLightingService, useValue: gamingLightingServiceMock }]
		}).compileComponents();
		fixture = TestBed.createComponent(UiLightingProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Profile should be off', () => {
		component.currentProfileId = 0;
		fixture.detectChanges();
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
