import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-why-seeing-tooltip',
	templateUrl: './why-seeing-tooltip.component.html',
	styleUrls: ['./why-seeing-tooltip.component.scss']
})
export class WhySeeingTooltipComponent implements OnInit {
	@Input() contextText: string;
	constructor() {
	}

	ngOnInit() {
	}

}
