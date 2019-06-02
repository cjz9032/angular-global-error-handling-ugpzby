import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-ui-dropdown',
  templateUrl: './ui-dropdown.component.html',
  styleUrls: ['./ui-dropdown.component.scss']
})
export class UiDropdownComponent implements OnInit {
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

  constructor() { }

  ngOnInit() { }

}
