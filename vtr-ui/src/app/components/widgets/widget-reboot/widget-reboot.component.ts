import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCommonConfirmationComponent } from '../../modal/modal-common-confirmation/modal-common-confirmation.component';

@Component({
	selector: 'vtr-widget-reboot',
	templateUrl: './widget-reboot.component.html',
	styleUrls: ['./widget-reboot.component.scss']
})
export class WidgetRebootComponent implements OnInit {
	@Output() rebootClick = new EventEmitter<any>();
	@Output() dismissClick = new EventEmitter<any>();

	constructor(public modalService: NgbModal) { }

	ngOnInit() {
	}

	onRebootClick($event) {
		this.rebootClick.emit($event);
	}

	onDismissClick($event) {
		this.dismissClick.emit($event);
	}

	openConfirmationModal() {
		const modalRef = this.modalService.open(ModalCommonConfirmationComponent, {
			size: 'lg',
			windowClass: 'common-confirmation-modal'
		});
		// modalRef.componentInstance.title = 'Hello';
		// modalRef.componentInstance.body = `Protect the airplane AC power outlet by controlling
		//  the power consumption of your system. When Airplane Power Mode is enabled, the computer
		//  reduces power consumption by limiting the battery charging rate and system performance.`;
		modalRef.componentInstance.packages = ['Package 1', 'Package 2', 'Package 3'];
	}
}
