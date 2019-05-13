import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-button',
	templateUrl: './ui-button.component.html',
	styleUrls: ['./ui-button.component.scss']
})
export class UiButtonComponent implements OnInit {
	@Input() label: string;
	@Input() isFullWidth: boolean;
	@Input() alreadyJoinGroup = 'unjoined';
	@Input() upperCaseLabel = true;
	@Output() onClick = new EventEmitter<any>();

	@Input() metricsItem: string;
	@Input() metricsParent: string;
	@Input() metricsValue: string;
	@Input() metricsEvent: string = 'FeatureClick';
	@Input() metricsParam: string;
	@Input() metricsItemPosition: string;
	@Input() metricsPageNumber: string;
	@Input() isDisabled = false;
	@Input() isRegular = false;
	@Input() btnHeight = false;
	@Input() isGradient = false;

	constructor() { }

	onClickButton(event) {
		this.onClick.emit(event);
	}

	ngOnInit() {
	}



}
