import { Subscription } from 'rxjs/internal/Subscription';
import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CardService, CardOverlayTheme } from 'src/app/services/card/card.service';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { DeviceService } from 'src/app/services/device/device.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { ContentSource } from 'src/app/enums/content.enum';

@Component({
	selector: 'vtr-container-card',
	templateUrl: './container-card.component.html',
	styleUrls: ['./container-card.component.scss', './container-card.component.gaming.scss']
})
export class ContainerCardComponent implements OnInit, OnDestroy {
	@Input() type = '';
	@Input() ratio = 0.5;
	@Input() cornerShift = '';
	@Input() order = '';
	@Input() sideFlag = '';
	@Input() containerCardId = '';
	@Input() dataSource = '';
	@Input() dynamicMetricsItem = '';
	@Input() isOfflineArm = false;

	@ViewChild('containerCardLoading', { static: false }) containerCardLoading: ElementRef;
	@ViewChild('containerCardCorner', { static: false }) containerCardCorner: ElementRef;
	// @ViewChild('containerCardAndroid', {static: false}) containerCardAndroid: ElementRef;
	@ViewChild('containerCardWideArticle', { static: false }) containerCardWideArticle: ElementRef;
	@ViewChild('containerCardArticle', { static: false }) containerCardArticle: ElementRef;
	@ViewChild('containerCardCornerArticle', { static: false }) containerCardCornerArticle: ElementRef;
	@ViewChild('containerCardSidebarPartnerCorner', { static: false }) containerCardSidebarPartnerCorner: ElementRef;

	overlayThemeDefaultIsDark = true;
	overlayThemeDefaultIsLight = true;

	isLoading = true;
	isOnline = true;
	notificationSubscription: Subscription;
	closeTipTimer = null;

	private displayDetectionTaskId;
	private innerItem: FeatureContent;

	@Input() set item(itemValue: any) {
		if (itemValue && itemValue.FeatureImage) {
			this.isLoading = false;
			this.overlayThemeDefaultIsDark = !itemValue.OverlayTheme || itemValue.OverlayTheme !== CardOverlayTheme.Light;
			this.overlayThemeDefaultIsLight = !itemValue.OverlayTheme || itemValue.OverlayTheme !== CardOverlayTheme.Dark;
			const preItem = this.item;
			this.innerItem = itemValue;

			if (preItem && preItem.Id === itemValue.Id) {
				return;
			}

			if (!itemValue.DataSource || itemValue.DataSource === ContentSource.Local) {
				return;
			}

			// handle content display metrics event
			this.metricsService.contentDisplayDetection.removeTask(this.displayDetectionTaskId);
			const container = () => this.containerCardLoading
				|| this.containerCardCorner
				|| this.containerCardWideArticle
				|| this.containerCardArticle
				|| this.containerCardCornerArticle
				|| this.containerCardSidebarPartnerCorner;
			const position = () => this.sideFlag + this.order;
			this.displayDetectionTaskId = this.metricsService.contentDisplayDetection.addTask(itemValue, container, position);
		} else {
			this.innerItem = new FeatureContent();
		}
	}

	get item() {
		return this.innerItem;
	}

	constructor(
		private commonService: CommonService,
		private cardService: CardService,
		public deviceService: DeviceService,
		private metricsService: MetricService
	) { }

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}

		this.metricsService.contentDisplayDetection.removeTask(this.displayDetectionTaskId);
	}


	handleLoading() {
		if (this.item && this.item.FeatureImage) {
			this.isLoading = false;
			this.overlayThemeDefaultIsDark = !this.item.OverlayTheme || this.item.OverlayTheme !== CardOverlayTheme.Light;
			this.overlayThemeDefaultIsLight = !this.item.OverlayTheme || this.item.OverlayTheme !== CardOverlayTheme.Dark;
		} else {
			const image = new Image();
			image.onload = () => {
				this.isLoading = false;
			};
			image.src = this.item.FeatureImage;
		}
	}

	linkClicked(actionType: string, actionLink: string, title: string = '') {
		return this.cardService.linkClicked(actionType, actionLink, this.isOfflineArm, title);
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

	/**
	 * Close tooltip manually
	 */
	public closeTip(tooltip: any) {
		if (!tooltip.isOpen()) {
			return true;
		}

		tooltip.close();
		if (this.closeTipTimer) {
			clearTimeout(this.closeTipTimer);
		}
	}
	/**
	 * Close tooltip after 3sec
	 */
	public closeTipTimeout(tooltip: any) {
		this.closeTipTimer = setTimeout(this.closeTip, 5000, tooltip);
	}
}
