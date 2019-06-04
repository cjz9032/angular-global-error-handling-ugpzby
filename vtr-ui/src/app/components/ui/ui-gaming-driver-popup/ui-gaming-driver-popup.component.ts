import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-ui-gaming-driver-popup',
  templateUrl: './ui-gaming-driver-popup.component.html',
  styleUrls: ['./ui-gaming-driver-popup.component.scss']
})
export class UiGamingDriverPopupComponent implements OnInit {
	@Input() showMePartially: boolean;
  constructor() { }

  ngOnInit() {
  }
  close(){
	this.showMePartially = !this.showMePartially;
  }

}
