import { ElementRef, Input, ViewChild, AfterViewInit, OnInit, OnChanges } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { KeyCode } from 'src/app/enums/key-code.enum';

export class UICustomRadio implements OnInit, AfterViewInit, OnChanges {
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
	noRadioButtonSelected: boolean;
	private radioButton: ElementRef<HTMLElement>;
	radioLabel = 'radio.';
	UNDEFINED = undefined;
	constructor(private logger: LoggerService,
		public metrics: MetricService) { }

	onChange(event) { }
	// once radio button is visible then execute logic
	@ViewChild('radioButton', { static: false }) set content(element: ElementRef) {
		if (element) {
			this.radioButton = element;
			this.setRadioButtons();
		}
	}

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
		// 			elementDiv.setAttribute('aria-checked', 'false');
		// 			elementDiv.tabIndex = -1;
		// 		} else {
		// 			elementDiv.setAttribute('aria-checked', 'true');
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
				//this.setChecked(this.radioButton.nativeElement, true);
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

	protected setRadioButtons() {
		try {
			const rbs = this.getRadioGroup();
			this.radioButtons = [];
			if (rbs !== this.UNDEFINED && rbs && rbs.length > 0) {
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
				// focus on first non disabled element if not selected any radio items
				if (this.noRadioButtonSelected && this.firstRadioButton !== undefined
					&& (this.firstRadioButton.tabIndex || this.firstRadioButton.tabIndex !== 0)
				) {
					this.setRadioTabIndex(this.firstRadioButton.nativeElement);
				}
				else if (!this.noRadioButtonSelected && this.selectedRadioButton !== undefined
					&& (this.selectedRadioButton.tabIndex || this.selectedRadioButton.tabIndex !== 0)) {
					this.setRadioTabIndex(this.selectedRadioButton.nativeElement);
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
			if (this.radioGroup !== this.UNDEFINED) {
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
			if (element !== this.UNDEFINED) {
				element = element && element['nativeElement'] ? element.nativeElement : element;
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
