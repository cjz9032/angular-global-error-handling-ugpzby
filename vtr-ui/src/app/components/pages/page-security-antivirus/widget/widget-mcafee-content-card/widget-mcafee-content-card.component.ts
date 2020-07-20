import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../../../modal/modal-article-detail/modal-article-detail.component';

@Component({
  selector: 'vtr-widget-mcafee-content-card',
  templateUrl: './widget-mcafee-content-card.component.html',
  styleUrls: ['./widget-mcafee-content-card.component.scss']
})
export class WidgetMcafeeContentCardComponent implements OnInit {
	@Input() articleId: string;
	@Input() isOnline: boolean;
	constructor(public modalService: NgbModal) { }

	ngOnInit(): void {
	}

	openArticle() {
		if (!this.isOnline) {
			return;
		}
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			backdrop: true,
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

		articleDetailModal.componentInstance.articleId = this.articleId;
	}
}
