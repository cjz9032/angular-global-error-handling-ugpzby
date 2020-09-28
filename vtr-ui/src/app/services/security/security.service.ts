import {
	Injectable
} from '@angular/core';


@Injectable({
	providedIn: 'root'
})
export class SecurityService {
	public colors = [
		{
			start: '#FF5B4D',
			end: '#DB221F'
		}, {
			start: '#EAB029',
			end: '#F0D662'
		}, {
			start: '#346CEF',
			end: '#2955BC'
		}, {
			start: '#00A886',
			end: '#00893A'
		}
	];
	constructor() {
	}

}
