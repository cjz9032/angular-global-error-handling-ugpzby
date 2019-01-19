import { Injectable } from '@angular/core';

@Injectable()
export class DevService {

	log = 'v0.0.6';

	constructor() { }

	writeLog(...args) {
		console.log('DEV LOG', args);
		const self = this;
		self.log += ' \n';
		args.forEach(arg => {
			if (typeof arg === 'object') {
				self.log += JSON.stringify(arg, null, 2);
			} else {
				self.log += arg + ' ';
			}
		});
	}
}
