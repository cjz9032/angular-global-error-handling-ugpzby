import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {

	appBrand = 'Lenovo';
	appName = 'Vantage';

	constructor() { }
}
