import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	ViewChild,
	ViewChildren,
} from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { throttleTime } from 'rxjs/operators';
import { DeviceService } from 'src/app/services/device/device.service';
import { BaseComponent } from '../../base/base.component';
import { ModalRebootConfirmComponent } from '../../modal/modal-reboot-confirm/modal-reboot-confirm.component';
import { ModalVoiceComponent } from '../../modal/modal-voice/modal-voice.component';

@Component({
	selector: 'vtr-ui-row-switch',
	templateUrl: './ui-row-switch.component.html',
	styleUrls: ['./ui-row-switch.component.scss'],
	exportAs: 'uiRowSwitch',
})
export class UiRowSwitchComponent
	extends BaseComponent
	implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('childContent', { static: false }) childContent: any;

	// Use Fort Awesome Font Awesome Icon Reference Array (library, icon class) ['fas', 'arrow-right']
	@Input() rightIcon: any = [];
	@Input() leftIcon: any = [];
	@Input() showChildContent = false;
	@Input() readMoreText = '';
	@Input() title = '';
	@Input() caption = '';
	@Input() linkPath = '';
	@Input() linkText = '';
	@Input() isSwitchVisible = false;
	@Input() theme = 'white';
	@Input() resetText = '';
	@Input() isSwitchChecked = true;
	@Input() tooltipText = '';
	@Input() switchId = '';
	@Input() disabled = false;
	@Input() disabledAll = false;
	@Input() type = undefined;
	@Input() resetTextAsButton = false;
	@Input() isLastChild = false;
	@Input() showLoaderState = false;
	@Input() voice = false;
	@Input() voiceValue = '';
	@Output() toggleOnOff = new EventEmitter<boolean>();
	@Output() rebootToggleOnOff = new EventEmitter<boolean>();
	@Output() readMoreClick = new EventEmitter<boolean>();
	@Output() tooltipClick = new EventEmitter<boolean>();
	@Output() resetClick = new EventEmitter<Event>();
	@Input() toolTipStatus = false;
	@Input() isDisabled = false;
	@Input() metricsParent = '';
	@Input() isAdminRequired = false;
	@Input() isRebootRequired = false;
	@Input() label = '';
	@Input() fnCtrltoolTip = false;
	@Input() tooltipContent = [];
	@Input() headingLevel: number;

	public contentExpand = false;
	@Input() isMetricsEnabled = true;

	@ViewChild('rightToolTip1', { static: false }) rightToolTip1: ElementRef;
	@ViewChild('rightToolTip2', { static: false }) rightToolTip2: ElementRef;
	@ViewChild('rightToolTip3', { static: false }) rightToolTip3: ElementRef;
	@ViewChild('captionRef', { static: false }) captionRef: ElementRef;
	@ViewChildren(NgbTooltip) toolTips: QueryList<NgbTooltip>;
	scrollEvent = new Subject();

	subscriptionList = [];

	constructor(
		public dialog: MatDialog,
		private deviceService: DeviceService,
		private translate: TranslateService,
		private ngZone: NgZone
	) {
		super();
	}

	ngAfterViewInit(): void {
		try {
			Array.from(this.captionRef.nativeElement.querySelectorAll('a')).forEach(
				(element: any) => {
					element.setAttribute('id', 'modern-standby-link');
					element.setAttribute('class', 'modern-standby');
				}
			);
		} catch (error) { }
	}

	ngOnInit() {
		this.childContent = {};
		this.childContent.innerHTML = '';
	}

	public onOnOffChange($event) {
		const activeElement = document.activeElement as HTMLElement;
		this.toggleOnOff.emit($event);
		this.rebootConfirm($event);
	}
	public rebootConfirm($event) {
		const activeElement = document.activeElement as HTMLElement;
		if (
			this.title ===
			this.translate.instant(
				'device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSectionTwo.title'
			) ||
			this.isRebootRequired
		) {
			this.isSwitchChecked = !this.isSwitchChecked;
			const modalRef = this.dialog.open(ModalRebootConfirmComponent, {
				autoFocus: true,
				hasBackdrop: true,
				disableClose: true,
				panelClass: 'Battery-Charge-Threshold-Modal',
			});
			if (this.isRebootRequired) {
				modalRef.componentInstance.description =
					'device.deviceSettings.inputAccessories.fnCtrlKey.restartNote';
			} else {
				modalRef.componentInstance.description =
					'device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.popup.description';
			}
			modalRef.afterClosed().subscribe(
				(result) => {
					if (result === 'enable') {
						this.rebootToggleOnOff.emit($event);
					} else if (result === 'close') {
						this.isSwitchChecked = !this.isSwitchChecked;
					}
					activeElement.focus();
				},
				(reason) => { }
			);
		} else {
			this.rebootToggleOnOff.emit($event);
		}
	}

	public onReadMoreClick($event) {
		this.readMoreClick.emit($event);
		this.contentExpand = true;
	}

	public onRightIconClick(tooltip, $event) {
		this.toggleToolTip(tooltip, true);
		this.tooltipClick.emit($event);
	}

	checkToolTips() {
		const subscription = this.scrollEvent
			.asObservable()
			.pipe(throttleTime(100))
			.subscribe((event) => {
				this.toggleToolTip(this.rightToolTip1);
				this.toggleToolTip(this.rightToolTip2);
				this.toggleToolTip(this.rightToolTip3);
			});
		this.subscriptionList.push(subscription);
	}

	public toggleToolTip(tooltip, canOpen = false) {
		if (tooltip) {
			if (tooltip.isOpen()) {
				tooltip.close();
			} else if (canOpen) {
				tooltip.open();
			}
		}
	}

	closeAllToolTips() {
		if (this.toolTips && this.toolTips.length > 0) {
			this.toolTips.forEach((element) => {
				this.closeToolTip(element);
			});
		}
	}
	closeToolTip(tooltip) {
		if (tooltip && tooltip.isOpen()) {
			tooltip.close();
		}
	}

	public onResetClick($event: Event) {
		this.resetClick.emit($event);
	}

	public onLinkClick(linkPath) {
		if (linkPath && linkPath.length > 0) {
			this.deviceService.launchUri(linkPath);
		}
	}
	voicePopUp() {
		const modalRef = this.dialog.open(ModalVoiceComponent, {
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'Voice-Modal',
		});
		modalRef.componentInstance.value = this.voiceValue;
		modalRef.componentInstance.metricsParent = this.metricsParent;
	}

	ngOnDestroy() {
		window.removeEventListener('scroll', () => { });
		this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
	}

	removeHTMLFormatting(source: string) {
		try {
			return source.replace(/<\/?.+?\/?>/g, ' ').replace(/  +/g, ' ');
		} catch (error) {
			return source;
		}
	}
}
