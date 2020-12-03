import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PageSmartPerformanceComponent } from './page-smart-performance.component';

import { SystemEventService } from 'src/app/services/system-event/system-event.service';
import { CommonService } from 'src/app/services/common/common.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

describe('PageSmartPerformanceComponent', () => {
	let component: PageSmartPerformanceComponent;
	let fixture: ComponentFixture<PageSmartPerformanceComponent>;
	let commonService: CommonService;
	let systemEventService: SystemEventService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [PageSmartPerformanceComponent],
			imports: [HttpClientTestingModule],
			providers: [CommonService, VantageShellService, SystemEventService],
		});
		fixture = TestBed.createComponent(PageSmartPerformanceComponent);
		component = fixture.componentInstance;
	}));

	it('should create PageSmartPerformanceComponent', waitForAsync(() => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should call registerScanEvent', waitForAsync(() => {
		component.eventName = 'SmartPerformance.ScheduleEventStarted';
		systemEventService = TestBed.inject(SystemEventService);
		commonService = TestBed.inject(CommonService);
		const spy = spyOn(systemEventService, 'registerCustomEvent').and.returnValue(
			Promise.resolve(true)
		);
		component.registerScanEvent();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	}));
});
