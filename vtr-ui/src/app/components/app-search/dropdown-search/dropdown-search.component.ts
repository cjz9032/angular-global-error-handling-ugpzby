import { Component } from '@angular/core';
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
	public searchTips = 'Search Query';
	public userInput = '';
	public clickSearchIconEvent: FeatureClick = {
		ItemType: EventName.featureclick,
		ItemParent: 'Dropdown.Search',
		ItemName: 'icon.search',
	};

	constructor(private router: Router, private metricService: MetricService) {}

	onClickSearch() {
		const userInput = this.mergeAndTrimSpace(this.userInput);
		if (!this.userInput) {
			return;
		}

		this.metricService.sendMetrics(this.clickSearchIconEvent);
		this.navigateToSearchPage(userInput);
	}

	onDropdownClick($event) {
		$event.stopPropagation();
	}

	onDropdownClosed() {
		this.userInput = '';
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
