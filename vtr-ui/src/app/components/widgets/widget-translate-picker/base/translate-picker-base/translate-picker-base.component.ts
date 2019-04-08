import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-translate-picker-base',
	templateUrl: './translate-picker-base.component.html',
	styleUrls: ['./translate-picker-base.component.scss']
})
export class TranslatePickerBaseComponent implements OnInit {

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
