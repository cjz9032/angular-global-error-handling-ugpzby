import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'vtr-ui-group-card',
	templateUrl: './ui-group-card.component.html',
	styleUrls: ['./ui-group-card.component.scss'],
})
export class UiGroupCardComponent implements OnInit {
	@Input() title = '';
	@Input() refreshButtonText = '';
	@Output() refreshClicked = new EventEmitter();

	constructor() {}

	ngOnInit(): void {}

	onRefreshClicked() {
		this.refreshClicked.emit();
	}
}
