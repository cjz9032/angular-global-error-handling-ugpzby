import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CardService } from 'src/app/services/card/card.service';

@Component({
	selector: 'vtr-widget-carousel',
	templateUrl: './widget-carousel.component.html',
	styleUrls: ['./widget-carousel.component.scss'],
	providers: [NgbCarouselConfig]
})

export class WidgetCarouselComponent implements OnInit, OnChanges {
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
	@Input() order: number;
	@Input() carouselId: string;


	isOnline = true;

	constructor(
		private config: NgbCarouselConfig,
		private commonService: CommonService,
		private cardService: CardService,
		) {
	}

	ngOnInit() {

		this.config.interval = typeof this.interval !== 'undefined' ? this.interval : 5000;
		this.config.keyboard = typeof this.keyboard !== 'undefined' ? this.keyboard : true;
		this.config.pauseOnHover = typeof this.pauseOnHover !== 'undefined' ? this.pauseOnHover : true;
		this.config.showNavigationArrows = typeof this.showNavigationArrows !== 'undefined' ? this.showNavigationArrows : true;
		this.config.showNavigationIndicators = typeof this.showNavigationIndicators !== 'undefined' ? this.showNavigationIndicators : true;
		this.config.wrap = typeof this.wrap !== 'undefined' ? this.wrap : true;
		this.parseToCarouselModel();

		this.isOnline = this.commonService.isOnline;

		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	byString(o: any, s: string) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		const a = s.split('.');
		for (let i = 0, n = a.length; i < n; ++i) {
			const k = a[i];
			if (k in o) {
				o = o[k];
			} else {
				return;
			}
		}
		return o;
	}

	ngOnChanges(changes: SimpleChanges) {
		const change = changes.data;
		if (!change.isFirstChange()) {
			this.parseToCarouselModel();
		}

	}

	parseToCarouselModel() {
		this.carouselModel = [];

		for (const carousel of this.data) {
			this.carouselModel.push({
				id: carousel.id,
				source: carousel.source,
				cardTitle: carousel.title,
				image: carousel.url,
				link: carousel.ActionLink ? carousel.ActionLink : '',
				linkType: carousel.ActionType || '',
				dataSource: carousel.DataSource || ''
			});
		}
	}

	linkClicked($event, actionType: string, actionLink: string) {
		if (!actionLink) {
			$event.preventDefault();
		}
		return this.cardService.linkClicked(actionType, actionLink);
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

}

interface CarouselModel {
	cardTitle: string;
	source: string;
	image: string;
	link: string;
	id: string;
	linkType: string;
	dataSource: string;
}


