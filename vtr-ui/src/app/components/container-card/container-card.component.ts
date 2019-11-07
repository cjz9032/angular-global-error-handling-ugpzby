import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../modal/modal-article-detail/modal-article-detail.component';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { WinRT } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-container-card',
	templateUrl: './container-card.component.html',
	styleUrls: ['./container-card.component.scss', './container-card.component.gaming.scss']
})
export class ContainerCardComponent implements OnInit, OnChanges {
	@Input() img = '';
	@Input() caption = '';
	@Input() title = '';
	@Input() logo = '';
	@Input() logoText = '';
	@Input() action = '';
	@Input() actionType = '';
	@Input() actionLink = '';
	@Input() type = '';
	@Input() ratioX = 1;
	@Input() ratioY = 1;
	@Input() cornerShift = '';
	@Input() order: number;
	@Input() itemID: string;
	@Input() sideFlag = '';
	@Input() containerCardId = '';
	@Input() dataSource = '';
	@Input() isOfflineArm = false;

	isLoading = true;

	ratio = 1;
	containerHeight = 100;
	isOnline = true;

	resizeListener;

	constructor(
		private commonService: CommonService,
		public modalService: NgbModal,
	) { }

	ngOnInit() {
		this.handleLoading();
		this.ratio = this.ratioY / this.ratioX;
		this.isOnline = this.commonService.isOnline;
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	handleLoading() {
		console.log(this.img, '+++++++++---------');
		if (this.img) {
			this.isLoading = false;
		} else {
			const image = new Image();
			image.onload = () => {
				this.isLoading = false;
			};
			image.src = this.img;
		}
	}

	linkClicked(actionType: string, actionLink: string) {
		if (this.isOfflineArm) {
			return false;
		}

		if (!actionType || actionType !== 'Internal') {
			return;
		}

		if (actionLink.indexOf('lenovo-vantage3:') === 0) {
			WinRT.launchUri(actionLink);
		} else {
			this.articleClicked(actionLink);
		}

		return false;
	}

	articleClicked(articleId) {
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

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}

	ngOnChanges(changes) {
		this.handleLoading();
	}
}
