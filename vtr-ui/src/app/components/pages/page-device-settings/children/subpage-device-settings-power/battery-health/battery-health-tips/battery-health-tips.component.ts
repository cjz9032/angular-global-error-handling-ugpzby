import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { BatteryCapacityCircleStyle } from '../battery-health.enum';
import { BatteryHealthService } from '../battery-health.service';

@Component({
  selector: 'vtr-battery-health-tips',
  templateUrl: './battery-health-tips.component.html',
  styleUrls: ['./battery-health-tips.component.scss']
})
export class BatteryHealthTipsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
