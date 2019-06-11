import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-chs-statusbar',
	templateUrl: './ui-chs-statusbar.component.html',
	styleUrls: ['./ui-chs-statusbar.component.scss']
})
export class UiChsStatusbarComponent implements OnInit {
	@Input() statusList: Array<any>;
	@Input() regular: false;
	isShowMore = true;
	constructor() { }

	ngOnInit() {
	}

}
