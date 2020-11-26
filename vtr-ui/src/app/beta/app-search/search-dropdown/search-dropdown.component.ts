import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppSearchService } from 'src/app/beta/app-search/app-search.service';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-search-dropdown',
	templateUrl: './search-dropdown.component.html',
	styleUrls: ['./search-dropdown.component.scss'],
})
export class SearchDropdownComponent implements AfterViewInit {
	@ViewChild('searchInput', { static: false }) searchInput: ElementRef;
	@ViewChild('searchBox', { static: false }) searchBox: ElementRef;

	private searchTimer: any;
	public searchTips = 'Search Query';
	constructor(public searchService: AppSearchService, private router: Router) {}

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
		this.searchService.targetFeature = item;
		this.router.navigate([item.route]);
		setTimeout(() => {
			this.searchService.activeScroll();
		}, 0);
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
			this.searchService.search(keywords);
		}, 100);
	}
}
