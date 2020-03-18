import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { NewFeatureTipService } from 'src/app/services/new-feature-tip/new-feature-tip.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
	selector: 'vtr-modal-new-feature-tip',
	templateUrl: './modal-new-feature-tip.component.html',
	styleUrls: ['./modal-new-feature-tip.component.scss']
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

	positionInterval: any;
	positionIntervalTime: number;

	idArray = [
		'new-feature-tip-ok-btn',
		'new-feature-tip-mask',
	];

	tipsVersitions = {
		'v3.2': 3.002,
		'v3.2.5': 3.002005,
	}

	allNewTips = {
		security: { tipId: 'security', desc: 'notification.menu.security', version: this.tipsVersitions['v3.2'] },
		homeSecurity: { tipId: 'home-security', desc: 'notification.menu.connectedHomeSecurity', version: this.tipsVersitions['v3.2'] },
		hardwareScan: { tipId: 'hardware-scan', desc: 'notification.menu.hardwareScan', version: this.tipsVersitions['v3.2.5'] },
	}

	metrics: any;

	constructor(
		private viewContainerRef: ViewContainerRef,
		private element: ElementRef,
		private configService: ConfigService,
		newFeatureTipService: NewFeatureTipService,
		private shellService: VantageShellService,
	) {
		newFeatureTipService.viewContainer = this.viewContainerRef;
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
		if (this.tipId === this.allNewTips.security.tipId) {
			const homeSecurityAction = this.tipItemAction(this.allNewTips.homeSecurity, positionName)
			if (homeSecurityAction) { return }

			const hardwareScanAction = this.tipItemAction(this.allNewTips.hardwareScan, positionName)
			if (hardwareScanAction) { return }
		}
		if (this.tipId === this.allNewTips.homeSecurity.tipId) {
			const hardwareScanAction = this.tipItemAction(this.allNewTips.hardwareScan, positionName)
			if (hardwareScanAction) { return }
		}
		const newTipsMetrics = this.calcTipItemMetricsData(this.tipId, positionName);
		this.sendMetricsAsync(newTipsMetrics);
		this.destroyTipsComponent();
	}

	tipItemAction(tip: NewTipItem, positionName: string) {
		const menuItem = this.newTipIdSelector(tip.tipId);
		if (menuItem) {
			const newTipsMetrics = this.calcTipItemMetricsData(this.tipId, positionName);
			this.setDescAndTipId(tip);
			this.showItemTip(menuItem);
			this.sendMetricsAsync(newTipsMetrics);
			return true;
		} else { return false; }
	}

	calcTipItemMetricsData(id: string, positionName: string) {
		return {
			ItemType: 'FeatureClick',
			ItemName: `${id}-${positionName}`,
			ItemParent: 'New Feature Tips'
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
		} else { }
	}

	setDescAndTipId(tip: NewTipItem) {
		this.tipId = tip.tipId;
		this.description = tip.desc;
	}

	setTipsPosition() {
		const securityMenu = this.newTipIdSelector(this.allNewTips.security.tipId);
		const homeSecurityMenu = this.newTipIdSelector(this.allNewTips.homeSecurity.tipId);
		const hardwareScanMenu = this.newTipIdSelector(this.allNewTips.hardwareScan.tipId);

		const lastFeatureVersion = this.configService.lastFeatureVersion;

		if (this.isShowMenuTips(securityMenu, this.allNewTips.security.version, lastFeatureVersion)) {
			this.setDescAndTipId(this.allNewTips.security);
			this.showItemTip(securityMenu);
		} else if (this.isShowMenuTips(homeSecurityMenu, this.allNewTips.homeSecurity.version, lastFeatureVersion)) {
			this.setDescAndTipId(this.allNewTips.homeSecurity);
			this.showItemTip(homeSecurityMenu);
		} else if (this.isShowMenuTips(hardwareScanMenu, this.allNewTips.hardwareScan.version, lastFeatureVersion)) {
			this.setDescAndTipId(this.allNewTips.hardwareScan);
			this.showItemTip(hardwareScanMenu);
		}
	}

	isShowMenuTips(menuItem: HTMLElement, version: number, lastVersion: number = 0) {
		return Boolean(menuItem && version > lastVersion)
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
			if (e.offsetParent != null) { offset += this.getLeft(e.offsetParent); }
			return offset;
		} else { return null; }
	}
	getWidth(e: any) {
		if (e) {
			const offset = e.clientWidth;
			return offset;
		} else { return null; }
	}

	@HostListener('window:resize')
	onResize() {
		this.destroyTipsComponent();
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
			if (idIndex === -1 || idIndex === idArray.length - 1) { return idArray[0]; }
			return idArray[idIndex + 1];
		} else {
			if (idIndex === -1 || idIndex === 0) { return idArray[idArray.length - 1]; }
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

export class NewTipItem { tipId: string; desc: string; version: number }