import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';

@Component({
	selector: 'vtr-settings-page-layout',
	templateUrl: './settings-page-layout.component.html',
	styleUrls: ['./settings-page-layout.component.scss']
})
export class SettingsPageLayoutComponent implements OnInit, OnDestroy {
	increasePadding = false;
	notificationSubscription: Subscription;
	@Input() pageTitle: string;
	@Input() textId: string;
	@Input() pageCssClass: string;
	@Input() parentPath: string;
	@Input() backLinkText: string;
	@Input() menuItems: any[];

	constructor(public commonService: CommonService) { }

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onSmartStandbyNotification(notification);
		});
	}

	onSmartStandbyNotification(notification: AppNotification) {
		if (notification && notification.type === 'smartStandbyToggles') {
			const toggle = notification.payload;
			if (toggle.id === 2) {
				this.increasePadding = toggle.value;
			}
		}
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

}
