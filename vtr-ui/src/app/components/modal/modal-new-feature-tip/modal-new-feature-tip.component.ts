import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { NewFeatureTipService } from 'src/app/services/new-feature-tip/new-feature-tip.service';

@Component({
	selector: 'vtr-modal-new-feature-tip',
	templateUrl: './modal-new-feature-tip.component.html',
	styleUrls: ['./modal-new-feature-tip.component.scss']
})
export class ModalNewFeatureTipComponent implements OnInit, OnDestroy {

	@Input() description = 'template description text.';
	@Input() tipId = 'privacy';
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

	constructor(
		private viewContainerRef: ViewContainerRef,
		private element: ElementRef,
		newFeatureTipService: NewFeatureTipService,
	) {
		newFeatureTipService.viewContainer = this.viewContainerRef;
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

	nextTips() {
		if (this.tipId === 'privacy') {
			const securityMenu = document.querySelector('[new-tip-id=new-tip-security]');
			if (securityMenu) {
				this.setDescAndTipId('notification.menu.security', 'security');
				this.showItemTip(securityMenu);
				return;
			}
			const chsMenu = document.querySelector('[new-tip-id=new-tip-home-security]');
			if (chsMenu) {
				this.setDescAndTipId('notification.menu.connectedHomeSecurity', 'home-security');
				this.showItemTip(chsMenu);
				return;
			}
		}
		if (this.tipId === 'security') {
			const chsMenu = document.querySelector('[new-tip-id=new-tip-home-security]');
			if (chsMenu) {
				this.setDescAndTipId('notification.menu.connectedHomeSecurity', 'home-security');
				this.showItemTip(chsMenu);
				return;
			}
		}
		this.destroyTipsComponent();
	}

	destroyTipsComponent() {
		clearInterval(this.positionInterval);
		this.element.nativeElement.parentNode.removeChild(this.element.nativeElement);
	}

	setDescAndTipId(description: string, tipId: string) {
		this.description = description;
		this.tipId = tipId;
	}

	setTipsPosition() {
		const privacyMenu = document.querySelector('[new-tip-id=new-tip-privacy]') as HTMLElement;
		const securityMenu = document.querySelector('[new-tip-id=new-tip-security]') as HTMLElement;
		const chsMenu = document.querySelector('[new-tip-id=new-tip-home-security]') as HTMLElement;

		if (privacyMenu) {
			this.setDescAndTipId('notification.menu.privacy', 'privacy');
			this.showItemTip(privacyMenu);
		} else if (securityMenu) {
			this.setDescAndTipId('notification.menu.security', 'security');
			this.showItemTip(securityMenu);
		} else if (chsMenu) {
			this.setDescAndTipId('notification.menu.connectedHomeSecurity', 'home-security');
			this.showItemTip(chsMenu);
		}
	}

	showItemTip(item: any) {
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
