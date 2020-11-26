import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

@Component({
	selector: 'vtr-ui-custom-switch',
	templateUrl: './ui-custom-switch.component.html',
	styleUrls: ['./ui-custom-switch.component.scss'],
})
export class UiCustomSwitchComponent implements OnInit, OnDestroy {
	public static switchChange: Subject<boolean> = new Subject<boolean>();

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
	@Input() switchParam: string;

	switchChangeSubscription: Subscription;

	constructor(private metrics: MetricService, private activatedRoute: ActivatedRoute) {}

	ngOnInit(): void {
		this.switchChangeSubscription = UiCustomSwitchComponent.switchChange
			.asObservable()
			.subscribe((res) => {
				if (this.componentId === 'ds-power-battery-threshold') {
					this.value = res;
				}
			});
	}

	ngOnDestroy(): void {
		if (this.switchChangeSubscription) {
			this.switchChangeSubscription.unsubscribe();
		}
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
				ItemParam: this.switchParam,
				ItemValue: this.value,
			};
			this.metrics.sendMetrics(metricsData);
		}
	}
}
