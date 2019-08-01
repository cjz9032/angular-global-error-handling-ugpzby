import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartStandbyComponent } from './smart-standby.component';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { ContainerCollapsibleComponent } from 'src/app/components/container-collapsible/container-collapsible.component';
import { UiRowSwitchComponent } from 'src/app/components/ui/ui-row-switch/ui-row-switch.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/services/common/common.service';
import { PowerService } from 'src/app/services/power/power.service';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';

describe('SmartStandbyComponent', () => {
	let component: SmartStandbyComponent;
	let fixture: ComponentFixture<SmartStandbyComponent>;
	let powerService;
	let commonService;
	let debugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SmartStandbyComponent],
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
			providers: [CommonService, PowerService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SmartStandbyComponent);
		debugElement = fixture.debugElement;
		powerService = debugElement.injector.get(PowerService);
		commonService = debugElement.injector.get(CommonService);
		// spyOn(CommonService)
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('#showSmartStandby should initialize smart standby section', async () => {
		component.powerService.isShellAvailable = false;
		spyOn(component, 'initSmartStandby');
		spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(Promise.resolve(false));
		await component.showSmartStandby();
		expect(component.initSmartStandby).toHaveBeenCalled();
		expect(powerService.getSmartStandbyCapability).not.toHaveBeenCalled();
	});

	it('#showSmartStandby should call initSmartStandby & set smartStandby capability to true', async () => {
		component.powerService.isShellAvailable = true;
		spyOn(component, 'initSmartStandby');
		spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(Promise.resolve(true));
		await component.showSmartStandby();
		expect(component.initSmartStandby).toHaveBeenCalled();
		expect(powerService.getSmartStandbyCapability).toHaveBeenCalled();
		expect(component.smartStandby.isCapable).toBeTruthy();
	});

	it('#showSmartStandby should call initSmartStandby & set smartStandby capability to false', async () => {
		component.powerService.isShellAvailable = true;
		spyOn(component, 'initSmartStandby');
		spyOn(powerService, 'getSmartStandbyCapability').and.returnValue(Promise.resolve(false));
		await component.showSmartStandby();
		expect(component.initSmartStandby).toHaveBeenCalled();
		expect(powerService.getSmartStandbyCapability).toHaveBeenCalled();
		expect(component.smartStandby.isCapable).toBeFalsy();
	});

	it('#setSmartStandbySection should call getSmartStandbyEnabled and enable smart standby', async () => {
		component.powerService.isShellAvailable = true;
		spyOn(powerService, 'getSmartStandbyEnabled').and.returnValue(Promise.resolve(true));
		await component.setSmartStandbySection();
		expect(powerService.getSmartStandbyEnabled).toHaveBeenCalled();
		expect(component.smartStandby.isEnabled).toBeTruthy();
	});

	it('#setSmartStandbySection should call getSmartStandbyEnabled and disable smart standby', async () => {
		component.powerService.isShellAvailable = true;
		spyOn(powerService, 'getSmartStandbyEnabled').and.returnValue(Promise.resolve(false));
		await component.setSmartStandbySection();
		expect(powerService.getSmartStandbyEnabled).toHaveBeenCalled();
		expect(component.smartStandby.isEnabled).toBeFalsy();
	});
});
