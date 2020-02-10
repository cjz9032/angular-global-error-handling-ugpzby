import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WinRT } from '@lenovo/tan-client-bridge';
import { ModalArticleDetailComponent } from 'src/app/components/modal/modal-article-detail/modal-article-detail.component';
import { ModalDccDetailComponent } from 'src/app/components/modal/modal-dcc-detail/modal-dcc-detail.component';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';

@Injectable({
	providedIn: 'root'
})
export class CardService {

	constructor(
		private modalService: NgbModal,
		private appsForYouService: AppsForYouService
	) { }

	linkClicked(actionType: string, actionLink: string, isOfflineArm?: boolean) {
		if (isOfflineArm) {
			return false;
		}

		const isProtocol = actionLink.startsWith('lenovo-vantage3:');
		const isDccDetails = actionLink.startsWith('lenovo-vantage3:dcc-details');
		const isDccDemo = actionLink.startsWith('dcc-demo');

		if (!actionType || (actionType !== 'Internal' && !isProtocol)) {
			return;
		}

		if (isProtocol && !isDccDetails) {
			WinRT.launchUri(actionLink);
		} else if (isDccDetails || isDccDemo) {
			this.appsForYouService.updateUnreadMessageCount('menu-main-lnk-open-dcc');
			this.openDccDetailModal();
		} else {
			this.openArticleModal(actionLink);
		}

		return false;
	}

	openArticleModal(articleId: string) {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			backdrop: true, /*'static',*/
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal',
			keyboard: false,
			beforeDismiss: () => {
				if (articleDetailModal.componentInstance.onBeforeDismiss) {
					articleDetailModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});

		articleDetailModal.componentInstance.articleId = articleId;
	}

	openDccDetailModal() {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalDccDetailComponent, {
			backdrop: true, /*'static',*/
			size: 'lg',
			centered: true,
			windowClass: 'Dcc-Detail-Modal',
			keyboard: false,
			beforeDismiss: () => {
				if (articleDetailModal.componentInstance.onBeforeDismiss) {
					articleDetailModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});
	}
}
