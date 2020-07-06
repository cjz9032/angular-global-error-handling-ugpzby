
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DevService } from 'src/app/services/dev/dev.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { UiRoundedRectangleCustomRadioListComponent } from './ui-rounded-rectangle-custom-radio-list.component';


fdescribe('UiRoundedRectangleCustomRadioListComponent', () => {
	let component: UiRoundedRectangleCustomRadioListComponent;
	let fixture: ComponentFixture<UiRoundedRectangleCustomRadioListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiRoundedRectangleCustomRadioListComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [
				LoggerService,
				MetricService,
				DevService,
				TranslateService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiRoundedRectangleCustomRadioListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
