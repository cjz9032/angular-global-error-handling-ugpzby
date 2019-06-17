export class SystemUpdateStatusMessage {
	public static readonly SUCCESS = {
		code: 0,
		message: ''
	};
	public static readonly FAILURE = {
		code: 1,
		message: 'systemUpdates.statusCodeMessage.commonFailure'
	};
	public static UP_TO_DATE = {
		code: 2,
		message: 'systemUpdates.statusCodeMessage.upToDate'
	};
	public static EGATER_EXCEPTION = {
		code: 3,
		message: 'systemUpdates.statusCodeMessage.egatherException'
	};
	public static GATHERING_USERINFO_EXCEPTION = {
		code: 4,
		message: 'systemUpdates.statusCodeMessage.gatheringUserInfoException'
	};
	public static CERTIFICATE_VALIDATION_EXCEPTION = {
		code: 5,
		message: 'systemUpdates.statusCodeMessage.certificateValidationException'
	};
	public static DOWNLOAD_EXCEPTION = {
		code: 6,
		message: 'systemUpdates.statusCodeMessage.downloadException'
	};
	public static CONNECT_EXCEPTION = {
		code: 7,
		message: 'systemUpdates.statusCodeMessage.connectException'
	};
	public static NOT_ENOUGHDISKSPACE = {
		code: 8,
		message: 'systemUpdates.statusCodeMessage.notEnoughDiskSpace'
	};
	public static PROXY_AUTHENTICATION_EXCEPTION = {
		code: 9,
		message: 'systemUpdates.statusCodeMessage.proxyAuthenticationException'
	};
	public static PROXY_CONNECTION_EXCEPTION = {
		code: 10,
		message: 'systemUpdates.statusCodeMessage.proxyConnectionException'
	};
	public static AUTOSCRIPT_EVALUATION_EXCEPTION = {
		code: 11,
		message: 'systemUpdates.statusCodeMessage.autoScriptEvaluationException'
	};
	public static LOCALREPOSITORY_CONNECTION_FAILURE_EXCEPTION = {
		code: 12,
		message: 'systemUpdates.statusCodeMessage.localRepositoryConnectionFailureException.'
	};
	public static LOCALREPOSITORY_DATABASE_EXCEPTION = {
		code: 13,
		message: 'systemUpdates.statusCodeMessage.localRepositoryDatabaseException'
	};
	public static NETWORK_INTERRUPTED_EXCEPTION = {
		code: 14,
		message: 'systemUpdates.statusCodeMessage.networkInterruptedException'
	};
	public static HELPCENTER_INVALID_SERVER_EXCEPTION = {
		code: 15,
		message: 'systemUpdates.statusCodeMessage.helpCenterInvalidServerException'
	};
	public static CATALOG_NOT_FOUND_EXCEPTION = {
		code: 16,
		message: 'systemUpdates.statusCodeMessage.catalogNotFoundException'
	};
	public static CATALOG_CRC_ERROR_EXCEPTION = {
		code: 17,
		message: 'systemUpdates.statusCodeMessage.catalogCrcErrorException'
	};
	public static CATALOG_ERROR_EXCEPTION = {
		code: 18,
		message: 'systemUpdates.statusCodeMessage.catalogErrorException'
	};
	public static FILE_NOT_FOUND_EXCEPTION = {
		code: 19,
		message: 'systemUpdates.statusCodeMessage.fileNotFoundException'
	};
	public static UNKNOWN_EXCEPTION = {
		code: 20,
		message: 'systemUpdates.statusCodeMessage.commonFailure'
	};
	public static INSTANCE_ISRUNNING = {
		code: 21,
		message: 'systemUpdates.statusCodeMessage.commonFailure'
	};
}
