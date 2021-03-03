import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
	selector: 'vtr-page-creator-centre',
	templateUrl: './page-creator-centre.component.html',
	styleUrls: ['./page-creator-centre.component.scss'],
})
export class PageCreatorCentreComponent implements OnInit, OnDestroy {
	@ViewChild('hsRouterOutlet', { static: false }) hsRouterOutlet: ElementRef;

	constructor(private translate: TranslateService, private configService: ConfigService) {}

	routerSubscription: Subscription;
	activeElement: HTMLElement;
	title = 'Creator Centre';
	back = 'BACK';
	backarrow = '< ';
	parentPath = 'smb/creator-centre';
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
		this.menuItems = this.configService.getMenuForCreatorCentre();
		this.menuItems.forEach((m) => {
			m.label = this.translate.instant(m.label);
			m.path = m.path.split('/')[m.path.split('/').length - 1];
		});
	}
}
