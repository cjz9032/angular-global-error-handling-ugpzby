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
	@Input() isLoading = false;
	@Input() theme = 'white';
	@Input() readonly = false;
	@Input() label: string;
	@Input() ariaLabel: string;
	@Input() metricsEvent = 'ItemClick';

	constructor() { }

	ngOnInit(): void {
	}

	public onChange($event) {
		const value = $event.target.checked;
		this.value = value;
		this.toggle.emit({ switchValue: value });
	}
}
