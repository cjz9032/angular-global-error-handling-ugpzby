import { Component, OnInit, Input } from '@angular/core';
import { interval } from '../../../data-models/common/interval.model'

@Component({
  selector: 'vtr-oled-power-settings',
  templateUrl: './oled-power-settings.component.html',
  styleUrls: ['./oled-power-settings.component.scss']
})
export class OledPowerSettingsComponent implements OnInit {
  @Input() description : any ;
  
  interval: interval[];
  title: string;

	constructor() { }

	ngOnInit() { 
    this.interval = [{
      name: 'On',
      value: 0
    },
    {
      name: '30',
      value: 30
    },
    {
      name: '1',
      value: 60
    },
    {
      name: '2',
      value: 120
    },
    {
      name: '3',
      value: 180
    },
    {
      name: '5',
      value: 300
    },
    {
      name: '10',
      value: 600
    },
    {
      name: '20',
      value: 1200
    },
    {
      name: 'Never',
      value: 0
    }]

    this.title = 'Minute';

  }
}
