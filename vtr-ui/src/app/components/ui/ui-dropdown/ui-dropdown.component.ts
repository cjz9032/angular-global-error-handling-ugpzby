import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { LoggerService } from "src/app/services/logger/logger.service";

@Component({
	selector: "vtr-ui-dropdown",
	templateUrl: "./ui-dropdown.component.html",
	styleUrls: ["./ui-dropdown.component.scss"],
})
export class UiDropDownComponent implements OnInit {
	@Input() dropDownId: string;
	@Input() dropDownName: string;
	@Input() list: any[];
	@Input() value: number;
	@Input() disabled: boolean = false;
	@Input() textCase: string;
	@Input() dropdownType: string = "oled-dimmer";
	@Output() change: EventEmitter<any> = new EventEmitter<any>();
	iconUp = faChevronUp;
	iconDown = faChevronDown;
	isDropDownOpen: boolean = false;
	name: string;
	placeholder: string;
	narratorLabel: string;
	selectedValue: number;
	applyHoverClass: boolean;
	applyFocusClass: boolean;

	constructor(
		private translate: TranslateService,
		private logger: LoggerService
	) {}

	ngOnInit() {
		this.setDropDownValue();
	}

	// refactoring duplicate lines of code for interval
	settingDimmerIntervals(interval) {
		this.selectedValue = this.list.indexOf(interval);
		this.name = interval.name;
		this.placeholder = interval.placeholder;
		this.narratorLabel =
			this.dropDownId.slice(5, this.dropDownId.length - 9) +
			"-" +
			interval.text;
	}

	// refactoring duplicate lines of code for userdefined key
	setUserDefinedKey(key) {
		this.selectedValue = this.list.indexOf(key);
		this.name = this.translate.instant(
			"device.deviceSettings.inputAccessories.userDefinedKey.dropDown.title"
		);
		this.placeholder = this.translate.instant(key.title);
		this.narratorLabel = this.name + "-" + this.placeholder;
	}

	// checks for any previous selected value if any; if no value then calls 'setDropDropValue method
	setDropDownValue() {
		if (this.value != undefined && this.list) {
			const itemValue = this.list.find(
				(item) => item.value === this.value
			);
			if (this.dropdownType === "oled-dimmer") {
				this.settingDimmerIntervals(itemValue);
				return;
			}
			if (this.dropdownType === "userdefined-key") {
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
			case "oled-dimmer":
				this.name = this.translate.instant(
					"device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.select"
				);
				this.placeholder = this.translate.instant(
					"device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.time"
				);
				this.narratorLabel =
					this.dropDownId.slice(5, this.dropDownId.length - 9) +
					"-" +
					this.name +
					"-" +
					this.placeholder;
				break;
			case "userdefined-key":
				this.name = this.translate.instant(
					"device.deviceSettings.inputAccessories.userDefinedKey.dropDown.title"
				);
				this.placeholder = this.translate.instant(
					"device.deviceSettings.inputAccessories.userDefinedKey.dropDown.options.option1"
				);
				this.narratorLabel = this.name + "-" + this.placeholder;
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
			if (this.dropdownType === "oled-dimmer" && value !== undefined) {
				this.settingDimmerIntervals(value);
				this.change.emit(value);
				return;
			}
			if (
				this.dropdownType === "userdefined-key" &&
				value !== undefined
			) {
				this.setUserDefinedKey(value);
				this.change.emit(value);
				return;
			}
		} catch (error) {
			this.logger.error("Error", error);
		}
	}
}
