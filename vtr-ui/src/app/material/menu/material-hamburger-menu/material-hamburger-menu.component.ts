import {
	Component,
	Input,
	OnInit,
	OnDestroy,
	ElementRef,
	ViewChild,
	Output,
	EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';

import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { CardService } from 'src/app/services/card/card.service';
import { CommonService } from 'src/app/services/common/common.service';
import { MenuItem } from 'src/app/services/config/config.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { ModernPreloadService } from 'src/app/services/modern-preload/modern-preload.service';
import { UserService } from 'src/app/services/user/user.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LenovoIdStatus } from 'src/app/enums/lenovo-id-key.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { MatMenu } from '@lenovo/material/menu';

@Component({
	selector: 'vtr-material-hamburger-menu',
	templateUrl: './material-hamburger-menu.component.html',
	styleUrls: ['./material-hamburger-menu.component.scss'],
	exportAs: 'materialHamburgerMenuComponent',
})
export class MaterialHamburgerMenuComponent implements OnInit, OnDestroy {
	@ViewChild(MatMenu, { static: true }) matMenu: MatMenu;
	@Input() set menuItems(value: MenuItem[]) {
		if (Array.isArray(value)) {
			this.items = cloneDeep(value);
			this.items.forEach((item) => {
				this.hasSecondaryMenu(item);
			});
		}
	}
	@Input() currentRoutePath: string;
	isLoggingOut = false;
	appsForYouEnum = AppsForYouEnum;
	items: any;
	private subscription: Subscription;
	constructor(
		public appsForYouService: AppsForYouService,
		public deviceService: DeviceService,
		public userService: UserService,
		public commonService: CommonService,
		public modernPreloadService: ModernPreloadService,
		private cardService: CardService,
		private dialogService: DialogService,
		private feedbackService: FeedbackService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.subscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
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

	private hasSecondaryMenu(item: any) {
		if (Array.isArray(item?.subitems)) {
			for (const element of item.subitems) {
				if (
					Array.isArray(element?.subitems) &&
					!element.hide &&
					element.subitems.some((it) => !it.hide)
				) {
					item.hasSecondaryMenu = true;
					return;
				}
			}
		}
		item.hasSecondaryMenu = false;
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
			const id = target?.attributes?.id?.nodeValue;
			if (
				id === 'menu-main-lnk-open-lma' ||
				id === 'menu-main-lnk-open-adobe' ||
				id === 'menu-main-lnk-open-dcc'
			) {
				this.appsForYouService.updateUnreadMessageCount(id);
				if (id === 'menu-main-lnk-open-dcc') {
					this.cardService.openDccDetailModal();
				}
			}
		}
	}

	menuItemKeyDown(path, subpath?, secondaryPath?) {
		secondaryPath
			? this.router.navigateByUrl(`/${path}/${subpath}/${secondaryPath}`)
			: subpath
			? this.router.navigateByUrl(`/${path}/${subpath}`)
			: path
			? this.router.navigateByUrl(`/${path}`)
			: this.router.navigateByUrl(`/`);
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

	openSurveyModal(surveyId: string) {
		this.appsForYouService.lenovoSurvey.unread = false;
		this.appsForYouService.decreaseUnreadMessage(surveyId);
		this.feedbackService.openSurveyModal(surveyId);
	}

	openLenovoId(appFeature = null) {
		this.dialogService.openLenovoIdDialog(appFeature);
	}

	updateActiveItem(id: string): boolean {
		if (id === 'security') {
			return (
				this.currentRoutePath === '/home-security' ||
				this.currentRoutePath?.startsWith('/security')
			);
		}
		if (id === 'support') {
			return (
				this.currentRoutePath === '/hardware-scan' ||
				this.currentRoutePath?.startsWith('/support')
			);
		}
		return false;
	}
}
