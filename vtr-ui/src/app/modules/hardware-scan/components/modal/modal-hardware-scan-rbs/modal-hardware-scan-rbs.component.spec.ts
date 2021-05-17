import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef } from '@lenovo/material/dialog';

import { DevService } from 'src/app/services/dev/dev.service';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';

import { ModalHardwareScanRbsComponent } from './modal-hardware-scan-rbs.component';

describe('ModalHardwareScanRbsComponent', () => {
	let hwScanService: HardwareScanService;
	let component: ModalHardwareScanRbsComponent;
	let fixture: ComponentFixture<ModalHardwareScanRbsComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ModalHardwareScanRbsComponent],
				imports: [TranslateModule.forRoot(), HttpClientModule],
				providers: [MatDialogRef, HttpClientModule, DevService],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalHardwareScanRbsComponent);
		component = fixture.componentInstance;
		hwScanService = TestBed.inject(HardwareScanService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call getItemsToRecoverBadSectors when call ngOnInit', () => {
		const spyGetItems = spyOn<any>(component, 'getItemsToRecoverBadSectors');
		component.ngOnInit();
		expect(spyGetItems).toHaveBeenCalled();
	});

	it('should call onClickRun', () => {
		const spy = spyOn(component, 'onClickRun');
		component.onClickRun();
		expect(spy).toHaveBeenCalled();
	});

	it('should call isSelectedItem', () => {
		const spy = spyOn(component, 'isSelectedItem');
		component.isSelectedItem();
		expect(spy).toHaveBeenCalled();
	});
});
