import * as metricsConst from 'src/app/enums/metrics.enum';
class BaseModel {
	public ItemType: string;
}

export class TaskAction extends BaseModel {
	constructor(taskName: string, taskCount: number, taskParm: string, taskResult: string, taskDuration: number) {
		super();
		this.ItemType = metricsConst.MetricEvent.TaskAction;
		this.TaskName = taskName;
		this.TaskCount = taskCount;
		this.TaskParm = taskParm;
		this.TaskResult = taskResult;
		this.TaskDuration = taskDuration;
	}
	public TaskName: string;
	public TaskCount: number;
	public TaskParm: string;
	public TaskResult: string;
	public TaskDuration: number;
	public AppSessionID: string;
}
