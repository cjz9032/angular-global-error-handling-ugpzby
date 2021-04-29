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
	templateUrl: './modal-smart-privacy-subscribe.component.html',
	styleUrls: ['./modal-smart-privacy-subscribe.component.scss'],
})
export class ModalSmartPrivacySubscribeComponent implements OnInit {
	paymentUrl: string;
	constructor(
		public dialogRef: MatDialogRef<ModalSmartPrivacySubscribeComponent>,
		private deviceService: DeviceService,
	) { }

	ngOnInit() {
		this.deviceService.getMachineInfo().then((machineInfo) => {
			this.paymentUrl = `${environment.pcSupportApiRoot}/smartprivacy?serial=${machineInfo?.serialnumber}&mtm=${machineInfo?.mtm}`;
		});
	}

	closeModal() {
		this.dialogRef.close('close');
	}
}
