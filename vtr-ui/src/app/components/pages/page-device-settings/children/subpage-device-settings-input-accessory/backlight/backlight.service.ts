import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BacklightService {

	constructor() {
	}

	get backlight$(): Observable<Backlight> {
		return
	}
}
