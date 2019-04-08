import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-translate-picker',
	templateUrl: './widget-translate-picker.component.html',
	styleUrls: ['./widget-translate-picker.component.scss']
})
export class WidgetTranslatePickerComponent implements OnInit {

	@Input() translateString: string;
	@Input() firstMetricsParent: string;
	@Input() firstMetricsItem: string;
	@Input() firstMetricsValue: string;
	@Input() firstHref: string;
	@Input() secondMetricsParent: string;
	@Input() secondMetricsItem: string;
	@Input() secondMetricsValue: string;
	@Input() secondHref: string;

	firstTranslateString = '';
	secondTranslateString = '';

	constructor() {

	}

	ngOnInit() {
		const secondTagIndex = this.translateString.indexOf('<tag>', this.translateString.indexOf('<tag>') + 1);
		if (secondTagIndex === -1) {
			this.firstTranslateString = this.translateString;
		} else {
			this.firstTranslateString = this.translateString.substring(0, secondTagIndex);
			this.secondTranslateString = this.translateString.substring(secondTagIndex);
		}
	}

}
