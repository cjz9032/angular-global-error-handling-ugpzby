import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SubpageSmartPerformanceDashboardComponent } from './subpage-smart-performance-dashboard.component';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { DevService } from 'src/app/services/dev/dev.service';

import { TranslateModule } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell-mock.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

describe('SubpageSmartPerformanceDashboardComponent', () => {
	let component: SubpageSmartPerformanceDashboardComponent;
	let fixture: ComponentFixture<SubpageSmartPerformanceDashboardComponent>;
	let smartPerformanceService: SmartPerformanceService;
	let commonService: CommonService;
	let localCacheService: LocalCacheService;
	let modalService: NgbModal;
	let shellServices: VantageShellService;
	let logger: LoggerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageSmartPerformanceDashboardComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [
				SmartPerformanceService,
				CommonService,
				LoggerService,
				NgbModal,
				MetricService,
				DevService,
				VantageShellService
			]
		});
		fixture = TestBed.createComponent(SubpageSmartPerformanceDashboardComponent);
		component = fixture.componentInstance;
	});

	it('should create SubpageSmartPerformanceDashboardComponent', async(() => {
		commonService = TestBed.inject(CommonService);
		smartPerformanceService = TestBed.inject(SmartPerformanceService);
		shellServices = TestBed.inject(VantageShellService);
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(undefined);
		spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(false));
		smartPerformanceService.isShellAvailable = true;
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should start scanning - getReadiness returns false', async(() => {
		smartPerformanceService = TestBed.inject(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(false));
		component.scanNow();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	}));

	it('should start scanning - getReadiness returns false when shell not available', async(() => {
		smartPerformanceService = TestBed.inject(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = false;
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.resolve(false));
		component.scanNow();
		fixture.detectChanges();
		expect(spy).not.toHaveBeenCalled();
	}));

	it('should start scanning - getReadiness throw error', async(() => {
		smartPerformanceService = TestBed.inject(SmartPerformanceService);
		smartPerformanceService.isShellAvailable = true;
		const spy = spyOn(smartPerformanceService, 'getReadiness').and.returnValue(Promise.reject('error'));
		component.scanNow();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	}));
});
