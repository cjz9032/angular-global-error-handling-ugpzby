import { Injectable } from '@angular/core';
import { ForteClient } from './forte-client.interface';
//
// declare const VantageShellExtension: {
// 	ForteRpcClient: {
// 		getInstance();
// 	}
// };

@Injectable({
	providedIn: 'root'
})
export class ForteClientService {
	forteClient: ForteClient;

	constructor() {
		this.forteClient = (window as any).VantageShellExtension.ForteRpcClient.getInstance();
	}
}
