/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { SubpageDeviceSettingsPowerContainerComponent } from './subpage-device-settings-power-container.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { resolve } from 'dns';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AndroidService } from 'src/app/services/android/android.service';
import { DevService } from 'src/app/services/dev/dev.service';

describe('SubpageDeviceSettingsPowerContainerComponent', () => {
	let component: SubpageDeviceSettingsPowerContainerComponent;
	let fixture: ComponentFixture<SubpageDeviceSettingsPowerContainerComponent>;
	let deviceService: DeviceService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsPowerContainerComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore,DevService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsPowerContainerComponent);
		component = fixture.componentInstance;
		deviceService = fixture.debugElement.injector.get(DeviceService);
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should show dpm page when brand is "think", subBrand is "thinkcentre"', fakeAsync(() => {
		let mockMachineInfo = { brand: 'think', subBrand: 'thinkcentre' };
		spyOn(deviceService, 'getMachineInfo').and.returnValue(Promise.resolve(mockMachineInfo));
		fixture.detectChanges();
		tick();
		expect(component.showDpm).toBeTruthy();
	}));

	it('should show dpm page when brand is "Lenovo", subBrand is "ThinkCenter"', fakeAsync(() => {
		let mockMachineInfo = { brand: 'Lenovo', subBrand: 'ThinkCenter' };
		spyOn(deviceService, 'getMachineInfo').and.returnValue(Promise.resolve(mockMachineInfo));
		fixture.detectChanges();
		tick();
		expect(component.showDpm).toBeTruthy();
	}));

	it('should not show dpm page when brand is "other", subBrand is "ThinkCenter"', fakeAsync(() => {
		let mockMachineInfo = { brand: 'other', subBrand: 'ThinkCenter' };
		spyOn(deviceService, 'getMachineInfo').and.returnValue(Promise.resolve(mockMachineInfo));
		fixture.detectChanges();
		tick();
		expect(component.showDpm).toBeFalsy();
	}));

	it('should not show dpm page when brand is "lenovo", subBrand is "other"', fakeAsync(() => {
		let mockMachineInfo = { brand: 'lenovo', subBrand: 'other' };
		spyOn(deviceService, 'getMachineInfo').and.returnValue(Promise.resolve(mockMachineInfo));
		fixture.detectChanges();
		tick();
		expect(component.showDpm).toBeFalsy();
	}));
});
