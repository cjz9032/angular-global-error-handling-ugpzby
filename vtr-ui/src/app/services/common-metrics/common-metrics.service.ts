import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetricService } from '../metric/metrics.service';


@Injectable({
	providedIn: 'root'
})
export class CommonMetricsService {
	constructor(
		private metrics: MetricService
		, private activatedRoute: ActivatedRoute
	) {
	}

	public sendMetrics(itemValue: any, itemName: string, itemType = 'FeatureClick', itemParam: any = null) {
		const metricsData = {
			ItemParent: this.activatedRoute.snapshot.data.pageName,
			ItemType: itemType,
			ItemName: itemName,
			ItemValue: itemValue,
			ItemParam: itemParam
		};
		this.metrics.sendMetrics(metricsData);
	}
}
