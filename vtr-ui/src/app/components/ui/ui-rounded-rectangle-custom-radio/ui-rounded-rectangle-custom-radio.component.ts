import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * this radio group implementation is based on W3C KB navigation example
 * https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/radio/radio.html
 */
@Component({
	selector: 'vtr-ui-rounded-rectangle-custom-radio',
	templateUrl: './ui-rounded-rectangle-custom-radio.component.html',
	styleUrls: ['./ui-rounded-rectangle-custom-radio.component.scss']
})
export class UiRoundedRectangleCustomRadioComponent implements OnInit {
	@Input() componentId: string;
	@Input() tooltip: string;
	@Input() isChecked = false;
	@Input() isDisabled = false;
	@Input() label: string;
	@Input() value: any;
	@Input() metricsEvent = 'ItemClick';

	@Output() selectionChange = new EventEmitter<any>();

	constructor() { }

	ngOnInit() { }

	onClick() {
		this.selectionChange.emit({
			value: this.value,
			componentId: this.componentId,
			isChecked: this.isChecked
		});
	}
}
