import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DccService } from 'src/app/services/dcc/dcc.service';

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
	@Input() isInnerBack = false;
	@Input() menuItems: any[];
	@Input() shiftLeftUp = false;
	@Input() shiftRightUp = false;
	@Input() hideBack = false;
	@Output() innerBack = new EventEmitter();
	@Input() showDemo: boolean;

	constructor(
		public dccService: DccService
	) { }

	ngOnInit() {
	}

	onInnerBack() {
		this.innerBack.emit();
	}
}
