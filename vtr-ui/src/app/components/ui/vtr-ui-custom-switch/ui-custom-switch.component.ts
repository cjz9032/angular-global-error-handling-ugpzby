import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-custom-switch',
	templateUrl: './ui-custom-switch.component.html',
	styleUrls: ['./ui-custom-switch.component.scss']
})
export class UiCustomSwitchComponent implements OnInit {
	@Output() toggle: EventEmitter<any> = new EventEmitter();
	@Input() value = false;
	@Input() componentId = 'toggle-switch';
	@Input() isDisabled = false;
	@Input() isLoading = true;
	@Input() theme = 'white';
	@Input() readonly = false;
	@Input() label: string;
	@Input() ariaLabel: string;
	@Input() metricsEvent = 'ItemClick';
	@Input() metricsParent: string;
	@Input() metricsItem: string;
	@Input() metricsValue: any;

	constructor() { }

	ngOnInit(): void {
	}

	public onChange($event) {
		const value = $event.target.checked;
		this.value = value;
		this.toggle.emit(value);
	}

}
