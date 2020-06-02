import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetDeviceUpdateSettingsComponent } from './widget-device-update-settings.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';

describe('WidgetDeviceUpdateSettingsComponent', () => {
	let component: WidgetDeviceUpdateSettingsComponent;
	let fixture: ComponentFixture<WidgetDeviceUpdateSettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetDeviceUpdateSettingsComponent],
			imports: [HttpClientModule, RouterTestingModule,TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				},
				isolate: false
			}),
				TranslationModule.forChild()
			],

			schemas: [NO_ERRORS_SCHEMA],
			providers: [DeviceService, DevService, HypothesisService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetDeviceUpdateSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});


	it('should check currentFocus', () => {
		const id ='cold'+1;
		component.currentFocus(id);
		expect(component).toBeTruthy();
	});


	it('should check onToggleOnOff', () => {
		const event =true;
		spyOn(component.toggleOnOff,'emit').and.callThrough();
		component.onToggleOnOff(event);
		expect(component.toggleOnOff.emit).toHaveBeenCalled();
	});


	it('should check optionChanged', () => {
		const option=1;
		const item=1;
		const id=1;
		spyOn(component.optionSelected,'emit').and.callThrough();
		component.optionChanged(option,item,id);
		expect(component.optionSelected.emit).toHaveBeenCalled();
	});

	it('should check onClosed', () => {
		spyOn(component.popupClosed,'emit').and.callThrough();
		component.onClosed('true','false');
		expect(component.popupClosed.emit).toHaveBeenCalled();
	});
});
