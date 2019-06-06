import { isUndefined } from 'util';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'vtr-ui-number-button',
	templateUrl: './ui-number-button.component.html',
	styleUrls: [ './ui-number-button.component.scss' ]
})
export class UiNumberButtonComponent implements OnInit {
	@Input() public numbers;
	@Input() public isNumberpad;
	@Input() public recordingStatus: Boolean;
	@Output() public numberSelected = new EventEmitter<any>();
	choosenKey: any;
	isShowingPopup: Boolean = false;
	public showModal: boolean = false;
	clickCount: number = 0;
	// Initialize modal content
	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.maximumInput.title',
		bodyText: 'gaming.macroKey.popupContent.maximumInput.body',
		btnConfirm: false
		};
	constructor() {}

	ngOnInit() {
		this.numbers.forEach((number) => {
			if (number.isSelected) {
				this.choosenKey = number;
				this.numberSelected.emit(number);
			}
		});
	}

	numberClicked(number) {
		// Show modal if input is clicked 20 times
		if (this.clickCount === 20) {
			this.showModal = !this.showModal;
		}
		this.clickCount++;
		this.isShowingPopup = !this.isShowingPopup;

		if (this.recordingStatus) {
			alert('Stop recording to change');
			return;
		}

		if (isUndefined(this.choosenKey) || this.choosenKey.value !== number.value) {
			this.numbers.forEach((numberObj) => {
				if (numberObj.title === number.title) {
					numberObj.isSelected = true;
				} else {
					numberObj.isSelected = false;
				}
			});
			this.numberSelected.emit(number);
			this.choosenKey = number;
			return;
		}
	}
}
