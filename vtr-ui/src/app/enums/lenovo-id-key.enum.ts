/**
 * this enum is for local storage keys. new keys can be added here. please give meaningful names to key.
 */
export enum LenovoIdKey {
	FirstName = '[LenovoIdKey] FirstName'
}

export enum LenovoIdStatus {
	Unknown = '[LenovoIdStatus] Unknown',
	StarterId = '[LenovoIdStatus] StarterId',
	SignedIn = '[LenovoIdStatus] SignedIn',
	SignedOut = '[LenovoIdStatus] SignedOut',
	Disabled = '[LenovoIdStatus] Disabled',
	Pending = '[LenovoIdStatus] Pending'
}

export enum ssoErroType {

	SSO_ErrorType_NoErr = 0,

	//
	// server error type
	//

	// Invalid request parameters, some parameters may be empty
	SSO_ErrorType_InvalidParam,

	// Sign error
	SSO_ErrorType_SignInFailed,

	// Invalid aid
	SSO_ErrorType_InvalidAID,

	SSO_ErrorType_InvalidDidByServer,

	// Invalid UAD
	SSO_ErrorType_InvalidUAD,

	// Invalid UD
	SSO_ErrorType_InvalidUD,

	// Invalid UAD type
	SSO_ErrorType_InvalidUADType,

	// ClientTimeStamp is incorrect
	SSO_ErrorType_TimeStampIncorrect,

	// Server Error
	SSO_ErrorType_ServerError = -99,

	//
	// sso client error type
	//

	// Unknown/Undefined client error
	SSO_ErrorType_Unknown = 1000,

	// Error communicating with server
	SSO_ErrorType_Conmmunicating,

	// Invalid response from server
	SSO_ErrorTyoe_InvalidResponse,

	// Invalid response logon URL returned from server
	SSO_ErrorType_InvalidURL,

	// Invalid dId returned from server
	SSO_ErrorType_InvalidDID,

	// Error accessing Windows credential manager
	SSO_ErrorType_CannotAccessCredential,

	// Problem obtaining MTM/serial number
	SSO_ErrorType_MTMORSerialNumber,

	// custom
	// the user was not signed in yet,
	SSO_ErrorType_NotSignedIn = 2000,

	SSO_ErrorType_UnknownCrashed = 2001,

	SSO_ErrorType_DisConnect = 2002,

	SSO_ErrorType_SSORequestTimeOut = 2003,

	SSO_ErrorType_AccountPluginDoesnotExist = 2004,
}