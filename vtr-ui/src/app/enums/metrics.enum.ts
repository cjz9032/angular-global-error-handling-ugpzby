export enum MetricEvent {
	TaskAction = 'TaskAction',
	AppAction = 'AppAction'
}

export enum MetricString {
	TaskCheckSystemUpdate = 'SystemUpdate.CheckForUpdates',
	TaskInstallSystemUpdate = 'SystemUpdate.InstallUpdates',
	TaskSetUpdateSchedule = 'SystemUpdate.SetUpdateSchedule',
	ActionOpen = 'open',
	ActionResume = 'resume',
	ActionSuspend = 'suspend',
	ActionClose = 'close'	// no notification for this action type
}

