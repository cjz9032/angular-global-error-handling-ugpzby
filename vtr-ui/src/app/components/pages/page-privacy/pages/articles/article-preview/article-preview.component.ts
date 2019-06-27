import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'vtr-article-preview',
	templateUrl: './article-preview.component.html',
	styleUrls: ['./article-preview.component.scss'],
})
export class ArticlePreviewComponent {
	@Input() article;
	@Output() openArticle = new EventEmitter<string>();
}
