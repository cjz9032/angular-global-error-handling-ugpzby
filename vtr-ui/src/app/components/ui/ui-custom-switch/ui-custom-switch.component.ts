import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'vtr-ui-custom-switch',
	templateUrl: './ui-custom-switch.component.html',
	styleUrls: ['./ui-custom-switch.component.scss']
})
export class UiCustomSwitchComponent implements OnInit {
	@Output() toggle: EventEmitter<any> = new EventEmitter();
	@Input() value = false;
	@Input() componentId = 'toggle-switch';
	@Input() isDisabled = false;
	@Input() isLoading = false;
	@Input() theme = 'white';
	@Input() readonly = false;
	@Input() label: string;
	@Input() ariaLabel: string;
	@Input() sendMetrics = true;
	@Input() metricsParent;

	constructor(private metrics: MetricService, private activatedRoute: ActivatedRoute) { }

	ngOnInit(): void {
	}

	public onChange($event) {
		const value = $event.target.checked;
		this.value = value;
		this.toggle.emit({ switchValue: value });
		if (this.sendMetrics) {
			const metricsData = {
				ItemParent: this.metricsParent || this.activatedRoute.snapshot.data.pageName,
				ItemType: 'ItemClick',
				ItemName: this.componentId,
				ItemValue: this.value
			};
			this.metrics.sendMetrics(metricsData);
		}
	}
}
