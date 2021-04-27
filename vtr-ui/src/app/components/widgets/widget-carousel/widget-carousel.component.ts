import {
	Component,
	Input,
	OnInit,
	SimpleChanges,
	OnChanges,
	ViewChild,
	ElementRef,
	OnDestroy,
} from '@angular/core';
import { NgbCarouselConfig, NgbCarousel, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CardService, CardOverlayTheme } from 'src/app/services/card/card.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { ContentSource } from 'src/app/enums/content.enum';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';

@Component({
	selector: 'vtr-widget-carousel',
	templateUrl: './widget-carousel.component.html',
	styleUrls: ['./widget-carousel.component.scss'],
	providers: [NgbCarouselConfig],
})
export class WidgetCarouselComponent implements OnInit, OnChanges, OnDestroy {
	@Input() tabIndex = 0;
	@Input() isShort = false;
	@Input() defaultOverlayTheme = CardOverlayTheme.Dark;
	@Input() data: FeatureContent[];
	@Input() interval: number;
	@Input() keyboard: boolean;
	@Input() pauseOnHover: boolean;
	@Input() showNavigationArrows: boolean;
	@Input() showNavigationIndicators: boolean;
	@Input() wrap: boolean;
	@Input() order: number;
	@Input() carouselId: string;
	@ViewChild('containerCarousel', { static: false }) containerCarousel: ElementRef;
	@ViewChild(NgbCarousel) carouselContainer;
	// images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
	carouselModel: FeatureContent[] = [];
	CardOverlayTheme = CardOverlayTheme;

	currentSlideId = 'ngb-slide-0';
	isOnline = true;

	private displayDetectionTaskId;

	constructor(
		private config: NgbCarouselConfig,
		private commonService: CommonService,
		private cardService: CardService,
		private metricsService: MetricService
	) { }

	ngOnInit() {
		this.config.interval = typeof this.interval !== 'undefined' ? this.interval : 5000;
		this.config.keyboard = typeof this.keyboard !== 'undefined' ? this.keyboard : true;
		this.config.pauseOnHover =
			typeof this.pauseOnHover !== 'undefined' ? this.pauseOnHover : true;
		this.config.showNavigationArrows =
			typeof this.showNavigationArrows !== 'undefined' ? this.showNavigationArrows : true;
		this.config.showNavigationIndicators =
			typeof this.showNavigationIndicators !== 'undefined'
				? this.showNavigationIndicators
				: true;
		this.config.wrap = typeof this.wrap !== 'undefined' ? this.wrap : true;
		this.parseToCarouselModel();

		this.isOnline = this.commonService.isOnline;

		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		this.currentSlideId = `${this.carouselId}-slide-0`;
	}

	byString(o: any, s: string) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, ''); // strip a leading dot
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
			let overlayTheme;
			if (!carousel.OverlayTheme || carousel.OverlayTheme === CardOverlayTheme.Default) {
				overlayTheme = this.defaultOverlayTheme;
			} else {
				overlayTheme = carousel.OverlayTheme;
			}
			this.carouselModel.push({
				Id: carousel.Id,
				Title: carousel.Title,
				Description: carousel.Description,
				FeatureImage: carousel.FeatureImage,
				ActionLink: carousel.ActionLink ? carousel.ActionLink : '',
				ActionType: carousel.ActionType || '',
				DataSource: carousel.DataSource || '',
				OverlayTheme: overlayTheme,
			});
		}

		const firstCarousel = this.data[0];
		if (!firstCarousel) {
			return;
		}

		this.metricsService.contentDisplayDetection.removeTask(this.displayDetectionTaskId);
		if (firstCarousel.DataSource && firstCarousel.DataSource !== ContentSource.Local) {
			this.displayDetectionTaskId = this.metricsService.contentDisplayDetection.addTask(
				this.data,
				() => this.containerCarousel,
				this.order,
			);
		}
		setTimeout(() => {
			this.containerCarousel?.nativeElement.querySelector('.carousel-control-prev')?.setAttribute('id', this.carouselId + '-arrow-left');
			this.containerCarousel?.nativeElement.querySelector('.carousel-control-next')?.setAttribute('id', this.carouselId + '-arrow-right');
		}, 0);
	}

	linkClicked($event, actionType: string, actionLink: string, title: string) {
		if (!actionLink) {
			$event.preventDefault();
		}
		return this.cardService.linkClicked(actionType, actionLink, false, title);
	}

	swipe(e) {
		if (this.carouselModel && this.carouselModel.length > 1) {
			if (e.toLowerCase() === 'swiperight') {
				this.carouselContainer.prev();
			} else {
				if (e.toLowerCase() === 'swipeleft') {
					this.carouselContainer.next();
				}
			}
		}
	}

	onCarouselSlideChange($event: NgbSlideEvent) {
		if ($event.current) {
			this.currentSlideId = $event.current;
		}
	}

	onCarouselKeyUp($event: KeyboardEvent) {
		// enter key pressed
		if ($event.key.toLowerCase() === 'enter') {
			$event.preventDefault();
			const index = this.getIndexFromId(this.currentSlideId);
			if (index >= 0) {
				const model = this.carouselModel[index];
				this.linkClicked($event, model.ActionType, model.ActionLink, model.Title);
			}
		}
	}

	ngOnDestroy() {
		this.metricsService.contentDisplayDetection.removeTask(this.displayDetectionTaskId);
	}

	private getIndexFromId(slideId: string): number {
		if (slideId && slideId.length > 0) {
			const index: string = slideId.split('-')[2];
			return parseInt(index, 10);
		}
		return -1;
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
