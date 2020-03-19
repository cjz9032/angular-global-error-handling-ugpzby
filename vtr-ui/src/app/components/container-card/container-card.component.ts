import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CardService, CardOverlayTheme } from 'src/app/services/card/card.service';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';

@Component({
	selector: 'vtr-container-card',
	templateUrl: './container-card.component.html',
	styleUrls: ['./container-card.component.scss', './container-card.component.gaming.scss']
})
export class ContainerCardComponent implements OnInit {
	@Input() type = '';
	@Input() ratio = 0.5;
	@Input() cornerShift = '';
	@Input() order: string;
	@Input() sideFlag = '';
	@Input() containerCardId = '';
	@Input() dataSource = '';
	@Input() dynamicmetricsItem = '';
	@Input() isOfflineArm = false;

	overlayThemeDefaultIsDark = true;
	overlayThemeDefaultIsLight = true;

	isLoading = true;
	isOnline = true;

	private _item: FeatureContent;

	@Input() set item(itemValue: any) {
		if (itemValue && itemValue.FeatureImage) {
			this.isLoading = false;
			this.overlayThemeDefaultIsDark = !itemValue.OverlayTheme || itemValue.OverlayTheme !== CardOverlayTheme.Light
			this.overlayThemeDefaultIsLight = !itemValue.OverlayTheme || itemValue.OverlayTheme !== CardOverlayTheme.Dark
			this._item = itemValue;
		} else {
			this._item = new FeatureContent();
		}
	}

	get item() {
		return this._item;
	}

	constructor(
		private commonService: CommonService,
		private cardService: CardService,
	) { }

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	handleLoading() {
		if (this.item && this.item.FeatureImage) {
			this.isLoading = false;
			this.overlayThemeDefaultIsDark = !this.item.OverlayTheme || this.item.OverlayTheme !== CardOverlayTheme.Light
			this.overlayThemeDefaultIsLight = !this.item.OverlayTheme || this.item.OverlayTheme !== CardOverlayTheme.Dark
		} else {
			const image = new Image();
			image.onload = () => {
				this.isLoading = false;
			};
			image.src = this.item.FeatureImage;
		}
	}

	linkClicked(actionType: string, actionLink: string) {
		return this.cardService.linkClicked(actionType, actionLink, this.isOfflineArm);
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
