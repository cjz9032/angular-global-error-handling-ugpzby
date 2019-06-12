import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'vtr-ui-checkbox',
  templateUrl: './ui-checkbox.component.html',
  styleUrls: ['./ui-checkbox.component.scss']
})
export class UiCheckboxComponent implements OnInit {

  @Input() radioId: string;
	@Input() group: string;
	@Input() label: string;
	@Input() tooltip: string;
	@Input() value: string;
	@Input() checked: boolean;
	@Input() disabled: boolean;

	@Output() change: EventEmitter<any> = new EventEmitter();

  constructor() { }

	ngOnInit() {
	}

	onChange(event) {
		this.change.emit(event);
	}

}
