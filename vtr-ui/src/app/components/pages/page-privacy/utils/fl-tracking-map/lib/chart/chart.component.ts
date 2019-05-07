import {Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList} from '@angular/core';

import {ChartCore} from '../../tracking-map-base/ChartCore';
import {ChartLineComponent} from '../chart-line/chart-line.component';
import {ChartPieLine_NULL, ChartPieLine} from '../../tracking-map-base/ChartCore/ChartPieLine';
import { ImageComponent } from '../image/image.component';

const MAX_TRACKERS = 15;

@Component({
	selector: '[fl-chart]',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
	@ViewChildren(ChartLineComponent) chartLines: QueryList<ChartLineComponent>;

	@Input() chart: ChartCore;

	@Input() hitboxEnabled = true;

	@Output() selectTracker = new EventEmitter<ChartPieLine>();
	@Output() selectAll = new EventEmitter<null>();
	@Output() showDetails = new EventEmitter<ChartPieLine>();

	@Output() loadError = new EventEmitter<ImageComponent>();

	constructor() {
	}

	ngOnInit() {
	}

	get chartLineData() {
		let pieLineData = this.chart.chartPieData.pieLineData;
		const lenDiff = MAX_TRACKERS - pieLineData.length;

		if (lenDiff > 0) {
			pieLineData = [...pieLineData];
			for (let i = 0; i < lenDiff; i++) {
				pieLineData.push(ChartPieLine_NULL);
			}
		}

		return pieLineData;
	}

	updateLines() {
		this.chartLines.forEach(lines => {
			lines.update();
		});
	}

	trackPieLine(index: number, line) {
		return line ? index : null;
	}

	onLoadError(event) {
		this.loadError.emit(event);
	}

}
