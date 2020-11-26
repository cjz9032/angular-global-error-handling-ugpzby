import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCustomSliderComponent } from './ui-custom-slider.component';
import { DevService } from 'src/app/services/dev/dev.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

describe('UiCustomSliderComponent', () => {
	let component: UiCustomSliderComponent;
	let fixture: ComponentFixture<UiCustomSliderComponent>;
	let devService: DevService;
	let metricService: MetricService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiCustomSliderComponent],
			providers: [DevService, MetricService, HttpClient],
			imports: [
				RouterTestingModule,
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient],
					},
				}),
				HttpClientTestingModule,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCustomSliderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('should call onInputChange', () => {
		const event = { target: { valueAsNumber: 4 } };
		component.onInputChange(event);
	});
	it('should call onDragStart', () => {
		const event = { target: { valueAsNumber: 3 } };
		component.onDragStart(event);
	});
	it('should call onDragEnd', () => {
		const event = { target: { valueAsNumber: 2 } };
		component.onDragEnd(event);
	});
});
