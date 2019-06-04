import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-ui-lighting-profile',
  templateUrl: './ui-lighting-profile.component.html',
  styleUrls: ['./ui-lighting-profile.component.scss']
})
export class UiLightingProfileComponent implements OnInit {
	@Input() public options: any;
  constructor() { }

  ngOnInit() {
  }


  
public effectopt = [
  {      
      name: 'gaming.lightingProfile.effect.option1',
      selectedOption: false,
      defaultOption: false,
      value: 1,
  },
  {     
      name: 'gaming.lightingProfile.effect.option2',
      selectedOption: false,
      defaultOption: true,
      value: 2,
  },
  {      
      name: 'gaming.lightingProfile.effect.option3',
      selectedOption: false,
      defaultOption: false,
      value: 3,
  }
];

}
