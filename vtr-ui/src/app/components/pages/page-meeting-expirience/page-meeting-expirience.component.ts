import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config/config.service';
@Component({
	selector: 'vtr-page-meeting-expirience',
	templateUrl: './page-meeting-expirience.component.html',
	styleUrls: ['./page-meeting-expirience.component.scss'],
})
export class PageMeetingExpirienceComponent implements OnInit, OnDestroy {
	@ViewChild('hsRouterOutlet', { static: false }) hsRouterOutlet: ElementRef;

	constructor(private translate: TranslateService, private configService: ConfigService) {}

	routerSubscription: Subscription;
	activeElement: HTMLElement;
	title = 'Meeting Expirience';
	back = 'BACK';
	backarrow = '< ';
	parentPath = 'smb/meeting-experience';
	private router: Router;
	menuItems = [];

	ngOnInit(): void {
		this.getMenuItems();
		this.routerSubscription = this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
		});
	}

	ngOnDestroy(): void {
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
}
