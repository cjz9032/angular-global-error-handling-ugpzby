import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-progress-bar',
	templateUrl: './ui-progress-bar.component.html',
	styleUrls: ['./ui-progress-bar.component.scss']
})
export class UiProgressBarComponent implements OnInit {

	@Input() value = 0;
	@Input() noPadding = false;

	constructor() { }

	ngOnInit() {
	}

}
