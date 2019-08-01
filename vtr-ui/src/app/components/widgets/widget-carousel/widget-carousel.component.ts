import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {MockService} from '../../../services/mock/mock.service';
import {NgbCarouselConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalArticleDetailComponent} from '../../modal/modal-article-detail/modal-article-detail.component';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';

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
	@Input() order: number;
	@Input() carouselId: string;


	isOnline = true;

	constructor(private config: NgbCarouselConfig, private MocckService: MockService, private commonService: CommonService) {

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
		const change = changes['data'];
		if (!change.isFirstChange()) {
			this.parseToCarouselModel();
		}

	}

	parseToCarouselModel() {
		this.carouselModel = [];

		for (let i = 0; i < this.data.length; i++) {
			this.carouselModel.push({
				id: this.data[i].id,
				source: this.data[i].source,
				cardTitle: this.data[i].title,
				image: this.data[i].url,
				link: this.data[i].ActionLink ? this.data[i].ActionLink : ''
			});
		}
	}

	linkClicked($event, link) {
		if (!link) {
			$event.preventDefault();

		}
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
}


