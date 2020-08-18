import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { DevService } from '../../../services/dev/dev.service';
import { ModalCancelComponent } from './modal-cancel.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ModalCancelComponent', () => {
	let component: ModalCancelComponent;
	let fixture: ComponentFixture<ModalCancelComponent>;
	let cancelModal;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ RouterTestingModule, HttpClientModule, TranslateModule.forRoot() ],
			providers: [ DevService, NgbActiveModal ],
			declarations: [ ModalCancelComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalCancelComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('closeModal calling activeModal close', () => {
		cancelModal = TestBed.inject(NgbActiveModal);
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
