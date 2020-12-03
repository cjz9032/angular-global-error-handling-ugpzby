import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiCircleRadioWithCheckboxComponent } from './ui-circle-radio-with-checkbox.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CapitalizeFirstPipe } from 'src/app/pipe/capitalize-pipe/capitalize-first.pipe';

describe('UiCircleRadioWithCheckboxComponent', () => {
	let component: UiCircleRadioWithCheckboxComponent;
	let fixture: ComponentFixture<UiCircleRadioWithCheckboxComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiCircleRadioWithCheckboxComponent, CapitalizeFirstPipe],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [LoggerService, MetricService, DevService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCircleRadioWithCheckboxComponent);
		component = fixture.componentInstance;
		component.label = 'test';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
