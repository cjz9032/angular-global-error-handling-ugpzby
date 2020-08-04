import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WinRT } from '@lenovo/tan-client-bridge';
import { ModalArticleDetailComponent } from 'src/app/components/modal/modal-article-detail/modal-article-detail.component';
import { ModalDccDetailComponent } from 'src/app/components/modal/modal-dcc-detail/modal-dcc-detail.component';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { DeviceService } from '../device/device.service';
import { ContentActionType } from 'src/app/enums/content.enum';

@Injectable({
	providedIn: 'root'
})
export class CardService {

	constructor(
		private modalService: NgbModal,
		private appsForYouService: AppsForYouService,
		public deviceService: DeviceService,
	) { }

	linkClicked(actionType: string, actionLink: string, isOfflineArm?: boolean, articleTitle: string = '') {
		if (isOfflineArm || !actionType) {
			return false;
		}

		const isProtocol = actionLink.startsWith('lenovo-vantage3:');
		const isDccDetails = actionLink.startsWith('lenovo-vantage3:dcc-details');
		const isDccDemo = actionLink.startsWith('dcc-demo');

		if ((isProtocol && !isDccDetails) || actionType === ContentActionType.External) {
			WinRT.launchUri(actionLink);
		} else if (isDccDetails || isDccDemo) {
			this.appsForYouService.updateUnreadMessageCount('menu-main-lnk-open-dcc');
			this.openDccDetailModal();
		} else {
			this.openArticleModal(actionType, actionLink, articleTitle);
		}

		return false;
	}

	openArticleModal(actionType: string, articleId: string, articleTitle: string = '') {
		const articleClass = this.deviceService.isGaming ? 'Article-Detail-Modal content-gaming' : 'Article-Detail-Modal';
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			backdrop: true, /*'static',*/
			size: 'lg',
			centered: true,
			ariaLabelledBy: 'article-dialog-basic-title',
			windowClass: articleClass,
			keyboard: false,
			beforeDismiss: () => {
				if (articleDetailModal.componentInstance.onBeforeDismiss) {
					articleDetailModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});

		articleDetailModal.componentInstance.articleId = articleId;
		if (articleTitle !== '') {
			articleDetailModal.componentInstance.articleLinkTitle = articleTitle;
		}
		articleDetailModal.componentInstance.actionType = actionType;
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

export const CardOverlayTheme = {
	Default: 'default',
	Light: 'light',
	Dark: 'dark',
};
