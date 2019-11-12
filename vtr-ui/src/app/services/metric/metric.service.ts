import { Injectable, HostListener } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import * as MetricsConst from 'src/app/enums/metrics.enum';
import { AppAction, GetEnvInfo, AppLoaded } from 'src/app/data-models/metrics/events.model';
import { TimerServiceEx } from 'src/app/services/timer/timer-service-ex.service';

declare var Windows;

@Injectable({
	providedIn: 'root'
})
export class MetricService {
	private metricsClient: any;
	private blurStart = Date.now();
	private durationCalculator;

	private totalDuration = 0; 	// itermittant app duratin will be added to it
	constructor(private shellService: VantageShellService, private timerService: TimerServiceEx) {
		this.metricsClient = this.shellService.getMetrics();
		document.addEventListener('vantageSessionLose', () => {
			this.onLoseSession();
		});

		document.addEventListener('vantageSessionResume', () => {
			this.onResumeSession();
		});
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
		this.metricsClient.sendAsyncEx(
			{
				ItemType: 'FirstRun',
				IsGaming: isGaming
			},
			{
				forced: true
			}
		);
	}

	public async sendEnvInfoMetric(isFirstLaunch) {
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
				windowSize: `${Math.floor(displayWidth / 100) * 100}x${Math.floor(displayHeight / 100) * 100}`,
				displaySize: `${Math.floor(displayWidth * scale / 100) * 100}x${Math.floor(
					displayHeight * scale / 100
				) * 100}`,
				scalingSize: scale, // this value would is accurate in edge
				isFirstLaunch
			})
		);
	}

	public sendAppLoadedMetric() {
		const vanStub = this.shellService.getVantageStub();
		this.metricsClient.sendAsync(new AppLoaded((Date.now() - vanStub.navigateTime)));
	}

	public sendAppLaunchMetric() {
		this.durationCalculator = this.timerService.getActiveCounter();
		const stub = this.shellService.getVantageStub();
		this.metricsClient.sendAsync(new AppAction(MetricsConst.MetricString.ActionOpen, stub.launchParms, stub.launchType, 0, this.totalDuration));
	}

	public sendAppResumeMetric() {
		this.durationCalculator = this.timerService.getActiveCounter();
		const stub = this.shellService.getVantageStub();
		this.metricsClient.sendAsync(new AppAction(MetricsConst.MetricString.ActionResume, stub.launchParms, stub.launchType, 0, this.totalDuration));
	}

	public sendAppSuspendMetric() {
		if (!this.durationCalculator) {
			return;
		}

		const duration = this.durationCalculator.getDuration();
		this.totalDuration += duration;
		const stub = this.shellService.getVantageStub();
		this.metricsClient.sendAsync(new AppAction(MetricsConst.MetricString.ActionSuspend, stub.launchParms, stub.launchType, duration, this.totalDuration));
	}

	private onLoseSession() {
		this.sendAppSuspendMetric();
		this.blurStart = Date.now();
	}

	private onResumeSession() {
		this.sendAppResumeMetric();

		if (this.blurStart) {
			return;
		}

		const idleDuration = Math.floor((Date.now() - this.blurStart) / 1000);
		if (this.metricsClient.updateSessionId && idleDuration > 1800) { // 30 * min
			this.metricsClient.updateSessionId();
		}
		this.blurStart = null;
	}

}
