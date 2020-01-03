import { async, TestBed, getTestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { TranslateModule } from "@ngx-translate/core";
import { BacklightComponent } from "./backlight.component";
import { BacklightLevel, BacklightStatus } from "./backlight.interface";

import { VantageShellService } from "../../../../../../services/vantage-shell/vantage-shell.service";
import { RemoveSpacePipe } from "../../../../../../pipe/remove-space/remove-space.pipe";
import { BacklightService } from "./backlight.service";
import { BacklightLevelEnum, BacklightStatusEnum } from "./backlight.enum";
import { of } from "rxjs";

describe("Component: Backlight", () => {
	// let vantageShellService: VantageShellService
	// let backlightServiceSpy: jasmine.SpyObj<BacklightService>
	beforeEach(() => {
		const spy = jasmine.createSpyObj("BacklightService", ["backlight"]);
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [BacklightComponent, RemoveSpacePipe],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule],
			providers: [VantageShellService, BacklightService]
		});

		// vantageShellService = TestBed.get(VantageShellService);
		// backlightServiceSpy = TestBed.get(BacklightService)
	});

	it("should create Backlight Component", () => {
		let fixture = TestBed.createComponent(BacklightComponent);
		let backlightComponent = fixture.debugElement.componentInstance;
		expect(backlightComponent).toBeTruthy();
	});

	it("should call backlight service get property - LevelEnum", () => {
		let setting: Array<BacklightStatus | BacklightLevel> = [
			{
				key: "KeyboardBacklightLevel",
				value: BacklightLevelEnum.TWO_LEVELS_AUTO
			},
			{
				key: "KeyboardBacklightStatus",
				value: BacklightStatusEnum.OFF
			}
		];
		let fixture = TestBed.createComponent(BacklightComponent);
		let backlightComponent = fixture.debugElement.componentInstance;
		let backlightService = fixture.debugElement.injector.get(
			BacklightService
		);
		let spy = spyOn(backlightService, "requestBacklight").and.returnValue(
			of(setting)
		);
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it("should call backlight service get property - LevelEnum - 2", () => {
		let setting: Array<BacklightStatus | BacklightLevel> = [
			{
				key: "KeyboardBacklightLevel",
				value: BacklightLevelEnum.ONE_LEVEL
      },
      {
				key: "KeyboardBacklightStatus",
				value: BacklightStatusEnum.AUTO
			}
		];
		let fixture = TestBed.createComponent(BacklightComponent);
		let backlightComponent = fixture.debugElement.componentInstance;
		let backlightService = fixture.debugElement.injector.get(
			BacklightService
		);
		let spy = spyOn(backlightService, "requestBacklight").and.returnValue(
			of(setting)
		);
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});

	it('should call onToggleOnOff method', () => {
	  let fixture = TestBed.createComponent(BacklightComponent);
    let backlightComponent = fixture.debugElement.componentInstance;
    let event = {
      switchValue: 'on'
    }
    backlightComponent.onToggleOnOff(event)
	  expect(backlightComponent.update$.next).toBeTruthy()
  });
  
  it('should call onToggleOnOff method - else case', () => {
	  let fixture = TestBed.createComponent(BacklightComponent);
    let backlightComponent = fixture.debugElement.componentInstance;
    let event = {
      switchValue: ''
    }
    backlightComponent.onToggleOnOff(event)
	  expect(backlightComponent.update$.next).toBeTruthy()
	});
});
