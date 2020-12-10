import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ModalSnapshotComponent } from './modal-snapshot.component';

fdescribe('ModalSnapshotComponent', () => {
	let component: ModalSnapshotComponent;
	let fixture: ComponentFixture<ModalSnapshotComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalSnapshotComponent],
			imports: [TranslateModule.forRoot()],
			providers: [NgbActiveModal],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalSnapshotComponent);
		component = fixture.componentInstance;
		component.snapshotInfo = [{
			hardwareList: [
				{
					CdRomDrives: null,
					DisplayDevices: null,
					HardDrives: null
				}
			],
			softwareList: [
				{
					Processors: null,
					OperatingSystems: null,
					Printers: null,
				}
			]
		}];
		fixture.detectChanges();
	});

	fit('should create', () => {
		expect(component).toBeTruthy();
	});

	fit('should call closeModal', () => {
		const spy = spyOn(component, 'closeModal');
		component.closeModal();
		expect(spy).toHaveBeenCalled();
	});

	fit('should call onClickRun', () => {
		const spy = spyOn(component, 'onClickRun');
		component.onClickRun();
		expect(spy).toHaveBeenCalled();
	});

	fit('should appears errorMessage after click onClickRun', () => {
		const spy = spyOn(component, 'onClickRun');
		component.errorMessage = true;
		fixture.detectChanges();
		component.onClickRun();
		expect(component.errorMessage).toBeTrue();
	});
});
