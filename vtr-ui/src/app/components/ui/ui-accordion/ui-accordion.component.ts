import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-ui-accordion',
	templateUrl: './ui-accordion.component.html',
	styleUrls: ['./ui-accordion.component.scss']
})
export class UiAccordionComponent implements OnInit {
	@Input() tune = 0;
	@Input() boost = 0;
	@Input() secure = 0;
	@Input() scannigResultObj;

	constructor() { }
	ngOnInit(): void {
	}

}
