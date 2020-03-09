import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { DisplayColorTempComponent } from "./display-color-temp.component";
import { EyeCareMode } from "src/app/data-models/camera/eyeCareMode.model";
import { ChangeContext } from "ng5-slider";
import { LoggerService } from "src/app/services/logger/logger.service";
import { TranslateStore } from "@ngx-translate/core";

import { TranslationModule } from "src/app/modules/translation.module";

const displayColorTempSettings: EyeCareMode = {
	available: true,
	current: 10,
	maximum: 100,
	minimum: 0,
	status: true
};

describe("DisplayColorTempComponent", () => {
	let component: DisplayColorTempComponent;
	let fixture: ComponentFixture<DisplayColorTempComponent>;
	let logger: LoggerService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [DisplayColorTempComponent],
			imports: [TranslationModule],
			providers: [LoggerService, TranslateStore]
		});
	}));

	it("should create the app", () => {
		fixture = TestBed.createComponent(DisplayColorTempComponent);
		component = fixture.debugElement.componentInstance;
		logger = TestBed.get(LoggerService);
		component.displayColorTempSettings = { ...displayColorTempSettings };
		spyOn(logger, "info");
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it("should call onDisplayColorTemparatureChange", () => {
		fixture = TestBed.createComponent(DisplayColorTempComponent);
		component = fixture.debugElement.componentInstance;
		const event: ChangeContext = {
			value: 20,
			highValue: 80,
			pointerType: 1
		};
		const spy = spyOn(component.displayColorTempChange, "emit");
		component.onDisplayColorTemparatureChange(event);
		expect(spy).toHaveBeenCalled();
	});

	it("should call onResetTemparature", () => {
		fixture = TestBed.createComponent(DisplayColorTempComponent);
		component = fixture.debugElement.componentInstance;
		const event = "10";
		const spy = spyOn(component.resetTemparature, "emit");
		component.onResetTemparature(event);
		expect(spy).toHaveBeenCalled();
	});

	it("should call dragChangeValue", () => {
		fixture = TestBed.createComponent(DisplayColorTempComponent);
		component = fixture.debugElement.componentInstance;
		const event = 10;
		const spy = spyOn(component.colorPreviewValue, "emit");
		component.dragChangeValue(event);
		expect(spy).toHaveBeenCalled();
	});
});
