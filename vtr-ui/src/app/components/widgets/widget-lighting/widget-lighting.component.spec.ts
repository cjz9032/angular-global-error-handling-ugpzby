import { Gaming } from './../../../enums/gaming.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from 'src/app/services/gaming/lighting/gaming-lighting.service';
import { DeviceService } from './../../../services/device/device.service';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { WidgetLightingComponent } from './widget-lighting.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { of } from 'rxjs';

describe('WidgetLightingComponent', () => {
	let component: WidgetLightingComponent;
	let fixture: ComponentFixture<WidgetLightingComponent>;
	const commonServiceMock = {
		getLocalStorageValue: (key, defaultVal) => {
			if(localStorage.getItem(key) !== "undefined"){
				return JSON.parse(localStorage.getItem(key));
			}else{
				return undefined;
			} 
		},
		setLocalStorageValue: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
		getCapabalitiesNotification: () => of({ type: Gaming.GamingCapabilities })
	};
	const spy = jasmine.createSpyObj('GamingLightingService',['isShellAvailable','setLightingProfileId','getLightingProfileId','regLightingProfileIdChangeEvent']);
	const deviceServiceMock = { getMachineInfo: () => Promise.resolve({}) };
	beforeEach(async(() => {
		spy.isShellAvailable = true;
		spy.setLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: true }));
		spy.getLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: true, profileId: 1 }));
		TestBed.configureTestingModule({
			declarations: [WidgetLightingComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })],
			providers: [
				{ provide: DeviceService, useValue: deviceServiceMock },
				{ provide: GamingLightingService, useValue: spy },
				{ provide: CommonService, useValue: commonServiceMock }
			],
			imports: [HttpClientModule],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
		fixture = TestBed.createComponent(WidgetLightingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should check status', () => {
		component.checkStatus(1);
		expect(component.isdriverpopup).toBe(true);
		component.checkStatus(null);
		expect(component.checkStatus(null)).toBeUndefined();
	});

	it('should get the capabilities and should set islighting as false', () => {
		localStorage.setItem('[LocalStorageKey] LedSetFeature', 'true');
		localStorage.setItem('[LocalStorageKey] LedDriver', 'false');
		component.ledSetFeature = true;
		const res = component.getCapabilities();
		expect(res).toBe(undefined);
		localStorage.setItem('[LocalStorageKey] LedSetFeature', 'false');
		localStorage.setItem('[LocalStorageKey] LedDriver', 'true');
		component.getCapabilities();
		expect(component.isLightingVisible).toEqual(false);
		localStorage.setItem('[LocalStorageKey] LedDriver', 'false');
		component.getCapabilities();
		expect(component.isLightingVisible).toEqual(false);
	});

	it('should get the capabilities and should set islighting as true', () => {
		localStorage.setItem('[LocalStorageKey] LedSetFeature', 'true');
		localStorage.setItem('[LocalStorageKey] LedDriver', 'true');
		fixture.detectChanges();
		const res = component.getCapabilities();
		expect(res).toBe(undefined);
	});

	it('should show popup', () => {
		component.isPopupVisible = true;
		component.SetProfile({ target: {value : 1}});
		expect(component.isPopupVisible).toBe(true);
	});

	it('should not show popup', () => {
		component.isPopupVisible = false;
		spy.setLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: true }));
		component.didSuccess = true;
		component.SetProfile({ target: {value : 1}});
		expect(component.setprofId).toEqual(1);
		component.setprofId = 1;
		component.SetProfile({ target: {value : 1}});
		expect(component.setprofId).toEqual(1);
		component.isPopupVisible = false;
		spy.setLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: null }));
		component.SetProfile({ target: {value : 2}});
		expect(component.SetProfile({ target: {value : 1}})).toBeUndefined();
	});

	it('should setProfileEvent', () => {
		component.setprofId =2;
		component.setProfileEvent(1);
		expect(component.setprofId).not.toEqual(2);
		component.setProfileEvent(undefined);
		expect(component.setProfileEvent(undefined)).toBeUndefined();
	});

	it('should regLightingProfileIdChangeEvent', () => {
	  localStorage.setItem('[LocalStorageKey] LedSwitchButtonFeature', 'true');
	  component.getCapabilities();
	  expect(component.ledSwitchButtonFeature).toEqual(true);
	  localStorage.setItem('[LocalStorageKey] LedSwitchButtonFeature', 'false');
	  component.getCapabilities();
	  expect(component.getCapabilities()).toBeUndefined();
   });

   it('should get lighting profileId', fakeAsync(() => {
	   spy.getLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: false, profileId: 1 }));
	   component.getLightingProfileId();
	   expect(component.getLightingProfileId()).toBeUndefined();
   }))

});

export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}
