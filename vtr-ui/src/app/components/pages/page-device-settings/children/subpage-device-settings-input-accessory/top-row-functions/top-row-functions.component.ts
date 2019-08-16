import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vtr-top-row-functions',
  templateUrl: './top-row-functions.component.html',
  styleUrls: ['./top-row-functions.component.scss']
})
export class TopRowFunctionsComponent implements OnInit {

  public isHotKeys = true;
	public isFnKeys = false;
  public stickyFunStatus = false;
  
  constructor() { }

  ngOnInit() {
  }
	public onChanggeKeyType(event: any, value: string) {
		console.log(value, '------------------> log here');
		if (value === '1') {
			this.isHotKeys = true;
			this.isFnKeys = false;
		} else {
			this.isHotKeys = false;
			this.isFnKeys = true;
		}
  }
  public onStickyFunToggle(event: any) {
		this.stickyFunStatus = event.switchValue;
	}
}
