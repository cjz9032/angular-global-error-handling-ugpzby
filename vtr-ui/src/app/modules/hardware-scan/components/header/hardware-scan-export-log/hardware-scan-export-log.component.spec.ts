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
});
