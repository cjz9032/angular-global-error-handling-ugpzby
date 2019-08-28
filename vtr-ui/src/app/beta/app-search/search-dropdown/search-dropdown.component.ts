import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppSearchService } from 'src/app/beta/app-search/app-search.service';
import { Subject } from 'rxjs';


@Component({
	selector: 'vtr-search-dropdown',
	templateUrl: './search-dropdown.component.html',
	styleUrls: ['./search-dropdown.component.scss']
})

export class SearchDropdownComponent implements AfterViewInit {
	@ViewChild('searchInput', { static: false }) searchInput: ElementRef;
	@ViewChild('searchBox', { static: false }) searchBox: ElementRef;

	private searchTimer: any;
	public searchTips = 'Search Query';
	public searchResults = [
		/*{
			icon: ['fal', 'search'],
			text: 'Suggested search Item',
			route: '/dashboard',
			Id: 'vtrAppSearchScroll',
		}*/
	];
	constructor(
		private searchService: AppSearchService
	) {
	}

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

	onResultClick(item: any) {
		this.searchService.activeScroll(item.id);
	}

	onCleanClick() {
		this.searchInput.nativeElement.value = '';
		this.onTextChange('');
	}

	onTextChange(keywords: string) {
		if (this.searchTimer) {
			clearTimeout(this.searchTimer);
		}

		this.searchTimer = setTimeout(() => {
			this.searchTimer = null;
			const result = this.searchService.search(keywords);
			if (result) {
				this.searchResults = result;
			}
		}, 100);
	}
}
