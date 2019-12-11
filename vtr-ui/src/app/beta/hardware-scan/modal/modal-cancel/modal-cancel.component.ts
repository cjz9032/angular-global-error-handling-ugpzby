import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-cancel',
	templateUrl: './modal-cancel.component.html',
	styleUrls: ['./modal-cancel.component.scss']
})
export class ModalCancelComponent implements OnInit {

	title: string = this.translate.instant('hardwareScan.attention');
	description: string = this.translate.instant('hardwareScan.cancelTextPrompt');
	buttonText: string = this.translate.instant('hardwareScan.yes');

	loading: boolean;

	timerRef: any;
	@Input() ItemParent: string;
	@Input() CancelItemName: string;
	@Input() ConfirmItemName: string;

	@Output() cancelRequested: EventEmitter<any> = new EventEmitter();

	constructor(private translate: TranslateService, public activeModal: NgbActiveModal) { }

	ngOnInit() {
		this.loading = false;
		this.timerRef = setTimeout(() => { this.onAgree(); }, 10000);
	}

	public closeModal() {
		if (this.timerRef) {
			clearTimeout(this.timerRef);
		}

		this.activeModal.close('close');
	}

	onAgree() {
		this.description = this.translate.instant('hardwareScan.cancelTextProgress');
		this.loading = true;
		this.cancelRequested.emit();

		if (this.timerRef) {
			clearTimeout(this.timerRef);
		}
	}
}
