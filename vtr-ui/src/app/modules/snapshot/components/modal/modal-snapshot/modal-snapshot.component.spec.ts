import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ModalSnapshotComponent } from './modal-snapshot.component';

describe('ModalSnapshotComponent', () => {
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
});
