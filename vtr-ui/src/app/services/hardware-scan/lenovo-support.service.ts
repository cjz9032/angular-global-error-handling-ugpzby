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
	private static readonly ProblemType = '/hardware/repair/';

	private deviceInfo: Promise<MyDevice>;

	constructor(
		deviceService: DeviceService,
		private hardwareScanService: HardwareScanService,
		private logger: LoggerService
	) {
		this.deviceInfo = deviceService.getDeviceInfo();
	}

	public async getETicketUrl(): Promise<string> {
		const machineSerialNumber = (await this.deviceInfo).sn;
		const scanDate =  this.hardwareScanService.getFinalResultStartDate();

		// new e-Ticket url is as follows:
		//   https://support.lenovo.com/servicerequest?SerialNumber=xxxxxxx&ProblemType=/hardware/repair/&DiagnosticsCode=xxxxxx&DiagnosticsDate=yyyy-MM-dd
		const urlParameters = new HttpParams()
			.set('SerialNumber', machineSerialNumber)
			.set('ProblemType', LenovoSupportService.ProblemType)
			.set('DiagnosticsCode', this.hardwareScanService.getFinalResultCode())
			.set('DiagnosticsDate', formatDate(scanDate, "yyyy-MM-dd", 'en-US'))

		let url = new URL(LenovoSupportService.ServiceRequestPath, LenovoSupportService.LenovoSupportBaseUrl);
		url.search = urlParameters.toString();

		this.logger.info('[LenovoSupportService.getETicketUrl] URL:', url.toString());
		return url.toString();
	}
}
