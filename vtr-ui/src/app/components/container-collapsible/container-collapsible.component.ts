import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'vtr-container-collapsible',
  templateUrl: './container-collapsible.component.html',
  styleUrls: ['./container-collapsible.component.scss']
})
export class ContainerCollapsibleComponent implements OnInit {

  @Input()
  header:string;
  constructor() { }
	isCollapsed:boolean=false;
  ngOnInit() {
  }


}
