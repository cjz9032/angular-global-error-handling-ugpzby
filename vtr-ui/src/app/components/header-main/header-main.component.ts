import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-header-main',
	templateUrl: './header-main.component.html',
	styleUrls: [
		'./header-main.component.scss',
		'./header-main.component.gaming.scss'
	]
})
export class HeaderMainComponent implements OnInit {

	@Input() title: string;
	@Input() back: string;
	@Input() backarrow = '<';
	@Input() forwardLink: { path: string, label: string };
	@Input() menuItems: any[];
	@Input() parentPath: string;
	@Input() backId: string;
	@Input() ariaLabel: string;
	@Input() isInnerBack = false;
	@Output() innerBack = new EventEmitter();
	@Input() textId: string;
	constructor(private router: Router, public deviceService: DeviceService) {
	}

	ngOnInit() {
		const self = this;
		if (this.parentPath !== '' && this.parentPath !== undefined) {
			this.menuItems.forEach((d, i) => {
				d.path = self.parentPath + '/' + d.path;
			});
		}
	}

	onInnerBack() {
		this.innerBack.emit();
	}

	goBack() {
		if (this.isInnerBack) {
			this.onInnerBack();
		} else {
			if (window.history.length > 1) { return window.history.back(); }
			this.router.navigate(['dashboard']);
		}
	}
}
