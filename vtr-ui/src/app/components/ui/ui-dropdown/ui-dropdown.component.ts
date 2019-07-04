import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
	OnChanges
} from '@angular/core';
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
	@Input() list: DropDownInterval[];
	@Input() value: number;
	@Output() change: EventEmitter < any > = new EventEmitter < any > ();
	public isDropDownOpen = false;
	public name = 'Select';
	public placeholder = 'Time';

	constructor() {}

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
		this.isDropDownOpen = !this.isDropDownOpen;
	}

	public select(event: DropDownInterval) {
		this.value = event.value;
		this.name = event.name;
		this.placeholder = event.placeholder;
		this.isDropDownOpen = !this.isDropDownOpen;
		this.change.emit(event);
	}
}
