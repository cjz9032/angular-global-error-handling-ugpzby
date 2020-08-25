import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-subpage-scan-results-accordion',
	templateUrl: './subpage-scan-results-accordion.component.html',
	styleUrls: ['./subpage-scan-results-accordion.component.scss']
})
export class SubpageScanResultsAccordionComponent implements OnInit {
	@Input() tune = 0;
	@Input() boost = 0;
	@Input() secure = 0;
	@Input() scannigResultObj;

	constructor() { }
	ngOnInit(): void {
	}


}
