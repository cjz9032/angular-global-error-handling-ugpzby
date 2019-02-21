import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-connected-home-security',
	templateUrl: './connected-home-security.component.html',
	styleUrls: ['./connected-home-security.component.scss']
})
export class ConnectedHomeSecurityComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

	startTrial(event) {
		console.log('startTrial', event);
	}

	enterActivationCode(event) {
		console.log('enterActivationCode', event);
	}
}
