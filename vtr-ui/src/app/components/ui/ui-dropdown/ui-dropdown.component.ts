import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-dropdown',
	templateUrl: './ui-dropdown.component.html',
	styleUrls: ['./ui-dropdown.component.scss']
})
export class UiDropdownComponent implements OnInit {
	@Input() list: [];
	@Input() title: string;
	active = false;
	value = 0;
	name = 'Never';

	toggle() {
		this.active = !this.active;
	}
	select(i) {
		this.value = i.value;
		this.name = i.name;

		this.active = !this.active;
	}

	constructor() { }

	ngOnInit() { }

}
