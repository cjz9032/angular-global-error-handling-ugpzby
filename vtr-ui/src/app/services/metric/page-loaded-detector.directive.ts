import { Directive, AfterViewInit, Input } from '@angular/core';
import { MetricService } from './metric.service';

@Directive({
	selector: '[vtrPageLoadedDetector]'
})
export class PageLoadedDetectorDirective implements AfterViewInit {
	@Input('vtrPageLoadedDetector') isWelcomePage: any;

	constructor(private metricService: MetricService) { }

	ngAfterViewInit() {
		this.metricService.onPageLoaded();
	}
}
