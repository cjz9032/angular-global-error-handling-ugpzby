import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiCheckboxComponent } from './ui-checkbox.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DevService } from 'src/app/services/dev/dev.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('UiCheckboxComponent', () => {
	let component: UiCheckboxComponent;
	let fixture: ComponentFixture<UiCheckboxComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiCheckboxComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [CommonMetricsService, MetricService, DevService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCheckboxComponent);
		component = fixture.componentInstance;
		component.isMetricsEnabled = true;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should test onChange method', () => {
		let event = { target: { value: true } };
		spyOn(component.toggle, 'emit').and.callThrough();
		component.onChange(event);
		expect(component.toggle.emit).toHaveBeenCalled();
	});
});
