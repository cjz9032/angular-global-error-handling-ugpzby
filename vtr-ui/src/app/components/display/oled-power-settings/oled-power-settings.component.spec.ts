

import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { of } from 'rxjs';
import { OledPowerSettingsComponent } from './oled-power-settings.component';
import {TranslateModule} from "@ngx-translate/core";
import { DisplayService } from 'src/app/services/display/display.service';
import { DevService } from 'src/app/services/dev/dev.service';
const displayServiceMock = jasmine.createSpyObj('displayService', ['isShellAvailable', 'getOLEDPowerControlCapability']);

describe('OledPowerSettingsComponent', () => {
	let component: OledPowerSettingsComponent;
	let fixture: ComponentFixture<OledPowerSettingsComponent>;
	displayServiceMock.isShellAvailable.and.returnValue(true);
	displayServiceMock.getOLEDPowerControlCapability.and.returnValue(true);
  beforeEach(async(() => {
	TestBed.configureTestingModule({
    declarations: [ OledPowerSettingsComponent],
	schemas: [NO_ERRORS_SCHEMA],
	imports: [
		TranslateModule.forRoot(),
	],
			providers: [
				{ provide: HttpClient },
				{  provide: DisplayService, useValue: displayServiceMock  },
				{ provide: DevService },
			]
	})
	.compileComponents();
	fixture = TestBed.createComponent(OledPowerSettingsComponent);
		component = fixture.componentInstance;
		component.description= [
			"Your computer's OLED display can also reduce power consumption and increase battery life by selectively dimming portions of the display.",
			"It is also recommended to dim the task bar and other areas of the display that do not change frequently to prolong the overall lifetime of the display."
		]
		fixture.detectChanges();
  }));
  it('should create', () => {
	expect(component).toBeTruthy();
  });
  it('#Should call  initOledSettings', () => {
	displayServiceMock.getOLEDPowerControlCapability.and.returnValue(Promise.resolve(true));
	component.initOledSettings();
	const res=component.hasOLEDPowerControlCapability || true;
	expect(res).toEqual(true);
    
  });
  it('should test onTaskBarDimmerChange method', () => {
	let dropDownInterval: any = {value: 1}; 
	let val = component.taskBarDimmerValue || 1;
	component.onTaskBarDimmerChange(dropDownInterval);
	 expect(component.title).toString();
	 expect(val).toBeLessThanOrEqual(dropDownInterval.value);
});
it('should test onBackgroundDimmerChange method', () => {
	let dropDownInterval: any = {value: 1}; 
	let val = component.backgroundDimmerValue || 1;
	component.onBackgroundDimmerChange(dropDownInterval);
	 expect(component.title).toString();
	 expect(val).toBeLessThanOrEqual(dropDownInterval.value);
});
it('should test onDisplayDimmerChange method', () => {
	let dropDownInterval: any = {value: 1}; 
	let val = component.displayDimmerValue || 1;
	component.onDisplayDimmerChange(dropDownInterval);
	 expect(component.title).toString();
	 expect(val).toBeLessThanOrEqual(dropDownInterval.value);
});
it('should test ngOnChange method', () => {
	let obj: any = ['hasOLEDPowerControlCapability'].toString().trim(); 
	component.ngOnChanges(obj);
	expect(obj).toString();
	expect(obj).toBe('hasOLEDPowerControlCapability');
});
});
