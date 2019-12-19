import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CardService } from 'src/app/services/card/card.service';

@Component({
	selector: 'vtr-container-card',
	templateUrl: './container-card.component.html',
	styleUrls: ['./container-card.component.scss', './container-card.component.gaming.scss']
})
export class ContainerCardComponent implements OnInit, OnChanges {
	@Input() img = '';
	@Input() caption = '';
	@Input() title = '';
	@Input() logo = '';
	@Input() logoText = '';
	@Input() action = '';
	@Input() actionType = '';
	@Input() actionLink = '';
	@Input() type = '';
	@Input() ratio = 0.5;
	@Input() cornerShift = '';
	@Input() order: number;
	@Input() itemID: string;
	@Input() sideFlag = '';
	@Input() containerCardId = '';
	@Input() dataSource = '';
	@Input() dynamicmetricsItem = '';
	@Input() isOfflineArm = false;

	isLoading = true;
	isOnline = true;

	constructor(
		private commonService: CommonService,
		private cardService: CardService,
	) { }

	ngOnInit() {
		this.handleLoading();
		this.isOnline = this.commonService.isOnline;
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	handleLoading() {
		// console.log(this.img, '+++++++++---------');
		if (this.img) {
			this.isLoading = false;
		} else {
			const image = new Image();
			image.onload = () => {
				this.isLoading = false;
			};
			image.src = this.img;
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

	ngOnChanges(changes) {
		this.handleLoading();
	}
}
