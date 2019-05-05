import {Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';

import {ChartCore} from '../../tracking-map-base/ChartCore';
import { ChartPieLine } from '../../tracking-map-base/ChartCore/ChartPieLine';
import { ImageComponent } from '../image/image.component';

@Component({
	selector: '[fl-chart-line]',
	templateUrl: './chart-line.component.html',
	styleUrls: ['./chart-line.component.scss']
})
export class ChartLineComponent implements OnInit, OnChanges {

	@Input() p: ChartPieLine;
	@Output() loadError = new EventEmitter<ImageComponent>();

	constructor(
		private cdr: ChangeDetectorRef
	) {
	}

	ngOnInit() {
	}

	ngOnChanges() {
	}

	update() {
		if (this.p.style.hidden) {
			return;
		}
		this.cdr.detectChanges();
	}

	onLoadError(event) {
		this.loadError.emit(event);
	}

}
