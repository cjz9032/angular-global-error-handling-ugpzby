import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-widget-system-update',
	templateUrl: './widget-system-update.component.html',
	styleUrls: ['./widget-system-update.component.scss']
})
export class WidgetSystemUpdateComponent implements OnInit {

	constructor(
		private router: Router,
	) { }

	ngOnInit(): void {
	}

	gotoAndCheckSystemUpdate() {
		this.router.navigate(['/device/system-updates'], { queryParams: { action: 'start' } });
	}

}
