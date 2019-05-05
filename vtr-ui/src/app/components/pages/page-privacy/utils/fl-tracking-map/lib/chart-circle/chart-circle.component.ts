import {Component, OnInit, Input} from '@angular/core';
import { ChartCircleProps } from '../../tracking-map-base/ChartCore/ChartCircles';

@Component({
	selector: '[fl-chart-circle]',
	templateUrl: './chart-circle.component.html',
	styleUrls: ['./chart-circle.component.scss']
})
export class ChartCircleComponent implements OnInit {
	@Input() circles: ChartCircleProps;

	constructor() {
	}

	ngOnInit() {
	}

}
