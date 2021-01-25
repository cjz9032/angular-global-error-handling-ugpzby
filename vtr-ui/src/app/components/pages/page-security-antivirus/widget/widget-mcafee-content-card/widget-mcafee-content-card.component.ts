import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';
import { ModalArticleDetailComponent } from '../../../../modal/modal-article-detail/modal-article-detail.component';

@Component({
	selector: 'vtr-widget-mcafee-content-card',
	templateUrl: './widget-mcafee-content-card.component.html',
	styleUrls: ['./widget-mcafee-content-card.component.scss'],
})
export class WidgetMcafeeContentCardComponent implements OnInit {
	@Input() articleId: string;
	@Input() isOnline: boolean;
	constructor(public dialog: MatDialog) {}

	ngOnInit(): void {}

	openArticle() {
		const articleDetailModal = this.dialog.open(ModalArticleDetailComponent, {
			autoFocus: false,
			hasBackdrop: true,
			panelClass: 'Article-Detail-Modal',
		});
		articleDetailModal.beforeClosed().subscribe(() => {
			articleDetailModal.componentInstance.onBeforeDismiss();
		});
		articleDetailModal.componentInstance.articleId = this.articleId;
	}
}
