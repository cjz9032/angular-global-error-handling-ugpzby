import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-dropdown',
	templateUrl: './ui-dropdown.component.html',
	styleUrls: ['./ui-dropdown.component.scss']
})
export class UiDropdownComponent implements OnInit {
<<<<<<< HEAD
  @Input() list :[];
  @Input() title :string;
  active :boolean = false;
  value :number = 0;
  name :string = 'Never';

  toggle(){
    this.active = !this.active;
  }
  select(i){
    this.value = i.value;
    this.name = i.name;

    this.active = !this.active;
  }
=======
	@Input() list: [];
	@Input() title: string;
	active = false;
	value = 0;

	toggle() {
		this.active = !this.active;
	}
	select(value) {
		this.value = value;
		this.active = !this.active;
	}
>>>>>>> b8006f0e0e36ee254a4be04a4c5130b359954e6e

	constructor() { }

	ngOnInit() { }

}
