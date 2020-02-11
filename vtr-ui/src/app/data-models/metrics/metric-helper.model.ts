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

	public static async getHypothesis(shellService) {
		if (window.Windows && window.Windows.ApplicationModel.Package.current.id.familyName === 'E046963F.LenovoCompanionBeta_k1h2ywk1493x8') {
			// beta may not support the hypothesis config filter key, and it would block here, if not return immediately, we can treat it as not supported.
			return null;
		}

		return await shellService.calcDeviceFilter('{"var":"HypothesisGroups"}');
	}

	// enable this feature to track a bug
	public static async setupMetricDbg(shellService, metricClient, data) {
		if (metricClient.enableDbg === undefined) {
			try {
				const hyp: any =  await MetricHelper.getHypothesis(shellService);
				metricClient.enableDbg = hyp && hyp.metricDbg === true;
			} catch (ex) {
				metricClient.enableDbg = false; // not use
			}
		}

		if (metricClient.enableDbg) {
			// set dbg data to track a bug cause
			if (!metricClient.dbgCounter) {
				metricClient.dbgCounter = 0;
			}

			data.dbgId = `${Date.now()}${ metricClient.dbgCounter++}`;
			data.retryCode = '@@retryCode@@';
		}
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
