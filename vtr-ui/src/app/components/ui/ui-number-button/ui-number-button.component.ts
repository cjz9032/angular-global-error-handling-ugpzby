import { isUndefined } from 'util';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'vtr-ui-number-button',
	templateUrl: './ui-number-button.component.html',
	styleUrls: [ './ui-number-button.component.scss' ]
})
export class UiNumberButtonComponent implements OnInit {
	@Input() public numbers;
	@Input() public recordingStatus: Boolean;
	@Output() public numberSelected = new EventEmitter<any>();
	choosenKey: any;

	constructor() {}

	ngOnInit() {}

	numberClicked(number) {
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

		if (this.choosenKey.value === number.value) {
			this.numbers.forEach((numberObj) => {
				numberObj.isSelected = false;
			});
			this.numberSelected.emit(undefined);
			this.choosenKey = undefined;
			return;
		}
	}
}
