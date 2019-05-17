import { Injectable, Type } from '@angular/core';

export interface PermitItemInputData {
	index: number;
	length: number;
}

@Injectable()
export class PermitItem {
	constructor(public component: Type<any>, public data: PermitItemInputData) {}
}
