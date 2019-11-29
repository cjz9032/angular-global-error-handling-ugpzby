import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class DevService {
	constructor(private logger: LoggerService) { }

	writeLog(...args) {
		let log = '';
		args.forEach(arg => {
			if (typeof arg === 'object') {
				log += JSON.stringify(arg, null, 2);
			} else {
				log += arg + ' ';
			}
		});
		this.logger.info('DevService.writeLog', log);
	}
}
