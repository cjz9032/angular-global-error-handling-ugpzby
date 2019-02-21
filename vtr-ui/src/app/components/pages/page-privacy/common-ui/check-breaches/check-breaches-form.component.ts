import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerCommunicationService } from '../../common-services/server-communication.service';

@Component({
	selector: 'vtr-check-breaches-form',
	templateUrl: './check-breaches-form.component.html',
	styleUrls: ['./check-breaches-form.component.scss'],
})
export class CheckBreachesFormComponent implements OnInit {
	public isLoading: boolean;
	public lenovoId: string;
	public islenovoIdOpen: boolean;
	public isFormFocused: boolean;
	public inputValue: string;

	constructor(public router: Router, private serverCommunication: ServerCommunicationService) {
		this.isLoading = false;
		this.islenovoIdOpen = false;
		this.isFormFocused = false;
		this.inputValue = '';
	}

	ngOnInit() {
		this.serverCommunication.getLenovoId().then((lenovoId: string) => {
			this.lenovoId = lenovoId;
		});
	}

	changeInputValue(event) {
		this.inputValue = event.target.value;
		if (this.lenovoId && this.lenovoId.includes(this.inputValue)) {
			this.openLenovoId();
		} else {
			this.closeLenovoId();
		}
	}

	handleFocus() {
		this.isFormFocused = true;
		this.openLenovoId();
	}

	handleBlur() {
		this.isFormFocused = false;
		setTimeout(() => {
			this.closeLenovoId();
		}, 200); // added because blur event should be after 'id' selection by click
	}

	openLenovoId() {
		this.islenovoIdOpen = true;
	}

	closeLenovoId() {
		this.islenovoIdOpen = false;
	}

	setLenovoId() {
		this.inputValue = this.lenovoId;
		this.closeLenovoId();
	}

	scanEmail(event) {
		event.preventDefault();
		// TODO validate this.inputValue here
		this.isLoading = true;
		this.serverCommunication.getBreachedAccounts(this.inputValue).then((breachesArr) => {
			console.log('breachesArr', breachesArr);
			this.isLoading = false;
			this.router.navigate(['privacy/result']);
		});
	}
}
