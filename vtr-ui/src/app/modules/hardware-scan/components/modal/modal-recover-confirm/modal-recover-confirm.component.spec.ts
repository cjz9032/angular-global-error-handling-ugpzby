import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DevService } from 'src/app/services/dev/dev.service';

import { ModalRecoverConfirmComponent } from './modal-recover-confirm.component';

describe('ModalRecoverConfirm', () => {
	let component: ModalRecoverConfirmComponent;
	let fixture: ComponentFixture<ModalRecoverConfirmComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalRecoverConfirmComponent],
			imports: [TranslateModule.forRoot(), HttpClientModule],
			providers: [NgbActiveModal, HttpClientModule, DevService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalRecoverConfirmComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call onClose', () => {
		const spy = spyOn(component, 'onClosing');
		component.onClosing();
		expect(spy).toHaveBeenCalled();
	});

	it('should call confirmClick', () => {
		const spy = spyOn(component, 'confirmClick');
		component.confirmClick();
		expect(spy).toHaveBeenCalled();
	});
});
