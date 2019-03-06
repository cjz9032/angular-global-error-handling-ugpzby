import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
	selector: 'vtr-ui-list-support',
	templateUrl: './ui-list-support.component.html',
	styleUrls: ['./ui-list-support.component.scss']
})
export class UiListSupportComponent implements OnInit {

	@Input() items: any[];

	constructor(
		private router: Router,
	) { }

	ngOnInit() {
	}

	listItemClick(item: any) {
			console.log(item.path)
			console.log(item.url)
		if (item.path !== '') {
			this.router.navigate(['/' + item.path]);
		} else if (item.url !== '') {
			window.open(item.url);
		}
	}

}
