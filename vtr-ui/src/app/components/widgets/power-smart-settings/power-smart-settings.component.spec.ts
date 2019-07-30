import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSmartSettingsComponent } from './power-smart-settings.component';
import { PowerService } from 'src/app/services/power/power.service';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';

describe('PowerSmartSettingsComponent', () => {
	let component: PowerSmartSettingsComponent;
	let fixture: ComponentFixture<PowerSmartSettingsComponent>;
	let debugElement;
	let powerService;
	let translate;
	let commonService;
	let modalService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PowerSmartSettingsComponent],
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
			providers: [PowerService, TranslateService, CommonService, NgbModal]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PowerSmartSettingsComponent);
		debugElement = fixture.debugElement;
		powerService = debugElement.injector.get(PowerService);
		translate = debugElement.injector.get(TranslateService);
		commonService = debugElement.injector.get(CommonService);
		modalService = debugElement.injector.get(NgbModal);
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(1);
		component = fixture.componentInstance;
		spyOn(component, 'initPowerSmartSettingsForThinkPad');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
