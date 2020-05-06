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
	private static readonly MinimumPluginVersionSupported = '1.0.44';
	private static readonly LenovoSupportBaseUrl = 'https://pcsupport.lenovo.com';
	private static readonly ETicketUrlPath = 'eticketwithservice';
	private static readonly PremierHomeUrlPath = 'premierhome'

	private hardwareScanBridge: any;
	private deviceInfo: Promise<MyDevice>;
	private isETicketAvailablePromise: Promise<any>;

	constructor(
		shellService: VantageShellService,
		deviceService: DeviceService,
		private hardwareScanService: HardwareScanService,
		private logger: LoggerService
	) {
		this.hardwareScanBridge = shellService.getHardwareScan();
		this.deviceInfo = deviceService.getDeviceInfo();
		this.startCheckingIfETicketIsAvailable();
	}

	public async startCheckingIfETicketIsAvailable() {
		const machineSerialNumber = (await this.deviceInfo).sn;
		this.isETicketAvailablePromise = this.isETicketAvailable(machineSerialNumber)
	}

	public async getSupportUrl(scanDate: Date): Promise<string> {
		try {
			const response = await this.isETicketAvailablePromise;

			if (response.isAvailable) {
				return this.getETicketUrl(scanDate);
			} else {
				return this.getPremierUrl();
			}
		} catch (ex) {
			this.logger.exception('[LenovoSupportService.getSupportUrl] Exception:', ex);
			return this.getPremierUrl();
		}
	}

	private async getETicketUrl(scanDate: Date): Promise<string> {
		const machineSerialNumber = (await this.deviceInfo).sn;

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

	public async getPremierUrl(): Promise<string> {
		const machineSerialNumber = (await this.deviceInfo).sn;

		// Premier home url is as follows:
		//   https://pcsupport.lenovo.com/premierhome?sn=<machine serial number>
		const urlParameters = new HttpParams()
			.set('sn', machineSerialNumber);
		let url = new URL(LenovoSupportService.PremierHomeUrlPath, LenovoSupportService.LenovoSupportBaseUrl);
		url.search = urlParameters.toString();

		this.logger.info('[LenovoSupportService.getPremierUrl] URL:', url.toString());
		return url.toString();
	}

	private isETicketAvailable(machineSerialNumber: string): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!this.hardwareScanService.isPluginCompatible(LenovoSupportService.MinimumPluginVersionSupported)) {
				reject('[LenovoSupportService.isETicketAvailable] IsETicketAvailable is not implemented on plugin ' +
					this.hardwareScanService.getPluginVersion());
			}

			if (this.hardwareScanBridge) {
				return this.hardwareScanBridge.isETicketAvailable(machineSerialNumber)
					.then((response) => {
						if (response) {
							resolve(response);
						} else {
							reject('[LenovoSupportService.isETicketAvailable] hardwareScanBridge.isETicketAvailable() ' +
								'returned a null or empty response');
						}
					})
					.catch((error) => {
						reject('[LenovoSupportService.isETicketAvailable] ' + error);
					});
			} else {
				reject('[LenovoSupportService.isETicketAvailable] Invalid hardwareScanBridge');
			}
		});
	}
}
