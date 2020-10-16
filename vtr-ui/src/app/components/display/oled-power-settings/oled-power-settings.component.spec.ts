import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OledPowerSettingsComponent } from './oled-power-settings.component';
import { DisplayService } from 'src/app/services/display/display.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownInterval } from 'src/app/data-models/common/drop-down-interval.model';

describe('OledPowerSettingsComponent', () => {
	let component: OledPowerSettingsComponent;
	let fixture: ComponentFixture<OledPowerSettingsComponent>;
	let displayService: DisplayService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OledPowerSettingsComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule],
			providers: [DevService, DisplayService]
		}).compileComponents();
		fixture = TestBed.createComponent(OledPowerSettingsComponent);
		component = fixture.componentInstance;
		component.description = [
			'Your computer\'s OLED display can also reduce power consumption and increase battery life by selectively dimming portions of the display.',
			'It is also recommended to dim the task bar and other areas of the display that do not change frequently to prolong the overall lifetime of the display.'
		];
		displayService = TestBed.inject(DisplayService);
	}));
	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call ngOnInit', () => {
		const spy = spyOn(component, 'initOledSettings');
		spyOn<any>(component, 'populateIntervals');
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it('should call ngOnChanges', () => {
		const spy = spyOn(component, 'initOledSettings');
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initOledSettings - hasOLEDPowerControlCapability is true', () => {
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'getOLEDPowerControlCapability').and.returnValue(Promise.resolve(true));
		component.initOledSettings();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initOledSettings - hasOLEDPowerControlCapability is false', () => {
		displayService.isShellAvailable = true;
		let spy = spyOn(displayService, 'getOLEDPowerControlCapability').and.returnValue(Promise.resolve(false));
		component.initOledSettings();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initOledSettings - getOLEDPowerControlCapability is rejected', () => {
		displayService.isShellAvailable = true;
		let spy = spyOn(displayService, 'getOLEDPowerControlCapability').and.returnValue(Promise.reject());
		component.initOledSettings();
		expect(spy).toHaveBeenCalled();
	});

	it('should call initOledSettings - isShellAvailable is false', () => {
		displayService.isShellAvailable = false;
		let spy = spyOn(displayService, 'getOLEDPowerControlCapability');
		component.initOledSettings();
		expect(spy).not.toHaveBeenCalled();
	});

	it('should initOledSettings throw error', () => {
		expect(component.initOledSettings).toThrow();
	});

	it('should call onTaskBarDimmerChange', () => {
		const event: DropDownInterval = {
			name: 'Taskbar Dimmer',
			value: 1,
			placeholder: 'Taskbar',
			text: 'Some text',
			metricsValue: null,
		}
		component.onTaskBarDimmerChange(event);
		expect(component.title).toEqual(event.placeholder);
	});

	it('should call onBackgroundDimmerChange', () => {
		const event: DropDownInterval = {
			name: 'Taskbar Dimmer',
			value: 1,
			placeholder: 'Taskbar',
			text: 'Some text',
			metricsValue: null
		}
		component.onBackgroundDimmerChange(event)
		expect(component.title).toEqual(event.placeholder)
	});

	it('should call onDisplayDimmerChange', () => {
		const event: DropDownInterval = {
			name: 'Taskbar Dimmer',
			value: 1,
			placeholder: 'Taskbar',
			text: 'Some text',
			metricsValue: null,
		}
		component.onDisplayDimmerChange(event)
		expect(component.title).toEqual(event.placeholder)
	});

	it('should call getTaskbarDimmerSetting - inner catch block', () => {
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'getTaskbarDimmerSetting').and.returnValue(Promise.reject());
		component.getTaskbarDimmerSetting();
		expect(spy).toHaveBeenCalled();
	});

	it('should getTaskbarDimmerSetting - outer catch block', () => {
		expect(component.getTaskbarDimmerSetting).toThrow()
	});

	it('should call getBackgroundDimmerSetting - inner catch block', () => {
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'getBackgroundDimmerSetting').and.returnValue(Promise.reject());
		component.getBackgroundDimmerSetting();
		expect(spy).toHaveBeenCalled();
	});

	it('should getBackgroundDimmerSetting - outer catch block', () => {
		expect(component.getBackgroundDimmerSetting).toThrow();
	});

	it('should call getDisplayDimmerSetting - inner catch block', () => {
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'getDisplayDimmerSetting').and.returnValue(Promise.reject());
		component.getDisplayDimmerSetting();
		expect(spy).toHaveBeenCalled();
	});

	it('should getDisplayDimmerSetting - outer catch block', () => {
		expect(component.getDisplayDimmerSetting).toThrow()
	});

	it('should call setTaskbarDimmerSetting', () => {
		const value = 1;
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'setTaskbarDimmerSetting').and.returnValue(Promise.resolve(true));
		component['setTaskbarDimmerSetting'](value);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setTaskbarDimmerSetting - inner catch block', () => {
		const value = 1;
		displayService.isShellAvailable = true;
		let spy = spyOn(displayService, 'setTaskbarDimmerSetting').and.returnValue(Promise.reject());
		component['setTaskbarDimmerSetting'](value);
		expect(spy).toHaveBeenCalled();
	});

	it('should setTaskbarDimmerSetting - outer catch block', () => {
		expect(component['setTaskbarDimmerSetting']).toThrow();
	});

	it('should call setBackgroundDimmerSetting', () => {
		const value = 1;
		displayService.isShellAvailable = true;
		let spy = spyOn(displayService, 'setBackgroundDimmerSetting').and.returnValue(Promise.resolve(true));
		component['setBackgroundDimmerSetting'](value);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setBackgroundDimmerSetting - inner catch block', () => {
		const value = 1;
		displayService.isShellAvailable = true;
		let spy = spyOn(displayService, 'setBackgroundDimmerSetting').and.returnValue(Promise.reject());
		component['setBackgroundDimmerSetting'](value);
		expect(spy).toHaveBeenCalled();
	});

	it('should setBackgroundDimmerSetting - outer catch block', () => {
		expect(component['setBackgroundDimmerSetting']).toThrow();
	});

	it('should call setDisplayDimmerSetting', () => {
		const value = 1;
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'setDisplayDimmerSetting').and.returnValue(Promise.resolve(true));
		component['setDisplayDimmerSetting'](value);
		expect(spy).toHaveBeenCalled();
	});

	it('should call setDisplayDimmerSetting - inner catch block', () => {
		const value = 1;
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'setDisplayDimmerSetting').and.returnValue(Promise.reject());
		component['setDisplayDimmerSetting'](value);
		expect(spy).toHaveBeenCalled();
	});

	it('should setDisplayDimmerSetting - outer catch block', () => {
		expect(component['setDisplayDimmerSetting']).toThrow();
	});

});
