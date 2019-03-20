import { Component, Self, ElementRef, OnInit, AfterViewInit, Input } from '@angular/core';
import { DisplayService } from '../../services/display/display.service';
import { SupportService } from '../../services/support/support.service';

@Component({
	selector: 'vtr-container-article',
	templateUrl: './container-article.component.html',
	styleUrls: ['./container-article.component.scss']
})
export class ContainerArticleComponent implements OnInit, AfterViewInit {

	@Input() items: any;

	ratioX = 1;
	ratioY = 0.5;
	ratio = 1;
	containerHeight = 100;
	containerHeights: number[];

	resizeListener;

	metricsDatas: {
		viewOrder: number
		pageNumber: number
	};

	constructor(
		@Self() private element: ElementRef,
		private displayService: DisplayService,
		private supportService: SupportService,
	) {
		this.metricsDatas = this.supportService.metricsDatas;
	}

	ngOnInit() {
		this.resizeListener = this.displayService.windowResizeListener().subscribe((event) => {
			console.log(this.items);
			this.calcHeight();
		});
	}

	ngAfterViewInit() {
		const self = this;
		console.log(self);
		const delay = setInterval(() => {
			if (this.items) {
				console.log(this.items);
				this.calcHeight();
				clearInterval(delay);
			}
		}, 200);
	}

	calcHeight() {
		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];
			const thisElement = this.element.nativeElement.getElementsByClassName('item-article')[i];
			console.log(thisElement.clientWidth);
			if (item.thumbnailUrl === '') {
				thisElement.style.height = thisElement.clientWidth * 160 / 430 + 'px';
			} else if (item.title === '') {
				thisElement.style.height = thisElement.clientWidth * 283 / 430 + 'px';
			} else {
				thisElement.style.height = thisElement.clientWidth * 420 / 430 + 'px';
			}
		}
	}

	addViewOrder() {
		this.metricsDatas.viewOrder++;
	}

}
