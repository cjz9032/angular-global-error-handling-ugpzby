export enum SystemUpdateStatus {
	SUCCESS,
	FAILURE,
	UP_TO_DATE,
	EGATER_EXCEPTION,
	GATHERING_USERINFO_EXCEPTION,
	CERTIFICATE_VALIDATION_EXCEPTION,
	DOWNLOAD_EXCEPTION,
	CONNECT_EXCEPTION,
	NOT_ENOUGHDISKSPACE,
	PROXY_AUTHENTICATION_EXCEPTION,
	PROXY_CONNECTION_EXCEPTION,
	AUTOSCRIPT_EVALUATION_EXCEPTION,
	LOCALREPOSITORY_CONNECTION_FAILURE_EXCEPTION,
	LOCALREPOSITORY_DATABASE_EXCEPTION,
	NETWORK_INTERRUPTED_EXCEPTION,
	HELPCENTER_INVALID_SERVER_EXCEPTION,
	CATALOG_NOT_FOUND_EXCEPTION,
	CATALOG_CRC_ERROR_EXCEPTION,
	CATALOG_ERROR_EXCEPTION,
	FILE_NOT_FOUND_EXCEPTION,
	UNKNOWN_EXCEPTION,
	INSTANCE_ISRUNNING
}

export class SystemUpdateStatusMessage {
	public static readonly StatusMessageMap = [
		{code: SystemUpdateStatus.SUCCESS, statusKey: 'SUCCESS', message: 'systemUpdates.banner.title'}, // display default title for success
		{code: SystemUpdateStatus.FAILURE, statusKey: 'FAILURE', message: 'systemUpdates.statusCodeMessage.commonFailure'},
		{code: SystemUpdateStatus.UP_TO_DATE, statusKey: 'UP_TO_DATE', message: 'systemUpdates.statusCodeMessage.upToDate'},
		{code: SystemUpdateStatus.EGATER_EXCEPTION, statusKey: 'EGATER_EXCEPTION', message: 'systemUpdates.statusCodeMessage.egatherException'},
		{code: SystemUpdateStatus.GATHERING_USERINFO_EXCEPTION, statusKey: 'GATHERING_USERINFO_EXCEPTION', message: 'systemUpdates.statusCodeMessage.gatheringUserInfoException'},
		{code: SystemUpdateStatus.CERTIFICATE_VALIDATION_EXCEPTION, statusKey: 'CERTIFICATE_VALIDATION_EXCEPTION', message: 'systemUpdates.statusCodeMessage.certificateValidationException'},
		{code: SystemUpdateStatus.DOWNLOAD_EXCEPTION, statusKey: 'DOWNLOAD_EXCEPTION', message: 'systemUpdates.statusCodeMessage.downloadException'},
		{code: SystemUpdateStatus.CONNECT_EXCEPTION, statusKey: 'CONNECT_EXCEPTION', message: 'systemUpdates.statusCodeMessage.connectException'},
		{code: SystemUpdateStatus.NOT_ENOUGHDISKSPACE, statusKey: 'NOT_ENOUGHDISKSPACE', message: 'systemUpdates.statusCodeMessage.notEnoughDiskSpace'},
		{code: SystemUpdateStatus.PROXY_AUTHENTICATION_EXCEPTION, statusKey: 'PROXY_AUTHENTICATION_EXCEPTION', message: 'systemUpdates.statusCodeMessage.proxyAuthenticationException'},
		{code: SystemUpdateStatus.PROXY_CONNECTION_EXCEPTION, statusKey: 'PROXY_CONNECTION_EXCEPTION', message: 'systemUpdates.statusCodeMessage.proxyConnectionException'},
		{code: SystemUpdateStatus.AUTOSCRIPT_EVALUATION_EXCEPTION, statusKey: 'AUTOSCRIPT_EVALUATION_EXCEPTION', message: 'systemUpdates.statusCodeMessage.autoScriptEvaluationException'},
		{code: SystemUpdateStatus.LOCALREPOSITORY_CONNECTION_FAILURE_EXCEPTION, statusKey: 'LOCALREPOSITORY_CONNECTION_FAILURE_EXCEPTION', message: 'systemUpdates.statusCodeMessage.localRepositoryConnectionFailureException.'},
		{code: SystemUpdateStatus.LOCALREPOSITORY_DATABASE_EXCEPTION, statusKey: 'LOCALREPOSITORY_DATABASE_EXCEPTION', message: 'systemUpdates.statusCodeMessage.localRepositoryDatabaseException'},
		{code: SystemUpdateStatus.NETWORK_INTERRUPTED_EXCEPTION, statusKey: 'NETWORK_INTERRUPTED_EXCEPTION', message: 'systemUpdates.statusCodeMessage.networkInterruptedException'},
		{code: SystemUpdateStatus.HELPCENTER_INVALID_SERVER_EXCEPTION, statusKey: 'HELPCENTER_INVALID_SERVER_EXCEPTION', message: 'systemUpdates.statusCodeMessage.helpCenterInvalidServerException'},
		{code: SystemUpdateStatus.CATALOG_NOT_FOUND_EXCEPTION, statusKey: 'CATALOG_NOT_FOUND_EXCEPTION', message: 'systemUpdates.statusCodeMessage.catalogNotFoundException'},
		{code: SystemUpdateStatus.CATALOG_CRC_ERROR_EXCEPTION, statusKey: 'CATALOG_CRC_ERROR_EXCEPTION', message: 'systemUpdates.statusCodeMessage.catalogCrcErrorException'},
		{code: SystemUpdateStatus.CATALOG_ERROR_EXCEPTION, statusKey: 'CATALOG_ERROR_EXCEPTION', message: 'systemUpdates.statusCodeMessage.catalogErrorException'},
		{code: SystemUpdateStatus.FILE_NOT_FOUND_EXCEPTION, statusKey: 'FILE_NOT_FOUND_EXCEPTION', message: 'systemUpdates.statusCodeMessage.fileNotFoundException'},
		{code: SystemUpdateStatus.UNKNOWN_EXCEPTION, statusKey: 'UNKNOWN_EXCEPTION', message: 'systemUpdates.statusCodeMessage.commonFailure'},
		{code: SystemUpdateStatus.INSTANCE_ISRUNNING, statusKey: 'INSTANCE_ISRUNNING', message: 'systemUpdates.statusCodeMessage.commonFailure'}
	];
}

