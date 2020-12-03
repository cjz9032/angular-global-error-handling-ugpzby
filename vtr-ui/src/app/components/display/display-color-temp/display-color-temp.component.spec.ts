import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateStore } from '@ngx-translate/core';
import { EyeCareMode } from 'src/app/data-models/camera/eyeCareMode.model';
import { TranslationModule } from 'src/app/modules/translation.module';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { DisplayColorTempComponent } from './display-color-temp.component';

const displayColorTempSettings: EyeCareMode = {
	available: true,
	current: 10,
	maximum: 100,
	minimum: 0,
	status: true,
};

describe('DisplayColorTempComponent', () => {
	let component: DisplayColorTempComponent;
	let fixture: ComponentFixture<DisplayColorTempComponent>;
	let logger: LoggerService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [DisplayColorTempComponent],
			imports: [TranslationModule],
			providers: [LoggerService, TranslateStore],
		});
	}));

	it('should create the app', () => {
		fixture = TestBed.createComponent(DisplayColorTempComponent);
		component = fixture.debugElement.componentInstance;
		logger = TestBed.inject(LoggerService);
		component.displayColorTempSettings = { ...displayColorTempSettings };
		spyOn(logger, 'info');
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should call onDisplayColorTemperatureChanged', () => {
		fixture = TestBed.createComponent(DisplayColorTempComponent);
		component = fixture.debugElement.componentInstance;
		component.displayColorTempSettings = { ...displayColorTempSettings };
		const event = 20;
		const spy = spyOn(component.displayColorTempChange, 'emit');
		component.onDisplayColorTemperatureChanged(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onResetTemperature', () => {
		fixture = TestBed.createComponent(DisplayColorTempComponent);
		component = fixture.debugElement.componentInstance;
		const event = 10;
		const spy = spyOn(component.resetTemperature, 'emit');
		component.onResetTemperature(event);
		expect(spy).toHaveBeenCalled();
	});

	it('should call onDisplayColorTemperaturePreview', () => {
		fixture = TestBed.createComponent(DisplayColorTempComponent);
		component = fixture.debugElement.componentInstance;
		const event = 10;
		const spy = spyOn(component.colorPreviewValue, 'emit');
		component.onDisplayColorTemperaturePreview(event);
		expect(spy).toHaveBeenCalled();
	});
});
