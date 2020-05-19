import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-popover',
	templateUrl: './ui-popover.component.html',
	styleUrls: ['./ui-popover.component.scss']
})
export class UiPopoverComponent implements OnInit {
	@Input() showMePartially: boolean;
	@Input() item: any;
	@Output() closeClicked = new EventEmitter<any>();
	@Input() descriptionLabel = 'Gaming popover opened';
	isNowOpened = false;
	@Input() automationId: string;
	constructor() { }

	ngOnInit() {
		this.focusElement('ui-popover');
		setTimeout(() => {
			this.isNowOpened = true;
		}, 10);
	}

	close() {
		this.showMePartially = !this.showMePartially;
		this.closeClicked.emit(this.item);
		this.focusElement('#main-wrapper');
	}

	onOutsideClick() {
		if (this.isNowOpened) {
			this.close();
		}
	}

		focusElement(selector) {
		const targetElement = document.querySelector(selector) as HTMLElement;
		if(targetElement){
			targetElement.focus();
		}
	}

	runappKeyup(event) {
		if (event.which === 9) {
			setTimeout(() => {
				this.focusElement("ui-popover");
			}, 2);
		}
	}
}
