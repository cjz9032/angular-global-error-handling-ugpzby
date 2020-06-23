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
	private static readonly LenovoSupportBaseUrl = 'https://pcsupport.lenovo.com';
	private static readonly ETicketUrlPath = 'eticketwithservice';

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

		// base64EncodedParams is as follows:
		//   base64(SerialNumber=<machine serial number>&DiagCode=<scan final result code>&Channel=vantage&TestDate=<scan start date>)
		const scanParameters = new HttpParams()
			.set('SerialNumber', machineSerialNumber)
			.set('DiagCode', this.hardwareScanService.getFinalResultCode())
			.set('Channel', 'vantage')
			.set('TestDate', formatDate(scanDate, 'yyyyMMdd', 'en-US'))
		const base64Parameters = btoa(scanParameters.toString());

		// e-Ticket url is as follows:
		//   https://pcsupport.lenovo.com/eticketwithservice?data=<base64EncodedParams>
		const urlParameters = new HttpParams()
			.set('data', base64Parameters);
		let url = new URL(LenovoSupportService.ETicketUrlPath, LenovoSupportService.LenovoSupportBaseUrl);
		url.search = urlParameters.toString();

		this.logger.info('[LenovoSupportService.getETicketUrl] URL:', url.toString());
		return url.toString();
	}
}
