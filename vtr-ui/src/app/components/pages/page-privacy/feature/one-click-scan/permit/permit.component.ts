import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { OneClickScan } from '../services/registration-component.service';
import { PermitItemInputData } from '../permit-item';
import { PERMIT_ITEM_DATA } from '../../../utils/injection-tokens';

@Component({
	selector: 'vtr-permit',
	templateUrl: './permit.component.html',
	styleUrls: ['./permit.component.scss']
})
export class PermitComponent implements OneClickScan {
	@Input() data: PermitItemInputData;
	@Output() allow = new EventEmitter<boolean>();

	constructor(@Inject(PERMIT_ITEM_DATA) private permitItemData) {}

	ngOnInit() {
		console.log(this.permitItemData);
	}

	allowEmitter() {
		this.allow.emit(true);
	}

	disallowEmitter() {
		this.allow.emit(false);
	}

}
