import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { WidgetDeviceUpdateSettingsComponent } from './widget-device-update-settings.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { GamingCollapsableContainerEvent } from 'src/app/data-models/gaming/gaming-collapsable-container-event';

describe('WidgetDeviceUpdateSettingsComponent', () => {
	let component: WidgetDeviceUpdateSettingsComponent;
	let fixture: ComponentFixture<WidgetDeviceUpdateSettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetDeviceUpdateSettingsComponent],
			imports: [HttpClientModule, RouterTestingModule,TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				},
				isolate: false
			}),
				TranslationModule.forChild()
			],

			schemas: [NO_ERRORS_SCHEMA],
			providers: [DeviceService, DevService, HypothesisService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetDeviceUpdateSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});


	it('should check currentFocus', () => {
		const id ='cold'+1;
		component.currentFocus(id);
		expect(component.currentFocus).toBeTruthy();
	});


	it('should check onToggleOnOff status is true', () => {
		const event = true;
		component.toggleOnOff.subscribe((res: any) =>{
			expect(res).toBe(true);
			})
		component.onToggleOnOff(event);
	});


	it('should check optionChanged', () => {
		const option=1;
		const item=1;
		const id=1;
		spyOn(component, 'currentFocus').and.callThrough();
		spyOn(component.optionSelected,'emit').and.callThrough();
		component.optionSelected.subscribe((res: any) =>{
			expect(res.option).toBe(1);
			expect(res.target).toBe(1);
			})
		component.optionChanged(option,item,id);
	});


	it('should check onClosed', () => {
		const event: any =true;
		spyOn(component, 'updateFocus').and.callThrough();
		component.popupClosed.subscribe((res: any) =>{
			expect(res).toBe(true);
			})
		component.onClosed(event,'false');
	});
});
