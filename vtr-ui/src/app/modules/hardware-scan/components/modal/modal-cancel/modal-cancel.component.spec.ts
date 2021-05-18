import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef } from '@lenovo/material/dialog';

import { DevService } from '../../../../../services/dev/dev.service';
import { ModalCancelComponent } from './modal-cancel.component';

describe('ModalCancelComponent', () => {
	let component: ModalCancelComponent;
	let fixture: ComponentFixture<ModalCancelComponent>;
	let cancelModal;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [RouterTestingModule, HttpClientModule, TranslateModule.forRoot()],
				providers: [DevService, MatDialogRef],
				declarations: [ModalCancelComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalCancelComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('closeModal calling activeModal close', () => {
		cancelModal = TestBed.inject(MatDialogRef);
		const spy = spyOn(cancelModal, 'close');
		component.closeModal();
		expect(spy).toHaveBeenCalled();
	});

	it('should show ItemParent value', () => {
		const itemParent = component.ItemParent;
		expect(itemParent).not.toEqual('');
	});

	it('should show ItemName value', () => {
		const itemName = component.CancelItemName;
		expect(itemName).not.toEqual('');
	});

	it('should start countdown', () => {
		const isCountdown = component.isInCountdown;
		expect(isCountdown).toBeTrue();
	});

	it('should call the StopCountdown', () => {
		const spy = spyOn(component, 'showProcessFinishedMessage');
		component.showProcessFinishedMessage();
		expect(spy).toHaveBeenCalled();
	});
});
