import { Injectable } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class HardwareScanMetricsService {

	public static readonly EXPORT_LOG_TASK_NAME = 'ExportLog';
	public static readonly SUCCESS_RESULT = 'Success';
	public static readonly  FAIL_RESULT = 'Fail';

	private metricsService: any;

	constructor(
		shellService: VantageShellService) {
		this.metricsService = shellService.getMetrics();
	}

	public sendFeatureClickMetrics(itemName: string, itemParent: string, itemParam: any) {
		const data = {
			ItemType: 'FeatureClick',
			ItemName: itemName,
			ItemParent: itemParent,
			ItemParam: itemParam
		};
		if (this.metricsService) {
			this.metricsService.sendAsync(data);
		}
	}

	public sendTaskActionMetrics(taskName: string, taskCount: number, taskParam: string, taskResult: any, taskDuration: number) {
		const data = {
			ItemType: 'TaskAction',
			TaskName: taskName,
			TaskCount: taskCount,
			TaskResult: taskResult,
			TaskParam: taskParam,
			TaskDuration: taskDuration
		};
		if (this.metricsService) {
			this.metricsService.sendAsync(data);
		}
	}

}
