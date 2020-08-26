import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-progress-bar',
	templateUrl: './ui-progress-bar.component.html',
	styleUrls: ['./ui-progress-bar.component.scss']
})
export class UiProgressBarComponent implements OnInit {

	@Input() minValue = 0;
	@Input() value = 0;
	@Input() maxValue = 100;
	@Input() progressId = 'progress-bar';
	@Input() noPadding = false;

	constructor() { }

	ngOnInit() {
	}

}
