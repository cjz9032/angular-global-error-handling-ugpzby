import { ElementRef, Input, ViewChild, AfterViewInit, OnInit, OnChanges } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { KeyCode } from 'src/app/enums/key-code.enum';

export class UICustomRadio implements OnInit, AfterViewInit, OnChanges {
	static readonly UN_DEFINED = undefined;
	static readonly TAB_INDEX = 'tabIndex';
	static readonly ARIA_CHECKED = 'aria-checked';
	// static readonly ARIA_DISABLED = 'aria-disabled';
	static readonly NATIVE_ELEMENT = 'nativeElement';

	constructor(private logger: LoggerService, public metrics: MetricService) { }
	// once radio button is visible then execute logic
	@ViewChild('radioButton', { static: false }) set content(element: ElementRef) {
		if (element) {
			this.radioButton = element;
			this.setRadioButtons();
		}
	}
	@Input() group: string;
	@Input() label: string;
	@Input() value: string;
	@Input() checked = false;
	@Input() radioGroup: any;
	@Input() automationid;
	@Input() metricsParent = 'Device.MyDeviceSettings';
	firstRadioButton: any;
	lastRadioButton: any;
	radioButtons: Array<any> = [];
	selectedRadioButton: any;
	noRadioButtonSelected = false;
	private radioButton: ElementRef<HTMLElement>;
	radioLabel = 'radio.';


	onChange(event) { }

	ngOnInit() {
		this.setRadioButtons(); // Set up radio buttons first , last etc and if none selected,set tabindex to first element
	}

	ngAfterViewInit(): void {
		this.setRadioButtons(); // Set up radio buttons first , last etc and if none selected,set tabindex to first element
	}

	ngOnChanges(changes: any) {
		// if (changes && changes.checked && !changes.checked.firstChange) {
		// 	const elementDiv = document.getElementById('div' + this.radioId);
		// 	if (elementDiv) {
		// 		if (!this.checked) {
		// 			elementDiv.setAttribute(UICustomRadio., 'false');
		// 			elementDiv.tabIndex = -1;
		// 		} else {
		// 			elementDiv.setAttribute(UICustomRadio., 'true');
		// 			elementDiv.tabIndex = 0;
		// 			elementDiv.focus();
		// 		}
		// 	}
		// }
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
			case KeyCode.SPACE:
			case KeyCode.RETURN:
				this.changeRadioOnKeyPress($event, radio);
				// this.setChecked(this.radioButton.nativeElement, true);
				$event.stopPropagation();
				$event.preventDefault();
				break;
			case KeyCode.UP:
				this.setCheckedToPreviousItem(this.radioButton);
				$event.preventDefault();
				break;
			case KeyCode.DOWN:
				this.setCheckedToNextItem(this.radioButton);
				$event.preventDefault();
				break;
			case KeyCode.LEFT:
				this.setCheckedToPreviousItem(this.radioButton);
				break;
			case KeyCode.RIGHT:
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
				radioButton.removeAttribute(UICustomRadio.ARIA_CHECKED);
				radioButton.setAttribute(UICustomRadio.ARIA_CHECKED, 'false');
			});
			currentRadioButton.removeAttribute(UICustomRadio.ARIA_CHECKED);
			currentRadioButton.setAttribute(UICustomRadio.ARIA_CHECKED, 'true');
		} catch (error) {
			this.logger.exception('setRadioAriaChecked error occurred ::', error);
		}
	}
	private setRadioTabIndex(currentRadioButton) {
		try {

			this.radioButtons.forEach(radioButton => {
				radioButton.tabIndex = -1; // the unchecked item should also be tabbable
			});
			// currentRadioButton[this.TABINDEX] !== UICustomRadio.UN_DEFINED && currentRadioButton.tabIndex !== 0
			if (currentRadioButton !== UICustomRadio.UN_DEFINED) {
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

	protected setRadioButtons() {
		try {
			const rbs = this.getRadioGroup();
			this.radioButtons = [];
			if (rbs !== UICustomRadio.UN_DEFINED && rbs && rbs.length > 0) {
				rbs.forEach(radioButton => {
					this.radioButtons.push(radioButton);
					if (this.firstRadioButton === UICustomRadio.UN_DEFINED || !this.firstRadioButton) {
						this.firstRadioButton = radioButton;
					}
					this.lastRadioButton = radioButton;

					if (radioButton.getAttribute(UICustomRadio.ARIA_CHECKED) === 'true') {
						this.selectedRadioButton = radioButton;
						this.noRadioButtonSelected = false;
					}
				});
				// focus on first non disabled element if not selected any radio items
				// || this.firstRadioButton.tabIndex !== 0
				if (this.noRadioButtonSelected && this.firstRadioButton !== UICustomRadio.UN_DEFINED) {
					this.setRadioTabIndex(this.getNativeElement(this.firstRadioButton));
				}
				// || this.selectedRadioButton.tabIndex !== 0
				else if (!this.noRadioButtonSelected && this.selectedRadioButton !== UICustomRadio.UN_DEFINED) {
					this.setRadioTabIndex(this.getNativeElement(this.selectedRadioButton));
				}
			}

		} catch (error) {
			this.logger.exception('setRadioButtons error occurred ::', error);
		}
	}

	private getRadioGroup() {

		try {
			// commented to remove the dependency from radiogroup role of parent this component

			this.radioGroup = this.getParentRadioGroup(this.getNativeElement(this.radioButton), 10);
			if (this.radioGroup !== UICustomRadio.UN_DEFINED) {
				// search by radio class and aria-disabled
				const query = `[class*=${this.group}][aria-disabled=false]`;
				// search by only role and aria-disabled
				// const query = '[role=radio][aria-disabled=false]';
				return this.radioGroup.querySelectorAll(query);
				// return Array.from(this.radioGroup.querySelectorAll(query));
			}

		} catch (error) {
			this.logger.exception('UICustomRadio.getRadioGroup exception', error);
		}

	}

	private getNativeElement(element) {
		try {
			if (element !== UICustomRadio.UN_DEFINED) {
				element = element && element[UICustomRadio.NATIVE_ELEMENT] ? element.nativeElement : element;
			}
			return element;
		}
		catch (error) {
			this.logger.exception('UICustomRadio.getElement exception', error);
		}
	}


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
