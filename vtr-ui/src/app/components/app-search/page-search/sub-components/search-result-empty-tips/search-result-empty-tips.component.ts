import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-search-result-empty-tips',
	templateUrl: './search-result-empty-tips.component.html',
	styleUrls: ['./search-result-empty-tips.component.scss'],
})
export class SearchResultEmptyTipsComponent {
	@Input() idPrefix: string;

	public noSearchResultTips;
	@Input() set userInput(input: string) {
		this.noSearchResultTips = this.translate.instant('appSearch.noSearchResultTips', {
			userInput: input,
		});
	}

	constructor(private translate: TranslateService) {}
}
