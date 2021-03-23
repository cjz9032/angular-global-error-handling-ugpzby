import {
	Component,
	OnInit,
	HostListener,
	Output,
	EventEmitter,
} from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';

import { environment } from 'src/environments/environment';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-modal-warranty-cart',
	templateUrl: './modal-warranty-cart.component.html',
	styleUrls: ['./modal-warranty-cart.component.scss'],
})
export class ModalWarrantyCartComponent implements OnInit {
	machineType: any;
	systemSerialNumber: any;
	systemMTM: any;
	countryCode: any;
	langCode: any;
	paymentUrl: string;
	@Output() cancelPaymentRequest: EventEmitter<any> = new EventEmitter();

	constructor(
		public dialogRef: MatDialogRef<ModalWarrantyCartComponent>,
		private deviceService: DeviceService,
	) { }

	ngOnInit() {
		this.deviceService.getMachineInfo().then(async (machineInfo) => {
			this.paymentUrl = `${environment.pcSupportApiRoot}/upgradewarranty?serial=${machineInfo?.serialnumber}&mtm=${machineInfo?.mtm}&source=companion`;
		});
	}

	closeModal() {
		this.dialogRef.close('close');
	}

	@HostListener('document:keydown.tab', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (
			document.activeElement &&
			document.activeElement.id.includes('warranty-cart-dialog-close-button')
		) {
			(document.querySelector('.warranty-cart-modal') as HTMLElement).focus();
			event.preventDefault();
			event.stopPropagation();
		}
	}

	@HostListener('window: focus', ['$event'])
	onFocus(): void {
		if (
			!document.activeElement ||
			!document.activeElement.id.includes('warranty-cart-dialog-close-button')
		) {
			const modal = document.querySelector('.warranty-cart-modal') as HTMLElement;
			modal.focus();
		}
	}
}
