import { Injectable } from '@angular/core';
import { AppMessage } from './app-message';
import { ContainerAppSendMessageType } from './app-message-type';
import { ContainerAppSendService } from './container-app-send.service';
import { ISubAppConfig } from 'src/sub-app-config/sub-app-config-base';
import { LoggerService } from '../logger/logger.service';
import { MetricEventName } from 'src/app/enums/metrics.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root',
})
export class ContainerAppSendHandler {
	private metrics: any;
	private readonly metricsParent = 'ContainerAppSendHandler';

	constructor(
		private communicationSendService: ContainerAppSendService,
		private loggerService: LoggerService,
		private shellService: VantageShellService
	) {
		this.metrics = this.shellService.getMetrics();
	}

	public handle(
		subAppConfig: ISubAppConfig,
		messageType: ContainerAppSendMessageType,
		payload,
		allowSendMetrics = true
	) {
		const appMessage = new AppMessage();
		appMessage.appName = 'consumerMain';
		appMessage.messageType = messageType;
		appMessage.payload = payload;
		try {
			this.communicationSendService.send(subAppConfig, appMessage);
		} catch (error) {
			this.loggerService.error(`container app send message exception`, error);
			const metricsData = {
				ItemParent: this.metricsParent,
				ItemType: MetricEventName.mfcommunication,
				ItemName: 'containerAppSendMessageException',
				ItemValue: error,
			};
			if (this.metrics) {
				this.metrics.sendAsync(metricsData);
			}
		}
		if (allowSendMetrics) {
			const metricsData = {
				ItemParent: this.metricsParent,
				ItemType: MetricEventName.mfcommunication,
				ItemName: 'containerAppSendMessage',
				ItemValue: appMessage.messageType,
			};
			if (this.metrics) {
				this.metrics.sendAsync(metricsData);
			}
		}
	}
}
