import { Injectable } from '@angular/core';
import { ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';

@Injectable({
	providedIn: 'root',
})
export class HomeSecurityMockService {
	public getConnectedHomeSecurity(): any {
		return undefined;
	}
}
