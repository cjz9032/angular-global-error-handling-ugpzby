import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { faGem } from '@fortawesome/pro-light-svg-icons/faGem';
import { IFeature } from 'src/app/services/app-search/interface.model';

@Component({
	selector: 'vtr-search-dropdown',
	templateUrl: './dropdown-search.component.html',
	styleUrls: ['./dropdown-search.component.scss'],
})
export class SearchDropdownComponent implements AfterViewInit {
	@ViewChild('searchInput', { static: false }) searchInput: ElementRef;
	@ViewChild('searchBox', { static: false }) searchBox: ElementRef;

	public searchTips = 'Search Query';
	public userInput = '';
	public featureList: IFeature[] = [];
	public recommandedItems = [];
	// public recommandedItems = [ {
	// 	id: 'item1',
	// 	icon: faGem,
	// 	name: 'item1'
	// }, {
	// 	id: 'item2',
	// 	icon: faGem,
	// 	name: 'item2'
	// }, {
	// 	id: 'item3',
	// 	icon: faGem,
	// 	name: 'item3'
	// }, {
	// 	id: 'item4',
	// 	icon: faGem,
	// 	name: 'item4'
	// } ];

	constructor(
		private router: Router) { }

	ngAfterViewInit() {
		setTimeout(() => {
			this.searchInput.nativeElement.focus();
		}, 0);
	}

	onParentClick(event) {
		if (!event.dropdownClick) {
			event.fromSearchBox = true;
		}
	}

	onDropDownClick(event) {
		event.dropdownClick = true;
	}

	onCleanClick() {
		this.searchInput.nativeElement.value = '';
	}

	onClickSearch() {
		this.navigateToSearchPage(this.searchInput.nativeElement.value);
	}

	onClickRecommandationItem(userInput) {
		this.navigateToSearchPage(userInput);
	}

	onSearchInputChange() {
		// to do, show input recommandation
	}

	onInputClick($event) {
		$event.stopPropagation();
	}

	private navigateToSearchPage(userInput: string) {
		this.router.navigate(['search'], {
			queryParams: { userInput },
		});
	}
}
