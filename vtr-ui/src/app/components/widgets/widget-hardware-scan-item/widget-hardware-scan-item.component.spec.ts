import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DevService } from 'src/app/services/dev/dev.service';

import { WidgetHardwareScanItemComponent } from './widget-hardware-scan-item.component';



describe('WidgetDeviceHardwareScanItemComponent', () => {
	let component: WidgetHardwareScanItemComponent;
	let fixture: ComponentFixture<WidgetHardwareScanItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetHardwareScanItemComponent],
			imports: [ RouterTestingModule, HttpClientModule, TranslateModule.forRoot() ],
			providers: [ DevService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetHardwareScanItemComponent);
		component = fixture.componentInstance;
	});

	it('should create', async(() => {
		expect(component).toBeTruthy();
	}));

	it('should call configureContactusUrlSpy and getXsBreakpointStatusSpy on ngOnInit', () => {
		const configureContactusUrlSpy = spyOn<any>(component, 'configureContactusUrl');
		const getXsBreakpointStatusSpy = spyOn<any>(component, 'getXsBreakpointStatus');

		component.ngOnInit();

		expect(configureContactusUrlSpy).toHaveBeenCalled();
		expect(getXsBreakpointStatusSpy).toHaveBeenCalled();
	});

	it('should set tooltip info', () => {
		component.setTooltipInfo('Tooltip Info', 0);

		expect(component.tooltipText).toEqual('Tooltip Info');
		expect(component.tooltipIndex).toEqual(0);
	});


});
