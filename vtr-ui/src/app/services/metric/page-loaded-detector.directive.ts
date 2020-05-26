import { Directive, AfterViewInit, Input } from '@angular/core';
import { MetricService } from './metrics.service';

@Directive({
	selector: '[vtrPageLoadedDetector]'
})
export class PageLoadedDetectorDirective implements AfterViewInit {
	constructor(private metricService: MetricService) { }

	ngAfterViewInit() {
		this.metricService.onPageLoaded();
	}
}
