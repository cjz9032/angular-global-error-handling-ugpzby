import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-widget-snapshot',
	templateUrl: './widget-snapshot.component.html',
	styleUrls: ['./widget-snapshot.component.scss'],
})
export class WidgetSnapshotComponent implements OnInit {
	@Input() itemParent: string;

	constructor(private router: Router) {}

	ngOnInit(): void {}

	navigateToSnapshotPage() {
		this.router.navigate(['/snapshot']);
	}
}
