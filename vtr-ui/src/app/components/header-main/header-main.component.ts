import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { HistoryManager } from 'src/app/services/history-manager/history-manager.service';

@Component({
	selector: 'vtr-header-main',
	templateUrl: './header-main.component.html',
	styleUrls: [
		'./header-main.component.scss'
	]
})
export class HeaderMainComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input() title: string;
	@Input() back: string;
	@Input() backarrow = '<';
	@Input() forwardLink: { path: string, label: string; };
	@Input() menuItems: any[];
	@Input() parentPath: string;
	@Input() backId: string;
	@Input() ariaLabel: string;
	@Input() isInnerBack = false;
	@Input() textId: string;
	@Input() hideBack = false;
	@Output() innerBack = new EventEmitter();
	@Input() hideTitle = false;
	backElement: HTMLElement;

	constructor(
		public deviceService: DeviceService,
		public dccService: DccService,
		public historyManager: HistoryManager
	) {
	}

	ngOnInit() {
		const self = this;
		if (this.parentPath !== '' && this.parentPath !== undefined) {
			if (this.menuItems) {
				this.menuItems.forEach((d, i) => {
					d.path = self.parentPath + '/' + d.path;
				});
			}
		}
	}

	ngAfterViewInit() {
		this.backElement = document.getElementById(this.backId);
		if (this.backElement) {
			this.backElement.addEventListener('focus', this.scrollTo);
		}
	}

	scrollTo() {
		window.scrollTo(0, 0);
	}

	onInnerBack() {
		this.innerBack.emit();
	}

	goBack() {
		if (this.isInnerBack) {
			this.onInnerBack();
		} else {
			return this.historyManager.goBack();
		}
	}

	ngOnDestroy() {
		if (this.backElement) {
			this.backElement.removeEventListener('focus', this.scrollTo);
		}
	}
}
