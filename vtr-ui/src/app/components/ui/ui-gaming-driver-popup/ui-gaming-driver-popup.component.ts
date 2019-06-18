import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'vtr-ui-gaming-driver-popup',
  templateUrl: './ui-gaming-driver-popup.component.html',
  styleUrls: ['./ui-gaming-driver-popup.component.scss']
})
export class UiGamingDriverPopupComponent implements OnInit {
	@Input() showMePartially: boolean;
  constructor( private Router: Router) { }

  ngOnInit() {
  }
  close(){
	this.showMePartially = !this.showMePartially;
  }

  systemUpdatePage() {
    this.Router.navigate(["device/system-updates"]);
  }

}
