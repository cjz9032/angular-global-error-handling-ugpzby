import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class DccService {

	public showDemo = false;
	public isDccDevice = false;

	constructor(
		private modalService: NgbModal,
		private logger: LoggerService,
		private vantageShellService: VantageShellService
	) { }

	public isDccCapableDevice(): Promise<boolean> {
		return new Promise(resolve => {
			const filter: Promise<any> = this.vantageShellService.calcDeviceFilter('{"var":"DeviceTags.System.DccGroup"}');
			if (filter) {
				filter.then((hyp) => {
					this.isDccDevice = hyp === 'true';
					resolve(this.isDccDevice);
				}, (error) => {
					this.logger.error('DccService.isDccDeviceCapableDevice: promise error ', error);
					resolve(false);
				});
			}
		});
	}

	public canShowDccDemo(): Promise<boolean> {
		return new Promise(resolve => {
			const filter: Promise<any> = this.vantageShellService.calcDeviceFilter('{"var":"DeviceTags.System.Demo"}');
			if (filter) {
				filter.then((hyp) => {
					this.showDemo = hyp === 'CES-2019';
					resolve(this.showDemo);
				}, (error) => {
					this.logger.error('DccService.canShowDccDemo: promise error ', error);
					resolve(false);
				});
			}
		});
	}
}
