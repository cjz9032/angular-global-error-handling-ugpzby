import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-modal-hardware-scan-customize',
	templateUrl: './modal-hardware-scan-customize.component.html',
	styleUrls: ['./modal-hardware-scan-customize.component.scss']
})
export class ModalHardwareScanCustomizeComponent implements OnInit {
	@Input() title = this.translate.instant('hardwareScan.customize.test');
	@Input() description = this.translate.instant('hardwareScan.customize.description');
	@Input() buttonText = this.translate.instant('hardwareScan.customize.runTests');
	@Input() items: any[];
	public errorMessage: string;

	@Output() passEntry: EventEmitter<any> = new EventEmitter();

	constructor(
		public activeModal: NgbActiveModal,
		private translate: TranslateService
	) { }

	ngOnInit() {
	}

	public closeModal() {
		this.activeModal.close('close');
	}

	public onClickRun() {
		const leastOneSelected = this.items.find(x => x.selected || x.indeterminate);
		if (leastOneSelected !== undefined) {
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
