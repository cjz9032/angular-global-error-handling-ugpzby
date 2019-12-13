export interface IEnvironment {
	production: boolean;
	cmsApiRoot: string;
	upeApiRoot: string;
	appVersion: string;
	upeClientID: string;
	upeSharedKey: string;
	allowMockService: boolean;
	isLoggingEnabled: boolean;
	isServerSwitchEnabled: boolean;
}
