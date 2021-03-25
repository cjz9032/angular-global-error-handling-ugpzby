import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
	selector: 'vtr-search-input-widget',
	templateUrl: './search-input-widget.component.html',
	styleUrls: ['./search-input-widget.component.scss'],
})
export class SearchInputWidgetComponent {
	@Input() input: string = '';
	@Output() inputChange = new EventEmitter<string>();
	@Output() search = new EventEmitter();
	@Input() disabled: boolean = false;
	@Input() iconClickable: boolean = false;
	@Input() showSearchButton: boolean = true;
	@Input() placeholder: string = '';
	@Input() maxlength: number = 30;
	@ViewChild('inputCtrl') inputCtrl: any;

	constructor() {}

	onClickSearch() {
		this.search.emit();
	}

	onInputEnterKeyDown() {
		if (this.disabled) {
			return;
		}

		this.search.emit();
	}

	onClickInput() {
		setTimeout(() => {
			this.inputCtrl?.focus();
		}, 200);
	}

	onInputChange() {
		this.inputChange.emit(this.input);
	}

	setInputFocus() {
		this.inputCtrl?.focus();
	}
}
