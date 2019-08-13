import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-hardware-list',
	templateUrl: './ui-hardware-list.component.html',
	styleUrls: ['./ui-hardware-list.component.scss']
})
export class UiHardwareListComponent implements OnInit {
	@Input() items: Array<any>;
	@Input() details: Array<any>;
	@Input() template = 1;
	@Input() collapsed: boolean = this.collapsed || false;
	public information: string;


	constructor() { }

	ngOnInit() {
	}

	public getKey(obj: any) {
		return Object.keys(obj);
	}

	public getValue(obj: any) {
		return Object.values(obj);
	}

	public getInformation(text: string) {
		this.information = text;
	}
}
