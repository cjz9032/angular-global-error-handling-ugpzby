import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HardwareScanExportLogComponent } from './hardware-scan-export-log.component';

describe('HardwareScanExportLogComponent', () => {
	let component: HardwareScanExportLogComponent;
	let fixture: ComponentFixture<HardwareScanExportLogComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [HardwareScanExportLogComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(HardwareScanExportLogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should return disabled icon', () => {
		component.isDisabled = true;
		const iconSrc = component.getExportIcon();

		expect(iconSrc).toBe('assets/icons/hardware-scan/icon_hardware_export-log_disabled.svg');
	});

	it('should return enabled icon', () => {
		component.isDisabled = false;
		const iconSrc = component.getExportIcon();

		expect(iconSrc).toBe('assets/icons/hardware-scan/icon_hardware_export-log.svg');
	});
});
