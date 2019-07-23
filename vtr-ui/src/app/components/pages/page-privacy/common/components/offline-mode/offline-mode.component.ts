import { Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../../../../../services/common/common.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { NetworkStatus } from '../../../../../../enums/network-status.enum';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';

@Component({
	selector: '[vtrOfflineMode]',
	templateUrl: './offline-mode.component.html',
	styleUrls: ['./offline-mode.component.scss'],
})
export class OfflineModeComponent implements OnInit, OnDestroy {
	@Input() positionContextTo: 'center' | 'right' | 'left' = 'center';

	@HostBinding('attr.disabled') isDisabled = false;
	@HostBinding('class.offline-active') isOfflineActive = false;
	@HostBinding('style.background') background = null;
	@HostBinding('style.color') color = null;
	@HostBinding('style.borderColor') borderColor = null;

	isOnline = this.commonService.isOnline;

	@HostListener('click', ['$event']) onClick($event) {
		if (!this.commonService.isOnline) {
			$event.preventDefault();
			$event.stopPropagation();
			$event.stopImmediatePropagation();
		}
	}

	constructor(
		private commonService: CommonService,
		private el: ElementRef,
	) {	}

	ngOnInit() {
		this.changeStyles(this.getCurrentElement(), this.commonService.isOnline);

		this.commonService.notification.pipe(
			filter((notification) => notification.type === NetworkStatus.Online || notification.type === NetworkStatus.Offline),
			map((notification) => notification.payload),
			takeUntil(instanceDestroyed(this))
		).subscribe((payload) => {
			this.changeStyles(this.getCurrentElement(), payload.isOnline);
			this.isOnline = payload.isOnline;
		});
	}

	ngOnDestroy() {
	}

	private buttonDisabled(isOnline) {
		this.isDisabled = isOnline ? null : true;
		this.background = isOnline ? null : 'linear-gradient(270deg, #E2E2E2 0%, #C2C6CF 100%)';
		this.borderColor = isOnline ? null : '#D8D8D8';
		this.color = isOnline ? null : '#FFF';
	}

	private linkDisabled(isOnline) {
		this.color = isOnline ? null : '#D8D8D8';
	}

	private addDisabledClass(isOnline) {
		this.isOfflineActive = isOnline ? null : true;
	}

	private changeStyles(element: string, isOnline = true) {
		if (element === 'button') {
			this.buttonDisabled(isOnline);
		} else if (element === 'a') {
			this.linkDisabled(isOnline);
		}

		this.addDisabledClass(isOnline);
	}

	private getCurrentElement() {
		return this.el.nativeElement.tagName.toLowerCase();
	}
}
