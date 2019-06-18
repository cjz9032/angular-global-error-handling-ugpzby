import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vtr-ui-time-picker',
  templateUrl: './ui-time-picker.component.html',
  styleUrls: ['./ui-time-picker.component.scss']
})
export class UiTimePickerComponent implements OnInit {
	@Input() isCollapsed = true;
	@Input() allowCollapse = true;
	@Input() theme = 'white';

	@Output() toggle = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public onToggle() {
	this.isCollapsed = !this.isCollapsed;
	this.toggle.emit(this.isCollapsed);
}
}
