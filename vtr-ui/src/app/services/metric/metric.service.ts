import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { MetricConst } from 'src/app/enums/metrics.enum';
import { AppAction, GetEnvInfo, AppLoaded, FirstRun, TaskAction } from 'src/app/services/metric/metrics.model';
import { TimerServiceEx } from 'src/app/services/timer/timer-service-ex.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { MetricHelper } from './metrics.helper';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

declare var Windows;

@Injectable({
	providedIn: 'root'
})
export class MetricService {
	private metricsClient: any;
	private blurStart = Date.now();
	private focusDurationCounter;
	private blurDurationCounter;
	private suspendDurationCounter;
	private dashboardFirstLoaded = 0;
	private hasSendAppLoadedEvent = false;

	constructor(
		private shellService: VantageShellService,
		private timerService: TimerServiceEx,
		hypothesisService: HypothesisService,
		private commonService: CommonService,
	) {
		this.metricsClient = this.shellService.getMetrics();

		if (this.metricsClient) {
			MetricHelper.initializeMetricClient(this.metricsClient, shellService, commonService, hypothesisService);

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

	private onLoseSession() {
		this.blurStart = Date.now();
	}

	private onResumeSession() {
		if (!this.blurStart) {
			return;
		}

		const idleDuration = Math.floor((Date.now() - this.blurStart) / 1000);
		if (this.metricsClient.updateSessionId && idleDuration > 1800) { // 30 * min
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

	public sendFirstRunEvent(machineInfo) {
		let isGaming = null;
		if (machineInfo) {
			isGaming = machineInfo.isGaming;
		}
		this.metricsClient.sendAsyncEx(new FirstRun(isGaming),
			{
				forced: true
			}
		);
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
		const isFirstLaunch: boolean = !this.commonService.getLocalStorageValue(LocalStorageKey.HadRunApp);
		this.metricsClient.sendAsync(
			new GetEnvInfo({
				imcVersion,
				srvVersion: hsaSrvInfo.vantageSvcVersion,
				shellVersion,
				windowSize: `${Math.floor(window.outerWidth / 100) * 100}x${Math.floor(window.outerHeight / 100) * 100}`,
				displaySize: `${Math.floor(displayWidth * scale / 100) * 100}x${Math.floor(
					displayHeight * scale / 100
				) * 100}`,
				scalingSize: scale, // this value would is accurate in edge
				isFirstLaunch
			})
		);
	}

	private sendAppLoadedMetric(dashboardFirstLoaded: number) {
		const vanStub = this.shellService.getVantageStub();
		this.metricsClient.sendAsync(new AppLoaded((dashboardFirstLoaded - vanStub.navigateTime)));
	}

	public sendAppLaunchMetric() {
		this.focusDurationCounter = this.timerService.getFocusDurationCounter();
		this.blurDurationCounter = this.timerService.getBlurDurationCounter();

		const stub = this.shellService.getVantageStub();
		this.metricsClient.sendAsync(new AppAction(MetricConst.ActionOpen, stub.launchParms, stub.launchType, 0, 0));
	}

	public sendAppResumeMetric() {
		this.focusDurationCounter = this.timerService.getFocusDurationCounter();
		this.blurDurationCounter = this.timerService.getBlurDurationCounter();

		const stub = this.shellService.getVantageStub();
		const suspendDuration = this.suspendDurationCounter ? this.suspendDurationCounter.getDuration() : 0;
		this.metricsClient.sendAsync(new AppAction(MetricConst.ActionResume, stub.launchParms, stub.launchType, suspendDuration, 0));
	}

	public sendAppSuspendMetric() {
		this.suspendDurationCounter = this.timerService.getSuspendDurationCounter();
		const focusDuration = this.focusDurationCounter ? this.focusDurationCounter.getDuration() : 0;
		const blurDuration = this.blurDurationCounter ? this.blurDurationCounter.getDuration() : 0;
		const stub = this.shellService.getVantageStub();
		this.metricsClient.sendAsync(new AppAction(MetricConst.ActionSuspend, stub.launchParms, stub.launchType, focusDuration, blurDuration));
	}

	public sendSystemUpdateMetric(avilablePackage: number, packageIdArray: string, message: string, searchStart: Date) {
		this.metricsClient.sendAsync(new TaskAction(
			MetricConst.TaskCheckSystemUpdate,
			avilablePackage,
			packageIdArray,
			message,
			MetricHelper.timeSpan(new Date(), searchStart)
		));
	}

	public sendInstallUpdateMetric(avilablePackage: number, packageIdArray: string, message: string) {
		this.metricsClient.sendAsync(new TaskAction(
			MetricConst.TaskInstallSystemUpdate,
			avilablePackage,
			packageIdArray,
			message,
			0
		));
	}

	public sendSetUpdateSchedure(taskParam, response) {
		this.metricsClient.sendAsync(new TaskAction(
			MetricConst.TaskSetUpdateSchedule,
			1,
			taskParam,
			response,
			0
		));
	}

	private handleAppLoadedEvent() {
		if (this.hasSendAppLoadedEvent) {
			return;	// send the initialzation metrics once at one session
		}
		this.hasSendAppLoadedEvent = true;

		if (!this.dashboardFirstLoaded) {
			this.dashboardFirstLoaded = Date.now();
		}

		// the following metrics need to be send when the welcome page was done or the page was loaded at which point the metrics privacy was determined
		this.sendAppLaunchMetric()
		this.sendEnvInfoMetric();
		this.sendAppLoadedMetric(this.dashboardFirstLoaded);
	}

	public async metricReady() {
		if (this.metricsClient.initializationResolved){
			 return;
		 }
		 await this.metricsClient.initPromise;
	}

	public async onPageLoaded() {
		if (this.dashboardFirstLoaded) {
			return; 	// run once
		}

		this.dashboardFirstLoaded = Date.now(); // save the time while app finish loading.
		await this.metricReady();
		if (this.metricsClient.metricsEnabled) {	// in normal case for first run, if the welcome page was not done, the metrics will be disable.
			this.handleAppLoadedEvent();	// send these metric event in dashboard at the scenarios when welcome page was done.
		}

		// else the welcome page need to check if it should send the metrics after the metrics option was determined
	}

	public async handleWelcomeDone() {
		await this.metricReady();
		if (this.metricsClient.metricsEnabled) {
			this.handleAppLoadedEvent();
		}
	}
}
