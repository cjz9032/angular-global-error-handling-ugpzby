import { TaskAction } from 'src/app/data-models/metrics/events.model';
import * as metricsConst from 'src/app/enums/metrics.enum';
export class MetricHelper {
	public static sendSystemUpdateMetric(metricClient, avilablePackage: number, packageIdArray: string, message: string, duration: number) {
		metricClient.sendAsync(new TaskAction(
			metricsConst.MetricString.TaskCheckSystemUpdate,
			avilablePackage,
			packageIdArray,
			message,
			duration
		));
	}

	public static timeSpan(dateEnd, dateStart) {
		return Math.round((dateEnd.getTime() - dateStart.getTime()) / 1000);
	}
}
