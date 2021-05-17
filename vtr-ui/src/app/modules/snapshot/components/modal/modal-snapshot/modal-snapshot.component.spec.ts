import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef } from '@lenovo/material/dialog';

import { TranslateModule } from '@ngx-translate/core';
import { ModalSnapshotComponent } from './modal-snapshot.component';

describe('ModalSnapshotComponent', () => {
	let component: ModalSnapshotComponent;
	let fixture: ComponentFixture<ModalSnapshotComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ModalSnapshotComponent],
				imports: [TranslateModule.forRoot()],
				providers: [MatDialogRef],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalSnapshotComponent);
		component = fixture.componentInstance;
		component.snapshotComponentsByType = {
			hardwareList: {
				CdRomDrives: null,
				DisplayDevices: null,
				HardDrives: null,
			},
			softwareList: {
				Processors: null,
				OperatingSystems: null,
				Printers: null,
			},
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call closeModal', () => {
		const spy = spyOn(component, 'closeModal');
		component.closeModal();
		expect(spy).toHaveBeenCalled();
	});

	it('should call onClickRun', () => {
		const spy = spyOn(component, 'onClickRun');
		component.onClickRun();
		expect(spy).toHaveBeenCalled();
	});

	it('should appears errorMessage after click onClickRun', () => {
		const spy = spyOn(component, 'onClickRun');
		component.errorMessage = true;
		fixture.detectChanges();
		component.onClickRun();
		expect(component.errorMessage).toBeTrue();
	});
});
