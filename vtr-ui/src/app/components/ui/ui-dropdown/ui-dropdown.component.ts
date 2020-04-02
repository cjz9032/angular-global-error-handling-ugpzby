import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DropDownInterval } from 'src/app/data-models/common/drop-down-interval.model';

@Component({
	selector: 'vtr-ui-dropdown',
	templateUrl: './ui-dropdown.component.html',
	styleUrls: ['./ui-dropdown.component.scss']
})
export class UiDropDownComponent implements OnInit, OnChanges {
	@Input() dropDownId;
	@Input() dropDownName;
	@Input() list: DropDownInterval[];
	@Input() value: number;
	@Input() disabled = false;
	@Input() textCase: string;
	@Output() change: EventEmitter<any> = new EventEmitter<any>();
	public isDropDownOpen = false;
	public name = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.select');
	public placeholder = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.time');

	constructor(private translate: TranslateService) { }

	ngOnInit() {
		this.setDropDownValue();
	}

	ngOnChanges(changes: SimpleChanges) {
		// only run when property "data" changed
		if (changes['value']) {
			this.setDropDownValue();
		}
	}


	private setDropDownValue() {
		if (this.list) {
			const interval = this.list.find((ddi: DropDownInterval) => {
				return (this.value === ddi.value);
			});
			if (interval) {
				this.value = interval.value;
				this.name = interval.name;
				this.placeholder = interval.placeholder;
			}
		}
	}

	public toggle() {
		if (!this.disabled) {
			this.isDropDownOpen = !this.isDropDownOpen;
		}
	}

	settingCustomAriaLabel() {
		if(this.value) {
			const customAriaLabel = this.list.find((item, i) => i === this.value ? item : '')
			return customAriaLabel ? this.dropDownId + '-' +customAriaLabel.text + '-selected' : this.dropDownId
		} else {
			return this.dropDownId
		}
	}

	public select(event: DropDownInterval, toggle) {
		this.value = event.value;
		this.name = event.name;
		this.placeholder = event.placeholder;
		this.isDropDownOpen = !this.isDropDownOpen;
		this.change.emit(event);
		toggle.focus();
	}

	public customCamelCase(value: string) {

		if (value === null) {
			return '';
		}
		//starts with
		if (value.match(/^\d/)) {
			let firstWord = value.substring(0, value.indexOf(' ') + 1);
			let secondWord = value.substring(value.indexOf(' ') + 1, value.length);
			return firstWord + secondWord.charAt(0).toUpperCase() + secondWord.slice(1);
		} else {
			return value.charAt(0).toUpperCase() + value.slice(1);
		}
	}
}
