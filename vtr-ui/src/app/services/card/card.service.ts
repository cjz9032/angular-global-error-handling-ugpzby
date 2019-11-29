import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WinRT } from '@lenovo/tan-client-bridge';
import { ModalArticleDetailComponent } from 'src/app/components/modal/modal-article-detail/modal-article-detail.component';

@Injectable({
	providedIn: 'root'
})
export class CardService {

	constructor(
		private modalService: NgbModal,
	) { }

	linkClicked(actionType: string, actionLink: string, isOfflineArm?: boolean) {
		if (isOfflineArm) {
			return false;
		}

		const isProtocol = actionLink.startsWith('lenovo-vantage3:');

		if (!actionType || (actionType !== 'Internal' && !isProtocol)) {
			return;
		}

		if (isProtocol) {
			WinRT.launchUri(actionLink);
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
}
