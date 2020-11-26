import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'vtr-ui-question-mark-button',
	templateUrl: './ui-question-mark-button.component.html',
	styleUrls: ['./ui-question-mark-button.component.scss'],
})
export class UiQuestionMarkButtonComponent implements OnInit {
	@Input() componentId: string;
	@Input() componentRole: string;
	@Input() tabIndex: number;
	@Input() ariaLabel: string;
	@Input() isGray = false;
	@Output() clickEvent: EventEmitter<Event> = new EventEmitter<Event>();
	@Output() blurEvent: EventEmitter<Event> = new EventEmitter<Event>();

	constructor() {}

	ngOnInit(): void {
		this.tabIndex = this.tabIndex ?? 0;
		this.componentRole = this.componentRole ?? 'img';
	}

	public onClickEvent(event: Event): void {
		this.clickEvent.emit(event);
	}

	public onBlurEvent(event: Event): void {
		this.blurEvent.emit(event);
	}
}
