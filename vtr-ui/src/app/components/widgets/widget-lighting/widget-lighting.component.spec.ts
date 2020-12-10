import { Gaming } from './../../../enums/gaming.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from 'src/app/services/gaming/lighting/gaming-lighting.service';
import { DeviceService } from './../../../services/device/device.service';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { WidgetLightingComponent } from './widget-lighting.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { of } from 'rxjs';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { GAMING_DATA } from 'src/testing/gaming-data';

describe('WidgetLightingComponent', () => {
	let component: WidgetLightingComponent;
	let fixture: ComponentFixture<WidgetLightingComponent>;
	let ledSwitchButtonFeature = true;
	let ledSetFeature = true;
	let ledDriver = true;
	let profileId = 2;
	const commonServiceMock = {
		getCapabalitiesNotification: () => of({ type: Gaming.GamingCapabilities }),
	};
	const localCacheServiceMock = {
		getLocalCacheValue:(key: any) => {
			switch (key) {
				case '[LocalStorageKey] LedSwitchButtonFeature':
					return ledSwitchButtonFeature;
				case '[LocalStorageKey] LedSetFeature':
					return ledSetFeature;
				case '[LocalStorageKey] LedDriver':
					return ledDriver;
				case 'LocalStorageKey.ProfileId':
					return profileId;
			}
		},
		setLocalCacheValue:(key: any, value: any) => {
			switch (key) {
				case '[LocalStorageKey] LedSwitchButtonFeature':
					ledSwitchButtonFeature = value;
					break;
				case '[LocalStorageKey] LedSetFeature':
					ledSetFeature = value;
					break;
				case '[LocalStorageKey] LedDriver':
					ledDriver = value;
					break;
				case 'LocalStorageKey.ProfileId':
					profileId = value;
					break;
			}
		},
	};
	const spy = jasmine.createSpyObj('GamingLightingService', [
		'isShellAvailable',
		'setLightingProfileId',
		'getLightingProfileId',
		'regLightingProfileIdChangeEvent',
	]);
	const deviceServiceMock = { getMachineInfo: () => Promise.resolve({}) };
	beforeEach(waitForAsync(() => {
		spy.isShellAvailable = true;
		spy.setLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: true }));
		spy.getLightingProfileId.and.returnValue(
			Promise.resolve({ didSuccess: true, profileId: 1 })
		);
		TestBed.configureTestingModule({
			declarations: [
				WidgetLightingComponent,
				GAMING_DATA.mockPipe({ name: 'translate' }),
				GAMING_DATA.mockPipe({ name: 'sanitize' }),
			],
			providers: [
				{ provide: DeviceService, useValue: deviceServiceMock },
				{ provide: GamingLightingService, useValue: spy },
				{ provide: CommonService, useValue: commonServiceMock },
				{ provide: LocalCacheService, useValue: localCacheServiceMock },
			],
			imports: [HttpClientModule],
			schemas: [NO_ERRORS_SCHEMA],
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
		localCacheServiceMock.setLocalCacheValue('[LocalStorageKey] LedSetFeature', true);
		localCacheServiceMock.setLocalCacheValue('[LocalStorageKey] LedDriver', false);
		component.ledSetFeature = true;
		const res = component.getCapabilities();
		expect(res).toBe(undefined);
		localCacheServiceMock.setLocalCacheValue('[LocalStorageKey] LedSetFeature', false);
		localCacheServiceMock.setLocalCacheValue('[LocalStorageKey] LedDriver', true);
		component.getCapabilities();
		expect(component.isLightingVisible).toEqual(false);
		localCacheServiceMock.setLocalCacheValue('[LocalStorageKey] LedDriver', false);
		component.getCapabilities();
		expect(component.isLightingVisible).toEqual(false);
	});

	it('should get the capabilities and should set islighting as true', () => {
		localCacheServiceMock.setLocalCacheValue('[LocalStorageKey] LedSetFeature', true);
		localCacheServiceMock.setLocalCacheValue('[LocalStorageKey] LedDriver', true);
		fixture.detectChanges();
		const res = component.getCapabilities();
		expect(res).toBe(undefined);
	});

	it('should show popup', () => {
		component.isPopupVisible = true;
		component.setLightingProfileId({ target: { value: 1 } });
		expect(component.isPopupVisible).toBe(true);
	});

	it('should not show popup', () => {
		component.isPopupVisible = false;
		component.setprofId = 0;
		spy.setLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: true }));
		component.didSuccess = true;
		component.setLightingProfileId({ target: { value: 1 } });
		expect(component.setprofId).toEqual(1);
		component.setprofId = 1;
		component.setLightingProfileId({ target: { value: 1 } });
		expect(component.setprofId).toEqual(1);
		component.isPopupVisible = false;
		spy.setLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: null }));
		component.setLightingProfileId({ target: { value: 2 } });
		expect(component.setLightingProfileId({ target: { value: 1 } })).toBeUndefined();
	});

	it('should setProfileEvent', () => {
		component.setprofId = 2;
		component.setProfileEvent(1);
		expect(component.setprofId).not.toEqual(2);
		component.setProfileEvent(undefined);
		expect(component.setProfileEvent(undefined)).toBeUndefined();
	});

	it('should regLightingProfileIdChangeEvent', () => {
		localCacheServiceMock.setLocalCacheValue('[LocalStorageKey] LedSwitchButtonFeature', true);
		component.getCapabilities();
		expect(component.ledSwitchButtonFeature).toEqual(true);
		localCacheServiceMock.setLocalCacheValue('[LocalStorageKey] LedSwitchButtonFeature', false);
		component.getCapabilities();
		expect(component.getCapabilities()).toBeUndefined();
	});

	it('should get lighting profileId', fakeAsync(() => {
		spy.getLightingProfileId.and.returnValue(
			Promise.resolve({ didSuccess: false, profileId: 1 })
		);
		component.getLightingProfileId();
		expect(component.getLightingProfileId()).toBeUndefined();
	}));
});

