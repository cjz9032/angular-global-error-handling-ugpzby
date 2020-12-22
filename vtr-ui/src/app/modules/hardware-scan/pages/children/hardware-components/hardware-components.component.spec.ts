import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HardwareComponentsComponent } from './hardware-components.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { DevService } from '../../../../../services/dev/dev.service';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';
import { By } from '@angular/platform-browser';
import { TaskType } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { ExportResultsService } from '../../../services/export-results.service';
import { TranslateDefaultValueIfNotFoundPipe } from 'src/app/pipe/translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';
import { FormatLocaleDateTimePipe } from 'src/app/pipe/format-locale-datetime/format-locale-datetime.pipe';

describe('HardwareComponentsComponent', () => {
	let component: HardwareComponentsComponent;
	let fixture: ComponentFixture<HardwareComponentsComponent>;
	let hwScanService: HardwareScanService;
	let exportService: ExportResultsService;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [HardwareComponentsComponent],
				imports: [RouterTestingModule, HttpClientModule, TranslateModule.forRoot()],
				providers: [
					DevService,
					TranslateDefaultValueIfNotFoundPipe,
					TranslatePipe,
					FormatLocaleDateTimePipe,
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(HardwareComponentsComponent);
		component = fixture.componentInstance;
		hwScanService = TestBed.inject(HardwareScanService);
		exportService = TestBed.inject(ExportResultsService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should translate the component title token', () => {
		// Validates if there is no syncronism issue and the token was translated.
		expect(component.getComponentsTitle()).not.toEqual('');
	});

	it('should call disableRefreshAnchor', () => {
		const spy = spyOn(component, 'disableRefreshAnchor');
		component.disableRefreshAnchor();
		expect(spy).toHaveBeenCalled();
	});

	it('should call isDisableCancel', () => {
		const spy = spyOn(component, 'isDisableCancel');
		component.isDisableCancel();
		expect(spy).toHaveBeenCalled();
	});

	it('should call executeQuickScan method and disable refreshModules link', () => {
		const spy = spyOn(component, 'startScanWaitingModules');
		component.startScanWaitingModules(TaskType.QuickScan);
		const refreshDisabled = component.disableRefreshAnchor();
		expect(refreshDisabled).toBeTrue();
	});

	it('should call executeCustomScan method and disable refreshModules link', () => {
		const spy = spyOn(component, 'startScanWaitingModules');
		component.startScanWaitingModules(TaskType.CustomScan);
		const refreshDisabled = component.disableRefreshAnchor();
		expect(refreshDisabled).toBeTrue();
	});

	it('it should have $menu_hover color on hardware scan title', () => {
		const customColor = 'rgb(74, 129, 253)'; // RGB value for $menu_hover color.
		const refreshlink = fixture.debugElement.query(By.css('#hwscan-components-title'))
			.nativeElement;
		const result = window.getComputedStyle(refreshlink).color;
		expect(result).toEqual(customColor);
	});
});
