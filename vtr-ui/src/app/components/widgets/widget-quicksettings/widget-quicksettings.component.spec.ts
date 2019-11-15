import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetQuicksettingsComponent } from './widget-quicksettings.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DisplayService } from 'src/app/services/display/display.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { PowerService } from 'src/app/services/power/power.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('WidgetQuicksettingsComponent', () => {
	let component: WidgetQuicksettingsComponent;
	let fixture: ComponentFixture<WidgetQuicksettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetQuicksettingsComponent],
			imports: [HttpClientModule, TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				},
				isolate: false
			}),
				TranslationModule.forChild()
			],
			providers: [
				DashboardService,
				CommonService,
				DisplayService,
				DeviceService,
				LoggerService,
				VantageShellService,
				PowerService,
				DevService,
				{
					provide: Router,
					useClass: class {
						navigate = jasmine.createSpy('navigate');
					}
				},
				RouterTestingModule
			],
			schemas: [NO_ERRORS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetQuicksettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
