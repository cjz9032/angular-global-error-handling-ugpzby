import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-reboot-confirm',
	templateUrl: './modal-reboot-confirm.component.html',
	styleUrls: ['./modal-reboot-confirm.component.scss']
})
export class ModalRebootConfirmComponent implements OnInit {
public description: string;

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}
	proceedToReboot() {
		this.activeModal.close('enable');
	}

	closeModal() {
		this.activeModal.close('close');
	}

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.closeModal();
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.Battery-Charge-Threshold-Modal') as HTMLElement;
		modal.focus();
	}
}
