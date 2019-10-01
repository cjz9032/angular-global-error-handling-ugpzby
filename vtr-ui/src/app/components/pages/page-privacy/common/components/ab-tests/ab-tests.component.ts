import { Component, Input, OnInit } from '@angular/core';
import { AbTestsName } from '../../../utils/ab-test/ab-tests.type';

@Component({
	selector: 'vtr-ab-tests',
	templateUrl: './ab-tests.component.html',
	styleUrls: ['./ab-tests.component.scss']
})
export class AbTestsComponent implements OnInit {
	@Input() testName: AbTestsName;

	constructor() {
	}

	ngOnInit() {
	}

}
