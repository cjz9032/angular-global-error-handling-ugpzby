import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveProtectionSystemAdvancedComponent } from './active-protection-system-advanced.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { DevService } from 'src/app/services/dev/dev.service';

describe('ActiveProtectionSystemAdvancedComponent', () => {
	let component: ActiveProtectionSystemAdvancedComponent;
	let fixture: ComponentFixture<ActiveProtectionSystemAdvancedComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ActiveProtectionSystemAdvancedComponent],
			imports: [
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient]
					},
					isolate: false
				}),
				TranslateModule.forChild(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [
				SmartAssistService,
				TranslateService,
				CommonMetricsService,
				MetricService,
				DevService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ActiveProtectionSystemAdvancedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
