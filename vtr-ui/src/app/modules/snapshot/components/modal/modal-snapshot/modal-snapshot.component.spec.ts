import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalSnapshotComponent } from './modal-snapshot.component';

xdescribe('ModalSnapshotComponent', () => {
	let component: ModalSnapshotComponent;
	let fixture: ComponentFixture<ModalSnapshotComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalSnapshotComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalSnapshotComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
