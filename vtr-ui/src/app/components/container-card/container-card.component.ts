import { Component, Self, ElementRef, OnInit, AfterViewInit, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { DisplayService } from '../../services/display/display.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../modal/modal-article-detail/modal-article-detail.component';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';

@Component({
	selector: 'vtr-container-card',
	templateUrl: './container-card.component.html',
	styleUrls: [ './container-card.component.scss', './container-card.component.gaming.scss' ]
})
export class ContainerCardComponent implements OnInit, AfterViewInit, OnChanges {
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
	@Input() cornerShift: String = '';
	@Input() order: number;
	@Input() itemID: string;
	@Input() sideFlag = '';

	isLoading = true;

	ratio = 1;
	containerHeight = 100;
	isOnline = true;

	resizeListener;

	constructor(
		@Self() private element: ElementRef,
		private displayService: DisplayService,
		private commonService: CommonService,
		public modalService: NgbModal,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.handleLoading();

		this.ratio = this.ratioY / this.ratioX;
		const self = this;
		this.resizeListener = this.displayService.windowResizeListener().subscribe((event) => {
			self.calcHeight(self.element);
		});

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

	ngAfterViewInit() {
		const self = this;
		const delay = setTimeout(() => {
			self.calcHeight(self.element);
		}, 0);
	}

	calcHeight(containerCard) {
		if (containerCard) {
			this.containerHeight = containerCard.nativeElement.firstElementChild.clientWidth * this.ratio;
			// console.log('RESIZE CONTAINER CARD', this.title, this.ratio, containerCard, this.containerHeight);
		}
	}

	linkClicked(actionType: string, actionLink: string) {
		if (!actionType || actionType !== 'Internal') {
			return;
		}

		this.articleClicked(actionLink);
		return false;
	}

	articleClicked(articleId) {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			backdrop: true,/*'static',*/
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal',
			keyboard : false
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
