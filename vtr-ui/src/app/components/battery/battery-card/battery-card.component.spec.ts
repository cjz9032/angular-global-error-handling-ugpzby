import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryCardComponent } from './battery-card.component';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonService } from 'src/app/services/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { ActivatedRoute } from '@angular/router';

xdescribe('BatteryCardComponent', () => {
	let component: BatteryCardComponent;
	let fixture: ComponentFixture<BatteryCardComponent>;
	let commonService: CommonService;
	let debugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BatteryCardComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				},
				isolate: false
			}),
			TranslationModule.forChild(), HttpClientModule],
			providers: [CommonService, BatteryDetailService, NgbModal, VantageShellService, ChangeDetectorRef, ActivatedRoute]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryCardComponent);
		debugElement = fixture.debugElement;
		commonService = debugElement.injector.get(CommonService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
