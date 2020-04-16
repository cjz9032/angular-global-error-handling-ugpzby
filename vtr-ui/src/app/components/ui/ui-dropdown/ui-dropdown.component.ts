import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DropDownInterval } from 'src/app/data-models/common/drop-down-interval.model';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-ui-dropdown',
	templateUrl: './ui-dropdown.component.html',
	styleUrls: ['./ui-dropdown.component.scss']
})
export class UiDropDownComponent implements OnInit {
	@Input() dropDownId: string;
	@Input() dropDownName: string;
	@Input() list: DropDownInterval[];
	@Input() value: number;
	@Input() disabled: boolean = false;
	@Input() textCase: string;
	@Output() change: EventEmitter<DropDownInterval> = new EventEmitter<DropDownInterval>();
	isDropDownOpen: boolean = false;
	name: string;
	placeholder: string;
	narratorLabel: string;
	selectedDuration: number;

	constructor(private translate: TranslateService, private logger: LoggerService) { }

	ngOnInit() {
		this.setDropDownValue();
	}

	// ngOnChanges(changes: SimpleChanges) {
	// 	// only run when property "data" changed
	// 	if (changes['value']) {
	// 		this.setDropDownValue();
	// 	}
	// }

	// refactoring duplicate lines of code
	settingDimmerIntervals(interval) {
		this.selectedDuration = this.list.indexOf(interval)
		this.name = interval.name;
		this.placeholder = interval.placeholder;
		this.narratorLabel = this.dropDownId.slice(5, this.dropDownId.length - 9) + '-' + interval.text;
	}


	setDropDownValue() {
		if(this.value && this.list) {
			const interval = this.list.find((ddi:DropDownInterval) => ddi.value === this.value );
			if(interval) {
				this.settingDimmerIntervals(interval)
				return
			}
		} else {
			this.name = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.select');
			this.placeholder = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.time');
			this.narratorLabel = this.dropDownId.slice(5, this.dropDownId.length - 9) + '-' + this.name + '-' + this.placeholder;
		}
	}

	// Below method is triggered from directive to close the dropdown list and set the change in interval if any.
	closeDropdown(eventObj: any ) {	
		try {
			const interval = this.list.find((ddi:DropDownInterval, idx) => idx === eventObj.value );
			this.isDropDownOpen = eventObj.hideList
			if(interval) {
				this.settingDimmerIntervals(interval)
				this.change.emit(interval)
				return;		
			}
		} catch (error) {
			this.logger.error("Error", error)
		}		
	}

	// public toggle() {
	// 	if (!this.disabled) {
	// 		this.isDropDownOpen = !this.isDropDownOpen;
	// 	}
	// }

	public select(item: DropDownInterval) {
		this.value = item.value;
		this.name = item.name;
		this.placeholder = item.placeholder;
		this.selectedDuration = this.list.indexOf(item)
		this.isDropDownOpen = !this.isDropDownOpen;
		this.change.emit(item);
		// this.toggleButton.nativeElement.focus()
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
