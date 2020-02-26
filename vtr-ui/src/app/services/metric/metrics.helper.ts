import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { environment } from '../../../environments/environment';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../../services/common/common.service';
import { MetricEventName as EventName } from 'src/app/enums/metrics.enum';

declare var window;
export class MetricHelper {

	constructor() {
	}

	public static timeSpan(dateEnd: Date, dateStart: Date) {
		return Math.round((dateEnd.getTime() - dateStart.getTime()) / 1000);
	}

	// try to hide appId
	public static getAppId(factor) {
		const entireFactor = factor + 'ÓaS­¼';
		return (window && window.btoa) ? window.btoa(entireFactor) : '';
	}

	// enable this feature to track a bug
	public static async setupMetricDbg(hypothesisService: HypothesisService, metricClient, data) {
		if (metricClient.enableDbg === undefined) {
			try {
				const hyp = await hypothesisService.getAllSettings() as any;
				metricClient.enableDbg = (hyp && hyp.metricDbg === 'true');
			} catch (ex) {
				metricClient.enableDbg = false; // not use
			}
		}

		if (metricClient.enableDbg) {
			// set dbg data to track a bug cause
			if (!metricClient.dbgCounter) {
				metricClient.dbgCounter = 0;
			}

			data.dbgId = `${Date.now()}${metricClient.dbgCounter++}`;
			data.retryCode = '@@retryCode200@@';
		}
	}

	public static normalizeEventName(eventName) {
		if (!eventName) {
			return EventName.Unknown;
		}

		eventName = eventName.toLowerCase();
		switch (eventName) {
			case 'firstrun':
				eventName = EventName.FirstRun;
				break;
			case 'apploaded':
				eventName = EventName.AppLoaded;
				break;
			case 'articledisplay':
				eventName = EventName.ArticleDisplay;
				break;
			case 'appaction':
				eventName = EventName.AppAction;
				break;
			case 'getenvinfo':
				eventName = EventName.GetEnvInfo;
				break;
			case 'pageview':
				eventName = EventName.PageView;
				break;
			case 'featureclick':
			case 'itemclick':
				eventName = EventName.FeatureClick;
				break;
			case 'itemview':
				eventName = EventName.ItemView;
				break;
			case 'articleclick':
			case 'docclick':
				eventName = EventName.ArticleClick;
				break;
			case 'articleview':
			case 'docview':
				eventName = EventName.ArticleView;
				break;
			case 'taskaction':
				eventName = EventName.TaskAction;
				break;
			case 'settingupdate':
				eventName = EventName.SettingUpdate;
				break;
			case 'userfeedback':
				eventName = EventName.UserFeedback;
				break;
		}

		return eventName;
	}

	public static initializeMetricClient(metricClient, shellService: VantageShellService, commonService: CommonService, hypothesisService: HypothesisService) {
		const jsBridgeVesion = shellService.getVersion() || '';
		const shellVersion = shellService.getShellVersion();
		const webUIVersion = environment.appVersion;

		metricClient.init({
			appVersion: `Web:${webUIVersion};Bridge:${jsBridgeVesion};Shell:${shellVersion}`,
			appId: MetricHelper.getAppId('dß'),
			appName: 'vantage3',
			channel: '',
			ludpUrl: 'https://chifsr.lenovomm.com/PCJson'
		});
		metricClient.sendAsyncOrignally = metricClient.sendAsync;
		metricClient.sendAsync = async function sendAsync(data) {
			const win: any = window;

			try {
				// automatically fill the OnlineStatus for page view event
				if (!data.OnlineStatus) {
					data.OnlineStatus = commonService.isOnline ? 1 : 0;
				}

				const isBeta = commonService.getLocalStorageValue(LocalStorageKey.BetaTag, false);
				if (isBeta) {
					data.IsBetaUser = true;
				}

				if (win.VantageStub && win.VantageStub.toastMsgName) {
					data.LaunchByToast = win.VantageStub.toastMsgName;
				}

				data.ItemType = MetricHelper.normalizeEventName(data.ItemType);

				MetricHelper.setupMetricDbg(hypothesisService, metricClient, data);

				return await this.sendAsyncOrignally(data);
			} catch (ex) {
				return Promise.resolve({
					status: 0,
					desc: 'ok'
				});
			}
		};
	}

	public static createSimulateObj() {
		return {
			init() {},
			sendAsync() {
				return Promise.resolve({
					status: 0,
					desc: 'ok'
				});
			},
			sendAsyncEx() {
				return Promise.resolve({
					status: 0,
					desc: 'ok'
				});
			},
			metricsEnabled: false
		};
	}
}
