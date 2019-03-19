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

	@HostListener('click',['$event.target']) onclick(target) {
		const location = window.location.href.substring(window.location.href.indexOf('#') + 2).replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
		this.metricsItem=typeof this.metricsItem==='string'?this.metricsItem.split(" ").join("").toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '').substr(0,25):this.metricsItem;
		this.metricsEvent=typeof this.metricsEvent==='string'?this.metricsEvent.split(" ").join("").toLowerCase():this.metricsEvent;
		this.metricsValue=typeof this.metricsValue==='string'?this.metricsValue.split(" ").join("").toLowerCase():this.metricsValue;
		this.metricsParent=typeof this.metricsParent==='string'?this.metricsParent.split(" ").join("").toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '').substr(0,25):this.metricsParent;
		this.metricsParam= typeof this.metricsParam==='string'?this.metricsParam.split(" ").join("").toLowerCase():this.metricsParam;

		if (this.metrics && this.metrics.sendAsync) {
			const data: any = {
				ItemName: this.metricsItem,
				ItemType: this.metricsEvent,
				ItemParent: location ? location + '.' + this.metricsParent : this.metricsParent,
			};
			if (this.metricsParam) {
				data.ItemParam = this.metricsParam;
			}

			if (typeof this.metricsValue!=='undefined') {
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
			if (typeof this.metricsValue!=='undefined') {
				data.metricsValue = this.metricsValue;
			}

			console.log('Sending the metrics [ItemType : ' + this.metricsEvent + ']\n' + JSON.stringify(data));
		}
	}
}
