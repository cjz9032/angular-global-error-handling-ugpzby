export class SystemUpdateStatusMessage {
	public static readonly SUCCESS = {
		code: 0,
		message: ''
	};
	public static readonly FAILURE = {
		code: 1,
		message: 'There is a problem in retrieving new Updates. Please try again later.'
	};
	public static UP_TO_DATE = {
		code: 2,
		message: 'No updates are available. Your system is up to date.'
	};
	public static EGATER_EXCEPTION = {
		code: 3,
		message: 'An error occurred while gathering user information.'
	};
	public static GATHERING_USERINFO_EXCEPTION = {
		code: 4,
		message: 'An error occurred while gathering user information.'
	};
	public static CERTIFICATE_VALIDATION_EXCEPTION = {
		code: 5,
		message: 'The Update Content Server is invalid. Please try again later.'
	};
	public static DOWNLOAD_EXCEPTION = {
		code: 6,
		message: 'An error occurred while downloading updates.'
	};
	public static CONNECT_EXCEPTION = {
		code: 7,
		message: 'Unable to connect to the Update Content Server.'
	};
	public static NOT_ENOUGHDISKSPACE = {
		code: 8,
		message: 'There is not enough disk space to perform the current task.'
	};
	public static PROXY_AUTHENTICATION_EXCEPTION = {
		code: 9,
		message: 'Incorrect Proxy user name or password.'
	};
	public static PROXY_CONNECTION_EXCEPTION = {
		code: 10,
		message: 'Unable to connect to the proxy server.'
	};
	public static AUTOSCRIPT_EVALUATION_EXCEPTION = {
		code: 11,
		message: 'There was an error evaluating the auto configuration script.'
	};
	public static LOCALREPOSITORY_CONNECTION_FAILURE_EXCEPTION = {
		code: 12,
		message: 'Unable to connect to the Local Repository.'
	};
	public static LOCALREPOSITORY_DATABASE_EXCEPTION = {
		code: 13,
		message: 'The local repository database could not be found or is corrupted.'
	};
	public static NETWORK_INTERRUPTED_EXCEPTION = {
		code: 14,
		message: 'The System Update Server is currently unavailable. Please try again later.'
	};
	public static HELPCENTER_INVALID_SERVER_EXCEPTION = {
		code: 15,
		message: 'The System Update Server is invalid. Please try again later.'
	};
	public static CATALOG_NOT_FOUND_EXCEPTION = {
		code: 16,
		message: 'There are no applicable updates found for your system.'
	};
	public static CATALOG_CRC_ERROR_EXCEPTION = {
		code: 17,
		message: 'The update catalog for your system is currently being updated on the System Update Server. Please try again later.'
	};
	public static CATALOG_ERROR_EXCEPTION = {
		code: 18,
		message: 'An error was detected with the update catalog for your system on the System Update Server. Please try again later.'
	};
	public static FILE_NOT_FOUND_EXCEPTION = {
		code: 19,
		message: 'File not found.'
	};
	public static UNKNOWN_EXCEPTION = {
		code: 20,
		message: 'There is a problem in retrieving new Updates. Please try again later.'
	};
	public static INSTANCE_ISRUNNING = {
		code: 21,
		message: 'There is a problem in retrieving new Updates. Please try again later.'
	};
}
