import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-close-button',
	templateUrl: './ui-close-button.component.html',
	styleUrls: ['./ui-close-button.component.scss']
})
export class UiCloseButtonComponent implements OnInit {

	@Input() linkId = '';
	@Input() metricsItem = '';
	@Input() metricsEvent = 'FeatureClick';
	@Input() metricsParent = '';
	@Input() tabIndex = 0;

	@Output() clickClose = new EventEmitter<any>();

	constructor() { }

	ngOnInit(): void {
	}

	clickCloseButton($event) {
		this.clickClose.emit($event)
	}

	pressCloseButton($event) {
		$event.target.click();
	}

}
