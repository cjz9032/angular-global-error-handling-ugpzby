import { Component, Self, ElementRef, OnInit, AfterViewInit, Input } from '@angular/core';
import { DisplayService } from '../../services/display/display.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalArticleDetailComponent } from '../modal/modal-article-detail/modal-article-detail.component';

@Component({
	selector: 'vtr-container-card',
	templateUrl: './container-card.component.html',
	styleUrls: ['./container-card.component.scss']
})
export class ContainerCardComponent implements OnInit, AfterViewInit {

	@Input() img = '';
	@Input() caption = '';
	@Input() title = '';
	@Input() logo = '';
	@Input() logoText = '';
	@Input() action = '';
	@Input() actionLink = '';
	@Input() type = '';
	@Input() ratioX = 1;
	@Input() ratioY = 1;
	@Input() cornerShift: String = '';

	ratio = 1;
	containerHeight = 100;

	resizeListener;

	constructor(
		@Self() private element: ElementRef,
		private displayService: DisplayService,
		public modalService: NgbModal
	) { }

	ngOnInit() {
		this.ratio = this.ratioY / this.ratioX;
		const self = this;
		this.resizeListener = this.displayService.windowResizeListener().subscribe((event) => {
			self.calcHeight(self.element);
		});
	}

	ngAfterViewInit() {
		const self = this;
		const delay = setTimeout(function () {
			self.calcHeight(self.element);
		}, 500);
	}

	calcHeight(containerCard) {
		if (containerCard) {
			this.containerHeight = containerCard.nativeElement.firstElementChild.clientWidth * this.ratio;
			// console.log('RESIZE CONTAINER CARD', this.title, this.ratio, containerCard, this.containerHeight);
		}
	}

	articleClicked(articleId) {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal'
		});

		articleDetailModal.componentInstance.articleId = articleId;
	}
}
