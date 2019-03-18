import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-button',
	templateUrl: './ui-button.component.html',
	styleUrls: ['./ui-button.component.scss']
})
export class UiButtonComponent implements OnInit {
	@Input() label: string;
	@Input() isFullWidth: boolean;
	@Output() onClick = new EventEmitter<any>();

	@Input() metricsItem:string;
	@Input() metricsParent:string;
	@Input() metricsValue:string;
	@Input() metricsEvent:string;
	@Input() metricsParam:string;

	constructor() { }

	onClickButton(event) {
		this.onClick.emit(event);
	}

	ngOnInit() {
	}



}
