import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'beta-vtr-ui-button',
	templateUrl: './ui-button.component.html',
	styleUrls: ['./ui-button.component.scss']
})
export class UiButtonComponent implements OnInit {
	@Input() label: string;
	@Input() isFullWidth: boolean;
	@Input() isHalfWidth: boolean;
	@Input() alreadyJoinGroup = 'unjoined';
	@Input() upperCaseLabel = true;
	@Output() onClick = new EventEmitter<any>();

	@Input() tooltip = true;

	@Input() metricsItem: string;
	@Input() metricsParent: string;
	@Input() metricsValue: string;
	@Input() metricsEvent: string = 'FeatureClick';
	@Input() metricsParam: string;
	@Input() metricsItemPosition: string;
	@Input() metricsPageNumber: string;
	@Input() metricsItemID: string;
	@Input() metricsItemCategory: string;
	@Input() isDisabled = false;
	@Input() isRegular = false;
	@Input() btnHeight = false;
	@Input() isGradient = false;
	@Input() title: string;
	@Input() linkId:any;
	@Input() routerPath: string;
	@Input() tooltipText: string;

	constructor() { }

	onClickButton(event) {
		event.target.blur();
		this.onClick.emit(event);
	}

	ngOnInit() {
	}
}
