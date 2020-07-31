import { DevService } from '../../dev/dev.service';
import { NetworkPerformance } from '../metrics.model';
import { MetricEventName as EventName } from 'src/app/enums/metrics.enum';

export class PerformanceMeasurement {
	private lastRecord = 0;
	private eventSignal = false;
	private moniterApis = [
		'/api/v1/features',
		'/api/v1/articlecategories',
		//'/api/v1/articles/',
		'/api/v1/entitledapps',
		'/api/v1/apps/',
		'/upe/recommendation/v2/recommends',
		'/upe/tag/api/row/tag/user_tags/sn/'
	];

	public readonly handleHttpsCompleteEvent = () => {};

	constructor(
		private devService: DevService,
		private metricsService: any
	) {
		if (!performance) {
			this.devService.writeLog('performance Api not supported');
			return;
		}

		this.handleHttpsCompleteEvent = this.onHttpsCompleteEventWrapper;
		performance.onresourcetimingbufferfull = this.onBufferFull.bind(this);
	}


	private filterEntries(entries) {
		const validEntries = [];

		for (let idx = entries.length - 1; idx > -1; idx--) {
			const entry = entries[idx];

			if (entry.startTime <= this.lastRecord) {
				break;
			}

			const url = new URL(entry.name);
			for (const val of this.moniterApis) {
				if (url.pathname.indexOf(val) > -1) {
					validEntries.push(entry);
					break;
				}
			}
		}

		return validEntries;
	}

	private onHttpsCompleteEventWrapper() {
		this.eventSignal = true;
		setTimeout(() => {		// Use setTimeout to defer the metric handling. The business task should have higher propriety.
			if (!this.eventSignal) {	// Use signal to merge duplicate event
				return;
			}
			this.eventSignal = false;

			this.onHttpsCompleteEvent();
		}, 1000);
	}

	private onHttpsCompleteEvent() {
		if (!performance) {
			return;
		}

		// 1. get resource
		const entries = performance.getEntriesByType('resource');
		if (!entries || entries.length <= 0) {
			return;
		}

		// 2. filter available resource
		const validEntries = this.filterEntries(entries);

		// 3. send metrics for the record
		validEntries.forEach(entry => {
			const url = new URL(entry.name);
			const performanceData: NetworkPerformance = {
				ItemType: EventName.performance,
				Host: url.host,
				Api: url.pathname,
				HttpDuration: entry.duration.toFixed(2)
			};
			this.metricsService.sendMetrics(performanceData);
		});

		// 4. record the last record's timestamp
		this.lastRecord = entries[entries.length - 1].startTime;
	}

	private onBufferFull(event) {
		if (performance.clearResourceTimings) {
			performance.clearResourceTimings();
		}
	}

}
