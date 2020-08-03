import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { TranslateService } from '@ngx-translate/core';
import { DropDownInterval } from 'src/app/data-models/common/drop-down-interval.model';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-ui-dropdown',
	templateUrl: './ui-dropdown.component.html',
	styleUrls: ['./ui-dropdown.component.scss'],
})
export class UiDropDownComponent implements OnInit, OnChanges {
	@Input() dropDownId: string;
	@Input() dropDownName: string;
	@Input() list: DropDownInterval[];
	@Input() value: number;
	@Input() disabled = false;
	@Input() isMetricsEnabled = false;
	@Input() textCase: string;
	@Input() metricsItem: string;
	@Input() metricsParent: string;
	@Input() dropdownType = 'oled-dimmer';
	@Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();
	iconUp = faChevronUp;
	iconDown = faChevronDown;
	isDropDownOpen = false;
	name: string;
	placeholder: string;
	narratorLabel: string;
	selectedValue: number;
	applyHoverClass: boolean;
	applyFocusClass: boolean;

	constructor(
		private translate: TranslateService,
		private logger: LoggerService,
		private metrics: CommonMetricsService
	) { }

	ngOnInit() {
		this.setDropDownValue();
	}
	ngOnChanges(changes: SimpleChanges) {
		if (changes && changes.value && changes.value.previousValue !== changes.value.currentValue) {
			this.setDropDownValue();
		}

	}

	// refactoring duplicate lines of code for interval
	settingDimmerIntervals(interval) {
		this.selectedValue = this.list.indexOf(interval);
		this.name = interval.name;
		this.placeholder = interval.placeholder;
		this.narratorLabel =
			this.dropDownId.slice(5, this.dropDownId.length - 9) +
			'-' +
			interval.text;
	}

	// refactoring duplicate lines of code for userdefined key
	setUserDefinedKey(key: DropDownInterval) {
		this.selectedValue = this.list.indexOf(key);
		this.name = this.translate.instant(
			'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.title'
		);
		this.placeholder = this.translate.instant(key.text);
		this.narratorLabel = this.name + '-' + this.placeholder;
	}

	// checks for any previous selected value if any; if no value then calls 'setDropDropValue method
	setDropDownValue() {
		if (this.value !== undefined && this.list) {
			const itemValue = this.list.find(
				(item) => item.value === this.value
			);
			if (this.dropdownType === 'oled-dimmer') {
				this.settingDimmerIntervals(itemValue);
				return;
			}
			if (this.dropdownType === 'userdefined-key') {
				this.setUserDefinedKey(itemValue);
				return;
			}
		} else {
			this.setDefaultDropValue();
		}
	}

	// sets 'select-time' or 'please-select'
	setDefaultDropValue() {
		switch (this.dropdownType) {
			case 'oled-dimmer':
				this.name = this.translate.instant(
					'device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.select'
				);
				this.placeholder = this.translate.instant(
					'device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.time'
				);
				this.narratorLabel =
					this.dropDownId.slice(5, this.dropDownId.length - 9) +
					'-' +
					this.name +
					'-' +
					this.placeholder;
				break;
			case 'userdefined-key':
				this.name = this.translate.instant(
					'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.title'
				);
				this.placeholder = this.translate.instant(
					'device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option1'
				);
				this.narratorLabel = this.name + '-' + this.placeholder;
				break;
		}
	}

	// toggles dropdown-list when we click on chevron icon
	toggleList(event) {
		event.stopPropagation();
		if (!this.disabled) {
			this.isDropDownOpen = !this.isDropDownOpen;
			this.applyFocusClass = false;
		}
	}

	// Below method is triggered from directive to close the dropdown list and set the change in interval if any.
	closeDropdown(event) {
		try {
			const value = this.list.find((item, idx) => idx === event.value);
			this.isDropDownOpen = event.hideList;

			if (this.isMetricsEnabled) {
				const parent = this.metricsParent || 'vtr-ui-dropdown';
				const itemName = this.metricsItem || `${this.dropDownName}`;
				this.metrics.sendMetrics(value.metricsValue, itemName, parent);
			}

			if (this.dropdownType === 'oled-dimmer' && value !== undefined) {
				this.settingDimmerIntervals(value);
				this.selectionChange.emit(value);
				return;
			}
			if (
				this.dropdownType === 'userdefined-key' &&
				value !== undefined
			) {
				this.setUserDefinedKey(value);
				this.selectionChange.emit(value);
				return;
			}
		} catch (error) {
			this.logger.error('Error', error);
		}
	}
}
