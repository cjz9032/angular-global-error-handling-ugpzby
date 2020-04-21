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
	@Input() componentlabel:string;
	@Input() label: string;
	@Input() checked = false;
	@Input() disabled = false;
	@Input() value: any;
	@Input() hasChild = false; // for ng-content
	@Input() metricsEvent = 'ItemClick';
	@Input() metricsParent: string;
	@Input() metricsItem: string;
	@Input() metricsValue: any;
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
