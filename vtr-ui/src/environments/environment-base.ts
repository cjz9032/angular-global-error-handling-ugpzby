export interface IEnvironment {
	production: boolean;
	debuggingSnackbar: boolean;
	cmsApiRoot: string;
	upeApiRoot: string;
	appVersion: string;
	upeClientID: string;
	upeSharedKey: string;
	allowMockService: boolean;
	isLoggingEnabled: boolean;
	isServerSwitchEnabled: boolean;
	pcSupportApiRoot: string;
	fullStory: boolean;
}
