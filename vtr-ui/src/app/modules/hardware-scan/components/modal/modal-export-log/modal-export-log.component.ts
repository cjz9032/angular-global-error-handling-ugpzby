import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { disableBackgroundNavigation, reEnableBackgroundNavigation } from '../../../services/utils/ModalBackgroundNavigationUtils';

@Component({
	selector: 'vtr-modal-export-log',
	templateUrl: './modal-export-log.component.html',
	styleUrls: ['./modal-export-log.component.scss']
})
export class ModalExportLogComponent implements OnInit, OnDestroy {
	@Input() logPath = '';

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit(){
		disableBackgroundNavigation(document);
	}

	ngOnDestroy(){
		reEnableBackgroundNavigation(document);
	}

	onClosing() {
		this.activeModal.close();
	}

}
