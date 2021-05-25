// intentially set the property to be lower case, we are using it as a map object
export const MetricEventName = {
	taskaction: 'TaskAction',
	appaction: 'AppAction',
	getenvInfo: 'GetEnvInfo',
	apploaded: 'AppLoaded',
	itemclick: 'FeatureClick', // convert itemclick to FeatureClick
	featureclick: 'FeatureClick',
	firstrun: 'FirstRun',
	articlecisplay: 'ArticleDisplay',
	pageview: 'PageView',
	itemview: 'ItemView',
	docclick: 'ArticleClick', // convert docclick => ArticleClick
	docview: 'ArticleView', // convert docview => ArticleView
	articleclick: 'ArticleClick',
	articleview: 'ArticleView',
	settingupdate: 'SettingUpdate',
	userfeedback: 'UserFeedback',
	contentdisplay: 'ContentDisplay',
	performance: 'NetworkPerformance',
	mfcommunication: 'MicroFrontendsCommunication',
	unknown: 'Unknown',
};
Object.freeze(MetricEventName);

export enum MetricConst {
	TaskCheckSystemUpdate = 'SystemUpdate.CheckForUpdates',
	TaskInstallSystemUpdate = 'SystemUpdate.InstallUpdates',
	TaskSetUpdateSchedule = 'SystemUpdate.SetUpdateSchedule',
	TaskSetScanSchedule = 'SmartPerformance.SetScanSchedule',
	ActionOpen = 'open',
	ActionResume = 'resume',
	ActionSuspend = 'suspend',
	ActionClose = 'close', // no notification for this action type
	ActionRefresh = 'refresh',
	Unknown = 'Unknown',
}
