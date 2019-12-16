import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
	OnChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
	DropDownInterval
} from 'src/app/data-models/common/drop-down-interval.model';
import {
	faThemeisle
} from '@fortawesome/free-brands-svg-icons';

@Component({
	selector: 'vtr-ui-dropdown',
	templateUrl: './ui-dropdown.component.html',
	styleUrls: ['./ui-dropdown.component.scss']
})
export class UiDropDownComponent implements OnInit, OnChanges {
	@Input() dropDownId;
	@Input() list: DropDownInterval[];
	@Input() value: number;
	@Input() disabled = false;
	@Output() change: EventEmitter<any> = new EventEmitter<any>();
	public isDropDownOpen = false;
	public name = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.select');
	public placeholder = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.time');

	constructor(private translate: TranslateService) { }

	ngOnInit() {
		console.log('Setting Dropdown  Value', this.value);
		this.setDropDownValue();
	}

	ngOnChanges(changes: SimpleChanges) {
		// only run when property "data" changed
		if (changes['value']) {
			console.log(' UI Dropdown value changed', this.value);
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

	public select(event: DropDownInterval, toggle) {
		this.value = event.value;
		this.name = event.name;
		this.placeholder = event.placeholder;
		this.isDropDownOpen = !this.isDropDownOpen;
		this.change.emit(event);
		toggle.focus();
	}
}
