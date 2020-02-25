export enum MetricEventName {
	TaskAction = 'TaskAction',
	AppAction = 'AppAction',
	GetEnvInfo = 'GetEnvInfo',
	AppLoaded = 'AppLoaded',
	FeatureClick = 'FeatureClick',
	FirstRun = 'FirstRun',
	ArticleDisplay = 'ArticleDisplay',
	PageView = 'PageView',
	ItemView = 'ItemView',
	ArticleClick = 'ArticleClick',
	ArticleView = 'ArticleView',
	SettingUpdate = 'SettingUpdate',
	UserFeedback = 'UserFeedback',
	Unknown = 'Unknown'
}

export enum MetricConst {
	TaskCheckSystemUpdate = 'SystemUpdate.CheckForUpdates',
	TaskInstallSystemUpdate = 'SystemUpdate.InstallUpdates',
	TaskSetUpdateSchedule = 'SystemUpdate.SetUpdateSchedule',
	ActionOpen = 'open',
	ActionResume = 'resume',
	ActionSuspend = 'suspend',
	ActionClose = 'close',	// no notification for this action type
	Unknown = 'Unknown'
}

