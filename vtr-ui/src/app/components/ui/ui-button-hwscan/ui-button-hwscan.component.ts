import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-button-hwscan',
	templateUrl: './ui-button-hwscan.component.html',
	styleUrls: ['./ui-button-hwscan.component.scss']
})
export class UiButtonHWScanComponent implements OnInit {
	@Input() label: string;
	@Input() isFullWidth: boolean;
	@Input() isHalfWidth: boolean;
	@Input() alreadyJoinGroup = 'unjoined';
	@Input() upperCaseLabel = true;
	@Output() onClick = new EventEmitter<any>();

	@Input() tooltip = true;

	@Input() metricsItem: string;
	@Input() metricsParent: string;
	@Input() metricsValue: any;
	@Input() metricsEvent: string = 'FeatureClick';
	@Input() metricsParam: string;
	@Input() metricsItemPosition: string;
	@Input() metricsPageNumber: any;
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
