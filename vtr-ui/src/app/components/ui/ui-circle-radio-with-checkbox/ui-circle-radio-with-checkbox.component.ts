import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from 'src/app/services/logger/logger.service';

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
	@Input() customIcon = '';
	@Input() hideIcon = false;
	@Input() processLabel = true;
	@Output() optionChange: EventEmitter<any> = new EventEmitter();
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
	selectedRadioButton: any;
	noRadioButtonSelected: boolean;
	constructor(private translate: TranslateService, private logger: LoggerService) {

	}

	ngOnInit() {
		// this.translate.stream(this.label).subscribe((result: string) => {
		// 	this.label = result;
		// });
		this.setRadioButtons(); // Set up radio buttons first , last etc and if none selected,set tabindex to first element
	}

	onChange(event) {
		this.optionChange.emit(event);
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

	/* checkOnFocus(event, radio) {
		 this.setRadioButtons();
		if (!radio.checked) {
			radio.click();
		}
	} */

	radioKBNavigation(event, radio) {
		this.setRadioButtons();
		switch (event.keyCode) {
			case this.keyCode.TAB:
				// this.checkOnFocus(event, radio);
				break;
			case this.keyCode.SPACE:
			case this.keyCode.RETURN:
				this.setChecked(this.radioButton, true);
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

	setChecked(currentItem, selectItem: boolean) {
		let currentRadio = [];
		try {
			currentRadio = currentItem.querySelectorAll('input[type="radio"]');
		} catch (error) {
			currentRadio = currentItem.nativeElement.querySelectorAll('input[type="radio"]');
		}

		if (selectItem && currentRadio && !currentRadio[0].checked && !currentRadio[0].disabled) {
			currentRadio[0].click();
			this.radioButtons.forEach(radioButton => {
				radioButton.setAttribute('aria-checked', 'false');
			});
			currentItem.setAttribute('aria-checked', 'true');
			this.setRadioTabIndex(currentItem);
		}

		currentItem.focus();
	}

	private setRadioTabIndex(currentItem) {
		this.radioButtons.forEach(radioButton => {
			radioButton.tabIndex = -1; // the unchecked item should also be tabbable
		});
		currentItem.tabIndex = 0; // tabitem need not be set to 1 unnecessarly
	}

	setCheckedToPreviousItem(currentItem) {
		try {
			let index;

			if (currentItem.nativeElement === this.firstRadioButton) {
				this.setChecked(this.lastRadioButton, true);
			} else {
				index = this.radioButtons.indexOf(currentItem.nativeElement);
				this.setChecked(this.radioButtons[index - 1], true);
			}
		} catch (error) {
			this.logger.exception('setRadioButtons error occurred ::', error);
		}
	}


	setCheckedToNextItem(currentItem) {
		try {
			let index;

			if (currentItem.nativeElement === this.lastRadioButton) {
				this.setChecked(this.firstRadioButton, true);
			} else {
				index = this.radioButtons.indexOf(currentItem.nativeElement);
				this.setChecked(this.radioButtons[index + 1], true);
			}

		} catch (error) {
			this.logger.exception('setRadioButtons error occurred ::', error);
		}

	}

	private setRadioButtons() {
		try {
			if (!this.radioGroup) {
				this.radioGroup = this.radioButton.nativeElement.parentElement.parentElement;
			}
			const rbs = this.radioGroup.querySelectorAll('[role=radio]');

			this.radioButtons = [];
			rbs.forEach(radioButton => {
				this.radioButtons.push(radioButton);
				if (!this.firstRadioButton) {
					this.firstRadioButton = radioButton;
				}
				this.lastRadioButton = radioButton;

				if (radioButton.getAttribute('aria-checked') === 'true') {
					this.selectedRadioButton = radioButton;
					this.noRadioButtonSelected = false;
				}
			});

			if (this.firstRadioButton && this.noRadioButtonSelected) {
				this.firstRadioButton.focus();
				// this.setRadioTabIndex(this.firstRadioButton);
			}
		} catch (error) {
			this.logger.exception('setRadioButtons error occurred ::', error);
		}
	}
}
