import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-modal-hardware-scan-customize',
	templateUrl: './modal-hardware-scan-customize.component.html',
	styleUrls: ['./modal-hardware-scan-customize.component.scss']
})
export class ModalHardwareScanCustomizeComponent implements OnDestroy {
	@Input() title = this.translate.instant('hardwareScan.customize.test');
	@Input() description = this.translate.instant('hardwareScan.customize.description');
	@Input() buttonText = this.translate.instant('hardwareScan.customize.runTests');
	@Input() items: any[];
	public errorMessage: string;
	private isSuccessful = false;

	@Output() passEntry: EventEmitter<any> = new EventEmitter();

	// Used to signalize to the caller that the modal is being closed.
	// It emits true when the modal is closed in a successful way,
	// e.g. user clicked in the OK button or false otherwise.
	@Output() modalClosing: EventEmitter<boolean> = new EventEmitter();

	constructor(
		public activeModal: NgbActiveModal,
		private translate: TranslateService
	) { }

	public ngOnDestroy() {
		this.modalClosing.emit(this.isSuccessful);
	}

	public closeModal() {
		this.activeModal.close('close');
	}

	public onClickRun() {
		const leastOneSelected = this.items.find(x => x.selected || x.indeterminate);
		if (leastOneSelected !== undefined) {
			this.isSuccessful = true;
			this.closeModal();
			this.passEntry.emit(this.items);
		} else {
			this.errorMessage = this.translate.instant('hardwareScan.errorResult');
		}
	}

	public receiveSelect() {
		if (this.errorMessage !== '') {
			this.errorMessage = '';
		}
	}
}
