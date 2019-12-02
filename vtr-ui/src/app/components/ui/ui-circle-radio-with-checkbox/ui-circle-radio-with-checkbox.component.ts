import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-ui-circle-radio-with-checkbox',
	templateUrl: './ui-circle-radio-with-checkbox.component.html',
	styleUrls: ['./ui-circle-radio-with-checkbox.component.scss']
})
export class UiCircleRadioWithCheckboxComponent implements OnInit {

	@Input() radioId: string;
	@Input() group: string;
	@Input() label: string;
	@Input() tooltip: string;
	@Input() value: string;
	@Input() checked: boolean;
	@Input() disabled = false;
	@Input() theme: string;
	@Input() processIcon = false;
	@Input() textId: string;
	@Input() radioGroup: any;
	@Output() change: EventEmitter<any> = new EventEmitter();
	hideIcon: boolean = false;
	// These following instance variables added for Keyboard navigation to radio button.
	keyCode = Object.freeze({
		TAB: 9,
		RETURN: 13,
		SPACE: 32,
		END: 35,
		HOME: 36,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40
	});
	firstRadioButton: any;
	lastRadioButton: any;
	radioButtons: Array<any> = [];
	@ViewChild('radioButton', { static: false }) radioButton: ElementRef<HTMLElement>;
	constructor(private translate: TranslateService) {

	}

	ngOnInit() {
		// this.translate.stream(this.label).subscribe((result: string) => {
		// 	this.label = result;
		// });
	}

	onChange(event) {
		this.change.emit(event);
	}

	getIconName(name: string) {
		if (this.processIcon) {
			if (name) {
				const arr = name.split(' ');
				const index = arr.indexOf('&');
				if (index !== -1) {
					arr.splice(index, 1);
				}
				return arr.join('').toLowerCase();
			} else {
				return '';
			}
		} else {
			return name;
		}
	}

	checkOnFocus(event, radio) {
		this.setRadioButtons();
		if (!radio.checked) {
			radio.click();
		}
	}

	radioKBNavigation(event, radio) {

		this.setRadioButtons();
		console.log(event.keyCode);

		switch (event.keyCode) {
			case this.keyCode.TAB:
				this.checkOnFocus(event, radio);
				break;
			case this.keyCode.SPACE:
			case this.keyCode.RETURN:
				this.setChecked(this.radioButton);
				break;

			case this.keyCode.UP:
				this.setCheckedToPreviousItem(this.radioButton);

				break;

			case this.keyCode.DOWN:
				this.setCheckedToNextItem(this.radioButton);

				break;

			case this.keyCode.LEFT:
				this.setCheckedToPreviousItem(this.radioButton);

				break;

			case this.keyCode.RIGHT:
				this.setCheckedToNextItem(this.radioButton);

				break;

			default:
				break;
		}

	}

	setChecked(currentItem) {

		this.radioButtons.forEach(radioButton => {
			radioButton.setAttribute('aria-checked', 'false');
			radioButton.tabIndex = -1; // the unchecked item should also be tabbable
		});
		/* for (let i = 0; i < this.radioButtons.length; i++) {
			const rb = this.radioButtons[i];
			rb.setAttribute('aria-checked', 'false');
			rb.tabIndex = -1;


		} */
		currentItem.setAttribute('aria-checked', 'true');
		currentItem.tabIndex = 0; // tabitem need not be set to 1 unnecessarly
		currentItem.focus();

	}

	setCheckedToPreviousItem(currentItem) {
		try {
			let index;

			if (currentItem.nativeElement === this.firstRadioButton) {
				this.setChecked(this.lastRadioButton);
			} else {
				index = this.radioButtons.indexOf(currentItem.nativeElement);
				this.setChecked(this.radioButtons[index - 1]);
			}
		} catch (error) {
			console.log('setCheckedToPreviousItem :: ' + error);
		}
	}


	setCheckedToNextItem(currentItem) {
		try {
			let index;

			if (currentItem.nativeElement === this.lastRadioButton) {
				this.setChecked(this.firstRadioButton);
			} else {
				index = this.radioButtons.indexOf(currentItem.nativeElement);
				this.setChecked(this.radioButtons[index + 1]);
			}

		} catch (error) {
			console.log('setCheckedToNextItem :: ' + error);
		}

	}

	private setRadioButtons() {
		try {
			if (!this.radioGroup) {
				this.radioGroup = this.radioButton.nativeElement.parentElement.parentElement;
			}
			const rbs = this.radioGroup.querySelectorAll('[role=radio]');

			if (this.radioButtons.length !== rbs.length) {

				rbs.forEach(radioButton => {
					this.radioButtons.push(radioButton);
					if (!this.firstRadioButton) {
						this.firstRadioButton = radioButton;
					}
					this.lastRadioButton = radioButton;
				});
				/* for (let i = 0; i < rbs.length; i++) {

					this.radioButtons.push(rbs[i]);
					if (!this.firstRadioButton) {
						this.firstRadioButton = rbs[i];
					}
					this.lastRadioButton = rbs[i];
				} */
			}
			if (!this.firstRadioButton) {
				this.firstRadioButton.nativeElement.tabIndex = 0;
			}

		} catch (error) {
			console.log('setRadioButtons :: ' + error);
		}


	}

}
