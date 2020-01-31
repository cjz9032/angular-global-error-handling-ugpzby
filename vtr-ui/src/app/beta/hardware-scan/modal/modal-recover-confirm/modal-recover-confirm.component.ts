import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-recover-confirm',
	templateUrl: './modal-recover-confirm.component.html',
	styleUrls: ['./modal-recover-confirm.component.scss']
})
export class ModalRecoverConfirmComponent implements OnInit, OnDestroy {
	@Input() buttonText = this.translate.instant('hardwareScan.ok');
	@Input() modalTitle = this.translate.instant('hardwareScan.warning');
	@Input() modalDescription = this.translate.instant('hardwareScan.recoverBadSectors.popup.description');

	@Input() ItemParent: string;
	@Input() CancelItemName: string;
	@Input() ConfirmItemName: string;

	constructor(private translate: TranslateService, public activeModal: NgbActiveModal) {
	}

	ngOnInit(){
	}

	ngOnDestroy(){
	}

	public onClosing() {
		console.log('[Modal] Closing recover modal');
		this.activeModal.close();
	}
}
