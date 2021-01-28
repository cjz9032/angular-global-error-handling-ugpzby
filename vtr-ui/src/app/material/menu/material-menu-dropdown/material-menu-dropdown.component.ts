import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenu } from '@lenovo/material/menu';
import { MenuItem } from 'src/app/services/config/config.service';

@Component({
	selector: 'vtr-material-menu-dropdown',
	templateUrl: './material-menu-dropdown.component.html',
	styleUrls: ['./material-menu-dropdown.component.scss'],
	exportAs: 'materialMenuDropdownComponent',
})
export class MaterialMenuDropdownComponent implements OnInit {
	@ViewChild(MatMenu, { static: true }) matMenu: MatMenu;
	@Input() dropdownMenu: MenuItem;
	@Input() parentPath: string;
	@Input() parentId: string;
	@Input() currentIsSearchPage: boolean;
	hasSecondaryMenu = false;

	constructor(private router: Router) { }

	ngOnInit(): void {
		if (Array.isArray(this.dropdownMenu?.subitems)) {
			this.dropdownMenu.subitems.forEach((element) => {
				if (
					Array.isArray(element?.subitems) &&
					!element.hide &&
					element.subitems.some((item) => !item.hide)
				) {
					this.hasSecondaryMenu = true;
				}
			});
		}
	}

	public onSearchItemFocus($event) {
		// pass focus to search box
		$event.currentTarget.querySelector('#dropdown-div-search-input')?.focus();
	}

	public openExternalLink(link) {
		if (link) {
			window.open(link);
		}
	}

	menuItemKeyDown(path, subpath?, secondaryPath?) {
		secondaryPath
			? this.router.navigateByUrl(`/${path}/${subpath}/${secondaryPath}`)
			: subpath
				? this.router.navigateByUrl(`/${path}/${subpath}`)
				: path
					? this.router.navigateByUrl(`/${path}`)
					: this.router.navigateByUrl(`/`);
	}
}
