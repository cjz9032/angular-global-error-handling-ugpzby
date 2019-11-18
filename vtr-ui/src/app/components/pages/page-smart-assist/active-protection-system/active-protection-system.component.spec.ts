import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveProtectionSystemComponent } from './active-protection-system.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { DropDownInterval } from '../../../../data-models/common/drop-down-interval.model';



fdescribe('ActiveProtectionSystemComponent', () => {
	let component: ActiveProtectionSystemComponent;
	let fixture: ComponentFixture < ActiveProtectionSystemComponent > ;
	let debugElement;
	let smartAssist;

	beforeEach(async (() => {
		TestBed.configureTestingModule({
			declarations: [ActiveProtectionSystemComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient]
					},
					isolate: false
				}),
				TranslationModule.forChild(), HttpClientModule
			],
			providers: [TranslateService, SmartAssistService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ActiveProtectionSystemComponent);
		debugElement = fixture.debugElement;
		component = fixture.componentInstance;
		smartAssist = debugElement.injector.get(SmartAssistService);
		fixture.detectChanges();
	});

	it('should create', async () => {
        spyOn(component, 'ngOnInit');
        spyOn(component, 'initAPS');
		spyOn(smartAssist, 'getAPSMode').and.returnValue(Promise.resolve(false));
		spyOn(smartAssist, 'getAPSSensitivityLevel').and.returnValue(Promise.resolve(false));
		spyOn(smartAssist, 'getAutoDisableSetting').and.returnValue(Promise.resolve(false));
		spyOn(smartAssist, 'getSnoozeSetting').and.returnValue(Promise.resolve(false));
		// await component.ngOnInit();
		expect(component).toBeTruthy();
	});
});

