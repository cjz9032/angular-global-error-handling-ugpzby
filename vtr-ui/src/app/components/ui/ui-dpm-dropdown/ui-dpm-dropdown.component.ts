import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DropDownInterval } from 'src/app/data-models/common/drop-down-interval.model';
import { DPMDropDownInterval } from 'src/app/data-models/common/dpm-drop-down-interval.model';

@Component({
	selector: 'vtr-ui-dpm-dropdown',
	templateUrl: './ui-dpm-dropdown.component.html',
	styleUrls: ['./ui-dpm-dropdown.component.scss']
})
export class UiDpmDropdownComponent implements OnInit {

	@Input() dropDownId;
	@Input() list: DPMDropDownInterval[];
	@Input() value: any;
	@Input() disabled = false;
	@Output() change: EventEmitter<any> = new EventEmitter<any>();
	public isDropDownOpen = false;
	public text: string;
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
				this.text = interval.text;
			} else {
				this.value = undefined;
				this.text = '';
			}
		}
	}

	public toggle() {
		if (!this.disabled) {
			this.isDropDownOpen = !this.isDropDownOpen;
		}
	}

	public select(event: DropDownInterval, toggle) {
		this.value = event.value;
		this.text = event.text;
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