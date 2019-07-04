import {
	Injectable
} from '@angular/core';
import {
	SecurityAdvisor
} from '@lenovo/tan-client-bridge';

@Injectable({
	providedIn: 'root',
})
export class SecurityAdvisorMockService {
	public getSecurityAdvisor(): SecurityAdvisor {
		return undefined;
	}
}
