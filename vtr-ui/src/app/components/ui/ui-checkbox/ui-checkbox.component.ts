import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output
} from '@angular/core';

@Component({
	selector: 'vtr-ui-checkbox',
	templateUrl: './ui-checkbox.component.html',
	styleUrls: ['./ui-checkbox.component.scss']
})
export class UiCheckboxComponent implements OnInit {

	@Input() componentId: string;
	@Input() label: string;
	@Input() checked: boolean;
	@Input() disabled: boolean;
	@Input() value: any;
	@Input() hasChild = false; // for ng-content
	@Output() toggle: EventEmitter<boolean> = new EventEmitter();

	constructor() { }

	ngOnInit() { }

	onChange(event) {
		if (event.target.checked) {
			this.toggle.emit(true);
		} else {
			this.toggle.emit(false);
		}
	}

}
