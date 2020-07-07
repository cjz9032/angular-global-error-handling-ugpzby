import { Injectable } from '@angular/core';
import { HardwareScanService } from 'src/app/services/hardware-scan/hardware-scan.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import { HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Injectable({
	providedIn: 'root'
})
export class LenovoSupportService {
	private static readonly LenovoSupportBaseUrl = 'https://support.lenovo.com';
	private static readonly ServiceRequestPath = 'servicerequest';
	private static readonly ContactUsPath = 'contactus';
	private static readonly ProblemType = '/hardware/repair/';

	private deviceInfo: Promise<MyDevice>;

	constructor(
		deviceService: DeviceService,
		private hardwareScanService: HardwareScanService,
		private logger: LoggerService
	) {
		this.deviceInfo = deviceService.getDeviceInfo();
	}

	public async getETicketUrl(scanDate: Date, finalResultCode: string): Promise<string> {
		const machineSerialNumber = (await this.deviceInfo).sn;

		// new e-Ticket url is as follows:
		//   https://support.lenovo.com/servicerequest?SerialNumber=xxxxxxx&ProblemType=/hardware/repair/&DiagnosticsCode=xxxxxx&DiagnosticsDate=yyyy-MM-dd
		const urlParameters = new HttpParams()
			.set('SerialNumber', machineSerialNumber)
			.set('ProblemType', LenovoSupportService.ProblemType)
			.set('DiagnosticsCode', finalResultCode)
			.set('DiagnosticsDate', formatDate(scanDate, "yyyy-MM-dd", 'en-US'))

		let url = new URL(LenovoSupportService.ServiceRequestPath, LenovoSupportService.LenovoSupportBaseUrl);
		url.search = urlParameters.toString();

		this.logger.info('[LenovoSupportService.getETicketUrl] URL:', url.toString());
		return url.toString();
	}

	public async getContactusUrl(): Promise<string> {
		const machineSerialNumber = (await this.deviceInfo).sn;

		const urlParameters = new HttpParams()
			.set('SerialNumber', machineSerialNumber);

		let url = new URL(LenovoSupportService.ContactUsPath, LenovoSupportService.LenovoSupportBaseUrl);
		url.search = urlParameters.toString();

		return url.toString();
	}
}
