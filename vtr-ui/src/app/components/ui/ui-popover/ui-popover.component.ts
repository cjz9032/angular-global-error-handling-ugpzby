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
	constructor() { }

	ngOnInit() {
		document.getElementById('gamingPopover').focus();
	}

	close() {
		this.showMePartially = !this.showMePartially;
		this.closeClicked.emit(this.item);
		document.getElementById('main-wrapper').focus();
	}

	runappKeyup(event) {
		if (event.which == 9) {
			setTimeout(() => {
				document.getElementById('gamingPopupClose').focus();
			}, 2);
		}
	}

	runappKeyup(event) {
		if (event.which == 9) {
			const focusElem = document.getElementById('gaming_popup_close');
			focusElem.focus();
		}
	}
}
