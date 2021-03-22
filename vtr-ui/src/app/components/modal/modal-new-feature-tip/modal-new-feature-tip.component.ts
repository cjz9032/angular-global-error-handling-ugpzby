import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ElementRef,
	HostListener,
	OnDestroy,
} from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { MenuID } from 'src/assets/menu/menu';

@Component({
	selector: 'vtr-modal-new-feature-tip',
	templateUrl: './modal-new-feature-tip.component.html',
	styleUrls: ['./modal-new-feature-tip.component.scss'],
})
export class ModalNewFeatureTipComponent implements OnInit, OnDestroy {
	@Input() description = 'template description text.';
	@Input() tipId = 'security';
	@Output() btnOk = new EventEmitter<any>();

	emptyLeft: number;
	emptyWidth: number;
	emptyHeight: number;
	contentLeft: number;
	pointerLeft: number;

	isCreating = true;

	positionInterval: any;
	positionIntervalTime: number;

	idArray = ['new-feature-tip-ok-btn', 'new-feature-tip-mask'];

	tipsVersions = {
		'v3.2': 3.002,
		'v3.2.5': 3.002005,
		'v3.6': 3.006,
		'v3.7': 3.007,
	};

	allNewTips: NewTipItem[] = [
		{
			tipId: MenuID.security,
			desc: 'notification.menu.security',
			version: this.tipsVersions['v3.2'],
		},
		{
			tipId: MenuID.homeSecurity,
			desc: 'notification.menu.connectedHomeSecurity',
			version: this.tipsVersions['v3.2'],
		},
		{
			tipId: MenuID.hardwareScan,
			desc: 'notification.menu.hardwareScan',
			version: this.tipsVersions['v3.2.5'],
		},
		{
			tipId: MenuID.appSearch,
			desc: 'notification.menu.appSearch',
			version: this.tipsVersions['v3.6'],
		},
		{
			tipId: MenuID.device,
			desc: 'notification.menu.autoClose',
			version: this.tipsVersions['v3.7'],
		},
	];

	metrics: any;

	constructor(
		private element: ElementRef,
		private commonService: CommonService,
		private shellService: VantageShellService
	) {
		this.metrics = this.shellService.getMetrics();
	}

	ngOnInit() {
		let tipsIntervalTime = 0;
		const setTipsInterval = setInterval(() => {
			this.setTipsPosition();
			tipsIntervalTime++;
			if (this.emptyLeft || tipsIntervalTime >= 10) {
				clearInterval(setTipsInterval);
			}
		}, 1000);
		setTimeout(() => {
			(document.querySelector('#new-feature-tip-dialog') as HTMLElement).focus();
		}, 0);
	}

	ngOnDestroy() {
		clearInterval(this.positionInterval);
	}

	nextTips(positionName: string) {
		const currentTipsIndex = this.allNewTips.findIndex((i) => i.tipId === this.tipId);
		const availableTips = this.allNewTips.slice(currentTipsIndex + 1);

		if (
			availableTips.some(
				(item, j) => this.tipItemAction(availableTips[j], positionName) === true
			)
		) {
			return;
		}

		const newTipsMetrics = this.calcTipItemMetricsData(this.tipId, positionName);
		this.sendMetricsAsync(newTipsMetrics);
		this.destroyTipsComponent();
	}

	tipItemAction(tip: NewTipItem, positionName: string): boolean {
		const menuItem = this.newTipIdSelector(tip.tipId);
		if (menuItem) {
			const newTipsMetrics = this.calcTipItemMetricsData(this.tipId, positionName);
			this.setDescAndTipId(tip);
			this.showItemTip(menuItem);
			this.sendMetricsAsync(newTipsMetrics);
			return true;
		} else {
			return false;
		}
	}

	calcTipItemMetricsData(id: string, positionName: string) {
		return {
			ItemType: 'FeatureClick',
			ItemName: `${id}-${positionName}`,
			ItemParent: 'New Feature Tips',
		};
	}

	newTipIdSelector(tipId: string) {
		return document.querySelector(`[new-tip-id=new-tip-${tipId}]`) as HTMLElement;
	}

	destroyTipsComponent() {
		clearInterval(this.positionInterval);
		this.element.nativeElement.parentNode.removeChild(this.element.nativeElement);
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		} else {
		}
	}

	setDescAndTipId(tip: NewTipItem) {
		this.tipId = tip.tipId;
		this.description = tip.desc;
	}

	setTipsPosition() {
		const lastFeatureVersion = this.commonService.lastFeatureVersion;

		for (const element of this.allNewTips) {
			if (element.version > lastFeatureVersion) {
				this.setDescAndTipId(element);
				this.showItemTip(this.newTipIdSelector(element.tipId));
				return;
			}
		}
	}

	isShowMenuTips(menuItem: HTMLElement, version: number, lastVersion: number = 0) {
		return Boolean(menuItem && version > lastVersion);
	}

	showItemTip(item: HTMLElement) {
		this.emptyLeft = this.getLeft(item);
		this.emptyWidth = this.getWidth(item);
		this.contentLeft = this.emptyLeft + this.emptyWidth / 2 - 100;
		const windowWidth = window.outerWidth;

		if (this.emptyLeft + 320 > windowWidth) {
			this.contentLeft -= 200;
		}
		this.pointerLeft = this.emptyLeft + this.emptyWidth / 2 - this.contentLeft;

		setTimeout(() => {
			this.isCreating = false;
		}, 1000);
		clearInterval(this.positionInterval);
		this.positionIntervalTime = 0;
		this.positionInterval = setInterval(() => {
			this.positionIntervalTime++;
			if (item.offsetLeft !== this.emptyLeft) {
				this.showItemTip(item);
			}
			if (this.positionIntervalTime >= 100) {
				clearInterval(this.positionInterval);
			}
		}, 100);
	}

	getLeft(e: any) {
		if (e) {
			let offset = e.offsetLeft;
			if (e.offsetParent != null) {
				offset += this.getLeft(e.offsetParent);
			}
			return offset;
		} else {
			return null;
		}
	}
	getWidth(e: any) {
		if (e) {
			const offset = e.clientWidth;
			return offset;
		} else {
			return null;
		}
	}

	@HostListener('window:resize')
	onResize() {
		if (!this.isCreating) {
			this.destroyTipsComponent();
		}
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		const activeId = document.activeElement.id || '';
		if (event.shiftKey && event.key === 'Tab') {
			this.focusById(this.getNextIdById(activeId, true));
			event.preventDefault();
		} else if (event.key === 'Tab') {
			this.focusById(this.getNextIdById(activeId));
			event.preventDefault();
		}
	}

	getNextIdById(id: string, reverse?: boolean): string {
		const idArray = this.idArray;
		const idIndex = idArray.indexOf(id);
		if (!reverse) {
			if (idIndex === -1 || idIndex === idArray.length - 1) {
				return idArray[0];
			}
			return idArray[idIndex + 1];
		} else {
			if (idIndex === -1 || idIndex === 0) {
				return idArray[idArray.length - 1];
			}
			return idArray[idIndex - 1];
		}
	}

	focusById(id: string) {
		(document.querySelector('#' + id) as HTMLElement).focus();
	}

	@HostListener('window: focus')
	onFocus() {
		this.focusById('new-feature-tip-dialog');
	}
}

export class NewTipItem {
	tipId: string;
	desc: string;
	version: number;
}
