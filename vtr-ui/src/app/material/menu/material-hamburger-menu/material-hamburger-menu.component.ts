import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { CardService } from 'src/app/services/card/card.service';
import { CommonService } from 'src/app/services/common/common.service';
import { MenuItem } from 'src/app/services/config/config.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ModernPreloadService } from 'src/app/services/modern-preload/modern-preload.service';
import { UserService } from 'src/app/services/user/user.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LenovoIdStatus } from 'src/app/enums/lenovo-id-key.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';

@Component({
	selector: 'vtr-material-hamburger-menu',
	templateUrl: './material-hamburger-menu.component.html',
	styleUrls: ['./material-hamburger-menu.component.scss'],
})
export class MaterialHamburgerMenuComponent implements OnInit, OnDestroy {
	@Input() items: MenuItem[];
	@Input() activeItemId: string;
	@Output() activeItem = new EventEmitter();
	isLoggingOut = false;
	appsForYouEnum = AppsForYouEnum;
	private subscription: Subscription;
	constructor(
		public appsForYouService: AppsForYouService,
		public deviceService: DeviceService,
		public languageService: LanguageService,
		public userService: UserService,
		public commonService: CommonService,
		public modernPreloadService: ModernPreloadService,
		private cardService: CardService,
		private dialogService: DialogService,
		private feedbackService: FeedbackService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
					this.modernPreloadService.getIsEntitled();
					break;
				case LenovoIdStatus.LoggingOut:
					this.isLoggingOut = notification.payload;
					break;
				default:
					break;
			}
		}
	}

	public hasSecondaryMenu(item: MenuItem) {
		return item && item.subitems && item.subitems.length > 0;
	}

	public openExternalLink(link) {
		if (link) {
			window.open(link);
		}
	}

	onMenuItemClick(item, event?) {
		window.getSelection().empty();
		if (item.id === 'user' && event) {
			const target = event.currentTarget || event.srcElement;
			if (target && target.attributes && target.attributes.id && target.attributes.id.nodeValue) {
				const id = target.attributes.id.nodeValue;
				if (id === 'menu-main-lnk-open-lma' ||
					id === 'menu-main-lnk-open-adobe' ||
					id === 'menu-main-lnk-open-dcc') {
					this.appsForYouService.updateUnreadMessageCount(id);
					if (id === 'menu-main-lnk-open-dcc') {
						this.cardService.openDccDetailModal();
					}
				}
			} else {
				return;
			}
		}
	}

	menuItemKeyDown(path, subpath?, secondaryPath?) {
		secondaryPath ? this.router.navigateByUrl(`/${path}/${subpath}/${secondaryPath}`)
			: subpath ? this.router.navigateByUrl(`/${path}/${subpath}`)
			: path ? this.router.navigateByUrl(`/${path}`) : this.router.navigateByUrl(`/`);
	}

	onLogout() {
		this.userService.removeAuth();
	}

	openModernPreloadModal() {
		this.dialogService.openModernPreloadModal();
	}

	openFeedbackModal() {
		this.feedbackService.openFeedbackModal();
	}

	openLenovoId(appFeature = null) {
		this.dialogService.openLenovoIdDialog(appFeature);
	}

	updateActiveItem(id: string) {
		this.activeItem.emit(id);
	}
}
