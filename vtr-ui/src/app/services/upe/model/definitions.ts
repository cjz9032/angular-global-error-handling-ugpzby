export interface IUpeEssential {
	anonUserId: string;
	deviceId: string;
	apiKey: string;
	clientAgentId: string;
	upeUrlBase: string;
	apiKeySalt?: any;
}

export interface IEssentialHelper {
	getUpeEssential: ()  => any;
	registerDevice: (upeEssential: IUpeEssential) => any;
}


export interface IGetContentParam {
	positions: any[];
}


export interface IActionResult {
	success: boolean;
	content: any;
	errorCode?: any;
}
