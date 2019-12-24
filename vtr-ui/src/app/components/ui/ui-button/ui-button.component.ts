import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WinRT } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-ui-button',
	templateUrl: './ui-button.component.html',
	styleUrls: ['./ui-button.component.scss']
})
export class UiButtonComponent implements OnInit {
	@Input() label: string;
	@Input() isFullWidth: boolean;
	@Input() isHalfWidth: boolean;
	@Input() alreadyJoinGroup = 'unjoined';
	@Input() upperCaseLabel = true;
	@Input() capitalizeLabel = false;
	@Output() onClick = new EventEmitter<any>();

	@Input() tooltip = true;

	@Input() metricsItem: string;
	@Input() metricsParent: string;
	@Input() metricsValue: string;
	@Input() metricsEvent = 'FeatureClick';
	@Input() metricsParam: string;
	@Input() metricsItemPosition: string;
	@Input() metricsPageNumber: string;
	@Input() metricsItemID: string;
	@Input() metricsItemCategory: string;
	@Input() isDisabled = false;
	@Input() isRegular = false;
	@Input() btnHeight = false;
	@Input() isGradient = false;
	@Input() buttonColor: string;
	@Input() title: string;
	@Input() linkId: any;
	@Input() routerPath: string;
	@Input() href: string;
	@Input() inRedBackground = false;
	@Input() tabIndex = 0; // please use this one if you need special tabindex.
	@Input() isLoading = false;

	constructor() { }

	onClickButton(event) {
		window.getSelection().empty();
		if (this.href) {
			WinRT.launchUri(this.href);
			return;
		}
		this.onClick.emit(event);
	}

	getButtonColor(buttonColor) {
		if (!buttonColor) { return; }
		return `btn-${buttonColor}`;
	}

	ngOnInit() {
	}
}
