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

export class AppAction extends BaseModel {
	constructor(actionType: string, launchParms: string, launchType: string, duration: number, durationBlur: number) {
		super();
		this.ItemType = metricsConst.MetricEvent.AppAction;
		this.ActionType = actionType;
		this.LaunchType = launchType;
		this.LaunchParms = launchParms;
		this.Duration = duration;
		this.DurationBlur = durationBlur;
	}
	public ActionType: string;
	public LaunchType: string;
	public LaunchParms: string;
	public Duration: number;
	public DurationBlur: number;
	public AppSessionID: string;
}

export class GetEnvInfo extends BaseModel {
	constructor(source: {
		imcVersion,
		srvVersion,
		shellVersion,
		windowSize,
		displaySize,
		scalingSize,
		isFirstLaunch
	}) {
		super();
		this.ItemType = metricsConst.MetricEvent.GetEnvInfo;
		this.ImcVersion = source.imcVersion;
		this.SrvVersion = source.srvVersion;
		this.ShellVersion = source.shellVersion;
		this.WindowSize = source.windowSize;
		this.DisplaySize = source.displaySize;
		this.ScalingSize = source.scalingSize;
		this.IsFirstLaunch = source.isFirstLaunch;
	}

	public ImcVersion: string;
	public SrvVersion: string;
	public ShellVersion: string;
	public WindowSize: string;
	public DisplaySize: string;
	public ScalingSize: string;
	public IsFirstLaunch: string;
	public AppSessionID: string;
}


export class AppLoaded extends BaseModel {
	constructor(durationForWeb) {
		super();
		this.ItemType = metricsConst.MetricEvent.AppLoaded;
		this.DurationForWeb = Math.round(durationForWeb);
	}

	public DurationForWeb: number;
	public AppSessionID: string;
}
