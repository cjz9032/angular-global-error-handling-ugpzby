import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-widget-speedometer',
  templateUrl: './widget-speedometer.component.html',
  styleUrls: ['./widget-speedometer.component.scss']
})
export class WidgetSpeedometerComponent implements OnInit {

  
	@Input() speedLabel = 'Scanning';
	@Input() speedCurrent = 25;
	@Input() speedMax = 50;

	constructor() { }

	ngOnInit() {
	}

	getRightDeg(current, max) {
		const pct = (current / max);
		const deg = 180 * pct;
		return deg;
	}

}
