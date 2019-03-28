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
	titleString = {
		fully: {
			title: 'Fully protected',
			subTitle: 'Congratulations! You are well protected.',
			buttonText: 'SECURITY ADVISOR 101'
		},
		notFully: {
			title: 'Not fully protected',
			subTitle: 'You are not fully protected, Learn how to better protect yourself now.',
			buttonText: 'SECURITY ADVISOR 101'
		}
	};
	titleObj = {
		title: '',
		subTitle1: '',
		subTitle2: '',
		buttonText: '',
	};
	// titleObj: LandingTitle;
  constructor(
		public modalService: NgbModal
	) { }

	ngOnInit() {
		if (this.percentValue === 100) {
			this.titleObj.title = this.titleString.fully.title;
			this.titleObj.subTitle1 = this.titleString.fully.subTitle;
			this.titleObj.buttonText = this.titleString.fully.buttonText;
		} else {
			this.titleObj.title = this.titleString.notFully.title;
			this.titleObj.subTitle1 = this.titleString.notFully.subTitle;
			this.titleObj.buttonText = this.titleString.notFully.buttonText;
		}
	}

	buttonClick() {
		let articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal'
		});

		articleDetailModal.componentInstance.articleId = '1C95D1D5D20D4888AC043821E7355D35';
	}
}
