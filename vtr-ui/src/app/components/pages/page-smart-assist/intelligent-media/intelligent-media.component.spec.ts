import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DevService } from 'src/app/services/dev/dev.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DisplayService } from 'src/app/services/display/display.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { IntelligentMediaComponent } from './intelligent-media.component';

describe('component: IntelligentMediaComponent', () => {
	let component: IntelligentMediaComponent;
	let fixture: ComponentFixture<IntelligentMediaComponent>;
	let smartAssist: SmartAssistService;
	// let vantageShellService: VantageShellService;
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [IntelligentMediaComponent],
			imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
			providers: [
				SmartAssistService,
				LoggerService,
				DeviceService,
				DevService,
				RouteHandlerService,
				DisplayService,
				TranslateService,
				MetricService,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IntelligentMediaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('setVideoPauseResumeStatus', () => {
		smartAssist = TestBed.inject(SmartAssistService);
		smartAssist.isShellAvailable = true;
		const spy = spyOn(smartAssist, 'setVideoPauseResumeStatus').and.returnValue(
			Promise.resolve(true)
		);

		component.setVideoPauseResumeStatus({ switchValue: true });
		expect(smartAssist.setVideoPauseResumeStatus).toHaveBeenCalled();
	});

	it('setSuperResolutionStatus', () => {
		smartAssist = TestBed.inject(SmartAssistService);
		smartAssist.isShellAvailable = true;
		const spy = spyOn(smartAssist, 'setSuperResolutionStatus').and.returnValue(
			Promise.resolve(true)
		);

		component.setSuperResolutionStatus({ switchValue: true });
		expect(smartAssist.setSuperResolutionStatus).toHaveBeenCalled();
	});
});
