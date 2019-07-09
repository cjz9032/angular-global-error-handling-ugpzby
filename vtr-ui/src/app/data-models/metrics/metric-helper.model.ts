import { TaskAction } from 'src/app/data-models/metrics/events.model';
import * as metricsConst from 'src/app/enums/metrics.enum';

declare var window;
export class MetricHelper {
	private metricClient: any;
	constructor(metricClient) {
		this.metricClient = metricClient;
	}

	public static timeSpan(dateEnd, dateStart) {
		return Math.round((dateEnd.getTime() - dateStart.getTime()) / 1000);
	}

	// try to hide appId
	public static getAppId(factor) {
		const entireFactor = factor + 'ÓaS­¼';
		return (window && window.btoa) ? window.btoa(entireFactor) : '';
	}

	public sendSystemUpdateMetric(avilablePackage: number, packageIdArray: string, message: string, duration: number) {
		if (!this.metricClient) {
			return;
		}

		this.metricClient.sendAsync(new TaskAction(
			metricsConst.MetricString.TaskCheckSystemUpdate,
			avilablePackage,
			packageIdArray,
			message,
			duration
		));
	}

	public sendInstallUpdateMetric(avilablePackage: number, packageIdArray: string, message: string) {
		if (!this.metricClient) {
			return;
		}

		this.metricClient.sendAsync(new TaskAction(
			metricsConst.MetricString.TaskInstallSystemUpdate,
			avilablePackage,
			packageIdArray,
			message,
			0
		));
	}
}
