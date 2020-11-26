import { isUndefined } from 'util';
import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'vtr-ui-number-button',
	templateUrl: './ui-number-button.component.html',
	styleUrls: ['./ui-number-button.component.scss'],
})
export class UiNumberButtonComponent implements OnInit {
	@Input() public numbers;
	@Input() public isNumberpad;
	@Input() public recordingStatus: Boolean;
	@Input() public selectedNumber;
	@Output() public numberSelected = new EventEmitter<any>();
	isShowingPopup: Boolean = false;

	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.maximumInput.title',
		bodyText: 'gaming.macroKey.popupContent.maximumInput.body',
		btnConfirm: false,
	};

	constructor() {}

	ngOnInit() {}

	numberClicked(number) {
		if (this.recordingStatus) {
			return;
		}

		this.isShowingPopup = false;
		if (isUndefined(this.selectedNumber) || this.selectedNumber.key !== number.key) {
			this.numberSelected.emit(number);
			this.selectedNumber = number;
			return;
		}
	}
}
