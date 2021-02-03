import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { MenuItemEvent } from 'src/app/enums/menuItemEvent.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';

@Component({
	selector: 'vtr-page-creator-centre',
	templateUrl: './page-creator-centre.component.html',
	styleUrls: ['./page-creator-centre.component.scss'],
})
export class PageCreatorCentreComponent implements OnInit {
	@ViewChild('hsRouterOutlet', { static: false }) hsRouterOutlet: ElementRef;

	constructor(
		private translate: TranslateService,
		private commonService: CommonService,
		private configService: ConfigService
	) {}

	routerSubscription: Subscription;
	activeElement: HTMLElement;
	title = 'Creator Centre';
	back = 'BACK';
	backarrow = '< ';
	parentPath = 'smb/creator-centre';
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

	onRouteActivate($event, hsRouterOutlet: HTMLElement) {
		// On route change , change foucs to immediate next below first tabindex on route change response
		this.activeElement = document.activeElement as HTMLElement;
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

	private getMenuItems() {
		this.menuItems = this.configService.getMenuForCreatorCentre();
		this.menuItems.forEach((m) => {
			m.label = this.translate.instant(m.label);
			m.path = m.path.split('/')[m.path.split('/').length - 1];
		});
	}
}
