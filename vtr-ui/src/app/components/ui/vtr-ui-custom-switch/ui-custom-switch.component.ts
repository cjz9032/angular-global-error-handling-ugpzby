import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-custom-switch',
	templateUrl: './ui-custom-switch.component.html',
	styleUrls: ['./ui-custom-switch.component.scss']
})
export class UiCustomSwitchComponent implements OnInit {
	@Output() toggle: EventEmitter<any> = new EventEmitter();
	@Input() value = false;
	@Input() switchId = 'toggle-switch';
	@Input() isDisabled = false;
	@Input() showLoader = false;
	@Input() theme = 'white';
	@Input() readonly = false;
	@Input() ariaLabel: string;
	@Input() label: string;

	constructor() { }

	ngOnInit(): void {
	}

}
