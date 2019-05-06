import {Component, OnInit, Input} from '@angular/core';
import {MText} from '../../tracking-map-base/Text';

@Component({
	selector: '[fl-map-text]',
	templateUrl: './map-text.component.html',
	styleUrls: ['./map-text.component.scss']
})
export class MapTextComponent implements OnInit {

	@Input() text: MText;

	constructor() {
	}

	ngOnInit() {
	}

}
