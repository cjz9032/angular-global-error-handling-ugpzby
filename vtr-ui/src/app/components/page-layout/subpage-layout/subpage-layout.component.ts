import { Output, Input, OnInit, Component, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-subpage-layout',
	templateUrl: './subpage-layout.component.html',
	styleUrls: ['./subpage-layout.component.scss']
})
export class SubPageLayoutComponent implements OnInit {

	@Input() pageCssClass: string;

	constructor() { }

	ngOnInit() { }
}
