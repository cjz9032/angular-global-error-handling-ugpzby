import { EventEmitter, Injectable } from '@angular/core';
import { PermitItem, PermitItemInputData } from '../permit-item';
import { PermitComponent } from '../permit/permit.component';

export interface OneClickScan {
	data: PermitItemInputData;
	allow: EventEmitter<boolean>;
	allowEmitter();
	disallowEmitter();
}

@Injectable({
	providedIn: 'root'
})
export class RegistrationComponentService {
	private permitComponents = [PermitComponent, PermitComponent];
	constructor() {
	}

	getComponents() {
		return this.permitComponents
			.map(((component, index) => new PermitItem(component, {index, length: this.permitComponents.length})));
	}
}
