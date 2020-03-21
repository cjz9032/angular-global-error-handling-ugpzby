import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { AppEvent } from './../../../enums/app-event.enum';
import { MetricService } from 'src/app/services/metric/metric.service';

@Component({
	selector: 'vtr-ui-rounded-rectangle-radio',
	templateUrl: './ui-rounded-rectangle-radio.component.html',
	styleUrls: ['./ui-rounded-rectangle-radio.component.scss']
})
export class UiRoundedRectangleRadioComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() radioId: string;
	@Input() group: string;
	@Input() label: string;
	@Input() tooltip: string;
	@Input() value: string;
	@Input() checked = false;
	@Input() disabled = false;
	@Input() name: string;
	@Input() isLarge = false;
	@Output() change: EventEmitter<any> = new EventEmitter();
	@Output() customKeyEvent = new EventEmitter();
	hideIcon = false;
	@Input() radioGroup: any;
	@Input() metricsParent = 'Device.MyDeviceSettings';
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
	selectedRadioButton: any;
	noRadioButtonSelected = true;
	private radioButton: ElementRef<HTMLElement>;
	radioLabel = 'radio.';
	// once radio button is visible then execute logic
	@ViewChild('radioButton', { static: false }) set content(element: ElementRef) {
		if (element) {
			this.radioButton = element;
			this.setRadioButtons();
		}
	}

	constructor(private logger: LoggerService, public metrics: MetricService) {
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {
		this.setRadioButtons(); // Set up radio buttons first , last etc and if none selected,set tabindex to first element
	}

	ngOnChanges(changes) {
		if (changes && changes.checked && !changes.checked.firstChange) {
			const elem = document.getElementById('div' + this.radioId);
			if (elem) {
				if (!this.checked) {
					elem.setAttribute('aria-checked', 'false');
					elem.tabIndex = -1;
				} else {
					elem.setAttribute('aria-checked', 'true');
					elem.tabIndex = 0;
					elem.focus();
				}
			}
		}
	}
	onChange(event) {
		this.change.emit(event);
	}
	onkeyPress($event) {
		const { keyCode } = $event;
		if (keyCode === this.keyCode.LEFT) {
			this.customKeyEvent.emit({ customeEvent: AppEvent.LEFT });
		} else if (keyCode === this.keyCode.RIGHT) {
			this.customKeyEvent.emit({ customeEvent: AppEvent.RIGHT });
		}
	}
	changeRadioOnKeyPress($event, radio: HTMLInputElement) {

		if (!this.checked) { // on only radio change
			// this.checked = !this.checked;
			radio.value = this.value;
			// radio.checked = this.checked;
			const $customEvent = { type: 'change', target: radio };
			this.onChange($customEvent);
			const metricsData = {
				itemParent: this.metricsParent,
				ItemType: 'FeatureClick',
				itemName: this.radioLabel + this.label,
				value: !this.checked
			};
			this.metrics.sendMetrics(metricsData);
		}
	}


	navigateByKeys($event, radio) {
		this.setRadioButtons();
		switch ($event.keyCode) {
			case this.keyCode.SPACE:
			case this.keyCode.RETURN:
				this.changeRadioOnKeyPress($event, radio);
				//this.setChecked(this.radioButton.nativeElement, true);
				break;
			case this.keyCode.UP:
				this.setCheckedToPreviousItem(this.radioButton);
				$event.preventDefault();
				break;
			case this.keyCode.DOWN:
				this.setCheckedToNextItem(this.radioButton);
				$event.preventDefault();
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

	private setChecked(currentRadioButton: HTMLElement, selectItem: boolean) {
		let currentRadio: any;
		currentRadio = currentRadioButton.querySelectorAll('input[type="radio"]');
		try {
			if (selectItem && currentRadio && !currentRadio[0].checked && !currentRadio[0].disabled) {
				try {
					this.setRadioAriaChecked(currentRadio[0]);
					currentRadio[0].click();
				}
				catch (error) {
					this.logger.exception('setChecked error occurred while selecting the current element ::', error);
				}
			}
			else {
				try {
					if (!selectItem) {
						// this.setRadioTabIndex(currentRadioButton);
						currentRadioButton.focus();
					}

				}
				catch (error) {
					this.logger.exception('setChecked error occurred while focusing currentRadioButton only::', error);
				}
			}
		}
		catch (error) {
			this.logger.exception('setChecked error occurred ::', error);
		}

	}

	private setRadioAriaChecked(currentRadioButton) {
		try {
			this.radioButtons.forEach(radioButton => {
				radioButton.removeAttribute('aria-checked');
				radioButton.setAttribute('aria-checked', 'false');
			});
			currentRadioButton.removeAttribute('aria-checked');
			currentRadioButton.setAttribute('aria-checked', 'true');
		} catch (error) {
			this.logger.exception('setRadioAriaChecked error occurred ::', error);
		}
	}
	private setRadioTabIndex(currentRadioButton) {
		try {

			this.radioButtons.forEach(radioButton => {
				radioButton.tabIndex = -1; // the unchecked item should also be tabbable
			});
			if (currentRadioButton !== undefined && currentRadioButton.tabIndex && currentRadioButton.tabIndex !== 0) {
				currentRadioButton.tabIndex = 0; // tabitem need not be set to 1 unnecessarly
			}

		}
		catch (error) {
			this.logger.exception('setRadioTabIndex error occurred ::', error);
		}
	}

	private setCheckedToPreviousItem(currentItem) {
		try {
			let index;

			if (currentItem.nativeElement === this.firstRadioButton) {
				this.setChecked(this.lastRadioButton, false);
			} else {
				index = this.radioButtons.indexOf(currentItem.nativeElement);
				this.setChecked(this.radioButtons[index - 1], false);
			}
		} catch (error) {
			this.logger.exception('setCheckedToPreviousItem error occurred ::', error);
		}
	}


	private setCheckedToNextItem(currentItem) {
		try {
			let index;

			if (currentItem.nativeElement === this.lastRadioButton) {
				this.setChecked(this.firstRadioButton, false);
			} else {
				index = this.radioButtons.indexOf(currentItem.nativeElement);
				this.setChecked(this.radioButtons[index + 1], false);
			}

		} catch (error) {
			this.logger.exception('setRadioButtons error occurred ::', error);
		}

	}

	private setRadioButtons() {
		try {
			const rbs = this.getRadioGroup();

			this.radioButtons = [];
			rbs.forEach(radioButton => {
				this.radioButtons.push(radioButton);
				if (this.firstRadioButton === undefined || !this.firstRadioButton) {
					this.firstRadioButton = radioButton;
				}
				this.lastRadioButton = radioButton;

				if (radioButton.getAttribute('aria-checked') === 'true') {
					this.selectedRadioButton = radioButton;
					this.noRadioButtonSelected = false;
				}
			});

			//focus on first non disabled element if not selected any radio items
			if (this.noRadioButtonSelected && this.firstRadioButton !== undefined
				&& (this.firstRadioButton.tabIndex || this.firstRadioButton.tabIndex !== 0)
			) {
				this.setRadioTabIndex(this.firstRadioButton.nativeElement);
			}
			else if (!this.noRadioButtonSelected && this.selectedRadioButton !== undefined
				&& (this.selectedRadioButton.tabIndex || this.selectedRadioButton.tabIndex !== 0)) {
				this.setRadioTabIndex(this.selectedRadioButton.nativeElement);
			}
		} catch (error) {
			this.logger.exception('setRadioButtons error occurred ::', error);
		}
	}

	private getRadioGroup() {

		// commented to remove the dependency from radiogroup role of parent this component
		if (!this.radioGroup) {
			this.radioGroup = this.getParentRadioGroup(this.radioButton.nativeElement, 10);
		}

		// search by radio class and aria-disabled
		const query = `[class*=${this.group}][aria-disabled=false]`;
		// search by only role and aria-disabled
		// const query = '[role=radio][aria-disabled=false]';
		return this.radioGroup.querySelectorAll(query);
		// return Array.from(this.radioGroup.querySelectorAll(query));

	}

	/* private setRadioFocus(radioButton) {
		this.radioButtons.forEach(element => {
			if (element !== radioButton) {
				element.tabIndex = -1;
			}
			if (element === radioButton) {
				element.tabIndex = 0;
			}
		});
	} */


	private getParentRadioGroup(element, topUpLevel: number) {
		try {
			const roleRadioGroup = 'radiogroup';
			const role = 'role';

			if (element && element.getAttribute(role) === roleRadioGroup) {
				return element;
			}
			else if (element && element.parentElement
				&& element.getAttribute(role) !== roleRadioGroup && topUpLevel > 0) {
				return this.getParentRadioGroup(element.parentElement, --topUpLevel);
			}
			else {
				return element;
			}
		}
		catch (error) {
			this.logger.exception('getParentRadioGroup error occurred ::', error);

		}
	}
}
