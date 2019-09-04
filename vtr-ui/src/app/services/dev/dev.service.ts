import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class DevService {

	log = '';

	constructor(private logger: LoggerService) { }

	writeLog(...args) {
		const self = this;
		self.log += ' \n';
		args.forEach(arg => {
			if (typeof arg === 'object') {
				self.log += JSON.stringify(arg, null, 2);
			} else {
				self.log += arg + ' ';
			}
		});
		this.logger.info('DevService.writeLog', this.log);
	}
}
