import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';

@Component({
	selector: 'vtr-widget-security',
	templateUrl: './widget-security.component.html',
	styleUrls: ['./widget-security.component.scss']
})
export class WidgetSecurityComponent implements OnInit {
	@Input() percentValue: number = this.percentValue || 100;
	security = {
		title: [
			'security.landing.fully',
			'security.landing.notFully',
		],
		subTitle: [
			'security.landing.fullyDesc',
			'security.landing.notFullyDesc',
		],
		subTitle2: [
			'',
			''
		]
	};
	constructor(
		public modalService: NgbModal
	) { }

	ngOnInit() { }

	buttonClick() {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal'
		});

		articleDetailModal.componentInstance.articleId = '1C95D1D5D20D4888AC043821E7355D35';
	}
}
