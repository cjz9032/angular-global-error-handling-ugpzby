import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { MatMenu } from '@lenovo/material/menu';

import { MenuItem } from 'src/app/services/config/config.service';

@Component({
	selector: 'vtr-material-menu-dropdown',
	templateUrl: './material-menu-dropdown.component.html',
	styleUrls: ['./material-menu-dropdown.component.scss'],
})
export class MaterialMenuDropdownComponent implements OnInit {
	@ViewChild(MatMenu, {static: true}) matMenu: MatMenu;
	@Input() dropdownMenu: MenuItem;
	@Input() parentPath: string;
	@Input() parentId: string;
	@Input() activeItemId: string;
	@Output() activeItem = new EventEmitter();
	hasSecondaryMenu: boolean;

	constructor(
		private router: Router,
	) {}

	ngOnInit(): void {
		if (this.dropdownMenu && this.dropdownMenu.subitems && this.dropdownMenu.subitems.length > 0) {
			this.hasSecondaryMenu = this.dropdownMenu.subitems.some((item) => Boolean(item.subitems) && item.subitems.length > 0);
		}
	}

	public openExternalLink(link) {
		if (link) {
			window.open(link);
		}
	}

	menuItemKeyDown(path, subpath?, secondaryPath?) {
		secondaryPath ? this.router.navigateByUrl(`/${path}/${subpath}/${secondaryPath}`)
			: subpath ? this.router.navigateByUrl(`/${path}/${subpath}`)
			: path ? this.router.navigateByUrl(`/${path}`) : this.router.navigateByUrl(`/`);
	}

	setActiveItem(id: string) {
		this.activeItem.emit(id);
	}
}
