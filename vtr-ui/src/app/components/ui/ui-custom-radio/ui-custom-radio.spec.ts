import { UICustomRadio } from './ui-custom-radio';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DevService } from 'src/app/services/dev/dev.service';

xdescribe('UICustomRadioBase', () => {
	let component: UICustomRadio;
	let fixture: ComponentFixture<UICustomRadio>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UICustomRadio],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [LoggerService, MetricService, DevService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UICustomRadio);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('UICustomRadioBase:should create', () => {
		expect(component).toBeTruthy();
	});
});
