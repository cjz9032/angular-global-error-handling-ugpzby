import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { MenuItemEvent } from 'src/app/enums/menuItemEvent.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { ConfigService } from 'src/app/services/config/config.service';
@Component({
	selector: 'vtr-page-meeting-expirience',
	templateUrl: './page-meeting-expirience.component.html',
	styleUrls: ['./page-meeting-expirience.component.scss'],
})
export class PageMeetingExpirienceComponent implements OnInit, OnDestroy {
	@ViewChild('hsRouterOutlet', { static: false }) hsRouterOutlet: ElementRef;

	constructor(
		private translate: TranslateService,
		private configService: ConfigService,
		private commonService: CommonService
	) {
		this.menuItems.forEach((m) => {
			m.label = this.translate.instant(m.label);
		});
	}

	routerSubscription: Subscription;
	activeElement: HTMLElement;
	title = 'Meeting Expirience';
	back = 'BACK';
	backarrow = '< ';
	parentPath = 'smb/meeting-experience';
	private router: Router;
	menuItems = [];
	menuItemSubscription: Subscription;

	ngOnInit(): void {
		this.getMenuItems();
		this.menuItemSubscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
		this.routerSubscription = this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
		});
	}

	ngOnDestroy(): void {
		if (this.menuItemSubscription) {
			this.menuItemSubscription.unsubscribe();
		}
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
	}

	onRouteActivate($event, hsRouterOutlet: HTMLElement) {
		// On route change , change foucs to immediate next below first tabindex on route change response
		this.activeElement = document.activeElement as HTMLElement;
	}

	private getMenuItems() {
		this.menuItems = this.configService.getMenuForMeetingManager();
		this.menuItems.forEach((m) => {
			m.label = this.translate.instant(m.label);
			m.path = m.path.split('/')[m.path.split('/').length - 1];
		});
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case MenuItemEvent.MenuItemChange:
					this.getMenuItems();
					break;
				default:
					break;
			}
		}
	}
}
