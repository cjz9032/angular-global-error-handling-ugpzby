import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { AbTestsName } from '../../../utils/ab-test/ab-tests.type';
import { AbTestsService } from './ab-tests.service';
import { TestOptionDirective } from '../../directives/test-option.directive';

@Component({
	selector: 'vtr-ab-tests',
	templateUrl: './ab-tests.component.html',
	styleUrls: ['./ab-tests.component.scss']
})
export class AbTestsComponent implements AfterContentInit {
	@Input() testName: AbTestsName;

	@ContentChildren(TestOptionDirective) templates: QueryList<TestOptionDirective>;

	constructor(private abTestsService: AbTestsService) {
	}

	ngAfterContentInit() {
		this.findOption().display();
	}

	private findOption() {
		return this.templates.find((option) => option.testOption === this.abTestsService.getDefaultOption(this.testName));
	}
}
