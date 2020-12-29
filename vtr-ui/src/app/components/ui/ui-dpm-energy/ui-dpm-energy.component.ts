import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-dpm-energy',
	templateUrl: './ui-dpm-energy.component.html',
	styleUrls: ['./ui-dpm-energy.component.scss'],
})
export class UiDpmEnergyComponent implements OnInit {
	private pValue: number;
	@Input()
	public get value(): number {
		return this.pValue;
	}
	public set value(v: number) {
		if (v < 0) {v = 0;}
		if (v > this.totalCount) {v = this.totalCount;}
		this.pValue = v;
		this.setItems();
	}

	private totalCount = 7;
	items: boolean[] = [];

	constructor() {}

	ngOnInit(): void {
		this.setItems();
	}

	private setItems() {
		this.items = [];
		for (let i = 0; i < this.totalCount; i++) {
			if (i < this.value) {this.items.push(true);}
			else {this.items.push(false);}
		}
	}
}
