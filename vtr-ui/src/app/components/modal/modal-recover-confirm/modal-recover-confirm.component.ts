import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { disableBackgroundNavigation, reEnableBackgroundNavigation } from '../../../services/hardware-scan/utils/ModalBackgroundNavigationUtils';

@Component({
	selector: 'vtr-modal-recover-confirm',
	templateUrl: './modal-recover-confirm.component.html',
	styleUrls: ['./modal-recover-confirm.component.scss']
})
export class ModalRecoverConfirmComponent implements OnInit, OnDestroy {
	@Input() ItemParent: string;
	@Input() CancelItemName: string;
	@Input() ConfirmItemName: string;

	@Output() confirmClicked: EventEmitter<any> = new EventEmitter();

	constructor(public activeModal: NgbActiveModal) {
	}

	ngOnInit() {
		disableBackgroundNavigation(document);
	}

	ngOnDestroy() {
		reEnableBackgroundNavigation(document);
	}

	public onClosing() {
		this.activeModal.close();
	}

	public confirmClick() {
		this.confirmClicked.emit();
		this.onClosing();
	}
}
