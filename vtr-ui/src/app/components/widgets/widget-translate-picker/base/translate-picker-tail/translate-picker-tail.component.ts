import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-translate-picker-tail',
	templateUrl: './translate-picker-tail.component.html',
	styleUrls: ['./translate-picker-tail.component.scss']
})
export class TranslatePickerTailComponent implements OnInit {

	@Input() translateString: string;
	@Input() metricsParent: string;
	@Input() metricsItem: string;
	@Input() metricsValue: string;
	@Input() href: string;
	@Input() onClick() {}

	constructor() { }

	ngOnInit() {
	}

}
