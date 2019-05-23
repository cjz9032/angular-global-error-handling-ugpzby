import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-ui-popover',
  templateUrl: './ui-popover.component.html',
  styleUrls: ['./ui-popover.component.scss']
})
export class UiPopoverComponent implements OnInit {

  @Input() showMePartially: boolean;

  constructor() { }

  ngOnInit() {
  }
  close(){
	this.showMePartially = !this.showMePartially;
  }
}
