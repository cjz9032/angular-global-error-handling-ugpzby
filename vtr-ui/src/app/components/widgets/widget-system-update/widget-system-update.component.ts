import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-widget-system-update',
	templateUrl: './widget-system-update.component.html',
	styleUrls: ['./widget-system-update.component.scss'],
})
export class WidgetSystemUpdateComponent implements OnInit {
	public title: any;
	public subtitle: any;

	constructor(private router: Router, private translate: TranslateService) {}

	ngOnInit(): void {
		this.title = this.translate.instant('systemUpdates.title');
		this.subtitle = this.translate.instant('dashboard.systemUpdate.subtitle');
	}

	gotoAndCheckSystemUpdate() {
		this.router.navigate(['/device/system-updates'], { queryParams: { action: 'start' } });
	}
}
