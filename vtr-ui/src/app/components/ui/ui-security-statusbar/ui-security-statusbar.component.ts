import { Component, OnInit, Input, Pipe, PipeTransform, NgModule } from '@angular/core';

@Component({
	selector: 'vtr-ui-security-statusbar',
	templateUrl: './ui-security-statusbar.component.html',
	styleUrls: ['./ui-security-statusbar.component.scss'],
})
export class UiSecurityStatusbarComponent implements OnInit {
	@Input() statusList: Array<any>;
	@Input() regular: false;
	@Input() textId = '';

	constructor() {}

	ngOnInit() {}
}
