import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {
	NO_ERRORS_SCHEMA,
	Pipe,
	SimpleChanges,
	SimpleChange
} from "@angular/core";
import { OledPowerSettingsComponent } from "./oled-power-settings.component";

import { DisplayService } from "src/app/services/display/display.service";
import { DevService } from "src/app/services/dev/dev.service";

import { of } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { DropDownInterval } from 'src/app/data-models/common/drop-down-interval.model';

// const displayServiceMock = jasmine.createSpyObj("displayService", [
// 	"isShellAvailable",
// 	"getOLEDPowerControlCapability"
// ]);

describe("OledPowerSettingsComponent", () => {
	let component: OledPowerSettingsComponent;
	let fixture: ComponentFixture<OledPowerSettingsComponent>;
	let devService: DevService;
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
			"Your computer's OLED display can also reduce power consumption and increase battery life by selectively dimming portions of the display.",
			"It is also recommended to dim the task bar and other areas of the display that do not change frequently to prolong the overall lifetime of the display."
		];
		displayService = TestBed.get(DisplayService);
	}));
	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should call ngOnInit", () => {
		let spy = spyOn(component, "initOledSettings");
		spyOn<any>(component, "populateIntervals");
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it("should call ngOnChanges", () => {
		component.hasOLEDPowerControlCapability = false;
		let changes: SimpleChanges = {
			hasOLEDPowerControlCapability: {
				previousValue: false,
				currentValue: true,
				firstChange: true,
				isFirstChange() {
					return true;
				}
			}
		};
		let spy = spyOn(component, "initOledSettings");
		component.ngOnChanges(changes);
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it("should call ngOnChanges - else case", () => {
		let changes: SimpleChanges = {};
		let spy = spyOn(component, "initOledSettings");
		component.ngOnChanges(changes);
		fixture.detectChanges();
		expect(component.hasOLEDPowerControlCapability).toBeUndefined();
	});

	it('should call initOledSettings - hasOLEDPowerControlCapability is true', () => {
		displayService.isShellAvailable = true;
		let spy = spyOn(displayService, 'getOLEDPowerControlCapability').and.returnValue(Promise.resolve(true))
		component.initOledSettings()
		expect(spy).toHaveBeenCalled()
	});

	it('should call initOledSettings - hasOLEDPowerControlCapability is false', () => {
		displayService.isShellAvailable = true;
		let spy = spyOn(displayService, 'getOLEDPowerControlCapability').and.returnValue(Promise.resolve(false))
		component.initOledSettings()
		expect(spy).toHaveBeenCalled()
	});

	it('should call initOledSettings - getOLEDPowerControlCapability is rejected', () => {
		displayService.isShellAvailable = true;
		let spy = spyOn(displayService, 'getOLEDPowerControlCapability').and.returnValue(Promise.reject())
		component.initOledSettings()
		expect(spy).toHaveBeenCalled()
	});

	it('should call initOledSettings - isShellAvailable is false', () => {
		displayService.isShellAvailable = false;
		let spy = spyOn(displayService, 'getOLEDPowerControlCapability')
		component.initOledSettings()
		expect(spy).not.toHaveBeenCalled()
	});

	it('should initOledSettings throw error', () => {
		expect(component.initOledSettings).toThrow()
	});

	it('should call onTaskBarDimmerChange', () => {
		const event: DropDownInterval = {
			name: 'Taskbar Dimmer',
			value: 1,
			placeholder: 'Taskbar',
			text: 'Some text'
		}
		component.onTaskBarDimmerChange(event)
		expect(component.title).toEqual(event.placeholder)
	});

	it('should call onBackgroundDimmerChange', () => {
		const event: DropDownInterval = {
			name: 'Taskbar Dimmer',
			value: 1,
			placeholder: 'Taskbar',
			text: 'Some text'
		}
		component.onBackgroundDimmerChange(event)
		expect(component.title).toEqual(event.placeholder)
	});

	it('should call onDisplayDimmerChange', () => {
		const event: DropDownInterval = {
			name: 'Taskbar Dimmer',
			value: 1,
			placeholder: 'Taskbar',
			text: 'Some text'
		}
		component.onDisplayDimmerChange(event)
		expect(component.title).toEqual(event.placeholder)
	});

	it('should call getTaskbarDimmerSetting - inner catch block', () => {
		displayService.isShellAvailable = true
		component.hasOLEDPowerControlCapability = true
		let spy = spyOn(displayService, 'getTaskbarDimmerSetting').and.returnValue(Promise.reject())
		component.getTaskbarDimmerSetting()
		expect(spy).toHaveBeenCalled()
	});

	it('should getTaskbarDimmerSetting - outer catch block', () => {
		expect(component.getTaskbarDimmerSetting).toThrow()
	});

	it('should call getBackgroundDimmerSetting - inner catch block', () => {
		displayService.isShellAvailable = true
		component.hasOLEDPowerControlCapability = true
		let spy = spyOn(displayService, 'getBackgroundDimmerSetting').and.returnValue(Promise.reject())
		component.getBackgroundDimmerSetting()
		expect(spy).toHaveBeenCalled()
	});

	it('should getBackgroundDimmerSetting - outer catch block', () => {
		expect(component.getBackgroundDimmerSetting).toThrow()
	});

	it('should call getDisplayDimmerSetting - inner catch block', () => {
		displayService.isShellAvailable = true
		component.hasOLEDPowerControlCapability = true
		let spy = spyOn(displayService, 'getDisplayDimmerSetting').and.returnValue(Promise.reject())
		component.getDisplayDimmerSetting()
		expect(spy).toHaveBeenCalled()
	});

	it('should getDisplayDimmerSetting - outer catch block', () => {
		expect(component.getDisplayDimmerSetting).toThrow()
	});

	it('should call setTaskbarDimmerSetting', () => {
		const value = 1
		displayService.isShellAvailable = true
		component.hasOLEDPowerControlCapability = true
		let spy = spyOn(displayService, 'setTaskbarDimmerSetting').and.returnValue(Promise.resolve(true));
		component['setTaskbarDimmerSetting'](value)
		expect(spy).toHaveBeenCalled()
	});

	it('should call setTaskbarDimmerSetting - inner catch block', () => {
		const value = 1
		displayService.isShellAvailable = true
		component.hasOLEDPowerControlCapability = true
		let spy = spyOn(displayService, 'setTaskbarDimmerSetting').and.returnValue(Promise.reject())
		component['setTaskbarDimmerSetting'](value)
		expect(spy).toHaveBeenCalled()
	});

	it('should setTaskbarDimmerSetting - outer catch block', () => {
		expect(component['setTaskbarDimmerSetting']).toThrow()
	});

	it('should call setBackgroundDimmerSetting', () => {
		const value = 1
		displayService.isShellAvailable = true
		component.hasOLEDPowerControlCapability = true
		let spy = spyOn(displayService, 'setBackgroundDimmerSetting').and.returnValue(Promise.resolve(true));
		component['setBackgroundDimmerSetting'](value)
		expect(spy).toHaveBeenCalled()
	});

	it('should call setBackgroundDimmerSetting - inner catch block', () => {
		const value = 1
		displayService.isShellAvailable = true
		component.hasOLEDPowerControlCapability = true
		let spy = spyOn(displayService, 'setBackgroundDimmerSetting').and.returnValue(Promise.reject())
		component['setBackgroundDimmerSetting'](value)
		expect(spy).toHaveBeenCalled()
	});

	it('should setBackgroundDimmerSetting - outer catch block', () => {
		expect(component['setBackgroundDimmerSetting']).toThrow()
	});

	it('should call setDisplayDimmerSetting', () => {
		const value = 1
		displayService.isShellAvailable = true
		component.hasOLEDPowerControlCapability = true
		let spy = spyOn(displayService, 'setDisplayDimmerSetting').and.returnValue(Promise.resolve(true));
		component['setDisplayDimmerSetting'](value)
		expect(spy).toHaveBeenCalled()
	});

	it('should call setDisplayDimmerSetting - inner catch block', () => {
		const value = 1
		displayService.isShellAvailable = true
		component.hasOLEDPowerControlCapability = true
		let spy = spyOn(displayService, 'setDisplayDimmerSetting').and.returnValue(Promise.reject())
		component['setDisplayDimmerSetting'](value)
		expect(spy).toHaveBeenCalled()
	});

	it('should setDisplayDimmerSetting - outer catch block', () => {
		expect(component['setDisplayDimmerSetting']).toThrow()
	});
	
});
