import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { disableBackgroundNavigation, reEnableBackgroundNavigation } from '../../../services/hardware-scan/utils/ModalBackgroundNavigationUtils';

@Component({
	selector: 'vtr-modal-pre-scan-info',
	templateUrl: './modal-pre-scan-info.component.html',
	styleUrls: ['./modal-pre-scan-info.component.scss']
})
export class ModalPreScanInfoComponent implements OnInit, OnDestroy {

	@Input() buttonText = this.translate.instant('hardwareScan.ok');
	@Input() error = this.translate.instant('hardwareScan.scheduledScan.error');
	@Input() description = this.translate.instant('hardwareScan.scheduledScan.scheduleIntervalLimit');
	question: string;

	@Input() ItemParent: string;
	@Input() CancelItemName: string;
	@Input() ConfirmItemName: string;

	constructor(private translate: TranslateService, public activeModal: NgbActiveModal) { }

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
