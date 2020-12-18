import { Injectable, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { MetricConst, MetricEventName as EventName } from 'src/app/enums/metrics.enum';
import {
	AppAction,
	GetEnvInfo,
	AppLoaded,
	FirstRun,
	TaskAction,
	ArticleView,
	ContentDisplay,
} from 'src/app/services/metric/metrics.model';
import { DurationCounterService } from 'src/app/services/timer/timer-service-ex.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { MetricHelper } from './metrics.helper';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { ActivatedRoute } from '@angular/router';
import { SelfSelectService } from '../self-select/self-select.service';
import { environment } from '../../../environments/environment';
import { ContentDisplayDetection } from './service-components/content-display-detection';
import { DevService } from '../dev/dev.service';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';

declare var Windows;

@Injectable({
	providedIn: 'root',
})
export class MetricService {
	private metricsClient: any;
	private blurStart = Date.now();
	private focusDurationCounter;
	private blurDurationCounter;
	private suspendDurationCounter;
	private welcomeNeeded: any;
	private hasSendAppLoadedEvent = false;
	private appInitTime: number;
	private appInitDuration: number;
	private firstPageActiveDuration: number;
	public readonly isFirstLaunch: boolean;
	public readonly maxScrollRecorder = {};
	public pageContainer: ElementRef;
	public readonly contentDisplayDetection: ContentDisplayDetection;
	public externalAppMetricsState = false;
	private pageScollEvent = (arg: any) => {};

	constructor(
		private http: HttpClient,
		private shellService: VantageShellService,
		private timerService: DurationCounterService,
		private hypothesisService: HypothesisService,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private activeRouter: ActivatedRoute,
		private selfSelectService: SelfSelectService,
		private localInfoService: LocalInfoService
	) {
		this.metricsClient = this.shellService.getMetrics();
		this.contentDisplayDetection = new ContentDisplayDetection(this);
		this.isFirstLaunch = !this.localCacheService.getLocalCacheValue(LocalStorageKey.HadRunApp);
		if (this.isFirstLaunch) {
			this.localCacheService.setLocalCacheValue(LocalStorageKey.HadRunApp, true);
		}

		if (this.metricsClient) {
			this.initializeMetricClient();

			document.addEventListener('vantageSessionLose', () => {
				this.onLoseSession();
			});

			document.addEventListener('vantageSessionResume', () => {
				this.onResumeSession();
			});

			document.addEventListener('visibilitychange', () => {
				if (document.hidden) {
					this.onInvisable();
				} else {
					this.onVisable();
				}
			});
		}
	}

	// move the function from metrics.helper.ts to here
	public initializeMetricClient() {
		const jsBridgeVesion = this.shellService.getVersion() || '';
		const shellVersion = this.commonService.getShellVersion();
		const webUIVersion = environment.appVersion;

		this.metricsClient.init({
			appVersion: `Web:${webUIVersion};Bridge:${jsBridgeVesion};Shell:${shellVersion}`,
			appId: MetricHelper.getAppId('dß'),
			appName: 'vantage3',
			channel: '',
			ludpUrl: 'https://chifsr.lenovomm.com/PCJson',
		});

		this.metricsClient.sendAsyncExOrignally = this.metricsClient.sendAsyncEx;
		this.metricsClient.sendAsyncEx = async (data, extendSetting) => {
			const win: any = window;

			try {
				// automatically fill the OnlineStatus for page view event
				if (!data.OnlineStatus) {
					data.OnlineStatus = this.commonService.isOnline ? 1 : 0;
				}

				const isBeta = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.BetaTag,
					false
				);
				if (isBeta) {
					data.IsBetaUser = true;
				}

				if (win.VantageStub && win.VantageStub.toastMsgName) {
					data.LaunchByToast = win.VantageStub.toastMsgName;
				}

				data.Segment = await this.selfSelectService.getSegment();
				data.ItemType = MetricHelper.normalizeEventName(data.ItemType);

				MetricHelper.setupMetricDbg(this.hypothesisService, this.metricsClient, data);

				return await this.metricsClient.sendAsyncExOrignally(data, extendSetting);
			} catch (ex) {
				return Promise.resolve({
					status: 0,
					desc: 'ok',
				});
			}
		};
	}

	private onLoseSession() {
		this.blurStart = Date.now();
	}

	private onResumeSession() {
		if (!this.blurStart) {
			return;
		}

		const idleDuration = Math.floor((Date.now() - this.blurStart) / 1000);
		if (this.metricsClient.updateSessionId && idleDuration > 1800) {
			// 30 * min
			this.metricsClient.updateSessionId();
		}
		this.blurStart = 0;
	}

	private onInvisable() {
		this.sendAppSuspendMetric();
	}

	private onVisable() {
		this.sendAppResumeMetric();
	}

	public sendMetrics(data: any) {
		if (this.metricsClient && this.metricsClient.sendAsync) {
			this.metricsClient.sendAsync(data);
		}
	}

	// This interface should only be used to send metrics that regardless of privacy option
	public sendMetricsForcibly(data: any) {
		if (this.metricsClient && this.metricsClient.sendAsync) {
			this.metricsClient.sendAsyncEx(data, { forced: true });
		}
	}

	public sendFirstRunEvent(machineInfo) {
		let isGaming = null;
		if (machineInfo) {
			isGaming = machineInfo.isGaming;
		}
		this.metricsClient.sendAsyncEx(new FirstRun(isGaming), {
			forced: true,
		});
	}

	private async sendEnvInfoMetric() {
		let imcVersion = null;
		let hsaSrvInfo: any = {};
		let shellVersion = null;

		if (this.metricsClient.getImcVersion) {
			imcVersion = await this.metricsClient.getImcVersion();
		}

		if (this.metricsClient.getHsaSrvInfo) {
			hsaSrvInfo = await this.metricsClient.getHsaSrvInfo();
		}

		if (typeof Windows !== 'undefined') {
			const packageVersion = Windows.ApplicationModel.Package.current.id.version;
			// packageVersion.major, packageVersion.minor, packageVersion.build, packageVersion.revision
			shellVersion = `${packageVersion.major}.${packageVersion.minor}.${packageVersion.build}`;
		}

		const scale = window.devicePixelRatio || 1;
		const displayWidth = window.screen.width;
		const displayHeight = window.screen.height;
		this.metricsClient.sendAsync(
			new GetEnvInfo({
				imcVersion,
				srvVersion: hsaSrvInfo.vantageSvcVersion,
				shellVersion,
				windowSize: `${Math.floor(window.outerWidth / 100) * 100}x${
					Math.floor(window.outerHeight / 100) * 100
				}`,
				displaySize: `${Math.floor((displayWidth * scale) / 100) * 100}x${
					Math.floor((displayHeight * scale) / 100) * 100
				}`,
				scalingSize: scale, // this value would is accurate in edge
				isFirstLaunch: this.isFirstLaunch,
			})
		);
	}

	public sendAppLoadedMetric(performanceTimes) {
		const loadedEvent: AppLoaded = {
			ItemType: EventName.apploaded,
			DurationForWeb: this.appInitDuration,
			DurationActivatePage: this.firstPageActiveDuration,
			TargePage: this.getPageName(),
			WebAppSource: performanceTimes.webAppSource ?? '',
			CERT_PIN_DONE: performanceTimes.certPingDone ?? 0,
			INDEXPAGE_CONNECTION_ESTABLISHED: performanceTimes.indexPageEstablished,
			DOM_INTERACTIVED: performanceTimes.domInteractived ?? 0,
			SCRIPT_LOADED: performanceTimes.scriptLoaded ?? 0,
			APP_INITIALIZED: performanceTimes.appInitialized ?? 0,
			APP_ENTRY_LOADED: performanceTimes.appEntryLoaded ?? 0,
			FIRST_PAGE_LOADED: performanceTimes.firstPageLoaded ?? 0
		};
		this.metricsClient.sendAsync(loadedEvent);
	}

	private sendInstallationMetric(metricEnable) {
		const win: any = window;
		if (
			win.VantageShellExtension &&
			win.VantageShellExtension.Metrics &&
			win.VantageShellExtension.Metrics.Helper &&
			win.VantageShellExtension.Metrics.Helper.SvcInstallationMetricsHelper
		) {
			const SvcInstallationMetricsHelper =
				win.VantageShellExtension.Metrics.Helper.SvcInstallationMetricsHelper;
			if (SvcInstallationMetricsHelper.needReportError) {
				SvcInstallationMetricsHelper.sendFinishMetric(metricEnable);
			}
		}
	}

	public sendAppLaunchMetric() {
		this.focusDurationCounter = this.timerService.getFocusDurationCounter();
		this.blurDurationCounter = this.timerService.getBlurDurationCounter();

		const stub = this.shellService.getVantageStub();
		this.metricsClient.sendAsync(
			new AppAction(MetricConst.ActionOpen, stub.launchParms, stub.launchType, 0, 0)
		);
	}

	public sendAppResumeMetric() {
		this.focusDurationCounter = this.timerService.getFocusDurationCounter();
		this.blurDurationCounter = this.timerService.getBlurDurationCounter();

		const stub = this.shellService.getVantageStub();
		const suspendDuration = this.suspendDurationCounter
			? this.suspendDurationCounter.getDuration()
			: 0;
		this.metricsClient.sendAsync(
			new AppAction(
				MetricConst.ActionResume,
				stub.launchParms,
				stub.launchType,
				suspendDuration,
				0
			)
		);
	}

	public sendAppSuspendMetric() {
		this.suspendDurationCounter = this.timerService.getSuspendDurationCounter();
		const focusDuration = this.focusDurationCounter
			? this.focusDurationCounter.getDuration()
			: 0;
		const blurDuration = this.blurDurationCounter ? this.blurDurationCounter.getDuration() : 0;
		const stub = this.shellService.getVantageStub();
		this.metricsClient.sendAsync(
			new AppAction(
				MetricConst.ActionSuspend,
				stub.launchParms,
				stub.launchType,
				focusDuration,
				blurDuration
			)
		);
	}

	public sendSystemUpdateStatusMetric(metricsName: string, status: string) {
		const metricsData = {
			ItemParent: 'SystemUpdate',
			ItemName: metricsName,
			ItemType: status,
		};
		this.sendMetrics(metricsData);
	}

	public sendSystemUpdateMetric(
		avilablePackage: number,
		packageIdArray: string,
		message: string,
		searchStart: Date
	) {
		this.metricsClient.sendAsync(
			new TaskAction(
				MetricConst.TaskCheckSystemUpdate,
				avilablePackage,
				packageIdArray,
				message,
				MetricHelper.timeSpan(new Date(), searchStart)
			)
		);
	}

	public sendInstallUpdateMetric(
		avilablePackage: number,
		packageIdArray: string,
		message: string
	) {
		this.metricsClient.sendAsync(
			new TaskAction(
				MetricConst.TaskInstallSystemUpdate,
				avilablePackage,
				packageIdArray,
				message,
				0
			)
		);
	}

	public sendSetUpdateSchedule(taskParam, response) {
		this.metricsClient.sendAsync(
			new TaskAction(MetricConst.TaskSetUpdateSchedule, 1, taskParam, response, 0)
		);
	}

	public sendSetScanSchedule(taskParam, response) {
		this.metricsClient.sendAsync(
			new TaskAction(MetricConst.TaskSetScanSchedule, 1, taskParam, response, 0)
		);
	}

	public sendArticleView(articleView: ArticleView) {
		this.metricsClient.sendAsync(articleView);
	}

	public getPageName() {
		return (
			this.activeRouter.snapshot.data.pageName ||
			this.activeRouter.snapshot.root.firstChild.data.pageName ||
			this.activeRouter.snapshot.root.firstChild.firstChild.data.pageName ||
			MetricConst.Unknown
		);
	}

	public sendContentDisplay(itemID: string, dataSource: string, position: string) {
		const contentDisplay: ContentDisplay = {
			ItemType: EventName.contentdisplay,
			ItemID: itemID,
			DataSource: this.toLower(dataSource),
			Position: position,
			ItemParent: this.getPageName(),
		};

		this.metricsClient.sendAsync(contentDisplay);
	}

	private sendAppLoadedMetrics() {
		if (this.hasSendAppLoadedEvent) {
			return; // send the initialzation metrics once at one session
		}
		this.hasSendAppLoadedEvent = true;

		// the following metrics need to be send when the welcome page was done or the page was loaded at which point the metrics privacy was determined
		this.sendAppLaunchMetric();
		this.sendEnvInfoMetric();
	}

	public async metricReady() {
		if (this.metricsClient.initializationResolved) {
			return;
		}
		await this.metricsClient.initPromise;
	}

	private async onWebLoaded() {
		await this.metricReady();
		if (this.metricsClient.metricsEnabled) {
			// in normal case for first run, if the welcome page was not done, the metrics will be disable.
			this.sendAppLoadedMetrics(); // send these metric event in dashboard at the scenarios when welcome page was done.
		}

		if (this.welcomeNeeded === false) {
			// default is undefined
			this.sendInstallationMetric(this.metricsClient.metricsEnabled);
		}
	}

	public onAppInitDone() {
		const vantageStub = this.shellService.getVantageStub();
		this.appInitTime = Date.now();
		this.appInitDuration = this.appInitTime - vantageStub.navigateTime; // vantageStub.navigateTime would change
	}

	public onPageRouteActivated() {
		if (this.firstPageActiveDuration) {
			return;
		}

		this.firstPageActiveDuration = Date.now() - this.appInitTime; // record the firt time to active a page route
		this.onWebLoaded();
	}

	public async onCheckedWelcomePageNeeded(welcomeNeeded: boolean) {
		this.welcomeNeeded = welcomeNeeded;
		if (this.welcomeNeeded === false) {
			// default is undefined
			await this.metricReady();
			this.sendInstallationMetric(this.metricsClient.metricsEnabled);
		}
	}

	public onWelcomePageDone() {
		if (this.metricsClient.metricsEnabled) {
			this.sendAppLoadedMetrics();
		}

		this.sendInstallationMetric(this.metricsClient.metricsEnabled);
	}

	private toLower(content: string) {
		return content && content.toLowerCase();
	}

	public getScrollPercentage(container: any) {
		if (!container) {
			return 0;
		}
		return Math.round(
			((container.scrollTop + container.clientHeight) * 100) / container.scrollHeight
		);
	}

	public activateScrollCounter(pageName: any) {
		this.maxScrollRecorder[pageName] = 0;
		this.pageScollEvent = (htmlElm) => {
			const curRecord = this.getScrollPercentage(htmlElm);
			const preRecord = this.maxScrollRecorder[pageName];
			if (!preRecord || preRecord < curRecord) {
				this.maxScrollRecorder[pageName] = curRecord;
			}
		};
	}

	public deactivateScrollCounter(pageName: any = null) {
		this.pageScollEvent = () => {};
	}

	public notifyPageScollEvent(htmlElm: any = null) {
		this.contentDisplayDetection.onScrollEvent();
		this.pageScollEvent(htmlElm || this.pageContainer.nativeElement);
	}

	public getExternalMetricsSettings(): Promise<boolean> {
		if (this.metricsClient.getExternalMetricsSettings) {
			return this.metricsClient
				.getExternalMetricsSettings()
				.then((result) => {
					if (
						result &&
						((result.deviceMetricsSettings &&
							this.toLower(result.deviceMetricsSettings) === 'enabled') ||
							(result.freMetricsSettings &&
								this.toLower(result.freMetricsSettings) === 'enabled'))
					) {
						this.metricsClient.metricsEnabled = true;
						this.externalAppMetricsState = true;
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.UserDeterminePrivacy,
							true
						);
						return true;
					}
					return false;
				})
				.catch((error) => {
					return false;
				});
		}

		return Promise.resolve(false);
	}

	async mcaffeStatisticDownloadInfo() {
		const hostname = window.location.hostname;
		let environmentValue = '';
		if (hostname.endsWith('lenovo.com')) {
			if (!hostname.endsWith('csw.lenovo.com')) {
				environmentValue = '_qa';
			}
		} else {
			environmentValue = '_debug';
		}
		const localInfo = await this.localInfoService.getLocalInfo();
		const currentDate = new Date();
		const settingData = {
			sdk_ver: '1.0.0.0',
			device_info: {
				d_os: 'NA',
				d_osver: 'NA',
				d_lang: 'NA',
				d_geo: localInfo.GEO,
				d_brand: localInfo.Brand,
				d_subbrand: 'NA',
				d_fam: 'NA',
				d_mtm: 'NA',
				d_id: 'NA',
				d_time: currentDate,
			},
			app_info: {
				a_key: this.metricsClient.appId,
				a_ver: this.metricsClient.appVersion,
				a_name: this.metricsClient.appName,
			},
			events: [
				{
					e_name: `statistic_mcafee_download${environmentValue}`,
					e_time: currentDate,
				},
			],
		};
		const res = await this.metricsClient.sendMcafeeStatisticDownload(settingData);
		if (!res) {
			this.http
				.post('https://chifsr.lenovomm.com/PCJson', `json=${JSON.stringify(settingData)}`)
				.subscribe();
		}
	}

	async sendLenovoSurveyReport(customData: any) {
		const deviceInfo = {
			d_os: 'NA',
			d_osver: 'NA',
			// d_lang: 'NA', -- auto supply
			// d_geo: localInfo.GEO, -- auto supply
			d_brand: 'NA',
			d_subbrand: 'NA',
			d_fam: 'NA',
			// d_mtm: localInfo.MTM, -- auto supply
			// d_id: '', -- auto supply
			// d_time: currentDate -- auto supply
		};
		const userInfo = {
			u_uid: 'NA',
			u_lid: 'NA',
		};
		const appInfo = {};
		const metricEvent = {
			e_name: 'LenovoSurvey',
			// e_time: colectionTime, -- auto supply
			e_data: customData,
		};
		const fullPayload = {
			app_info: appInfo,
			device_info: deviceInfo,
			user_info: userInfo,
			events: [metricEvent],
		};

		this.metricsClient.autoFillAndSend(fullPayload, { forced: true, autoFill: true });
	}
}
