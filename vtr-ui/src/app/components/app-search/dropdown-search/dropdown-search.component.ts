import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureClick } from 'src/app/services/metric/metrics.model';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { MetricEventName as EventName } from 'src/app/enums/metrics.enum';
import { RoutePath } from 'src/assets/menu/menu';
@Component({
	selector: 'vtr-search-dropdown',
	templateUrl: './dropdown-search.component.html',
	styleUrls: ['./dropdown-search.component.scss'],
})
export class SearchDropdownComponent {
	@ViewChild('searchInput', { static: false }) searchInput: ElementRef;

	public searchTips = 'Search Query';
	public userInput = '';
	public recommandedItems = [];
	public clickSearchIconEvent: FeatureClick = {
		ItemType: EventName.featureclick,
		ItemParent: 'Dropdown.Search',
		ItemName: 'icon.search',
	};
	public enterSearchEvent: FeatureClick = {
		ItemType: EventName.featureclick,
		ItemParent: 'Dropdown.Search',
		ItemName: 'input.search',
	};

	constructor(private router: Router, private metricService: MetricService) {}

	onCleanClick($event) {
		this.searchInput.nativeElement.value = '';
		$event?.stopPropagation();
	}

	onInputClick($event) {
		$event.stopPropagation();
	}

	onClickSearch($event, metricEvent) {
		const userInput = this.mergeAndTrimSpace(this.searchInput.nativeElement.value);
		this.searchInput.nativeElement.value = userInput;

		if (!userInput) {
			$event.stopPropagation();
			return;
		}

		this.metricService.sendMetrics(metricEvent);
		this.navigateToSearchPage(userInput);
	}

	private navigateToSearchPage(userInput: string) {
		this.router.navigate([RoutePath.search], {
			queryParams: { userInput },
		});
	}

	private mergeAndTrimSpace(source) {
		return source?.trim().replace(/ +(?= )/g, '') || '';
	}
}
