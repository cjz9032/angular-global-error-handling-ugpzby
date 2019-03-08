import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-connected-home',
	templateUrl: './connected-home.component.html',
	styleUrls: ['./connected-home.component.scss']
})
export class ConnectedHomeComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

	tryNow(event) {
		console.log('tryNow', event);
	}

	enterActivationCode(event) {
		console.log('enterActivationCode', event);
	}
}
