import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'vtr-big-pitch',
	templateUrl: './big-pitch.component.html',
	styleUrls: ['./big-pitch.component.scss']
})
export class BigPitchComponent {
	@Output() clickMore = new EventEmitter();
}
