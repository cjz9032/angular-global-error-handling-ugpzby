import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-error-message',
	templateUrl: './modal-error-message.component.html',
	styleUrls: ['./modal-error-message.component.scss']
})
export class ModalErrorMessageComponent implements OnInit {

	@Input() header: string;
	@Input() description: string;
	@Input() closeText = 'security.wifisecurity.errorMessage.closeText';
	@Input() closeButtonId: string;
	@Input() cancelButtonId: string;

	@Output() CancelClick = new EventEmitter<any>();

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	public onCloseClick($event: any) {
		this.activeModal.close(false);
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.wifi-security-error-modal') as HTMLElement;
		modal.focus();
	}

}
