import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-reboot-confirm',
	templateUrl: './modal-reboot-confirm.component.html',
	styleUrls: ['./modal-reboot-confirm.component.scss']
})
export class ModalRebootConfirmComponent implements OnInit {
	public description: string;
	@ViewChild('btnClose', { static: false }) set btnClose(element: ElementRef) {
		if (element) {
			element.nativeElement.focus();
		}
	}

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
		this.btnClose.nativeElement.focus();
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


}
