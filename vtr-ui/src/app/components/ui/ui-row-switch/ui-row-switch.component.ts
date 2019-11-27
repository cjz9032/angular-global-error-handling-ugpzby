import {
	Component,
	OnInit,
	Input,
	ViewChild,
	Output,
	EventEmitter
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBatteryChargeThresholdComponent } from '../../modal/modal-battery-charge-threshold/modal-battery-charge-threshold.component';
import { ModalRebootConfirmComponent } from '../../modal/modal-reboot-confirm/modal-reboot-confirm.component';
import { BaseComponent } from '../../base/base.component';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalVoiceComponent } from '../../modal/modal-voice/modal-voice.component';


@Component({
	selector: 'vtr-ui-row-switch',
	templateUrl: './ui-row-switch.component.html',
	styleUrls: ['./ui-row-switch.component.scss'],
	exportAs: 'uiRowSwitch'
})
export class UiRowSwitchComponent extends BaseComponent implements OnInit {
	@ViewChild('childContent', { static: false }) childContent: any;

	// Use Fort Awesome Font Awesome Icon Reference Array (library, icon class) ['fas', 'arrow-right']
	@Input() rightIcon = [];
	@Input() leftIcon = [];
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
	public contentExpand = false;


	// private tooltip: NgbTooltip;

	constructor(
		public modalService: NgbModal, private deviceService: DeviceService, private translate: TranslateService,
	) { super(); }


	ngOnInit() {
		this.childContent = {};
		this.childContent.innerHTML = '';
		// this.commonService.notification.subscribe((notification: AppNotification) => {
		// 	this.onNotification(notification);
		// });
	}

	public onOnOffChange($event) {
		// if (this.title === 'Battery Charge Threshold') {
		if (this.title === this.translate.instant('device.deviceSettings.power.batterySettings.batteryThreshold.title')) {
			this.isSwitchChecked = !this.isSwitchChecked;
			if (this.isSwitchChecked) {
				const modalRef = this.modalService.open(ModalBatteryChargeThresholdComponent, {
					backdrop: 'static',
					centered: true,
					windowClass: 'Battery-Charge-Threshold-Modal'
				});

				modalRef.componentInstance.title = 'device.deviceSettings.power.batterySettings.batteryThreshold.popup.title';
				modalRef.componentInstance.description1 = 'device.deviceSettings.power.batterySettings.batteryThreshold.popup.description1';
				modalRef.componentInstance.description2 = 'device.deviceSettings.power.batterySettings.batteryThreshold.popup.description2';
				modalRef.componentInstance.positiveResponseText = 'device.deviceSettings.power.batterySettings.batteryThreshold.popup.enable';
				modalRef.componentInstance.negativeResponseText = 'device.deviceSettings.power.batterySettings.batteryThreshold.popup.cancel';

				modalRef.result.then(
					result => {
						if (result === 'positive') {
							this.toggleOnOff.emit($event);
						} else if (result === 'negative') {
							this.isSwitchChecked = !this.isSwitchChecked;
						}
					},
					reason => {
					}
				);
			} else {
				this.toggleOnOff.emit($event);
			}
		} else {
			this.toggleOnOff.emit($event);
		}
		this.rebootConfirm($event);
	}
	public rebootConfirm($event) {
		if (this.title === this.translate.instant('device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSectionTwo.title') || this.isRebootRequired) {
			this.isSwitchChecked = !this.isSwitchChecked;
			const modalRef = this.modalService.open(ModalRebootConfirmComponent, {
				backdrop: 'static',
				size: 'sm',
				centered: true,
				windowClass: 'Battery-Charge-Threshold-Modal'
			});
			if (this.isRebootRequired) {
				modalRef.componentInstance.description = 'device.deviceSettings.inputAccessories.fnCtrlKey.restartNote';
			} else {
				modalRef.componentInstance.description = 'device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.popup.description';
			}
			modalRef.result.then(
				result => {
					if (result === 'enable') {
						this.rebootToggleOnOff.emit($event);
					} else if (result === 'close') {
						this.isSwitchChecked = !this.isSwitchChecked;
					}
				},
				reason => {
				}
			);

		} else {
			this.rebootToggleOnOff.emit($event);
		}
	}

	public onReadMoreClick($event) {
		this.readMoreClick.emit($event);
		this.contentExpand = true;
	}

	public onRightIconClick($event) {
		this.tooltipClick.emit($event);
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
		console.log('modal open');
		console.log(this.voiceValue);
		const modalRef = this.modalService.open(ModalVoiceComponent,
			{
				backdrop: 'static',
				size: 'sm',
				centered: true,
				windowClass: 'Voice-Modal',
			});
		modalRef.componentInstance.value = this.voiceValue;
		modalRef.componentInstance.metricsParent = this.metricsParent;
	}
	// private closeTooltip($event: Event) {
	// 	if (!$event.srcElement.classList.contains('fa-question-circle') && this.tooltip && this.tooltip.isOpen()) {
	// 		this.tooltip.close();
	// 	}
	// }

	// private onNotification(notification: AppNotification) {
	// 	const { type, payload } = notification;
	// 	switch (type) {
	// 		case AppEvent.Click:
	// 			this.closeTooltip(payload);
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }

}
