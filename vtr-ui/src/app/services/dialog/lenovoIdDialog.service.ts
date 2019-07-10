import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalCommonConfirmationComponent } from 'src/app/components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { ModalLenovoIdComponent } from 'src/app/components/modal/modal-lenovo-id/modal-lenovo-id.component';

@Injectable({
	providedIn: 'root'
})
export class LenovoIdDialogService {

	constructor(private modalService: NgbModal) {}

	openLenovoIdDialog(appFeature = null) {
		if (!navigator.onLine) {
			const modalRef = this.modalService.open(ModalCommonConfirmationComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'common-confirmation-modal'
			});

			const header = 'lenovoId.ssoErrorTitle';
			modalRef.componentInstance.CancelText = '';
			modalRef.componentInstance.header = header;
			modalRef.componentInstance.description = 'lenovoId.ssoErrorNetworkDisconnected';
			return modalRef.result;
		} else {
			const modal: NgbModalRef = this.modalService.open(ModalLenovoIdComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'lenovo-id-modal-size'
			});
			(<ModalLenovoIdComponent>modal.componentInstance).appFeature = appFeature;
			return modal.result;
		}
	}

}
