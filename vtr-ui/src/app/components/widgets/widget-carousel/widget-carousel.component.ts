import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-widget-carousel',
	templateUrl: './widget-carousel.component.html',
	styleUrls: ['./widget-carousel.component.scss'],
	providers: [NgbCarouselConfig]
})

export class WidgetCarouselComponent implements OnInit {
	// images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
	carouselModel: CarouselModel[] = [];

	@Input() cardTitle: string;
	@Input() source: string;
	@Input() image: string;
	@Input() link: string;
	@Input() data: any;
	@Input() interval: number;
	@Input() keyboard: boolean;
	@Input() pauseOnHover: boolean;
	@Input() showNavigationArrows: boolean;
	@Input() showNavigationIndicators: boolean;
	@Input() wrap: boolean;

	constructor(private config: NgbCarouselConfig) {

	}

	ngOnInit() {

		this.config.interval = typeof this.interval !== 'undefined' ? this.interval : 5000;
		this.config.keyboard = typeof this.keyboard !== 'undefined' ? this.keyboard : true;
		this.config.pauseOnHover = typeof this.pauseOnHover !== 'undefined' ? this.pauseOnHover : true;
		this.config.showNavigationArrows = typeof this.showNavigationArrows !== 'undefined' ? this.showNavigationArrows : true;
		this.config.showNavigationIndicators = typeof this.showNavigationIndicators !== 'undefined' ? this.showNavigationIndicators : true;
		this.config.wrap = typeof this.wrap !== 'undefined' ? this.wrap : true;
		this.parseToCarouselModel();
	}

	byString(o: any, s: string) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		for (var i = 0, n = a.length; i < n; ++i) {
			var k = a[i];
			if (k in o) {
				o = o[k];
			} else {
				return;
			}
		}
		return o;
	}

	ngOnChanges(changes: SimpleChanges) {
		var change = changes['data'];
		if (!change.isFirstChange()) {
			this.parseToCarouselModel();
		}

	}

	parseToCarouselModel() {
		for (var i = 0; i < this.data.length; i++) {
			this.carouselModel.push({
				source: this.data[i].source,
				cardTitle: this.data[i].title,
				image: this.data[i].url,
				link: this.data[i].ActionLink ? this.data[i].ActionLink : ''
			})
		}
		console.log('###################', this.carouselModel);
	}

	linkClicked($event, link) {
		if (!link) {
			$event.preventDefault();
		}
	}
}

interface CarouselModel {
	cardTitle: string;
	source: string;
	image: string;
	link: string;
}


