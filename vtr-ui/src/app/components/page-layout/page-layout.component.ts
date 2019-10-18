import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-page-layout',
	templateUrl: './page-layout.component.html',
	styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {

	@Input() title: string;
	@Input() textId: string;
	@Input() pageCssClass: string;
	@Input() parentPath: string;
	@Input() back: string;
	@Input() backId: string;
	@Input() menuItems: any[];
	@Input() shiftLeftUp: boolean = false;
	@Input() shiftRightUp: boolean = false;

	constructor() { }

	ngOnInit() {
	}

}
