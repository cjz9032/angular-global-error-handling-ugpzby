export enum SubAppSendMessageType {
	isLoaded = 'isLoaded',
	shadowMenuForModal = 'shadowMenuForModal',
	goBackInContainerApp = 'goBackInContainerApp',
	navigateInContainerApp = 'navigateInContainerApp',
	clickInIframe = 'clickInIframe',
	setSmartAssistMenuForSettingsApp = 'setSmartAssistMenuForSettingsApp',
}

export enum ContainerAppSendMessageType {
	goToTransitionPage = 'goToTransitionPage',
	navigateInSubApp = 'navigateInSubApp',
	setSegment = 'setSegment',
	setHeaderImage = 'setHeaderImage',
	setMetricsEnabled = 'metricsEnabled',
	setLid = 'setLid',
}
