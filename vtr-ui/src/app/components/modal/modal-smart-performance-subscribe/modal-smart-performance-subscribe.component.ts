import {
	Component,
	OnInit,
	HostListener,
	Output,
	EventEmitter,
} from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

import { PaymentPage } from 'src/app/enums/smart-performance.enum';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { DeviceService } from 'src/app/services/device/device.service';


@Component({
	selector: 'vtr-modal-smart-performance-subscribe',
	templateUrl: './modal-smart-performance-subscribe.component.html',
	styleUrls: ['./modal-smart-performance-subscribe.component.scss'],
})
export class ModalSmartPerformanceSubscribeComponent implements OnInit {

	paymentUrl: string;
	@Output() cancelPaymentRequest: EventEmitter<any> = new EventEmitter();

	constructor(
		public dialogRef: MatDialogRef<ModalSmartPerformanceSubscribeComponent>,
		private smartPerformanceService: SmartPerformanceService,
		private deviceService: DeviceService,
	) { }

	ngOnInit() {
		this.deviceService.getMachineInfo().then((machineInfo) => {
			this.paymentUrl = `${environment.pcSupportApiRoot}/upgradewarranty?serial=${machineInfo?.serialnumber}&mtm=${machineInfo?.mtm}&smartperformance=true&source=COMPANION`;
		});
	}

	closeModal() {
		const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		const intervalTime = moment(currentTime)
			.add(PaymentPage.ORDERWAITINGTIME, 'm')
			.format('YYYY-MM-DD HH:mm:ss');
		this.smartPerformanceService.modalStatus.initiatedTime = intervalTime;
		this.smartPerformanceService.modalStatus.isGettingStatus = true;
		this.cancelPaymentRequest.emit();
		this.dialogRef.close('close');
	}

	@HostListener('document:keydown.tab', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (
			document.activeElement &&
			document.activeElement.id.includes('smart-performance-subscribe-dialog-close-button')
		) {
			(document.querySelector('.subscribe-modal') as HTMLElement).focus();
			event.preventDefault();
			event.stopPropagation();
		}
	}

	@HostListener('window: focus', ['$event'])
	onFocus(): void {
		if (
			!document.activeElement ||
			!document.activeElement.id.includes('smart-performance-subscribe-dialog-close-button')
		) {
			const modal = document.querySelector('.subscribe-modal') as HTMLElement;
			modal.focus();
		}
	}

}
