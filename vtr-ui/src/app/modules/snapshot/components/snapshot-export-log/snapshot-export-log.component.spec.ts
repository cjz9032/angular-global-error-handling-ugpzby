import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SnapshotExportLogComponent } from './snapshot-export-log.component';

describe('SnapshotExportLogComponent', () => {
	let component: SnapshotExportLogComponent;
	let fixture: ComponentFixture<SnapshotExportLogComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [SnapshotExportLogComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(SnapshotExportLogComponent);
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
