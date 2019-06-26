import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../articles.service';

@Component({
	selector: 'vtr-article-preview',
	templateUrl: './article-preview.component.html',
	styleUrls: ['./article-preview.component.scss'],
})
export class ArticlePreviewComponent {
	@Input() article;
	@Output() openArticle = new EventEmitter<string>();

	// articlePopupId = 'articlePopupId';
	//
	// constructor(
	// 	private router: Router,
	// 	private routerChangeHandlerService: RouterChangeHandlerService,
	// 	private commonPopupService: CommonPopupService,
	// ) {
	// }
	//
	// ngOnInit() {
	// }
	//
	// ngOnDestroy() {
	// 	this.closeArticlePopup();
	// }
	//
	// openSingleArticle(id) {
	// 	if (this.routerChangeHandlerService.currentRoute === RoutersName.ARTICLES) {
	// 		this.router.navigate([RoutersName.PRIVACY, RoutersName.ARTICLES], {queryParams: {id: id}});
	// 	} else {
	// 		this.commonPopupService.open(this.articlePopupId);
	// 	}
	// }
	//
	// closeArticlePopup() {
	// 	this.commonPopupService.close(this.articlePopupId);
	// }
}
