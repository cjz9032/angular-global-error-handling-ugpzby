import { Injectable } from '@angular/core';
import {merge, Subject, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateTriggersService {
	windowFocused$ = new Subject<boolean>();
	shouldUpdate$ = merge(this.windowFocused$, timer(0, 30000));

	constructor() { }
}
