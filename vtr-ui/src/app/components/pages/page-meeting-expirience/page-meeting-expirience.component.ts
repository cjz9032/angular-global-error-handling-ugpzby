import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'vtr-page-meeting-expirience',
  templateUrl: './page-meeting-expirience.component.html',
  styleUrls: ['./page-meeting-expirience.component.scss']
})
export class PageMeetingExpirienceComponent implements OnInit {

  @ViewChild('hsRouterOutlet', { static: false }) hsRouterOutlet: ElementRef;

  constructor(private translate: TranslateService
    ) {this.menuItems.forEach((m) => {
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
  menuItems = [
		{
			id: 'meeting-expirience',
			label: 'smb.meetingExperience.meetingManager.title',
			path: 'meeting-manager',
			subitems: [],
			active: true,
		},
	];

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
			// focus same active link element after route change , content loaded.
			/* if ((evt instanceof NavigationEnd)) {
				if (this.activeElement) {
					this.activeElement.focus();
				}
			} */
		});
  }

  onRouteActivate($event, hsRouterOutlet: HTMLElement) {
		// On route change , change foucs to immediate next below first tabindex on route change response
		this.activeElement = document.activeElement as HTMLElement;
	}

}
