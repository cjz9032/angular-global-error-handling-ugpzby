import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
	prevUrl: string;

	constructor(
		private router: Router,
		public deviceService: DeviceService,
		public dccService: DccService,
		private route: ActivatedRoute
	) {
	}

	ngOnInit() {
		const self = this;
		if (this.parentPath !== '' && this.parentPath !== undefined) {
			this.menuItems.forEach((d, i) => {
				d.path = self.parentPath + '/' + d.path;
			});
		}
		this.route.queryParams.subscribe(params => {
			if (params.prevUrl) {
				try {
					this.prevUrl = atob(params.prevUrl);
				} catch {
				}
			}
		});
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
			if (window.history.length > 1
				&& !(this.prevUrl && this.prevUrl.startsWith('ms-appx-web:'))) {
				return window.history.back();
			} else if (typeof this.deviceService.isGaming === 'boolean') {
				this.router.navigate([this.deviceService.isGaming ? 'device-gaming' : 'dashboard']);
			}
		}
	}
}
