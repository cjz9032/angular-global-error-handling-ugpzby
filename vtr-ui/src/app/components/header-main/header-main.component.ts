import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-header-main',
	templateUrl: './header-main.component.html',
	styleUrls: [
		'./header-main.component.scss'
	]
})
export class HeaderMainComponent implements OnInit, AfterViewInit {

	@Input() title: string;
	@Input() back: string;
	@Input() backarrow = '<';
	@Input() forwardLink: { path: string, label: string };
	@Input() menuItems: any[];
	@Input() parentPath: string;
	@Input() backId: string;
	@Input() ariaLabel: string;
	@Input() isInnerBack = false;
	@Input() textId: string;
	@Input() hideBack = false;
	@Output() innerBack = new EventEmitter();
	@Input() hideTitle = false;

	constructor(
		public deviceService: DeviceService,
		public dccService: DccService
	) {
	}

	ngOnInit() {
		const self = this;
		if (this.parentPath !== '' && this.parentPath !== undefined) {
			this.menuItems.forEach((d, i) => {
				d.path = self.parentPath + '/' + d.path;
			});
		}
	}

	ngAfterViewInit() {
		const back = document.getElementById(this.backId);
		if (back) {
			back.addEventListener('focus', () => {
				window.scrollTo(0, 0);
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
			return window.history.back();
		}
	}
}
