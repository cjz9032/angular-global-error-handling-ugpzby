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
		const id =1;
		component.currentFocus(id);
		expect(component).toBeTruthy(undefined);
	});

	it('should check onToggleOnOff', () => {
		const event =true;
		component.onToggleOnOff(event);
		expect(component).toBeTruthy(undefined);
	});

	it('should check optionChanged', () => {
		const option=1;
		const item=1;
		const id=1;
		component.optionChanged(option,item,id);
		expect(component).toBeTruthy(undefined);
	});

	it('should check updateFocus', () => {
		component.updateFocus('false');
		expect(component).toBeTruthy(undefined);
	});

	it('should check onClosed', () => {
		component.onClosed('true','false');
		expect(component).toBeTruthy(undefined);
	});
});
