import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { VantageShellService } from '../services/vantage-shell/vantage-shell.service';


declare var window;
@Directive({
	selector: '[vtrMetrics]'
})
export class MetricsDirective {
	constructor(private el: ElementRef, private shellService: VantageShellService) {
		this.metrics = shellService.getMetrics();
	}

	private metrics: any;

	@Input() metricsItem: string;
	@Input() metricsEvent: string;
	@Input() metricsValue: string;
	@Input() metricsParent: string;
	@Input() metricsParam: string;

	@HostListener('click') onclick() {
		const location = window.location.href.substring(window.location.href.indexOf('#') + 2).split('/').join('.');
		console.log('++++++++++++', location);

		if (this.metrics && this.metrics.sendAsync) {
			const data: any = {
				ItemName: this.metricsItem,
				ItemType: this.metricsEvent,
				ItemParent: location ? location + '.' + this.metricsParent : this.metricsParent,
			};
			if (this.metricsParam) {
				data.ItemParam = this.metricsParam;
			}
			if (this.metricsValue) {
				data.metricsValue = this.metricsValue;
			}
			this.metrics.sendAsync(data);
		}

		// just for debugging, would be removed in the future
		{
			const data: any = {
				ItemName: this.metricsItem,
				ItemType: this.metricsEvent,
				ItemParent: location ? location + '.' + this.metricsParent : this.metricsParent,
			};
			if (this.metricsParam) {
				data.ItemParam = this.metricsParam;
			}
			if (this.metricsValue) {
				data.metricsValue = this.metricsValue;
			}

			console.log('Sending the metrics [ItemType : ' + this.metricsEvent + ']\n' + JSON.stringify(data));
		}
	}
}
