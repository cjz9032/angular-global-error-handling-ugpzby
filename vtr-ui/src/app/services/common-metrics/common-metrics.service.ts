import { Injectable } from '@angular/core';
import { MetricService } from '../metric/metrics.service';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';


@Injectable({
	providedIn: 'root'
})
export class CommonMetricsService {
	constructor(private metrics: MetricService) { }

	public sendMetrics(
		itemValue: any
		, itemName: string
		, itemParent: string
		, itemType = CommonMetricsModel.ItemType
		, itemParam: any = null
	) {
		const metricsData = {
			ItemParent: itemParent,
			ItemType: itemType,
			ItemName: itemName,
			ItemValue: itemValue,
			ItemParam: itemParam
		};
		this.metrics.sendMetrics(metricsData);
	}
}
