import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-schedule-scan-collision',
	templateUrl: './modal-schedule-scan-collision.component.html',
	styleUrls: ['./modal-schedule-scan-collision.component.scss']
})
export class ModalScheduleScanCollisionComponent implements OnInit {

	@Input() buttonText = this.translate.instant('hardwareScan.ok');
	@Input() error = this.translate.instant('hardwareScan.scheduledScan.error');
	@Input() description = this.translate.instant('hardwareScan.scheduledScan.scheduleIntervalLimit');
	question: string;

	@Input() ItemParent: string;
	@Input() CancelItemName: string;
	@Input() ConfirmItemName: string;

	constructor(private translate: TranslateService, public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	onClosing() {
		console.log('[MODAL] User confirms');
		this.activeModal.close();
	}

}
