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

  toggle(){
    this.active = !this.active;
  }
  select(value){
    this.value = value;
    this.active = !this.active;
  }

  constructor() { }

  ngOnInit() { }

}
