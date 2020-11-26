import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'vtr-ui-description-button',
	templateUrl: './ui-description-button.component.html',
	styleUrls: ['./ui-description-button.component.scss'],
})
export class UiDescriptionButtonComponent implements OnInit {
	@Input() btnHeight = false;
	@Input() isDisabled = false;
	@Input() label: string;
	@Input() id: string;
	@Input() tabIndex = 0;

	@Input() vtrMetricEnabled: boolean;
	@Input() metricsItem: string;
	@Input() metricsEvent: string;
	@Input() metricsParent: string;
	@Input() metricsItemID: string;
	@Input() metricsParam: string;
	@Input() metricsItemCategory: string;
	@Input() metricsItemPosition: string;
	@Input() metricsPageNumber: string;

	@Input() upperCaseLabel = true;
	@Output() buttonClick = new EventEmitter<Event>();

	constructor() {}

	ngOnInit(): void {}

	clickButton($event: Event) {
		this.buttonClick.emit($event);
	}
}
