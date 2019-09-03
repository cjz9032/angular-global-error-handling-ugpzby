import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-chs-statusbar-demo',
	templateUrl: './ui-chs-statusbar.component.html',
	styleUrls: ['./ui-chs-statusbar.component.scss']
})
export class UiChsStatusbarDemoComponent implements OnInit {
	@Input() ecoSystem;
	@Input() common;
	@Input() regular: false;
	isShowMore = true;
	constructor() { }

	ngOnInit() {
	}

}
