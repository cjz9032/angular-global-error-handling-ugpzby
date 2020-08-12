import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-recover-confirm',
	templateUrl: './modal-recover-confirm.component.html',
	styleUrls: ['./modal-recover-confirm.component.scss']
})
export class ModalRecoverConfirmComponent implements OnInit, OnDestroy {
	@Input() ItemParent: string;
	@Input() CancelItemName: string;
	@Input() ConfirmItemName: string;

	constructor(public activeModal: NgbActiveModal) {
	}

	ngOnInit(){
	}

	ngOnDestroy(){
	}

	public onClosing() {
		this.activeModal.close();
	}
}
